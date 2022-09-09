import { Delay } from "../../../shared/utils/utils";
import { Nui } from "../../core/nui";

interface IPed {
    title?: string;
    message?: string;
    button1?: string;
    button2?: string;
    button3?: string;
    button4?: string;
    cb?: (e: number) => any;
}

export abstract class Ped {
    private static cacheCb: any = null 

    public static data = {
        title: '',
        message: '',
        button1: '',
        button2: '',
        button3: '',
        button4: ''
    };

    public static async initialize() {
        Nui.RegisterCallback("close", () => this.close());
        Nui.RegisterCallback("push", (e: string) => this.push(e));
        onNet('hoyame:createPedMenu', (data: any) => this.open(data));
        
        RegisterCommand('createPedMenu', () => {
            this.open({
                title: 'Ped 1',
                message: 'Que voulez vous louer ?',
                button1: 'Bato',
                button2: 'Jetski',
                button3: 'Jetski',
                button4: 'Jetski',
                cb: (e: number) => {
                    console.log("fzeoifnzofin       " + e)
                }
            })
        }, false)
    }

    public static async open(menu: IPed) {
        this.cacheCb = menu.cb;
        Nui.SendMessage({ path: "ped" });
        await Delay(500);
        Nui.SendMessage({ type: "ped", content: menu, dark: (GetClockHours() < 21 && GetClockHours() > 6)});
        Nui.SetFocus(true, true, false);
        SetMouseCursorSprite(0);
    }

    public static push(e: string) {
        this.cacheCb(e);
        this.close();
    }

    public static close() {
        Nui.SetFocus(false, false, false);
        Nui.SendMessage({ path: "" });
        TriggerScreenblurFadeOut(500)
    }
}