/**
 * This file is part of the angular-repository package.
 *
 * (c) Rafał Lorenz <vardius@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
export class ListController {
    static $inject = ['$scope', 'RepositoryFactory'];

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
