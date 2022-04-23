import { JobId } from "../../../shared/config/jobs/jobs";
import { CharactersController } from "../../player/charactersController";
import { SendErrorNotification, SendNotification, SendSuccessNotification } from "../../utils/notifications";
import { Jobs } from "../jobs";
import Config from "../../../shared/config/activity/fleeca.json";
import { Environnment } from "../../../shared/utils/environnment";
import { DiscordUtils } from "../../utils/discord";

export abstract class Fleeca {
	private static banks = Config.banks;
	private static availableLoots: { [bankIndex: number]: number[] } = {};

	public static async initialize() {
		onNet("gm:fleeca:startRobbery", this.startRobbery.bind(this));
		onNet("gm:fleeca:lootReady", this.onLootReady.bind(this));
		onNet("gm:fleeca:beginLoot", this.beginLooot.bind(this));
		onNet("gm:fleeca:take", this.takeLoot.bind(this));
		onNet("gm:fleeca:openSecondDoor", this.openSecondDoor.bind(this));
		onNet("gm:fleeca:policeToggleDoor", this.policeToggleDoor.bind(this));
	}

	private static startRobbery(index: number) {
		if (!Jobs.EnsureCopsCount(Config.minCops, source)) return;

		const character = CharactersController.getCharacter(source);
		if (!character) return;

		if (character.job.id == JobId.LSPD && !Environnment.IsDev) {
			SendErrorNotification(source, "Votre ~r~métier~w~ ne vous permet pas d'effectuer cette action");
		} else if (!character.hasItem("fleecaCard")) {
			SendErrorNotification(source, "Vous ne possédez pas ~r~l'objet~w~ nécessaire");
		} else if (this.banks[index].beingRobbed) {
			SendErrorNotification(source, "Cette banque est déjà en train d'être ~r~braquée");
			return;
		} else if (this.banks[index].lastRobbed + 15 * 60 * 1000 > Date.now()) {
			SendErrorNotification(source, "Cette banque a déjà été ~r~braquée~w~ récemment. Le coffre est vide.");
		} else {
			this.banks[index].beingRobbed = true;
			Jobs.SendLspdCallout("Braquage de banque", this.banks[index].blipPos);
			emitNet("gm:fleeca:openDoorAnim", source, index, true);
			emitNet("gm:fleeca:toggleSecondDoor", -1, index, true);

			const initiator = source;
			setTimeout(() => {
				emitNet("gm:fleeca:toggleDoor", -1, index, false);

				setTimeout(() => SendNotification(initiator, "La porte du coffre va se ~r~refermer~w~ dans 10 secondes"), 110 * 1000);
				setTimeout(() => this.stopRobbery(index, initiator), 120 * 1000);
			}, 2500);
		}
	}

	private static policeToggleDoor(index: number, locked: boolean) {
		const bank = this.banks[index];
		if (!bank) return;

		const character = CharactersController.getCharacter(source);
		if (!character || character.job.id != JobId.LSPD) return;

		if (bank.beingRobbed) {
			SendErrorNotification(source, "~r~Action impossible~w~~n~Veuillez attendre la fin du braquage (maximum 2min)");
		} else {
			emitNet("gm:fleeca:toggleDoor", -1, index, locked);
		}
	}

	private static onLootReady(index: number, players: number[]) {
		if (!this.banks[index].beingRobbed || !!this.availableLoots[index] || !Config.banks[index]) return;

		this.availableLoots[index] = Config.banks[index].trolleys.map((_, i) => i);

		for (const player of players) {
			emitNet("gm:fleeca:startLoot", player, index);
		}
		emitNet("gm:fleeca:startLoot", source, index);
	}

	private static beginLooot(bankIndex: number, index: number) {
		emitNet("gm:fleeca:updateLoots", -1, bankIndex, index);
	}

	private static takeLoot(bankIndex: number, index: number) {
		const character = CharactersController.getCharacter(source);
		if (!character || !this.availableLoots[bankIndex].includes(index)) return;

		this.availableLoots[bankIndex] = this.availableLoots[bankIndex].filter(i => i != index);

		const reward = Math.randomRange(Config.minCash, Config.maxCash);
		character.giveMoney(reward);
		SendSuccessNotification(source, "Vous avez récupéré ~g~" + reward + "$", "money");

		DiscordUtils.SendFleecaLog(
			"```Fleeca: " +
				GetPlayerName(source) +
				" (Id : " +
				source +
				", characterId: " +
				character.id +
				") a dérobé : " +
				reward +
				" $```"
		);
	}

	private static openSecondDoor(bankIndex: number) {
		const character = CharactersController.getCharacter(source);
		if (!character) return;

		const bank = this.banks[bankIndex];
		if (!bank) return;

		if (character.job?.id == JobId.LSPD) {
			emitNet("gm:fleeca:toggleSecondDoor", -1, bankIndex, false);
			return;
		}

		if (!bank.beingRobbed) {
			SendErrorNotification(source, "~r~Action impossible");
		} else if (!character.hasItem("fleecaCard2")) {
			SendErrorNotification(source, "Vous ne possédez pas ~r~l'objet~w~ nécessaire");
		} else {
			emitNet("gm:fleeca:openDoorAnim", source, bankIndex, false);
			setTimeout(() => emitNet("gm:fleeca:toggleSecondDoor", -1, bankIndex, false), 2500);
		}
	}

	private static stopRobbery(bankIndex: number, initiator: string) {
		const bank = this.banks[bankIndex];
		if (!bank) return;

		bank.beingRobbed = false;
		bank.lastRobbed = Date.now();
		delete this.availableLoots[bankIndex];

		emitNet("gm:fleeca:toggleDoor", -1, bankIndex, true);
	}
}
