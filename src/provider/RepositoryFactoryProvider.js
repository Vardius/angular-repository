/**
 * This file is part of the angular-repository package.
 *
 * (c) Rafał Lorenz <vardius@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {RepositoryFactory} from "../factory/RepositoryFactory";

export class RepositoryFactoryProvider {

    /**
     * Inject dependencies
     */
    constructor() {
        this.$get.$inject = ['$resource'];
        this.config = {};
    }

    /**
     * Configure factory
     *
     * @param config
     */
    configure(config) {
        for (let attr in config) {
            if (config.hasOwnProperty(attr)) {
                this.config[attr] = config[attr];
            }
        }
    }

    /**
     * Get factory
     *
     * @param $resource
     * @returns {RepositoryFactory}
     */
    $get($resource) {
        return new RepositoryFactory(this.config, $resource);
    }
}