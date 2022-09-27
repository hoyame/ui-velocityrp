import { Delay } from "../../../shared/utils/utils";
import { Nui } from "../../core/nui";
import { Inventory } from "./inventory";

interface ICharacterData {
	coins: number | string;
	points: number | string;
	farm: number | string;
	farmLimit: number | string;
	patrimony: number | string;
	family: number | string;
	phone: number | string;
	amandes: number | string;
	job: number | string;
	org: number | string;
	warn: number | string;
}

interface IMenu {
	character: ICharacterData;
}

export abstract class Menu {
	private static data = {
		character: {
			name: "",
			coins: 0,
			points: 0,
			farm: 0,
			farmLimit: 0,
			patrimony: 0,
			family: "Any",
			phone: "",
			amandes: "",
			job: "",
			org: "",
			warn: 0,
		},
	};

	public static async initialize() {
		onNet("hoyame:openMainMenu", (data: any) => this.open(data));
		RegisterCommand("openMainMenu", () => this.open(this.data), false);

		Inventory.initialize();
	}

	public static async open(data: IMenu) {
		Nui.SendMessage({ path: "menu" });
		await Delay(500);
		Nui.SendMessage({ type: "menu", data: data });
		Nui.SetFocus(true, true, false);
	}
}
