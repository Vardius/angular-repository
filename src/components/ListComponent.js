/**
 * This file is part of the angular-repository package.
 *
 * (c) Rafał Lorenz <vardius@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {ListController} from "../controllers/ListController";

export class ListComponent {
    public bindings = {
        page: '=',
        limit: '='
    };
    public controller = ListController;
}