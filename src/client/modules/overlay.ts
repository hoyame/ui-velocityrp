import { Nui } from "../core/nui";
import { Delay } from "../core/utils";


interface IOverlay {
    visible: boolean;

    players?: number;
    id?: number;
    maxPlayers?: number;

    cash?: number;
    bank?: number;
    dirty?: number;
}

export abstract class Overlay {
    public static async initialize() {
        onNet('hoyame:updateOverlay', this.update.bind(this))
    }

    public static update(data: IOverlay) {
        SendNuiMessage(JSON.stringify({ type: "overlay", data: data}));
    }
}
