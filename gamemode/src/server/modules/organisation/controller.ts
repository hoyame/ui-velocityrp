import { ItemId } from "../../../shared/config/items";
import { IOrganisation, IDataOrganisation } from "../../../shared/types/organisation";
import { RegisterServerCallback } from "../../core/utils";
import { CharactersController } from "../../player/charactersController";
import { Character } from "../../player/models/character";
import { PlayersController } from "../../player/playersController";
import { SendErrorNotification, SendNotification } from "../../utils/notifications";
import { Organisation } from "./model";
import { OrganisationService } from "./service";

export abstract class OrganisationController {
	private static allOrganisations: { [id: string]: Organisation } = {};
	private static orgCount = 0;

	public static async initialize() {
		this.loadOrganisations();

		RegisterServerCallback("gm:organisations:getAll", this.getAll.bind(this));
		RegisterServerCallback("gm:organisations:getOrg", this.getOrg.bind(this));
		RegisterServerCallback("gm:organisations:get", this.get.bind(this));

		onNet("gm:organisations:create", this.createOrganisation.bind(this));
		onNet("gm:organisations:addMember", this.addMember.bind(this));
		onNet("gm:organisations:update", this.update.bind(this));

		// ctrl

		RegisterServerCallback("gm:organisations:ctrl:canPay", this.canPay.bind(this));
		RegisterServerCallback("gm:organisations:ctrl:getMoney", this.getMoney.bind(this));
		RegisterServerCallback("gm:organisations:ctrl:getVehicles", this.getVehicles.bind(this));

		onNet("gm:organisations:ctrl:takeMoney", this.takeMoney.bind(this));

		console.log("allOrganisations", this.allOrganisations);
	}

	public static async loadOrganisations() {
		const allOrgs = await OrganisationService.GetAllOrganisations();

		console.log("allOrgs", allOrgs);

		if (!allOrgs) return;

		allOrgs.map(async (v: IOrganisation, k: number) => {
			this.allOrganisations[this.orgCount] = await OrganisationService.AddOrganisation(v);
			this.orgCount++;
		});
	}

	public static async createOrganisation(organisation: IOrganisation) {
		const character = CharactersController.getCharacter(source);
		if (!character) return;
		if (character.org) return SendErrorNotification(source, "Vous êtes deja dans une organisation");

		const org = await OrganisationService.CreateOrganisation(character.id.toString(), organisation);

		if (!org) return;

		character.setOrg({
			name: organisation.name,
			rank: 4,
		});

		this.allOrganisations[this.orgCount] = org;
		this.orgCount++;
		return org;
	}

	public static getAll() {
		return this.allOrganisations;
	}

	private static getOrg(source: number, playerId?: string) {
		return CharactersController.getCharacter(playerId || source)?.org;
	}

	public static get(source: number, id: string) {
		return this.allOrganisations[id];
	}

	public static addMember(id: string, playerId: string) {
		const org = this.get(0, id);
		const pId = CharactersController.getCharacter(source)?.playerId || -1;

		if (org.data.owner !== pId.toString()) return false;
		org.addMember(playerId);
	}

	public static update(id: string, data: IDataOrganisation) {
		const org = this.get(0, id);
		const pId = CharactersController.getCharacter(source)?.playerId || -1;

		if (org.data.owner !== pId.toString()) return false;
		org.updateData(data);
	}

	private static getMoney(source: number) {
		const nameOrga = CharactersController.getCharacter(source).org?.name;
		if (!nameOrga) return;
		return this.allOrganisations[nameOrga]?.returnMoney();
	}

	private static getVehicles(source: number) {
		const nameOrga = CharactersController.getCharacter(source).org?.name;
		if (!nameOrga) return;
		return this.allOrganisations[nameOrga]?.returnVehicles();
	}

	private static canPay(source: number, amount: number) {
		const nameOrga = CharactersController.getCharacter(source).org?.name;
		if (!nameOrga) return;
		return this.allOrganisations[nameOrga]?.canPay(amount);
	}

	private static giveBank(source: string, nameOrga: number, amount: number) {
		return this.allOrganisations[nameOrga]?.giveBank(amount);
	}

	private static pay(nameOrga: string, amount: number) {
		return this.allOrganisations[nameOrga]?.pay(amount);
	}

	private static takeMoney(source: number, quantity: number) {
		const nameOrga = CharactersController.getCharacter(source).org?.name;
		if (!nameOrga) return;
		const character = CharactersController.getCharacter(source);

		if (this.pay(nameOrga, quantity)) {
			character.giveBank(quantity);
		}
	}
}
