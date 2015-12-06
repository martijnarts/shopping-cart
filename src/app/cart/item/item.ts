import {Component, ViewEncapsulation, NgIf, Input}
    from 'angular2/angular2';

import {CartItemModel} from '../models';

@Component({
    selector: 'cart-item',
    template: <string>require('./item.html'),
    directives: [NgIf],
})
export class CartItem {
    @Input() item: CartItemModel;
    saving = false;
    saved = false;

    onInit() {
        this.item.bind('saveStart', () => this.saving = true);
        this.item.bind('save', this.itemSaved.bind(this));
    }

    itemSaved() {
        this.saving = false;
        this.saved = true;
        setTimeout(() => this.saved = false, 1000);
    }
}
