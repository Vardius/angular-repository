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
        if (!isNaN(parseInt(parameters))) {
            if (Entity.pool[this.constructor.name] && Entity.pool[this.constructor.name][parameters] instanceof Entity) {
                return Entity.pool[this.constructor.name][parameters];
            }
        } else if (parameters.id) {
            if (Entity.pool[this.constructor.name] && Entity.pool[this.constructor.name][parameters.id] instanceof Entity) {
                let entity = Entity.pool[this.constructor.name][parameters.id];

                for (let prop in entity) {
                    if (entity.hasOwnProperty(prop) && prop !== 'id' && !(entity[prop] instanceof Array)) {
                        if (entity[prop] === undefined) {
                            entity[prop] = parameters[prop];
                        }
                        if (merge === true) {
                            if (!entity.changed[prop] && parameters[prop] !== undefined) {
                                entity[prop] = parameters[prop];
                            }
                        }
                    }
                }

                return entity;
            }

            if (!Entity.pool[this.constructor.name]) {
                Entity.pool[this.constructor.name] = [];
            }

            this.changed = [];

            Entity.pool[this.constructor.name][parameters.id] = this;
        }
    }

    contains(haystack, needle) {
        var found = false;
        if (haystack) {
            for (let i = 0; i < haystack.length; i++) {
                if (haystack[i].id === needle.id) {
                    found = true;
                    break;
                }
            }
        }

        return found;
    }

    unwatch() {
        for (let prop in this) {
            if (this.hasOwnProperty(prop)) {
                if (this[prop] instanceof Array) {
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
            if (this.hasOwnProperty(prop)) {
                if (this[prop] instanceof Array || this[prop] instanceof Entity || prop === 'id') {
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
                    getter = function () {
                        return val;
                    };
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

                    this.changed[prop] = prop;

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
}

Object.defineProperty(Entity, 'pool', {value: [], writable: true, enumerable: true});
