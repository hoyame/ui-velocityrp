import { ItemId } from "../../../shared/config/items";
import { ICompany } from "../../../shared/types/company";
import { Environnment } from "../../../shared/utils/environnment";
import { RegisterServerCallback } from "../../core/utils";
import { CharactersController } from "../../player/charactersController";
import { SendErrorNotification, SendNotification } from "../../utils/notifications";
import { Company } from "./model";
import { CompanyService } from "./service";
import Config from "../../../shared/config/server.json";

export abstract class CompaniesController {
	private static allSocietys: { [id: number]: Company } = {};
	private static socCount = 0;

	public static async initialize() {
		this.loadSocietys();

		RegisterServerCallback("gm:companies:getAll", this.getAll.bind(this));
		RegisterServerCallback("gm:companies:get", this.get.bind(this));

		//onNet("gm:companies:create", this.createSociety.bind(this));

		// ctrl

		RegisterServerCallback("gm:companies:ctrl:hasItem", this.hasItem.bind(this));
		RegisterServerCallback("gm:companies:ctrl:canPay", this.canPay.bind(this));
		RegisterServerCallback("gm:companies:ctrl:getInventory", this.getInventory.bind(this));
		RegisterServerCallback("gm:companies:ctrl:getMoney", this.getMoney.bind(this));

		onNet("gm:companies:ctrl:takeItem", this.takeItem.bind(this));
		onNet("gm:companies:ctrl:pay", this.pay.bind(this));
		onNet("gm:companies:ctrl:takeMoney", this.takeMoney.bind(this));

		setInterval(this.saveAll.bind(this), Environnment.IsDev ? 10000 : Config.autoSave);
	}

	public static async loadSocietys() {
		const allOrgs = await CompanyService.GetAllCompanies();

		allOrgs.map(async (v: ICompany, k: number) => {
			this.socCount++;
			this.allSocietys[this.socCount] = CompanyService.AddCompany(v);
		});
	}

	public static async saveAll() {
		console.log("Auto-save company start...");
		const start = GetGameTimer();

		const companies = Object.values(this.allSocietys);
		for (const company of companies) {
			await CompanyService.SaveCompany(company);
		}
		console.log(`Auto save done. ${companies.length} companies saved in ${GetGameTimer() - start} ms`);
	}

	public static getAll() {
		return this.allSocietys;
	}

	public static get(id: number) {
		return this.allSocietys[id];
	}

	private static getInventory(idCompany: number) {
		return this.allSocietys[idCompany]?.returnInventory();
	}

	private static getMoney(idCompany: number) {
		return this.allSocietys[idCompany]?.returnMoney();
	}

	private static pay(idCompany: number, amount: number) {
		return this.allSocietys[idCompany]?.pay(amount);
	}

	private static canPay(idCompany: number, amount: number) {
		return this.allSocietys[idCompany]?.canPay(amount);
	}

	private static giveMoney(idCompany: number, amount: number) {
		return this.allSocietys[idCompany]?.giveMoney(amount);
	}

	private static hasItem(idCompany: number, itemId: ItemId, quantity = 1) {
		return this.allSocietys[idCompany]?.hasItem(itemId, quantity);
	}

	private static additem(idCompany: number, itemId: ItemId, quantity = 1) {
		return this.allSocietys[idCompany]?.additem(itemId, quantity);
	}

	private static removeItem(idCompany: number, itemId: ItemId, quantity = 1) {
		return this.allSocietys[idCompany]?.removeItem(itemId, quantity);
	}

	private static takeItem(idCompany: number, itemId: ItemId, quantity = 1) {
		const character = CharactersController.getCharacter(source);

		if (!character.canCarry(itemId, quantity)) {
			SendErrorNotification(source, "~r~Action impossible.~w~~n~ Vous n'avez pas assez de place pour porter cela");
		} else if (this.removeItem(idCompany, itemId, quantity)) {
			character.additem(itemId, quantity, true);
		}
	}

	private static takeMoney(idCompany: number, quantity: number) {
		const character = CharactersController.getCharacter(source);

		if (this.pay(idCompany, quantity)) {
			character.giveBank(quantity);
		}
	}
}
