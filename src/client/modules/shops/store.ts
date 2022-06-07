import { Delay } from "../../../shared/utils/utils";
import { Nui } from "../../core/nui";

export abstract class Store {
    public static data = {
        coins: 150000
    }

    public static async initialize() {
        Nui.RegisterCallback("leave", () => this.close());

        Nui.RegisterCallback("buyMecano", () => this.buyMecano());
        Nui.RegisterCallback("buyFarmCompany", () => this.buyFarmCompany());
        Nui.RegisterCallback("buyOrganisation", () => this.buyOrganisation());
        Nui.RegisterCallback("reclameVip", () => this.reclameVip());
        Nui.RegisterCallback("exclusiveVehicle", () => this.exclusiveVehicle());

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

    private static buyMecano() { emitNet('hoyame:store:buyMecano'); this.close() }
    private static buyFarmCompany() {  emitNet('hoyame:store:buyFarmCompany') }
    private static buyOrganisation() {  emitNet('hoyame:store:buyOrganisation') }
    private static reclameVip() {  emitNet('hoyame:store:reclameVip') }
    private static exclusiveVehicle() {  emitNet('hoyame:store:exclusiveVehicle') }


    public static close() {
        Nui.SendMessage({ path: "" });
        Nui.SetFocus(false, false, false);
        TriggerScreenblurFadeOut(500)
    }
}