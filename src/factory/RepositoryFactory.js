/**
 * This file is part of the angular-repository package.
 *
 * (c) Rafał Lorenz <vardius@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Repository} from "../repository/Repository";

export class RepositoryFactory {

    /**
     * @param config
     * @param resource
     */
    constructor(config, resource) {
        this.required = [
            'url'
        ];

        for (let attr in this.required) {
            if (!config.hasOwnProperty(attr)) {
                throw new Error(`Missing parameter: ${attr}.`);
            } else if (attr === 'url' && !this.isURL(config.url)) {
                throw new Error(`Parameter: ${attr} is not valid url.`);
            }
        }

        this.config = config;
        this.resource = resource;
    }

    getRepository(model, path, onSuccess, onError) {
        onSuccess = onSuccess || this.config.onSuccess;
        onError = onError || this.config.onError;

        return new Repository(model, path, this.config.url, this.resource, onSuccess, onError);
    }

    isURL(url) {
        let strRegex = "^((https?|ftp|rtsp|mms)?://)" +
            "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" +
            "(([0-9]{1,3}\.){3}[0-9]{1,3}" +
            "|" +
            "([0-9a-z_!~*'()-]+\.)*" +
            "([0-9a-z][0-9a-z-]{0,61})" +
            "?[0-9a-z]\.[a-z]{2,6}|localhost)" +
            "(:[0-9]{1,4})" +
            "?((/?)|" +
            "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
        let pattern = new RegExp(strRegex);

        return pattern.test(url);
    }
}