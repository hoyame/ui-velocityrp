import { Nui } from "./nui";
import { Delay } from "./utils";

interface INotification {
    id?: number;
    title: string;
    message: string;
    timeout?: number;
    advanced?: boolean;
    url?: string;
}


export abstract class Notification {
    private static count = 0;

    private static banners = {
        "casino": "https://cdn.discordapp.com/attachments/857379508747239425/969621675698180164/unknown.png",

    }

    public static async initialize() {
        // await Delay(5000);

        onNet('hoyame:showNotification', this.show.bind(this))
        onNet('hoyame:showAdvancedNotification', this.showAdvanced.bind(this))

        // this.show({
        //     title: "Zebi",
        //     message: "Zebi is now ready to use!"
        // })

        // this.showAdvanced({
        //     title: "Advanced",
        //     message: "This is an advanced notification",
        //     url: "https://cdn.discordapp.com/attachments/857379508747239425/969621675698180164/unknown.png"
        // })
    }

    public static show(data: INotification) {
        this.count++;

        console.log("ziuzbfiuzbfiuzbefizfbiuzbef")

        SendNuiMessage(JSON.stringify({ type: "notification", data: {
            id: this.count,
            title: data.title,
            message: data.message,
            advanced: false,
            timeout: 5000
        }}));
    }

    public static showAdvanced(data: INotification) {
        this.count++;

        console.log("esf16g15ze61g65z1g65ze1g6e51g6z")

        SendNuiMessage(JSON.stringify({ type: "notification", data: {
            id: this.count,
            title: data.title,
            message: data.message,
            advanced: true,
            url: data.url,
            timeout: 5000
        }}));
    }
} 

