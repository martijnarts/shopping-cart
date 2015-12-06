type Event = () => void;
type EventMap = {[index: string]: Event[]};


/**
 * A very simple event class, made pretty much only to extend upon for other
 * classes. Cannot even unbind events yet.
 */
export class Events {
    private events: EventMap = {};

    public trigger(e: string) {
        var events = this.events[e] || [];
        events.forEach((event: Event) => event());
    }

    public bind(e: string, func: Event) {
        var events = this.events[e];
        if(!events) {
            this.events[e] = events = [];
        }

        events.push(func);
    }
}
