import { ItemId, ItemsConfig } from "../../shared/config/items";
import { IInventoryItem, TargetType } from "../../shared/player/inventory";
import { BroadcastAbovePedText, RegisterServerCallback } from "../core/utils";
import { PropertiesController } from "../modules/property/controller";
import { SendErrorNotification, SendNotification, SendSuccessNotification } from "../utils/notifications";
import { CharactersController } from "./charactersController";
import { VehiclesController } from "./vehiclesController";

export abstract class InventoryController {
	private static inventorySubscribers: { [characterId: string]: (string | number)[] } = {};
	private static vehInventorySubscribers: { [plate: string]: (string | number)[] } = {};
	private static propertiesInventorySubscribes: { [id: string]: (string | number)[] } = {};

	public static async initialize() {
		RegisterServerCallback("gm:inventory:get", this.getCharacterInventory.bind(this));
		RegisterServerCallback("gm:inventory:sell", this.sellItem.bind(this));
		RegisterServerCallback("gm:inventory:buyItem", this.buyItem.bind(this));
		RegisterServerCallback("gm:inventory:subscribe", this.subscribeToInventoryChanges.bind(this));
		RegisterServerCallback("gm:inventory:vehSubscribe", this.subscribeToVehInventoryChanges.bind(this));
		RegisterServerCallback("gm:inventory:propertySubscribe", this.subscribeToPropertyInventoryChanges.bind(this));
		onNet("gm:inventory:unsubscribe", this.unsubsribeFromInventoryChanges.bind(this));
		onNet("gm:inventory:useItem", this.useItem.bind(this));
		onNet("gm:inventory:throwItem", this.removeItem.bind(this));
		onNet("gm:inventory:giveItem", this.giveItem.bind(this));
		onNet("gm:inventory:removeItem", this.removeItem.bind(this));
		onNet("gm:inventory:takeItem", this.takeItem.bind(this));
		onNet("gm:inventory:putItem", this.putItem.bind(this));
		onNet("gm:inventory:haveBag", this.setCharacterHasBag.bind(this));
		on("playerDropped", this.onPlayerDropped.bind(this));
	}

	private static onPlayerDropped() {
		delete this.inventorySubscribers[source];
		for (const [characterId, subscribers] of Object.entries(this.inventorySubscribers)) {
			if (subscribers.includes(source)) {
				this.inventorySubscribers[characterId] = this.inventorySubscribers[characterId].filter(i => i !== source);
			}
		}
	}

	private static getCharacterInventory(source: number, playerId?: string) {
		return CharactersController.getCharacter(playerId || source)?.inventory || [];
	}

	private static useItem(itemId: ItemId) {
		const character = CharactersController.getCharacter(source);
		const itemsInfos = ItemsConfig[itemId];

		if (!itemsInfos || !character.hasItem(itemId)) return false;

		if (!!itemsInfos.onuse?.remove) {
			character.removeItem(itemId, 1);
			this.onCharacterInventoryChange(source);
		}

		if (!!itemsInfos.onuse?.clientEvent) emitNet(itemsInfos.onuse.clientEvent, source);
		if (!!itemsInfos.onuse?.effect) emitNet("gm:needs:feed", source, itemId, itemsInfos.onuse.effect);
		if (!!itemsInfos.onuse?.serverEvent) emit(itemsInfos.onuse.serverEvent, source);
	}

	private static sellItem(source: number, itemIds: ItemId[]) {
		const character = CharactersController.getCharacter(source);
		let item = character.inventory.find(i => itemIds.includes(i.itemId) && i.quantity > 0)?.itemId;
		if (!item) return [];

		const sellPrice = ItemsConfig[item]?.sellPrice;
		if (!sellPrice || !character?.removeItem(item, 1)) return [];

		const price = !!sellPrice.max ? Math.randomRange(sellPrice.min, sellPrice.max) : sellPrice.min;
		character.giveMoney(price);

		this.onCharacterInventoryChange(source);

		return [price, item];
	}

	private static async removeItem(itemId: string, quantity: string, metadatas?: IInventoryItem["metadatas"]) {
		const character = CharactersController.getCharacter(source);
		character.removeItem(itemId, Number(quantity) || 1, metadatas);
		BroadcastAbovePedText("* L'individu jette un objet *", source);
		this.onCharacterInventoryChange(source);
	}

	private static async takeItem(itemId: ItemId, quantity: number, targetType: TargetType, targetId: string) {
		if (targetType != TargetType.Vehicle && targetType != TargetType.Property) return;
		const target =
			targetType == TargetType.Vehicle ? VehiclesController.getVehicle(targetId) : PropertiesController.getPropertyById(+targetId);
		const character = CharactersController.getCharacter(source);
		if (!target || !character) return;

		quantity = Math.min(quantity, target.getItemQuantity(itemId), character.getQuantityThatCanBeCarried(itemId));
		if (character.canCarry(itemId, quantity) && target.removeItem(itemId, quantity)) {
			character.additem(itemId, quantity, true);
			this.onCharacterInventoryChange(source);
			this.onVehicleInventoryChange(targetId);

			if (targetType == TargetType.Vehicle) {
				this.onVehicleInventoryChange(targetId);
			} else {
				this.onPropertyInventoryChange(targetId);
			}
		}
	}

	private static async putItem(itemId: ItemId, quantity: number, targetType: TargetType, targetId: string) {
		if (targetType != TargetType.Vehicle && targetType != TargetType.Property) return;
		const target =
			targetType == TargetType.Vehicle ? VehiclesController.getVehicle(targetId) : PropertiesController.getPropertyById(+targetId);
		const character = CharactersController.getCharacter(source);
		if (!target || !character) return;

		quantity = Math.min(quantity, character.getItemQuantity(itemId), target.getQuantityThatCanBeCarried(itemId));
		if (target.canCarry(itemId, quantity) && character.removeItem(itemId, quantity)) {
			target.additem(itemId, quantity, true);
			this.onCharacterInventoryChange(source);

			if (targetType == TargetType.Vehicle) {
				this.onVehicleInventoryChange(targetId);
			} else {
				this.onPropertyInventoryChange(targetId);
			}
		}
	}

	private static buyItem(source: number, itemId: ItemId) {
		const character = CharactersController.getCharacter(source);
		if (!character.canCarry(itemId, 1)) {
			SendErrorNotification(source, "~r~Action impossible.~w~~n~ Vous n'avez pas assez de place pour porter cela");
			return false;
		}

		const price = ItemsConfig[itemId].buyPrice;
		if (!price || !character.pay(price)) return false;

		character.additem(itemId, 1, true);
		this.onCharacterInventoryChange(source);

		return true;
	}

	private static async giveItem(itemId: string, qty: string, targetId: string) {
		const character = CharactersController.getCharacter(source);
		const target = CharactersController.getCharacter(targetId);
		const quantity = Number(qty);
		const item = ItemsConfig[itemId];
		if (!character || !target || !quantity || quantity <= 0 || !item) return;

		if (!target.canCarry(itemId, quantity)) {
			SendErrorNotification(source, "~r~Action impossible.~w~~n~ La cible n'a pas assez de place pour porter cela");
			return false;
		}

		if (character.removeItem(itemId, quantity)) {
			target.additem(itemId, quantity, true);

			BroadcastAbovePedText("* L'individu donne un objet *", source);
			SendSuccessNotification(source, `Vous avez donné ${quantity} ~g~${ItemsConfig[itemId].name}`);
			SendSuccessNotification(targetId, `Quelqu'un vous a donné ${quantity} ~g~${ItemsConfig[itemId].name}`);
		}

		this.onCharacterInventoryChange(source);
		this.onCharacterInventoryChange(targetId);
	}

	private static subscribeToInventoryChanges(source: number, characterId: string) {
		const charId = characterId || source;

		if (!this.inventorySubscribers[charId]) {
			this.inventorySubscribers[charId] = [source];
		} else if (!this.inventorySubscribers[charId].includes(source)) {
			this.inventorySubscribers[charId].push(source);
		}

		return CharactersController.getCharacter(charId)?.inventory || [];
	}

	private static subscribeToVehInventoryChanges(source: number, plate: string) {
		if (!this.vehInventorySubscribers[plate]) {
			this.vehInventorySubscribers[plate] = [source];
		} else if (!this.vehInventorySubscribers[plate].includes(source)) {
			this.vehInventorySubscribers[plate].push(source);
		}

		const vehicle = VehiclesController.getVehicle(plate);
		if (!vehicle) return undefined;

		BroadcastAbovePedText("* regarde dans le coffre *", source);
		return VehiclesController.getVehicle(plate)?.inventory || [];
	}

	private static subscribeToPropertyInventoryChanges(source: number, propertyId: string) {
		if (!this.propertiesInventorySubscribes[propertyId]) {
			this.propertiesInventorySubscribes[propertyId] = [source];
		} else if (!this.propertiesInventorySubscribes[propertyId].includes(source)) {
			this.propertiesInventorySubscribes[propertyId].push(source);
		}

		const property = PropertiesController.getPropertyById(+propertyId);
		if (!property) return undefined;

		BroadcastAbovePedText("* regarde dans le coffre *", source);
		return property.inventory;
	}

	private static unsubsribeFromInventoryChanges(id?: string, type?: TargetType) {
		if (type == TargetType.Vehicle) {
			if (!!id) this.vehInventorySubscribers[id] = this.vehInventorySubscribers[id]?.filter(i => i != source) || [];
		} else if (type == TargetType.Property) {
			if (!!id) this.propertiesInventorySubscribes[+id] = this.propertiesInventorySubscribes[+id]?.filter(i => i != source) || [];
		} else {
			this.inventorySubscribers[id || source] = this.inventorySubscribers[id || source]?.filter(i => i != source) || [];
		}
	}

	private static onCharacterInventoryChange(charId: string | number) {
		const inventory = CharactersController.getCharacter(charId)?.inventory || [];
		for (const subscriber of this.inventorySubscribers[charId] || []) {
			emitNet("gm:inventory:characterUpdate", subscriber, inventory, charId);
		}
	}

	private static onVehicleInventoryChange(plate: string) {
		const inventory = VehiclesController.getVehicle(plate)?.inventory || [];
		for (const subscriber of this.vehInventorySubscribers[plate] || []) {
			emitNet("gm:inventory:targetUpdate", subscriber, inventory);
		}
	}

	private static onPropertyInventoryChange(id: string) {
		const inventory = PropertiesController.getPropertyById(+id)?.inventory || [];
		for (const subscriber of this.propertiesInventorySubscribes[+id] || []) {
			emitNet("gm:inventory:targetUpdate", subscriber, inventory);
		}
	}

	private static setCharacterHasBag(hasBag: boolean) {
		const character = CharactersController.getCharacter(source);
		if (!character) return;

		character.maxWeight = hasBag ? 80 : 50;
	}
}
