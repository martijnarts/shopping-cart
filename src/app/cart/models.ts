import {Collection, Model, field} from '../util/models';


export class CartItemModel extends Model {
    cart: CartModel;

    @field pk: number;
    @field name: string;
    @field amount: number = 1;

    constructor(cart: CartModel, name: string) {
        super();
        this.cart = cart;
        this.name = name;

        this.persist();
    }

    save(): Promise<boolean> {
        return this.cart.save();
    }

    delete() {
        this.cart.remove(this.pk);
    }
}


export class CartModel extends Collection<CartItemModel> {
    addItem(name: string) {
        if(name == '') {
            return false;
        }

        var dupe = this.filter((m: CartItemModel) => m.name == name);
        if(dupe.length) {
            dupe[0].amount += 1;
            return true;
        }

        this.append(new CartItemModel(this, name));
        return true;
    }

    save(): Promise<boolean> {
        return new Promise((done) => {
            this.trigger('presave');
            setTimeout(() => {
                done(true);
            }, 2000);
        })
        .then(() => {
            super.persist();
            this.trigger('save');
            return true;
        }, () => {
            return false;
        });
    }

}
