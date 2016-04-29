angular-repository
==================

API Repository factory for Angular Js based on ngResource

## Installation

Install with bower:

```bash
$ bower install angular-vrepository --save
```

Install with npm:

```bash
$ npm install angular-repository
```

Load the `angular-repository` module in your app.

```javascript
angular.module('app', ['vRepository']);
```

## Configure

```javascript
    angular
        .module('app', [
            'vRepository',
        ])
        .config(['RepositoryFactoryProvider', config])
    ;
        
    function config(RepositoryFactoryProvider) {
        var myConfig = {
            url: 'http://api.com'           //required config parameter
            onError: (response) => {        //optional global callback
                return response;
            },
            onSuccess: (response) => {      //optional global callback example
                if (this.checkPropertyExistence(response, ['data'])) {
                    let data = response.data;
                    if (data instanceof Array) {
                        for (var key in data) {
                            if (data.hasOwnProperty(key)) {
                                data[key] = new this.model(data[key]);
                            }
                        }
    
                        return data;
                    } else {
                        return new this.model(data);
                    }
                }
            }
        };
        RepositoryFactoryProvider.configure(myConfig);
    }

    /**
     * Check if property exist
     *
     * @param obj
     * @param paths
     * @returns {boolean}
     */
    function checkPropertyExistence(obj, paths = []) {
        for (var i = 0; i < paths.length; i++) {
            if (!obj || !obj.hasOwnProperty(paths[i])) {
                return false;
            }
            obj = obj[paths[i]];
        }
        return true;
    }
```

## Usage Example

Example usage:

Create your entity class
```javascript
                        
//remeber that your mdoel class has to extend Entity class provider by this package
class User extends Entity {
    constructor(parameters) {
        //this 2 lines are required !!!
        let entity = super(parameters);
        if (entity.id) return entity;
        
        this.id = parameters.id;
        this.email = parameters.email;
        this.name = parameters.name;
        
        //after parameter remember to turn on watcher
        //so multiple API call will not reset your changes
        this.watch();
    }
}

```

Example List controller for your model
```javascript
export class ListController {
    static $inject = ['$scope', 'RepositoryFactory'];
    
    this.repository = this.getRepository(User, '/users');

    constructor($scope, factory) {
        this.factory = factory;
        this.$scope = $scope;

        this.$scope.$watch(() => {
            return this.page
        }, this.onChange.bind(this));

        this.$scope.$watch(() => {
            return this.limit
        }, this.onChange.bind(this));
    }

    onChange(newValue, oldValue) {
        if (newValue !== oldValue) {
            this.repository.getAll({
                page: this.page,
                limit: this.limit
            }).then((response) => {
                this.items = response;
            });
        }
    }

    getRepository(model, path) {
        return this.factory.getRepository(model, path);
    }
}
```

You can also provide `onSuccess` and `onError` callback to the `getRepository` method
```javascript
export class ListController {

    //....

    getRepository(model, path) {
        return this.factory.getRepository(model, path, this.onSuccess, this.onError);
    }
    
    onError(response) {
        return response;
    }
    
    onSuccess(response) {
        return response;
    }
}
```

They will override global callback provided in your config for this specific model only.