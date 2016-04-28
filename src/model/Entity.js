/**
 * This file is part of the angular-repository package.
 *
 * (c) Rafał Lorenz <vardius@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
export class Entity {

    constructor(parameters = {}) {
        let id = null;
        if (!isNaN(parseInt(parameters))) {
            id = parameters;
        } else if (parameters.id) {
            id = parameters.id;
        }

        if (id) {
            if (Entity.pool[this.constructor.name] && Entity.pool[this.constructor.name][id] instanceof Entity) {
                return Entity.pool[this.constructor.name][id];
            }

            if (!Entity.pool[this.constructor.name]) {
                Entity.pool[this.constructor.name] = [];
            }

            Entity.pool[this.constructor.name][id] = this;
        }
    }
}

Object.defineProperty(Entity, 'pool', {value: [], writable: true});
