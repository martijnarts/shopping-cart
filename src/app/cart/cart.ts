import {Component, ViewEncapsulation, NgFor} from 'angular2/angular2';

import {CartModel, CartItemModel} from './models';
import {CartItem} from './item/item';

@Component({
    selector: 'cart',
    template: <string>require('./cart.html'),
    directives: [NgFor, CartItem],
})
export class Cart {
    public cart = new CartModel();
    public newItem: string = '';

    public addItem() {
        this.cart.addItem(this.newItem);
        this.newItem = '';
    }
}
