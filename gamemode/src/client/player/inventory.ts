import { Control, Game, Vehicle, VehicleLockStatus } from "@wdesgardin/fivem-js";
import { ItemId, ItemsConfig } from "../../shared/config/items";
import { ICharacter } from "../../shared/player/character";
import { IInventoryItem, TargetType } from "../../shared/player/inventory";
import { LocalEvents } from "../../shared/utils/localEvents";
import { GetClosestPlayer, TriggerServerCallbackAsync } from "../core/utils";
import { Lootboxes } from "../modules/game/lootboxes/lootboxes";
import { CharacterCreator } from "../modules/player/character/charactercreator";
import { Animations } from "../utils/animations";
import { Nui } from "../utils/nui";
import { Character } from "./character";
import { Clothes } from "./clothes";
import { Notifications } from "./notifications";

interface CallBackData {
	itemId: ItemId;
	quantity: number;
	metadatas?: IInventoryItem["metadatas"];
}

export abstract class Inventory {
	private static uiOpen = false;
	private static items: IInventoryItem[];
	private static target?: {
		id: string;
		type: TargetType;
		name: string;
		items: IInventoryItem[];
		maxWeight: number;
	};

	public static get isOpen() {
		return this.uiOpen;
	}

	public static async initialize() {
		Nui.RegisterCallback("inventory-use", this.useItem.bind(this));
		Nui.RegisterCallback("inventory-throw", this.throwItem.bind(this));
		Nui.RegisterCallback("inventory-give", this.giveItem.bind(this));
		Nui.RegisterCallback("inventory-give", this.giveItem.bind(this));
		Nui.RegisterCallback("inventory-take-item", this.takeItem.bind(this));
		Nui.RegisterCallback("inventory-put-item", this.putItem.bind(this));
		onNet("gm:inventory:characterUpdate", this.onInventoryUpdate.bind(this));
		onNet("gm:inventory:targetUpdate", this.onTargetInventoryUpdate.bind(this));
		on("gm:player:death", this.onDeath.bind(this));
		RegisterCommand("+toggleinv", this.toggleUi.bind(this), false);
		RegisterKeyMapping("+toggleinv", "Ouvrir/fermer l'inventaire", "keyboard", "i");
		setTick(this.inventoryTick.bind(this));
		LocalEvents.on("gm:character:spawned", async () => {
			this.items = await TriggerServerCallbackAsync("gm:inventory:subscribe");
		});
		exports("hasItem", async (item: string) => await Inventory.hasItem(item));
	}

	public static async sell(itemId: ItemId[]) {
		const result = await TriggerServerCallbackAsync("gm:inventory:sell", itemId);
		if (!result[0] || !result[1]) return 0;

		const [price, item] = result;
		Notifications.ShowSuccess(`Vous avez vendu ~g~1x ${ItemsConfig[item].name}~s~ pour ~g~${price}$`, "money");
		return price;
	}

	public static async getInventory() {
		return ((await TriggerServerCallbackAsync("gm:inventory:get")) as ICharacter["inventory"]) || [];
	}

	public static async useItem(data: CallBackData) {
		if (!!data?.metadatas?.sexRestriction && Character.getCurrent()?.sex != data.metadatas.sexRestriction) {
			Notifications.ShowError("~r~Action impossible~w~~n~Cet objet n'est pas à votre taille");
			return;
		}

		if (!!data?.metadatas?.variations) {
			Clothes.toggleVariation(data.metadatas.variations);
		}
		if (!!data?.metadatas?.pedProp) {
			Clothes.toggleProp(data.metadatas.pedProp.componentId, data.metadatas.pedProp.drawableId, data.metadatas.pedProp.textureId);
		}

		emitNet("gm:inventory:useItem", data.itemId);
	}

	public static async throwItem(data: CallBackData) {
		emitNet("gm:inventory:throwItem", data.itemId, 1, data.metadatas);
		Animations.PlaySimple("mp_weapon_drop", "drop_lh", 1000, 48);
	}

	public static async buyItem(itemId: ItemId) {
		if (await TriggerServerCallbackAsync("gm:inventory:buyItem", itemId)) {
			Notifications.ShowSuccess(`Vous avez achetté ${ItemsConfig[itemId].name} pour ~g~${ItemsConfig[itemId].buyPrice}$`, "money");
		}
	}

	public static async giveItem(data: CallBackData) {
		const [closest, distance] = GetClosestPlayer();
		if (!closest || distance > 2) {
			Notifications.ShowError("~r~Action impossible~w~~n~Approchez vous de la cible");
		} else {
			emitNet("gm:inventory:giveItem", data.itemId, data.quantity, closest);
			Animations.PlaySimple("mp_common", "givetake1_a", 2000, 50);
		}
	}

	public static async takeItem(data: CallBackData) {
		if (this.target?.type != TargetType.Vehicle && this.target?.type != TargetType.Property) return;
		emitNet("gm:inventory:takeItem", data.itemId, data.quantity, this.target.type, this.target.id);
	}

	public static async putItem(data: CallBackData) {
		if (this.target?.type != TargetType.Vehicle && this.target?.type != TargetType.Property) return;
		emitNet("gm:inventory:putItem", data.itemId, data.quantity, this.target.type, this.target.id);
	}

	private static onInventoryUpdate(inventory: IInventoryItem[], id: string) {
		if (Number(id) == GetPlayerServerId(PlayerId())) {
			this.items = inventory;
		} else if (id == this.target?.id) {
			this.target.items = inventory;
		}
		if (this.uiOpen) {
			Nui.SendMessage({
				action: {
					type: "SET_INVENTORY",
					payload: { items: this.items, maxWeight: Clothes.hasBag() ? 80 : 50, target: this.target },
				},
			});
		}
	}

	private static onTargetInventoryUpdate(inventory: IInventoryItem[]) {
		if (!this.uiOpen || !this.target) return;
		console.log(inventory);
		this.target.items = inventory;
		Nui.SendMessage({
			action: { type: "SET_INVENTORY", payload: { items: this.items, maxWeight: Clothes.hasBag() ? 80 : 50, target: this.target } },
		});
	}

	public static async openUi(target?: { targetId: string }) {
		this.items = await TriggerServerCallbackAsync("gm:inventory:subscribe");
		this.uiOpen = true;

		if (!!target) {
			const targetItems = await TriggerServerCallbackAsync("gm:inventory:subscribe", target.targetId);
			this.target = {
				type: TargetType.Player,
				id: target.targetId,
				name: "Fouille",
				items: targetItems,
				maxWeight: 50,
			};
		} else {
			let plate: string | undefined = undefined;

			if (Game.PlayerPed.CurrentVehicle?.exists()) {
				plate = Game.PlayerPed.CurrentVehicle.NumberPlate;
			} else {
				const pos = Game.PlayerPed.Position;
				const closestVeh = new Vehicle(GetClosestVehicle(pos.x, pos.y, pos.z, 3, 0, 71));
				if (closestVeh?.exists?.() && closestVeh.LockStatus != VehicleLockStatus.Locked) plate = closestVeh.NumberPlate;
			}

			const targetItems = !!plate && (await TriggerServerCallbackAsync("gm:inventory:vehSubscribe", plate));
			if (!!plate && !!targetItems)
				this.target = { type: TargetType.Vehicle, id: plate, name: "Coffre du véhicule", items: targetItems, maxWeight: 50 };
		}

		Nui.SendMessage({
			action: { type: "SET_INVENTORY", payload: { items: this.items, maxWeight: Clothes.hasBag() ? 80 : 50, target: this.target } },
			path: "inventory",
		});
		Nui.SetFocus(true, true, true);
	}

	public static async openUiChest(targetPropertyId: string) {
		this.uiOpen = true;

		const targetItems = await TriggerServerCallbackAsync("gm:inventory:propertySubscribe", targetPropertyId);
		this.target = {
			type: TargetType.Property,
			id: targetPropertyId,
			name: "Coffre",
			items: targetItems,
			maxWeight: 200,
		};

		Nui.SendMessage({
			action: { type: "SET_INVENTORY", payload: { items: this.items, maxWeight: Clothes.hasBag() ? 80 : 50, target: this.target } },
			path: "inventory",
		});
		Nui.SetFocus(true, true, true);

		Game.PlayerPed.IsPositionFrozen = true;
	}

	public static closeUi() {
		this.uiOpen = false;
		Nui.SetFocus(false, false, false);
		Nui.SendMessage({ path: "" });

		if (!!this.target) {
			emitNet("gm:inventory:unsubscribe", this.target.id, this.target.type);
			if (this.target.type == TargetType.Property) Game.PlayerPed.IsPositionFrozen = false;
			this.target = undefined;
		}
	}

	private static toggleUi() {
		if (Lootboxes.animationPlaying) return;

		if (this.uiOpen) {
			this.closeUi();
		} else if (Game.PlayerPed.isAlive() && !exports.phone.isOpen()) {
			this.openUi();
		}
	}

	private static inventoryTick() {
		if (this.uiOpen) {
			Game.disableControlThisFrame(0, Control.LookLeftRight);
			Game.disableControlThisFrame(0, Control.LookUpDown);
			Game.disableControlThisFrame(0, Control.LookUpOnly);
			Game.disableControlThisFrame(0, Control.LookDownOnly);
			Game.disableControlThisFrame(0, Control.LookLeftOnly);
			Game.disableControlThisFrame(0, Control.LookRightOnly);
			Game.disableControlThisFrame(0, Control.Duck);
			DisablePlayerFiring(Game.Player.Handle, true);

			HideHudAndRadarThisFrame();

			//BACKSPACE / ESC
			if (Game.isControlJustPressed(0, Control.FrontendCancel)) {
				this.closeUi();
			}
		}
	}

	private static onDeath() {
		if (this.uiOpen) this.closeUi();
	}

	public static updateMaxWeight() {
		if (this.uiOpen) {
			Nui.SendMessage({
				action: {
					type: "SET_INVENTORY",
					payload: { items: this.items, maxWeight: Clothes.hasBag() ? 80 : 50, target: this.target },
				},
			});
		}
	}

	public static canRemoveBag() {
		return (
			CharacterCreator.IsOpen ||
			(!!this.items && this.items.reduce((acc, item) => acc + item.quantity * ItemsConfig[item.itemId].weight, 0) <= 50)
		);
	}

	public static async hasItem(itemId: string) {
		this.items = await TriggerServerCallbackAsync("gm:inventory:subscribe");
		return this.items.findIndex(item => item.itemId == itemId) != -1;
	}
}
