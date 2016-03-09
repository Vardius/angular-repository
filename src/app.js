/**
 * This file is part of the angular-repository package.
 *
 * (c) Rafał Lorenz <vardius@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import 'angular-resource';
import {RepositoryFactoryProvider} from "./provider/RepositoryFactoryProvider";

(function (root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['angular'], factory);
    } else if (typeof module !== 'undefined' && typeof module.exports === 'object') {
        module.exports = factory(require('angular'));
    } else {
        return factory(root.angular);
    }
}(this, repository));

function repository(angular) {
    'use strict';

    var moduleName = 'vRepository';

    angular
        .module(moduleName, [
            'ngResource'
        ])
        .provider("RepositoryFactory", RepositoryFactoryProvider)
    ;

    return moduleName;
}