import { ItemId, ItemsConfig } from "../../../shared/config/items";
import { IInventoryItem } from "../../../shared/player/inventory";
import { isEqualObjects } from "../../../shared/utils/utils";

export abstract class withInventory {
	inventory: IInventoryItem[] = [];
	maxWeight = 50;

	constructor(inventory: IInventoryItem[]) {
		this.inventory = inventory;
	}

	public hasItem(itemId: ItemId, quantity = 1) {
		return this.getItemQuantity(itemId) >= quantity;
	}

	public getItemQuantity(itemId: ItemId) {
		return this.inventory.find(i => i.itemId == itemId)?.quantity || 0;
	}

	public removeItem(itemId: ItemId, quantity: number, metadatas?: IInventoryItem["metadatas"]) {
		const index = this.inventory.findIndex(i => i.itemId == itemId && isEqualObjects(i.metadatas, metadatas));
		if (index == -1) return false;

		if (this.inventory[index].quantity < quantity) return false;

		const newQuantity = Math.max(this.inventory[index].quantity - quantity, 0);
		if (newQuantity == 0) {
			this.inventory.splice(index, 1);
		} else {
			this.inventory[index].quantity = newQuantity;
		}

		return true;
	}

	public additem(itemId: ItemId, quantity: number, ignoreWeight = false, metadatas?: IInventoryItem["metadatas"]) {
		if (!ignoreWeight && !this.canCarry(itemId, quantity)) return false;

		const index = this.inventory.findIndex(i => i.itemId == itemId && isEqualObjects(i.metadatas, metadatas));
		if (index == -1) {
			this.inventory.push({ itemId, quantity, metadatas });
		} else {
			this.inventory[index].quantity += quantity;
		}

		return true;
	}

	public canCarry(itemId: ItemId, quantity: number) {
		const itemWeight = ItemsConfig[itemId].weight;
		if (itemWeight <= 0) return true;
		return this.getWeight() + itemWeight * quantity <= this.maxWeight;
	}

	public canCarryWeight(weight: number) {
		return this.getWeight() + weight <= this.maxWeight;
	}

	public getQuantityThatCanBeCarried(itemId: ItemId) {
		const weight = ItemsConfig[itemId]?.weight || 0;
		return weight <= 0 ? Number.MAX_SAFE_INTEGER : Math.floor((this.maxWeight - this.getWeight()) / weight);
	}

	public getWeight() {
		return this.inventory.reduce((weight, i) => weight + i.quantity * ItemsConfig[i.itemId].weight, 0);
	}
}
