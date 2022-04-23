import { Vector3 } from "@nativewrappers/client";
import { Jobs } from ".";
import { JobId } from "../../../shared/config/jobs/jobs";
import { RegisterServerCallback } from "../../core/utils";
import { CharactersController } from "../../player/charactersController";
import { SendNotification } from "../../utils/notifications";

export class EMS {
	public static initialize() {
		console.log("[GM][Framework] | [Module][Jobs] - EMS Initialized");

		RegisterServerCallback("gm:jobs:emsCall", this.emsCall.bind(this));
		RegisterServerCallback("gm:ems:bloodTest", this.bloodTest.bind(this));

		onNet("gm:jobs:EMS:revive", this.revive.bind(this));
		onNet("gm:jobs:EMS:heal", this.heal.bind(this));
		onNet("gm:ems:certif", this.giveCertif.bind(this));
	}

	private static emsCall(source: number) {
		const sourcePos = Vector3.fromArray(GetEntityCoords(GetPlayerPed(source.toString())));
		const sentTo = Jobs.SendEmsCallout("Un individu demande un médecin", sourcePos, source);
		return sentTo > 0;
	}

	private static revive(target: string, health: string) {
		const jobId = CharactersController.getCharacter(source)?.job?.id;

		if (jobId == JobId.EMS) {
			emitNet("gm:revive", target, Number(health));
			SendNotification(target, "Vous avez été ~g~réanimé");
		} else {
			// il cheat le fdp
			// c'est mal
		}
	}

	private static giveCertif(target: string) {
		const character = CharactersController.getCharacter(source);
		const targetCharacter = CharactersController.getCharacter(target);
		if (character?.job?.id != JobId.EMS || !target) return;
		SendNotification(source, "Vous avez donné un ~g~certificat");
		SendNotification(target, "Vous avez reçu un ~g~certificat");
		targetCharacter.additem("certif_medic", 1, true, { medicName: character.infos.name });
	}

	private static heal(target: string, heal: string) {
		emitNet("gm:heal", target, Number(heal));
	}

	private static bloodTest(source: number, target: string) {
		const needs = CharactersController.getCharacter(target)?.infos?.needs;
		if (!!needs) return { weed: needs.weed || 0, alcool: needs.alcool || 0 };
	}
}
