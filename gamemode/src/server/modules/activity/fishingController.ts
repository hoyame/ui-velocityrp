import { CharactersController } from "../../player/charactersController";
import { Character } from "../../player/models/character";
import { SendErrorNotification, SendNotification, SendSuccessNotification } from "../../utils/notifications";

export abstract class FishingController {
	public static async initialize() {
		onNet("gm:fishing:catch", this.catchFish.bind(this));
	}

	private static catchFish(bait: string) {
		const character = CharactersController.getCharacter(source);
		if (!character) return;

		const rnd = Math.randomRange(1, 100);

		if ((rnd >= 94 && bait == "turtlebait") || (rnd >= 91 && bait == "sharkbait")) {
			character.removeItem("fishingrod", 1);
			emitNet("gm:fishing:rodbreak", source);
			return;
		}

		if (bait == "turtlebait") {
			if (rnd >= 78) {
				this.onFishCatch(source, character, "turtle");
			} else {
				const weight = rnd >= 75 ? Math.randomRange(4, 9) : Math.randomRange(2, 6);
				this.onFishCatch(source, character, "fish", weight);
			}
		} else if (bait == "sharkbait") {
			if (rnd >= 82) {
				this.onFishCatch(source, character, "shark");
			} else {
				const weight = Math.randomRange(4, 8);
				this.onFishCatch(source, character, "fish", weight);
			}
		} else if (bait == "fishbait") {
			const weight = rnd >= 75 ? Math.randomRange(4, 11) : Math.randomRange(1, 6);
			this.onFishCatch(source, character, "fish", weight);
		} else {
			const weight = rnd >= 70 ? Math.randomRange(2, 4) : Math.randomRange(1, 2);
			this.onFishCatch(source, character, "fish", weight);
		}
	}

	private static onFishCatch(source: number | string, character: Character, itemId: "fish" | "turtle" | "shark", weight?: number) {
		if (!character.additem(itemId, 1)) {
			SendErrorNotification(source, "~r~Action impossible.~w~~n~ Vous n'avez pas assez de place pour porter cela");
			return;
		}

		if (itemId == "fish") {
			SendSuccessNotification(source, "~g~Vous avez attrapé un Poisson de ~y~~h~" + weight + "kg");
		} else if (itemId == "turtle") {
			SendSuccessNotification(
				source,
				"~g~Vous avez attrapé une Tortue\n~r~Ce sont des espèces en voie de disparition , vous êtes en infraction !"
			);
		} else {
			SendSuccessNotification(
				source,
				"~g~Vous avez attrapé un Requin!\n~r~Ce sont des espèces en voie de disparition , vous êtes en infraction !"
			);
		}
	}
}
