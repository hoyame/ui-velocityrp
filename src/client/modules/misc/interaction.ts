import { Delay } from "../../../shared/utils/utils";
import { Nui } from "../../core/nui";

interface IInteractionMenu {
	title: string;
	description: string;
	cb?: (c: string) => void;
}

export abstract class Interaction {
	private static cacheCb: any = null;
	public static data: IInteractionMenu = {
		title: "RETRAIT D'ARGENT",
		description: "Solde de votre compe bancaire : $2250 Entrez le montant que vous souhaitez retirer de votre compte",
		cb: (e: string) => console.log(e),
	};

	public static async initialize() {
		Nui.RegisterCallback("closeinteraction", () => this.close());
		Nui.RegisterCallback("pushinteraction", (e: number) => this.push(e));
		onNet("hoyame:createInteractionMenu", (data: any) => this.open(data));
	}

	public static async open(menu: IInteractionMenu) {
		this.cacheCb = menu.cb;
		Nui.SendMessage({ path: "interaction" });
		await Delay(500);
		Nui.SendMessage({ type: "interaction", content: menu, dark: GetClockHours() < 21 && GetClockHours() > 6 });
		Nui.SetFocus(true, true, false);
		SetMouseCursorSprite(0);
	}

	public static push(e: number) {
		this.cacheCb && this.cacheCb(e);
		this.close();
	}

	public static close() {
		Nui.SetFocus(false, false, false);
		Nui.SendMessage({ path: "" });
		TriggerScreenblurFadeOut(500);
	}
}
