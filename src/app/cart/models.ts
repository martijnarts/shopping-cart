import {Collection, Model, field} from '../util/models';


export class CartItemModel extends Model {
    cart: CartModel;

    @field pk: number;
    @field name: string;
    @field amount: number = 1;

    constructor(cart: CartModel, pk: number, name: string) {
        super();
        this.cart = cart;

        this.pk = pk;
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
        this.index++;
        this.append(new CartItemModel(this, this.index, name));
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
