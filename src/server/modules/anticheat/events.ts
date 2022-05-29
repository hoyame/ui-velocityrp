import { RegisterServerCallback } from "../../core/utils";
var msgpack = require("msgpack-lite");

const codec = msgpack.createCodec({
    uint8array: true,
    preset: false,
    binarraybuffer: true
});

export abstract class Events {
    private static List: any = [];

    public static async initialize() {
        onNet('hoyame:events:triggerEvent', this.triggerEvent.bind(this))

        onNet('hoyame:events:playerConnect', () => {
            this.List.forEach((x: { eventName: any; token: any; }) => {
                
                emitNet('hoyame:events:grabToken', -1, x.eventName, x.token)
            })
        })

        // exports functions 
        exports('registerEvent', (eventName: string, eventFunction: any) => {
            this.registerEvent(eventName, eventFunction)
        })
    }

    public static generateToken(): string {
        const m = Math.random().toString(36).substr(2);
        const z = Math.random().toString(36).substr(2);
        const y = Math.random().toString(36).substr(2);

        return m + z + y
    }

    private static async returnToken(eventName: string) {
        const event = this.List.findIndex((x: { eventName: string; }) => x.eventName === eventName);
        return this.List[event].token;
    }

    private static regenerateToken(eventName: string) {
        const event = this.List.findIndex((x: { eventName: string; }) => x.eventName === eventName);
        this.List[event].token = this.generateToken();
        console.log(`Event ${eventName} regenerated, token: ${this.List[event].token}`)
        emitNet('hoyame:events:sendToken', eventName, this.List[event].token)
    }

    public static registerEvent(eventName: string, eventFunction: any) {
        let d = {
            eventName: eventName,
            eventFunction: eventFunction,
            token: this.generateToken(),
            id: this.List.length + 1
        }

        d.eventFunction = eventFunction;
        
        this.List.push(d);
        emitNet('hoyame:events:grabToken', -1, eventName, d.token)
        console.log(`Event ${eventName} registered, token: ${d.token}`)
    }

    private static triggerEvent(eventName: string, eventToken: string, ...args: any[]) {
        if (!eventToken) return console.log('Event token is null')

        const pack = (data: any) => msgpack.encode(data, { codec });
        const event = this.List.find((x: { eventName: string; }) => x.eventName === eventName);
        const dataSerialized = pack(args);

        console.log(`Event ${eventName} triggered, tokentrigger: ${eventToken}, token: ${event.token}`)


        if (event.token === eventToken) {
            event.eventFunction(...args);
            this.regenerateToken(eventName);
        } else {
            console.log(`Event ${eventName} failed, token: ${eventToken}`)
            // DropPlayer(source, 'You are not allowed to use this event.');
        }
    }
}


