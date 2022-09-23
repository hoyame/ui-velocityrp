import { Delay } from "../../../shared/utils/utils";
import { Nui } from "../../core/nui";


export abstract class Inventory {
    // private static data: any = [];
    

    public static async initialize() {
        onNet('hoyame:openInventory', (data: any) => this.open(data));        
        onNet('hoyame:updateInventory', (data: any) => this.update(data));        
        RegisterCommand('openInventory', (arg: any) => this.open(arg), false)
        Nui.RegisterCallback("interact", (arg: any, data: any) => this.interact(arg, data));
    }

    public static async open(data: any) {
        Nui.SendMessage({ path: "inventory" });
        await Delay(500);
        Nui.SendMessage({ type: "inventory", inventory: data });
        Nui.SetFocus(true, true, false);
    }

    public static update(data: any) {
        console.log("inventory update")
        console.log(data)
        Nui.SendMessage({ type: "inventory", inventory: data });
    }       

    private static interact(data: any) {
        emit('hoyame:inventoryInteract', data.action, data.data)
    }
}
