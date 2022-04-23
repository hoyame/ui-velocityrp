import { ICharacterOrg } from "../../shared/player/character";
import { LocalEvents } from "../../shared/utils/localEvents";
import { TriggerServerCallbackAsync } from "../core/utils";

export class Orgs {
	private static currentOrg?: ICharacterOrg;

	public static getOrg() {
		return this.currentOrg;
	}

	public static async initialize() {
		LocalEvents.on("gm:character:spawned", this.loadOrg.bind(this));

		RegisterKeyMapping("+openorgmenu", "Ouvrir le menu organisation", "keyboard", "F7");
		RegisterCommand("+openorgmenu", this.openMenu.bind(this), false);
	}

	public static async loadOrg() {
		this.currentOrg = await TriggerServerCallbackAsync("gm:organisations:getOrg");
	}

	private static openMenu() {}
}
