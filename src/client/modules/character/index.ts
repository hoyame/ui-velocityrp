import { Delay } from "../../../shared/utils/utils";
import { Nui } from "../../core/nui";

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

export abstract class Character {
	private static data = {
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
	};

	public static async initialize() {
		onNet("hoyame:createCharacter", (data: any) => this.open(data));
	}

	public static async open(data: ICharacterData) {
		Nui.SendMessage({ path: "character" });
		await Delay(500);
		Nui.SendMessage({ type: "character", data: data });
		Nui.SetFocus(true, true, false);
	}
}
