import { Apparts } from "../../../shared/config/world/properties";
import { RegisterServerCallback, TriggerClientCallbackAsync } from "../../core/utils";
import { CharactersController } from "../../player/charactersController";
import { PropertiesService } from "./service";
import { OrganisationController } from "../organisation/controller";
import { CompaniesController } from "../companies/controller";
import { JobId } from "../../../shared/config/jobs/jobs";
import { SendErrorNotification, SendNotification, SendSuccessNotification } from "../../utils/notifications";
import { Property } from "./model";
import { IProperty } from "../../../shared/types/property";
import { Environnment } from "../../../shared/utils/environnment";
import Config from "../../../shared/config/prices.json";
import ServerConfig from "../../../shared/config/server.json";

export abstract class PropertiesController {
	public static allProperties: { [id: number]: Property };

	public static async initialize() {
		await this.loadProperties();

		RegisterServerCallback("gm:property:getPropertiesWithId", this.getPropertiesWithId.bind(this));
		RegisterServerCallback("gm:property:getProperties", this.getProperties.bind(this));

		onNet("gm:property:buyProperty", this.buyProperty.bind(this));
		onNet("gm:property:buyPropertyOrg", this.buyPropertyOrg.bind(this));
		onNet("gm:property:rentProperty", this.rentProperty.bind(this));

		setInterval(this.saveAll.bind(this), Environnment.IsDev ? 10000 : ServerConfig.autoSave);
	}

	private static async loadProperties() {
		const properties = await PropertiesService.GetAllProperties();
		this.allProperties = properties.reduce((all: { [id: number]: Property }, property: IProperty) => {
			all[property.id] = new Property(property);
			return all;
		}, {});
	}

	public static getPropertyById(id: number) {
		return this.allProperties[id];
	}

	private static async buyProperty(buildingId: number, propertyType: number, id: number) {
		const src = source;
		const character = CharactersController.getCharacter(id);
		if (!character) return false;
		const build = Apparts[buildingId].home;
		const ind = build.findIndex(e => e.id == propertyType);
		const price = build[ind].price;
		const property = Object.values(this.allProperties).find(
			p => p.propertyType[0] == buildingId && p.propertyType[1] == propertyType && p.ownerCharacterId == id
		);

		if (!!property && property.bought) return false;

		SendNotification(src, `En attente du paiement de la facture de ~b~${price}$`);
		const accepted = await TriggerClientCallbackAsync("gm:jobs:billingAnswer", id.toString(), price);

		if (!accepted) {
			SendErrorNotification(src, `Le client a ~r~refusé~w~ de payer la facture`);
			return;
		}

		if (!character.pay(price)) {
			SendErrorNotification(src, "~r~Vente annulée~w~~n~Le client n'a pas assez d'argent pour payer la facture");
			SendErrorNotification(id, "~r~Vente annulée~w~~n~Vous n'avez pas assez d'argent pour payer la facture", "money");
		} else {
			SendSuccessNotification(src, "Vente effectuée", "money");
			SendSuccessNotification(id, `Vous avez payé ~r~${price}$`, "money");
			CompaniesController.get(JobId.RealEstateAgent).giveMoney(price * 0.2);

			const createdProperty = await PropertiesService.CreateProperty(character.id, {
				propertyType: [buildingId, propertyType],
				ownerCharacterId: character.id,
				inventory: [],
				bought: true,
			});
			this.allProperties[createdProperty.id] = createdProperty;
		}
	}

	private static async rentProperty(buildingId: number, propertyType: number, id: number) {
		const src = source;
		const character = CharactersController.getCharacter(id);
		if (!character) return false;
		const build = Apparts[buildingId].home;
		const ind = build.findIndex(e => e.id == propertyType);
		const price = Math.round(build[ind].price / 50);
		const property = Object.values(this.allProperties).find(
			p => p.propertyType[0] == buildingId && p.propertyType[1] == propertyType && p.ownerCharacterId == id
		);

		if (!!property && property.bought) return false;

		SendNotification(src, `En attente du paiement de la facture de ~b~${price}$`);
		const accepted = await TriggerClientCallbackAsync("gm:jobs:billingAnswer", id.toString(), price);

		if (!accepted) {
			SendErrorNotification(src, `Le client a ~r~refusé~w~ de payer la facture`);
			return;
		}

		if (!character.pay(price)) {
			SendErrorNotification(src, "~r~Vente annulée~w~~n~Le client n'a pas assez d'argent pour payer la facture");
			SendErrorNotification(id, "~r~Vente annulée~w~~n~Vous n'avez pas assez d'argent pour payer la facture", "money");
		} else {
			SendSuccessNotification(src, "Vente effectuée", "money");
			SendSuccessNotification(id, `Vous avez payé ~r~${price}$`, "money");
			CompaniesController.get(JobId.RealEstateAgent).giveMoney(price * 0.2);

			if (!property) {
				const createdProperty = await PropertiesService.CreateProperty(character.id, {
					propertyType: [buildingId, propertyType],
					ownerCharacterId: character.id,
					inventory: [],
					bought: false,
					rent_dt: new Date().addDays(7),
				});
				this.allProperties[createdProperty.id] = createdProperty;
			} else {
				property.rent_dt =
					!!property.rent_dt && property.rent_dt > new Date() ? property.rent_dt.addDays(7) : new Date().addDays(7);
				PropertiesService.SaveProperty(property);
			}
		}
	}

	private static async buyPropertyOrg(buildingId: number | string, propertyType: number, id: string) {
		const character = CharactersController.getCharacter(source);
		if (character.org == null || !character.org.name) return false;
		if (character.org.rank && character.org.rank < 4) return false;

		const org = OrganisationController.get(0, character.org.name);

		let price = 0;

		if (buildingId == "bunker") {
			price = Config.organisation.bunker;
		} else if (buildingId == "complexe") {
			price = Config.organisation.complexe;
		} else if (buildingId == "qg") {
			price = Config.organisation.qg;
		}

		const property = Object.values(this.allProperties).find(
			p => p.propertyType[0] == buildingId && p.propertyType[1] == propertyType && p.ownerCharacterId == id
		);

		if (!!property && property.bought) return false;
		if (!character.pay(price)) return false;

		const createdProperty = await PropertiesService.CreateProperty(id, {
			propertyType: [buildingId, propertyType],
			ownerCharacterId: id,
			inventory: [],
			bought: true,
		});
		this.allProperties[createdProperty.id] = createdProperty;
	}

	private static getProperties() {
		return this.allProperties;
	}

	private static getPropertiesWithId(source: number, id?: number) {
		const charId = CharactersController.getCharacter(source).id;
		const i = id || charId;
		return Object.values(this.allProperties).filter(p => p.ownerCharacterId == i);
	}

	private static async saveAll() {
		console.log("Auto-save start...");
		const start = GetGameTimer();

		const properties = Object.values(this.allProperties);
		for (const property of properties) {
			await PropertiesService.SaveProperty(property);
		}
		console.log(`Auto save done. ${properties.length} properties saved in ${GetGameTimer() - start} ms`);
	}
}
