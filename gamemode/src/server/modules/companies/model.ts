import { ItemId } from "../../../shared/config/items";
import { IInventoryItem } from "../../../shared/player/inventory";
import { ICompany } from "../../../shared/types/company";
import { IVehiculesCustom } from "../../../shared/types/vehicules";

export class Company implements ICompany {
	id: number;
	idJob: number;
	name: string;
	inventory: IInventoryItem[];
	money: number;

	constructor(data: ICompany) {
		this.id = data.id;
		this.idJob = data.idJob;
		this.name = data.name;
		this.inventory = data.inventory;
		this.money = data.money;
	}

	public setName(name: string) {
		this.name = name;
	}

	public returnInventory() {
		return this.inventory;
	}

	public returnMoney() {
		return this.money;
	}

	public hasItem(itemId: ItemId, quantity = 1) {
		return !!this.inventory.find(i => i.itemId == itemId && i.quantity >= quantity);
	}

	public removeItem(itemId: ItemId, quantity: number) {
		const index = this.inventory.findIndex(i => i.itemId == itemId);
		if (index == -1) return false;

		const newQuantity = Math.max(this.inventory[index].quantity - quantity, 0);
		if (newQuantity == 0) {
			this.inventory.splice(index, 1);
		} else {
			this.inventory[index].quantity = newQuantity;
		}

		return true;
	}

	public additem(itemId: ItemId, quantity: number) {
		const index = this.inventory.findIndex(i => i.itemId == itemId);
		if (index == -1) {
			this.inventory.push({ itemId, quantity });
		} else {
			this.inventory[index].quantity += quantity;
		}
	}

	public canPay(amount: number) {
		return this.money + this.money >= amount;
	}

	public giveMoney(amount: number) {
		this.money += amount;
	}

	public pay(amount: number) {
		if (!this.canPay(amount)) return false;

		if (this.money > amount) {
			this.money -= amount;
		} else if (this.money > 0) {
			amount -= this.money;
			this.money = 0;
		}

		return true;
	}
}
