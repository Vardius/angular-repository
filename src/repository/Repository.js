/**
 * This file is part of the angular-repository package.
 *
 * (c) Rafał Lorenz <vardius@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export class Repository {
    constructor(model, path, url, $resource, onSuccess, onError) {
        this.url = url;
        this.model = model;
        this.$resource = $resource;
        this.resource = this.getResource(path);
        this.onError = onError;
        this.onSuccess = onSuccess;
    }

    /**
     * Call GET method on /path
     *
     * @param params
     * @returns {*}
     */
    getAll(params = {}) {
        let results = this.resource.query(params);

        return this.returnPromise(results);
    }

    /**
     * Call GET method on /path/{id}
     *
     * @param id
     * @returns {*}
     */
    getById(id) {
        let model = this.resource.get({id: id});

        return this.returnPromise(model);
    }

    /**
     * Call POST method on /path
     *
     * @param data
     * @returns {Promise}
     */
    create(data) {
        let model = new this.resource(data);

        return model.$save().then(this.onSuccess, this.onError);
    }

    /**
     * Call PUT method on /path/{id}
     *
     * @param id
     * @param data
     * @returns {Promise}
     */
    update(id, data) {
        data.id = id;
        var model = new this.resource(data);

        return model.$update().then(this.onSuccess, this.onError);
    }

    /**
     * Call DELETE method on /path/{id}
     *
     * @param id
     * @returns {Promise.<T>}
     */
    remove(id) {
        var data = {id: id};
        var model = new this.resource(data);

        return model.$delete().then(this.onSuccess, this.onError);
    }

    /**
     * Configure resource
     *
     * @param path
     * @returns {*}
     */
    getResource(path) {
        if ('/' === path.substr(-1)) {
            path = path.slice(0, -1);
        }

        return this.$resource(this.url + path + '/:id', {id: '@id'}, {
            'update': {
                method: 'PUT'
            },
            'get': {
                method: 'GET'
            },
            'save': {
                method: 'POST'
            },
            'query': {
                method: 'GET'
            },
            'remove': {
                method: 'DELETE'
            },
            'delete': {
                method: 'DELETE'
            }
        });
    }

    /**
     * @param obj
     * @returns {string}
     */
    transformRequest(obj) {
        var str = [];
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        }

        return str.join("&");
    }

    /**
     * Create promise from object
     *
     * @param object
     * @returns {Promise}
     */
    returnPromise(object) {
        return object.$promise.then(this.onSuccess, this.onError);
    }
}