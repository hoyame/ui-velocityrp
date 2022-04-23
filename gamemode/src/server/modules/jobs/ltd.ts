import { Jobs } from ".";
import { ItemsConfig } from "../../../shared/config/items";
import { JobId } from "../../../shared/config/jobs/jobs";
import Config from "../../../shared/config/jobs/ltd.json";
import { TriggerClientCallbackAsync } from "../../core/utils";
import { WorldGrid } from "../../core/worldGrid";
import { CharactersController } from "../../player/charactersController";
import { SendErrorNotification, SendNotification, SendSuccessNotification } from "../../utils/notifications";
import { CompaniesController } from "../companies/controller";

export abstract class Ltd {
	private static lastAnnouncement = 0;
	private static beingRob: { [index: number]: { lastRob: number; bagIndex?: number; bagTaken?: boolean } } = {};

	public static async initialize() {
		onNet("gm:ltd:announcement", this.announcement.bind(this));
		onNet("gm:ltd:order", this.order.bind(this));
		onNet("gm:ltd:rob", this.rob.bind(this));
		onNet("gm:ltd:robberyBag", this.registerBag.bind(this));
		onNet("gm:ltd:pickupBag", this.pickupBag.bind(this));
	}

	private static announcement(status: boolean) {
		if (!Jobs.isPlayerOnDuty(source, JobId.LTD)) {
			SendErrorNotification(source, `~r~Action impossible~w~ vous n'êtes pas en service`);
			return;
		}

		const timeToWait = this.lastAnnouncement + 60 * 1000 - GetGameTimer();
		if (timeToWait > 0) {
			SendErrorNotification(
				source,
				`Vous devez attendre ~r~${Math.round(timeToWait / 1000)} secondes~w~ avant de pouvoir faire une nouvelle annonce`
			);
		} else {
			this.lastAnnouncement = GetGameTimer();
			emitNet("gm:ltd:announcement", -1, status);
		}
	}

	private static async order(target: number, order: { [itemId: string]: number }) {
		const src = source;
		if (!Jobs.isPlayerOnDuty(src, JobId.LTD) && !Jobs.isPlayerOnDuty(src, JobId.Unicorn)) {
			SendErrorNotification(src, `~r~Action impossible~w~ vous n'êtes pas en service`);
			return;
		}

		const targetCharacter = CharactersController.getCharacter(target);
		if (!targetCharacter) return;

		let total = 0;
		let weight = 0;

		for (const [itemId, quantity] of Object.entries(order)) {
			const configItem = Config.items.find(i => i.id == itemId);

			if (quantity <= 0 || !ItemsConfig[itemId] || !configItem) {
				delete order[itemId];
				continue;
			}

			total += configItem.sellPrice * quantity;
			weight += ItemsConfig[itemId].weight * quantity;
		}

		if (total <= 0) return;

		SendNotification(src, `En attente du paiement de la facture de ~b~${total}$`);
		const accepted = await TriggerClientCallbackAsync("gm:jobs:billingAnswer", target.toString(), total);
		if (!accepted) {
			SendErrorNotification(src, `Le client a ~r~refusé~w~ de payer la facture`);
			return;
		}

		if (!targetCharacter.canCarryWeight(weight)) {
			SendErrorNotification(src, "~r~Vente annulée~w~~n~Le client ne peut pas porter autant d'objets");
			SendErrorNotification(target, "~r~Vente annulée~w~~n~Vous ne pouvez pas porter autant d'objets");
		} else if (!targetCharacter.pay(total)) {
			SendErrorNotification(src, "~r~Vente annulée~w~~n~Le client n'a pas assez d'argent pour payer la facture", "money");
			SendErrorNotification(target, "~r~Vente annulée~w~~n~Vous n'avez pas assez d'argent pour payer la facture", "money");
		} else {
			for (const [itemId, quantity] of Object.entries(order)) {
				targetCharacter.additem(itemId, quantity, true);
				console.log(itemId, quantity);
			}
			SendSuccessNotification(src, "~g~Vente effectuée", "cart");
			SendSuccessNotification(target, `Vous avez payé ~g~${total}$`, "money");
			CompaniesController.get(JobId.LTD).giveMoney(total);
		}
	}

	private static rob(index: number, targetId: number) {
		const src = source;
		const position = Config.positions[index];
		if (!position) return;

		const character = CharactersController.getCharacter(src);
		if (character?.job?.id != JobId.LTD) return;

		const target = CharactersController.getCharacter(targetId);
		if (!target) {
			SendErrorNotification(src, "~r~Action impossible~w~~n~La cible est introuvable");
		} else if (!!this.beingRob[index] && this.beingRob[index].lastRob > GetGameTimer() - 10 * 60 * 1000) {
			SendErrorNotification(src, "~r~Action impossible~w~~n~Impossible de vider la caisse pour le moment");
		} else {
			Jobs.SendLspdCallout("Braquage LTD", position);
			emitNet("gm:ltd:startRob", source, index);
			this.beingRob[index] = { lastRob: GetGameTimer() };
		}
	}

	private static registerBag(index: number, bagId: number) {
		if (!this.beingRob[index] || !!this.beingRob[index].bagIndex) return;
		this.beingRob[index].bagIndex = bagId;
		const nearby = WorldGrid.getNearbyPlayers(+source);
		for (const player of nearby) {
			emitNet("gm:ltd:registerBag", player, bagId);
		}
	}

	private static pickupBag(id: number) {
		const target = CharactersController.getCharacter(source);
		if (!target) return;

		for (const rob of Object.values(this.beingRob)) {
			if (rob.bagIndex == id && rob.bagTaken != true) {
				rob.bagTaken = true;
				const money = Math.randomRange(700, 1200);
				SendSuccessNotification(source, `Vous avez ramassé ~g~${money}$`, "money");
				DeleteEntity(NetworkGetEntityFromNetworkId(rob.bagIndex));
			}
		}
	}
}
