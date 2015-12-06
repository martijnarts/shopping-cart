import {Events} from './events.ts'

type Fields = {[index: string]: any};


export function field<T>(target: Model, property: string) {
    var _deflt = this[property];

    var getter = function() {
        return this.get(property);
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

        if(!target.fieldDefaults) target.fieldDefaults = {};
        target.fieldDefaults[property] = _deflt;
    }
}


export class Model extends Events {
    fieldDefaults: Fields;

    private fields: Fields = {};
    private persisted: Fields = {};
    dirty = false;

    @field
    pk: number;

    constructor() {
        super();

        for(var key in this.fieldDefaults) {
            if(this.fieldDefaults.hasOwnProperty(key)) {
                this.fields[key] = this.fieldDefaults[key];
            }
        }
        this.persist();
    }

    get(property: string) {
        return this.fields[property];
    }

    set(property: string, value: any) {
        this.fields[property] = value;
        this.dirty = true;

        this.trigger('change');
        this.trigger(`change:#{property}`);
    }

    persist() {
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


export class Collection<T extends Model> extends Events {
    index = 0;

    private models: T[] = [];
    private current: number[] = [];
    dirty = false;

    get(pk: number) {
        return this.models[pk];
    }

    filter(key: (model: T) => boolean) {
        return this.models.filter(key);
    }

    append(model: T) {
        model.bind('change', () => {
            this.dirty = true;
            this.current.splice(this.current.indexOf(model.pk), 1);
        });
        this.dirty = true;

        this.models.push(model);
        this.trigger('append');
    };

    remove(pk: number) {
        this.dirty = true;

        var model = this.models.filter((model) => model.pk == pk)[0];
        this.models.splice(this.models.indexOf(model), 1);
        this.trigger('remove');
    }

    persist() {
        if(!this.dirty) return false;

        this.dirty = false;
        this.current = [];
        this.models.forEach((model: T) => this.current.push(model.pk));

        this.trigger('persist');
        return true;
    }
}
