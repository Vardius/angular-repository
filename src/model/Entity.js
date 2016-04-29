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
        if (!isNaN(parseInt(parameters))) {
            if (Entity.pool[this.constructor.name] && Entity.pool[this.constructor.name][parameters] instanceof Entity) {
                return Entity.pool[this.constructor.name][parameters];
            }
        } else if (parameters.id) {
            if (Entity.pool[this.constructor.name] && Entity.pool[this.constructor.name][parameters.id] instanceof Entity) {
                return Entity.pool[this.constructor.name][parameters.id];
            }

            if (!Entity.pool[this.constructor.name]) {
                Entity.pool[this.constructor.name] = [];
            }

            Entity.pool[this.constructor.name][parameters.id] = this;
        }
    }
}

Object.defineProperty(Entity, 'pool', {value: [], writable: true, enumerable: true});
