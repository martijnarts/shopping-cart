/// <reference path="../typings/_custom.d.ts" />
import {Component, ViewEncapsulation} from 'angular2/angular2';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {Cart} from './cart/cart';

@Component({
    selector: 'shopping-cart',
    template: '<router-outlet></router-outlet>',
    directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
    { path: '/', component: Cart, as: 'Cart' },
])
export class Main {}
