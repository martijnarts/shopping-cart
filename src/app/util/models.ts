import {Events} from './events.ts'

type Fields = {[index: string]: any};


/**
 * The field decorator is my favourite piece of magic. Since we want to keep
 * track of every change to a model, but we also want to keep the wonderful
 * abilities of Typescript's type checking AND we want to set fields as class
 * properties, we can decorate them with @field name: type = default. This'll
 * create a strongly typed, controlled getter/setter on the model.
 */
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


/**
 * This is a fairly simple Model, but it's able to have default values and it
 * tracks field changes (with events!). You can see which values have changed,
 * choose when to set them as "persisted"... All that jazz.
 */
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

    /**
     * Set the model data as "persisted". You'd do this, for example, after
     * successfully completing an Ajax POST to the server, which would then
     * save the information - persist it!
     */
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


/**
 * This is really just a list of models. We need to be able to track both
 * appending and subtracting from model lists, so we could just do @field m:
 * Model[]. We needed a collection type.
 */
export class Collection<T extends Model> extends Events {
    index = 0;

    private models: T[] = [];
    private current: number[] = [];
    dirty = false;

    /**
     * Simple wrapper for filtering by pk. Convenience function, really.
     */
    get(pk: number) {
        return this.filter((m: T) => m.pk == pk)[0];
    }

    /**
     * This one is just a wrapper guys, sorry. this.models is a private
     * property, so this had to be done.
     */
    filter(key: (model: T) => boolean) {
        return this.models.filter(key);
    }

    /**
     * Now here's where the model system is a little flawed: since we're
     * tracking models fairly simply by "dumb" pks instead of globally unique
     * pks but we don't know what your model looks like, you're going to have
     * to instantiate your model yourself and we have to overwrite the pk to be
     * internally consistent. This is not pretty. I should fix this.
     */
    append(model: T) {
        this.index++;
        model.pk = this.index;
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

        this.models.splice(this.models.indexOf(this.get(pk)), 1);
        this.current.splice(this.current.indexOf(pk), 1);
        this.trigger('remove');
    }

    /**
     * Note that in the collections we don't actually keep track of every
     * individual model's changes, you can do that in the model itself. We just
     * keep a list of models that have changed.
     */
    persist() {
        if(!this.dirty) return false;

        this.dirty = false;
        this.current = [];
        this.models.forEach((model: T) => this.current.push(model.pk));

        this.trigger('persist');
        return true;
    }
}
