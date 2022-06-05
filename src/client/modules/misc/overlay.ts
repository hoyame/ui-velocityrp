interface IOverlay {
    visible: boolean;

    players?: number;
    id?: number;
    maxPlayers?: number;

    cash?: number;
    bank?: number;
    dirty?: number;
}

interface IStaffData {
    state: boolean;
    reportsCours: number;
    reportsAttente: number;
}

export abstract class Overlay {
    public static async initialize() {
        onNet('hoyame:updateOverlay', this.update.bind(this))
        onNet('hoyame:updateStaff', this.updateStaff.bind(this))
    }

    public static update(data: IOverlay) {
        SendNuiMessage(JSON.stringify({ type: "overlay", data: data, dark: (GetClockHours() < 21 && GetClockHours() > 6)}));
    }

    public static updateStaff(data: IStaffData) {
        SendNuiMessage(JSON.stringify({ type: "staff", data: data }));
    }
}
