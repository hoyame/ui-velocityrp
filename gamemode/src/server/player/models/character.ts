import { ItemId, ItemsConfig } from "../../../shared/config/items";
import { ICharacter, ICharacterInfos } from "../../../shared/player/character";
import { IInventoryItem } from "../../../shared/player/inventory";
import { IVehicle } from "../../../shared/types/vehicules";
import { Vehicle } from "./vehicle";
import { withInventory } from "./withInventory";

export class Character extends withInventory implements ICharacter {
	id: number;
	playerId: number;
	infos: ICharacterInfos;
	money: number;
	vehicles: Vehicle[];
	properties: [];
	lodaout: [];
	billings: any[];
	job: ICharacter["job"];
	org: ICharacter["org"];
	jail: number;

	constructor(data: ICharacter) {
		super(data.inventory);
		this.id = data.id;
		this.playerId = data.playerId;
		this.infos = data.infos;
		this.money = data.money;
		this.lodaout = data.lodaout;
		this.properties = data.properties;
		this.billings = data.billings;
		this.job = data.job;
		this.org = data.org;
		this.vehicles = data.vehicles.map(v => new Vehicle(v));
		this.jail = data.jail;
	}

	public updateJail(number: number) {
		this.jail = number;
	}

	public canPay(amount: number) {
		return this.getItemQuantity("money") + this.getItemQuantity("saleMoney") + this.money >= amount;
	}

	public pay(amount: number) {
		if (!this.canPay(amount)) return false;

		let toPay = amount;

		if (toPay > 0) {
			let money = Math.min(this.getItemQuantity("money"), toPay);
			toPay -= money;
			this.removeItem("money", money);
		}

		if (toPay > 0) {
			let saleMoney = Math.min(this.getItemQuantity("saleMoney"), toPay);
			toPay -= saleMoney;
			this.removeItem("saleMoney", saleMoney);
		}

		if (toPay > 0) {
			this.money -= toPay;
		}

		return true;
	}

	public giveMoney(amount: number) {
		this.additem("money", amount);
	}

	public removeMoney(amount: number) {
		this.removeItem("money", amount);
	}

	public giveBank(amount: number) {
		this.money += amount;
	}

	public giveSaleMoney(amount: number) {
		this.additem("saleMoney", amount);
	}

	public removeBank(amount: number) {
		this.money -= amount;
	}

	public getMoney() {
		return this.getItemQuantity("money");
	}

	public getSaleMoney() {
		return this.getItemQuantity("saleMoney");
	}

	public addBilling(source: string, amount: number, description: string) {
		this.billings.push([source, amount, description]);
		return true;
	}

	public removeBilling(source: string, amount: number, description: string) {
		const index = this.billings.findIndex(i => i[0] == source && i[1] == amount && i[2] == description);
		this.billings[index] = null;

		return true;
	}

	public setJob(job: ICharacter["job"]) {
		this.job = job;
	}

	public setOrg(org: ICharacter["org"]) {
		this.org = org;
	}
}
