import { RegisterServerCallback } from "../../core/utils";
import Config from "../../../shared/config/activity/hunting.json";
import { IItem, ItemsConfig } from "../../../shared/config/items";
import { Model } from "@nativewrappers/client";
import { CharactersController } from "../../player/charactersController";
import { SendErrorNotification, SendSuccessNotification } from "../../utils/notifications";

export abstract class HuntingController {
	private static itemForAnimalHash: { [hash: number]: IItem } = Config.animals.reduce((items, a) => {
		//@ts-ignore
		items[new Model(a.model).Hash] = ItemsConfig[a.item];
		return items;
	}, {});
	private static weaponHash = -1466123874;

	public static async initialize() {
		RegisterServerCallback("gm:hunting:getmeat", this.getMeat.bind(this));
		onNet("gm:hunting:returnWeapon", this.returnWeapon.bind(this));
		onNet("gm:hunting:rentWeapon", this.rentWeapon.bind(this));
	}

	private static getMeat(source: number, entityId: number) {
		const entity = NetworkGetEntityFromNetworkId(entityId);
		if (!DoesEntityExist(entity) || GetEntityHealth(entity) > 0) return;
		const item = this.itemForAnimalHash[GetEntityModel(entity)];
		if (!item) return;

		if (!CharactersController.getCharacter(source)?.additem(item.item, 1)) {
			SendErrorNotification(source, "~r~Action impossible.~w~~n~ Vous n'avez pas assez de place pour porter cela");
			return;
		}

		DeleteEntity(entity);
		return item.name;
	}

	private static returnWeapon() {
		const ped = GetPlayerPed(source);
		const character = CharactersController.getCharacter(source);

		if (!DoesEntityExist(ped) || !character) return;

		//workaround to check if player has weapon since HasPedGotWeapon isn't available server side
		SetCurrentPedWeapon(GetPlayerPed(source), this.weaponHash, true);
		if (GetSelectedPedWeapon(ped) != this.weaponHash) return;

		RemoveWeaponFromPed(ped, this.weaponHash);
		character.giveMoney(150);
		SendSuccessNotification(source, "Vous avez rendu l'arme de chasse et récupéré votre caution de ~g~150$", "money");
	}

	private static rentWeapon() {
		const ped = GetPlayerPed(source);
		const character = CharactersController.getCharacter(source);
		if (!DoesEntityExist(ped) || !character) return;

		if (character.infos.licenses.hunting != true) {
			SendErrorNotification(source, "Action impossible. Vous n'avez pas de ~r~permis de chasse.");
			return;
		}

		if (character.pay(150)) {
			GiveWeaponToPed(ped, this.weaponHash, 250, false, true);
			SendSuccessNotification(source, "Vous avez récupéré une arme de chasse. Rendez la pour récupérer votre caution de ~r~150$");
		} else {
			SendErrorNotification(source, "~r~Vous n'avez pas assez d'argent", "money");
		}
	}
}
