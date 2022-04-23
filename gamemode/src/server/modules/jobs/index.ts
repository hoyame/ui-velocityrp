import { uuidv4 } from "@nativewrappers/client";
import { Vec3, Vector3 } from "@nativewrappers/client/lib/utils/Vector3";
import { JobId, JobsList, SalaryMinutesInterval } from "../../../shared/config/jobs/jobs";
import { Callout } from "../../../shared/types/callouts";
import { Environnment } from "../../../shared/utils/environnment";
import { RegisterServerCallback, TriggerClientCallbackAsync } from "../../core/utils";
import { CharactersController } from "../../player/charactersController";
import { SendErrorNotification, SendNotification, SendSuccessNotification } from "../../utils/notifications";
import { CompaniesController } from "../companies/controller";

export class Jobs {
	private static onDuty: { [jobId: number]: string[] } = Object.keys(JobId)
		.filter(k => !!Number(k))
		.reduce((acc, jobId) => ({ ...acc, [Number(jobId)]: [] }), {});

	public static async initialize() {
		setInterval(this.giveSalary.bind(this), SalaryMinutesInterval * 60 * 1000);

		onNet("gm:jobs:setOnDuty", this.setStatus.bind(this));
		onNet("gm:jobs:takeCallout", this.onTakeCallout.bind(this));
		on("playerDropped", this.onPlayerDropped.bind(this));
		on("gm:jobs:phoneCallout", this.calloutFromPhone.bind(this));

		onNet("gm:jobs:billing", this.billing.bind(this));

		RegisterServerCallback("gm:character:getJob", this.getJob.bind(this));

		console.log("[GM][Framework] | [Module] - Jobs Initialized");
	}

	public static isPlayerOnDuty(source: string | number, jobId: JobId) {
		return this.onDuty[jobId]?.includes(source.toString());
	}

	private static setStatus(status: boolean) {
		const sourceCharacter = CharactersController.getCharacter(source);
		if (!sourceCharacter?.job?.id || !this.onDuty[sourceCharacter.job.id]) return;
		if (!status) {
			this.onDuty[sourceCharacter.job.id] = this.onDuty[sourceCharacter.job.id].filter(id => id != source);
		} else if (status && !this.onDuty[sourceCharacter.job.id].includes(source)) {
			this.onDuty[sourceCharacter.job.id].push(source.toString());
		}
	}

	private static onPlayerDropped() {
		for (const jobId in this.onDuty) {
			this.onDuty[jobId] = this.onDuty[jobId].filter(id => id != source);
		}
	}

	public static SendCallout(jobId: JobId, callout: Callout) {
		let sentTo = 0;
		for (const [id, character] of Object.entries(CharactersController.getCharacters())) {
			if (character?.job?.id == jobId) {
				emitNet("gm:jobs:addCallout", id, callout);
				sentTo++;
			}
		}

		return sentTo;
	}

	public static SendLspdCallout(infos: string, position: Vec3, sender?: string | number) {
		const senderName = (!!sender && CharactersController.getCharacter(sender)?.infos?.name) || "Inconnu";
		return this.SendCallout(JobId.LSPD, { id: uuidv4(), title: "Appel d'urgence: 911", senderName, sender, infos, position });
	}

	public static SendTaxiCallout(infos: string, position: Vec3, sender?: string | number) {
		const senderName = (!!sender && CharactersController.getCharacter(sender)?.infos?.name) || "Inconnu";
		return this.SendCallout(JobId.Taxi, { id: uuidv4(), title: "Message Entreprise", senderName, sender, infos, position });
	}

	public static SendEmsCallout(infos: string, position: Vec3, sender: string | number) {
		const senderName = CharactersController.getCharacter(sender)?.infos?.name || "Inconnu";
		return this.SendCallout(JobId.EMS, { id: uuidv4(), title: "Appel d'urgence: 912", senderName, sender, infos, position });
	}

	public static EnsureCopsCount(minCops: number, toNotifty?: string | number) {
		if (Environnment.IsDev) {
			if (!!toNotifty)
				SendNotification(toNotifty, "~b~[DEV]~w~ Cette action nécessite normalement ~b~" + minCops + "~w~ policier(s)");
			return true;
		}

		const copsCount = Object.values(CharactersController.getCharacters()).filter(c => c.job?.id == JobId.LSPD).length;
		if (copsCount >= minCops) return true;

		if (!!toNotifty) SendErrorNotification(toNotifty, "~r~Action impossible~w~~n~Il n'y a pas assez de policiers en service");
		return false;
	}

	private static getJob(source: number, playerId?: string) {
		return CharactersController.getCharacter(playerId || source)?.job;
	}

	private static giveSalary() {
		for (const [id, character] of Object.entries(CharactersController.getCharacters())) {
			const job = !!character?.job?.id && JobsList[character.job.id];
			if (!job || !job.salary) continue;

			const salary =
				!!character.job?.rank && character.job?.rank >= 0 && character.job?.rank < job.salary.length
					? job.salary[character.job.rank]
					: job.salary[0];

			character.giveBank(salary);

			SendNotification(id, `Vous avez reçu votre salaire: ~b~${salary}$`, "money");
		}
	}

	private static onTakeCallout(jobId: JobId, sender: string | number, calloutId: string) {
		if (!!sender) SendNotification(sender, "Votre ~b~appel~w~ vient d'être pris", "call");
		const name = CharactersController.getCharacter(source)?.infos?.name || "";
		for (const [id, character] of Object.entries(CharactersController.getCharacters())) {
			if (character?.job?.id == jobId) {
				emitNet("gm:jobs:calloutTaken", id, calloutId, name);
			}
		}
	}

	public static setCharacterJob(target: string, jobId: JobId, rank?: number) {
		const character = CharactersController.getCharacter(target);
		if (!character || jobId <= 0 || jobId > Object.values(JobsList).length) return false;
		character.job = { id: jobId, rank };
		emitNet("gm:jobs:changed", target, character.job);
		return true;
	}

	private static async billing(target: number, total: number) {
		const src = source;
		const sourceCharacter = CharactersController.getCharacter(src);
		const targetCharacter = CharactersController.getCharacter(target);
		if (!sourceCharacter) return;
		if (!targetCharacter || total <= 0) return;
		const sourceJob = sourceCharacter.job.id;
		if (!sourceJob) return;

		SendNotification(src, `En attente du paiement de la facture de ~b~${total}$`, "money");
		const accepted = await TriggerClientCallbackAsync("gm:jobs:billingAnswer", target.toString(), total);
		if (!accepted) {
			SendErrorNotification(src, `Le client a ~r~refusé~w~ de payer la facture`, "money");
			return;
		}

		if (!targetCharacter.pay(total)) {
			SendErrorNotification(src, "~r~Le client n'a pas assez d'argent pour payer la facture", "money");
			SendErrorNotification(target, "~r~Vous n'avez pas assez d'argent pour payer la facture", "money");
		} else {
			SendSuccessNotification(src, "~g~Le client a payé la facture", "money");
			SendSuccessNotification(target, `Vous avez payé ~r~${total}$`, "money");

			const companyReward = total > 10000 ? total / 10 : total;
			CompaniesController.get(sourceJob).giveMoney(companyReward);
		}
	}

	private static async calloutFromPhone(playerSrc: string, job: JobId, message: string) {
		const coords = Vector3.fromArray(GetEntityCoords(GetPlayerPed(playerSrc)));
		if (job == JobId.LSPD) {
			this.SendLspdCallout(message, coords, playerSrc);
		} else if (job == JobId.EMS) {
			this.SendEmsCallout(message, coords, playerSrc);
		} else if (job == JobId.Taxi) {
			this.SendTaxiCallout(message, coords, playerSrc);
		}
	}
}
