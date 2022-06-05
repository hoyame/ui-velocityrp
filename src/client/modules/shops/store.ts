import { Delay } from "../../../shared/utils/utils";
import { Nui } from "../../core/nui";

export abstract class Store {
    public static data = {
        coins: 150000
    }

    public static async initialize() {
        Nui.RegisterCallback("leave", () => this.close());


        RegisterCommand('boutique', async () => {
            Nui.SendMessage({ path: "shop/case" });
            await Delay(500)
            Nui.SendMessage({ type: "store", data: this.data });

            Nui.SetFocus(true, true, false);
            DisplayRadar(false);
            TriggerScreenblurFadeIn(500)
        }, false)
 
        // RegisterKeyMapping('boutique', 'Boutique', 'keyboard', 'f1')
    }

    public static close() {
        Nui.SetFocus(false, false, false);
        TriggerScreenblurFadeOut(500)
    }
}