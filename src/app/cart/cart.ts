import {Component, ViewEncapsulation, NgFor} from 'angular2/angular2';

import {CartModel, CartItemModel} from './models';
import {CartItem} from './item/item';

@Component({
    selector: 'cart',
    template: <string>require('./cart.html'),
    directives: [NgFor, CartItem],
})
export class Cart {
    cart = new CartModel();
    newItem: string = '';
    saving = false;
    saved = false;

    onInit() {
        this.cart.bind('presave', () => this.saving = true);
        this.cart.bind('save', this.savedCart.bind(this));

        this.cart.bind('append', this.cart.save.bind(this.cart));
        this.cart.bind('remove', this.cart.save.bind(this.cart));
    }

    savedCart() {
        this.saving = false;
        this.saved = true;
        setTimeout(() => this.saved = false, 1000);
    }

    addItem() {
        this.cart.addItem(this.newItem);
        this.newItem = '';
    }
}
