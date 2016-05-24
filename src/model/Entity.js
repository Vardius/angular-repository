/**
 * This file is part of the angular-repository package.
 *
 * (c) Rafał Lorenz <vardius@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
export class Entity {

    constructor(parameters = {}, merge = false) {
        if (!Entity.pool[this.constructor.name]) {
            Entity.pool[this.constructor.name] = [];
        }

        if (!this.changed) {
            this.changed = [];
        }

        if (!isNaN(parseInt(parameters))) {
            if (Entity.pool[this.constructor.name] && Entity.pool[this.constructor.name][parameters] instanceof Entity) {
                return Entity.pool[this.constructor.name][parameters];
            } else {
                this.id = parameters;
                Entity.pool[this.constructor.name][parameters] = this;
            }
        } else if (parameters.id) {
            if (Entity.pool[this.constructor.name] && Entity.pool[this.constructor.name][parameters.id] instanceof Entity) {
                let entity = Entity.pool[this.constructor.name][parameters.id];

                for (let prop in entity) {
                    if (prop.charAt(0) !== '_' && entity.hasOwnProperty(prop) && parameters[prop] !== undefined) {
                        if (entity[prop] instanceof Array || prop === 'id') {
                            continue;
                        }

                        if (entity[prop] instanceof Entity || entity[prop] === undefined) {
                            entity[prop] = parameters[prop];
                        } else if (merge === true && !entity.changed[prop]) {
                            entity[prop] = parameters[prop];
                        }
                    }
                }

                return entity;
            }

            Entity.pool[this.constructor.name][parameters.id] = this;
        }
    }

    contains(haystack, needle) {
        let found = false;
        if (haystack) {
            for (let i = 0; i < haystack.length; i++) {
                if (haystack[i] && needle && haystack[i].hasOwnProperty('id') && needle.hasOwnProperty('id') && haystack[i].id === needle.id) {
                    found = true;
                    break;
                }
            }
        }

        return found;
    }

    getter(model, property) {
        return property instanceof model ? property : new model(property);
    }

    setter(data, model) {
        if (data) {
            if (data instanceof model) return data;

            let entity = new model(data, true);

            return entity.id ? entity.id : entity;
        }
    }

    collectionSetter(data, model, collection, merge = false) {
        if (data) {
            for (let i = 0; i < data.length; i++) {
                let entity = new model(data[i], merge);
                if (!this.contains(collection, entity)) {
                    collection.push(entity);
                }
            }
            if (merge) {
                for (let i = collection.length - 1; i >= 0; i--) {
                    if (!collection[i] || !collection[i].id) {
                        collection.splice(i, 1);
                    }
                }
            }
        }
    }

    unwatch() {
        for (let prop in this) {
            if (prop.charAt(0) !== '_' && this.hasOwnProperty(prop)) {
                if (this[prop] instanceof Array || prop === 'id' || this[prop] instanceof Entity) {
                    continue;
                }

                let val = this[prop];
                delete this[prop];
                this[prop] = val;
            }
        }
    }

    watch() {
        for (let prop in this) {
            if (prop.charAt(0) !== '_' && this.hasOwnProperty(prop)) {
                if (this[prop] instanceof Array || prop === 'id' || this[prop] instanceof Entity) {
                    continue;
                }

                let desc = Object.getOwnPropertyDescriptor(this, prop),
                    getter = desc.get, setter = desc.set;

                if (!desc.configurable
                    || (desc.value === undefined && !desc.set)
                    || desc.writable === false) {
                    return false;
                }

                let val = desc.value;

                if (val != undefined) {
                    if (!getter) {
                        getter = function () {
                            return val;
                        };
                    }
                } else {
                    getter = desc.get;
                }

                let newSetter = function (newVal) {
                    let oldVal = val;
                    if (setter) {
                        setter(newVal);
                    } else {
                        val = newVal;
                    }

                    this.setChanged(prop);

                    return val;
                };
                if (delete this[prop]) {
                    Object.defineProperty(this, prop, {
                        get: getter,
                        set: newSetter,
                        configurable: true,
                        enumerable: desc.enumerable
                    });
                }
            }
        }
    }

    setChanged(propName) {
        this.changed[propName] = propName;
    }
}

Object.defineProperty(Entity, 'pool', {value: [], writable: true, enumerable: true});
