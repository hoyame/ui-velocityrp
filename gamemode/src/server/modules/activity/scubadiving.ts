import { CharactersController } from "../../player/charactersController";
import { SendErrorNotification, SendNotification, SendSuccessNotification } from "../../utils/notifications";
import Config from "../../../shared/config/activity/scubadiving.json";
import { RegisterServerCallback } from "../../core/utils";

export abstract class ScubaDiving {
	public static async initialize() {
		RegisterServerCallback("gm:scubadiving:rent", this.rent.bind(this));
		RegisterServerCallback("gm:scubadiving:return", this.return.bind(this));
	}

	private static rent(source: number) {
		const character = CharactersController.getCharacter(source);
		if (!character) return;

		if (!character.pay(400)) {
			SendErrorNotification(source, "Vous n'avez ~r~pas assez d'argent~w~ pour emprunter une tenue", "money");
			return false;
		}

		if (!character.canCarry("tenue", 1)) {
			SendErrorNotification(source, "Vous n'avez ~r~pas assez de place");
			return false;
		}

		character.additem("tenue", 1, false, {
			variations: character.infos.sex == "1" ? Config.femaleVariations : Config.maleVariations,
			renamed: "Tenue de plongée",
		});
		SendSuccessNotification(source, "Vous avez reçu une ~g~tenue de plongée");
		return true;
	}

	private static return(source: number) {
		const character = CharactersController.getCharacter(source);
		if (!character) return;

		if (
			character.removeItem("tenue", 1, {
				variations: character.infos.sex == "1" ? Config.femaleVariations : Config.maleVariations,
				renamed: "Tenue de plongée",
			})
		) {
			character.giveMoney(300);
			SendSuccessNotification(source, "Vous avez rendu une tenue de plongée, vous avez récupéré ~g~300$", "money");
			return true;
		}

		return false;
	}
}
