function field<T>(target: Model, property: string) {
    var _deflt = this[property];

    var getter = function() {
        return this.get(property) || _deflt;
    };
    var setter = function(value: T) {
        this.set(property, value);
    };

    if (delete this[property]) {
        Object.defineProperty(target, property, {
            set: setter,
            get: getter,
            enumerable: true,
            configurable: true,
        });
    }
}


class Model {
    private fields: {[index: string]: any} = {};
    private persisted: {[index: string]: any} = {};
    public dirty = false;

    private events: {[index: string]: Function[]} = {};

    public trigger(e: string) {
        var events = this.events[e] || [];
        events.forEach((event: Function) => event());
    }

    public bind(e: string, func: Function) {
        var events = this.events[e];
        if(!events) {
            this.events[e] = events = [];
        }

        events.push(func);
    }

    public get(property: string) {
        return this.fields[property];
    }

    public set(property: string, value: any) {
        this.fields[property] = value;
        this.dirty = true;

        this.trigger('change');
        this.trigger(`change:#{property}`);
    }

    public persist() {
        if(!this.dirty) return false;

        this.dirty = false;
        for(var attr in this.fields) {
            if(this.fields.hasOwnProperty(attr)) {
                this.persisted[attr] = this.fields[attr];
            }
        }
        this.trigger('persist');
        return true;
    }
}


export class CartItemModel extends Model {
    cart: CartModel;

    @field pk: number;
    @field name: string;
    @field amount: number;

    constructor(cart: CartModel, pk: number, name: string) {
        super();
        this.cart = cart;

        this.pk = pk;
        this.name = name;
        this.amount = 1;

        this.persist();
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

    delete() {
        this.cart.removeItem(this.pk);
    }
}


export class CartModel extends Model {
    itemsIndex = 0;

    @field
    items: CartItemModel[];

    constructor() {
        super();
        this.items = [];
    }

    addItem(name: string) {
        this.itemsIndex++;
        this.items.push(new CartItemModel(this, this.itemsIndex, name));
    }

    removeItem(pk: number) {
        var item = this.items.filter((item) => item.pk == pk)[0];
        this.items.splice(this.items.indexOf(item), 1);
    }
}
