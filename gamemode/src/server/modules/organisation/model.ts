import { ItemId } from "../../../shared/config/items";
import { IInventoryItem } from "../../../shared/player/inventory";
import { IOrganisation, IDataOrganisation } from "../../../shared/types/organisation";
import { IVehiculesCustom } from "../../../shared/types/vehicules";

export class Organisation implements IOrganisation {
	id: number;
	name: string;
	members: any[];
	data: IDataOrganisation;
	inventory: IInventoryItem[];
	money: [number, number];
	vehicles: any[];

	constructor(data: IOrganisation) {
		this.id = data.id;
		this.name = data.name;
		this.members = data.members;
		this.data = data.data;

		this.inventory = data.inventory;
		this.money = data.money;
		this.vehicles = data.vehicles;
	}

	public getMembers() {
		return this.members;
	}

	public getData() {
		return this.data;
	}

	public setName(name: string) {
		this.name = name;
	}

	public addMember(idPlayer: string) {
		this.members.push(idPlayer);
	}

	public updateData(data: IDataOrganisation) {
		this.data = data;

		// a update selon les données
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
		return this.money[0] + this.money[1] >= amount;
	}

	public giveBank(amount: number) {
		this.money[0] += amount;
	}

	public giveSale(amount: number) {
		this.money[1] += amount;
	}

	public pay(amount: number) {
		if (!this.canPay(amount)) return false;

		for (let i = 0; i < this.money.length; i++) {
			if (this.money[i] > amount) {
				this.money[i] -= amount;
				break;
			} else if (this.money[i] > 0) {
				amount -= this.money[i];
				this.money[i] = 0;
			}
		}

		return true;
	}

	public returnVehicles() {
		return this.vehicles;
	}

	public async addVehicle(vehicleName: string, plate: string, custom: IVehiculesCustom, id?: number) {
		this.vehicles.push([vehicleName, plate, custom, true]);
		return true;
	}

	public async removeVehicle(plate: string) {
		this.vehicles = this.vehicles.filter((x: any) => x[1] != plate);
		return true;
	}

	public async useVehicle(plate: string, pos?: number[], id?: number) {
		const indexOf = this.vehicles.findIndex((e: any) => e[1] === plate);
		this.vehicles[indexOf][3] = true;
		this.spawnVehicle(plate, pos);

		return true;
	}

	public async rangeVehicle(plate: string, pos?: number[], id?: number) {
		const indexOf = this.vehicles.findIndex((e: any) => e[1] === plate);
		this.vehicles[indexOf][3] = false;

		emitNet("gm:vehicles:delete", source);
		return true;
	}

	public async spawnVehicle(plate: string, pos?: number[], id?: number) {
		const vehicles = this.vehicles;
		const indexOf = vehicles.findIndex((e: any) => e[1] === plate);
		const nameVehicle = vehicles[indexOf][0];
		const customVehicle = vehicles[indexOf][2];

		emitNet("gm:vehicles:spawn", source, nameVehicle, customVehicle, pos);
	}
}
