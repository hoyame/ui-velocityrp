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
        "ems": "https://media.discordapp.net/attachments/969928521440968724/969992289772515368/emsm.png",
        "lspd": "https://media.discordapp.net/attachments/969928521440968724/969993361123582032/lspd.png",
        "bennys": "https://cdn.discordapp.com/attachments/969928521440968724/969993687620804608/bennys.png",
        "casse": "https://cdn.discordapp.com/attachments/969928521440968724/969994104446550106/casse.png",
        "velocity": "https://media.discordapp.net/attachments/956333971908730961/970050552396386344/Sans_titre-1.png",
        "illegal": "https://cdn.discordapp.com/attachments/956333971908730961/970048348402901032/moeny.png",
        "course": "https://cdn.discordapp.com/attachments/956333971908730961/970067052377305098/course.png",
        "tresor": "https://cdn.discordapp.com/attachments/956333971908730961/972158205188792400/treasure.png"
    }

    public static async initialize() {
        onNet('hoyame:showNotification', this.show.bind(this))
        onNet('hoyame:showAdvancedNotification', this.showAdvanced.bind(this))
        
    }

    public static show(data: INotification) {
        this.count++;

        SendNuiMessage(JSON.stringify({ type: "notification", data: {
            id: this.count,
            title: data.title,
            message: data.message,
            advanced: false,
            timeout: 7500,
            dark: (GetClockHours() < 21 && GetClockHours() > 6)
        }}));
    }

    public static showAdvanced(data: INotification) {
        this.count++;

        SendNuiMessage(JSON.stringify({ type: "notification", data: {
            id: this.count,
            title: data.title,
            message: data.message,
            advanced: true,
            // @ts-ignore
            url: this.banners[data.url],
            timeout: data.timeout || 7500,
            dark: (GetClockHours() < 21 && GetClockHours() > 6)
        }}));
    }
} 

