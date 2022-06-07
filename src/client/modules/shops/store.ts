import { Delay } from "../../../shared/utils/utils";
import { Nui } from "../../core/nui";
import { TriggerServerCallbackAsync } from "../../core/utils";

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

        Nui.RegisterCallback("openCase", (caseLevel: string) => this.openCase(caseLevel));

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

    private static async openCase(caseLevel: string) {
        const actuallyCase = await TriggerServerCallbackAsync("hoyame:store:grabCaisse", caseLevel);
        Nui.SendMessage({ type: "store/case", data: actuallyCase });

        console.log(actuallyCase);
    }

    private static buyMecano() { emitNet('hoyame:store:buyMecano'); this.close() }
    private static buyFarmCompany() {  emitNet('hoyame:store:buyFarmCompany'); this.close() }
    private static buyOrganisation() {  emitNet('hoyame:store:buyOrganisation'); this.close() }
    private static reclameVip() {  emitNet('hoyame:store:reclameVip'); this.close() }
    private static exclusiveVehicle() {  emitNet('hoyame:store:exclusiveVehicle'); this.close() }

    public static close() {
        Nui.SendMessage({ path: "" });
        Nui.SetFocus(false, false, false);
        TriggerScreenblurFadeOut(500)
    }
}