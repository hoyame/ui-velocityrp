import { Garages } from "../../../shared/config/world/garages";
import { Apparts } from "../../../shared/config/world/properties";
import { RegisterServerCallback } from "../../core/utils";
import { CharactersController } from "../../player/charactersController";
import { OrganisationController } from "../organisation/controller";
import { GaragesService } from "./service";

export abstract class GaragesController {
	public static allGarages: any = [];

	public static initialize() {
		RegisterServerCallback("gm:garage:getGaragesWithId", this.getGaragesWithId.bind(this));
		RegisterServerCallback("gm:garage:getGaragesOrganisations", this.getGaragesOrganisations.bind(this));

		onNet("gm:garage:buyGarage", this.buyGarage.bind(this));
		onNet("gm:garage:buyGarageForOrganisation", this.buyGarageForOrganisation.bind(this));
		onNet("gm:garage:rentGarage", this.rentGarage.bind(this));
	}

	private static buyGarage(garageType: number) {
		const character = CharactersController.getCharacter(source);
		const price = Garages[garageType].price;

		if (!character.pay(price)) return false;

		GaragesService.CreateGarage(character.id.toString(), {
			garageType: garageType,
			ownerCharacterId: character.id,
			bought: true,
		});
	}

	private static buyGarageForOrganisation(garageType: number) {
		const character = CharactersController.getCharacter(source);
		const orgaId = CharactersController.getCharacter(source)?.org.name;
		const price = Garages[garageType].price;

		if (!orgaId) return;
		const organisation = OrganisationController.get(0, orgaId);
		if (!character.org.rank || character.org.rank < 4) return;
		if (!organisation.pay(price)) return false;

		GaragesService.CreateGarage(character.id.toString(), {
			garageType: garageType,
			ownerCharacterId: character.id,
			bought: true,
		});
	}

	private static async getGaragesWithId(source: number, id?: number) {
		const charId = CharactersController.getCharacter(source)?.id;
		const zebi = (await GaragesService.GetAllGaragesWithId(charId)) || [];

		return zebi;
	}

	private static async getGaragesOrganisations(source: number, id?: number) {
		const charId = CharactersController.getCharacter(source)?.org.name;
		if (!charId) return;
		const zebi = (await GaragesService.GetAllGaragesWithId(charId)) || [];

		return zebi;
	}

	private static async rentGarage(source: string, buildingId: number, garageType: number) {
		const character = CharactersController.getCharacter(source);
		const price = Apparts[buildingId].home[garageType].price;

		const allGarages = await GaragesService.GetAllGaragesWithId(character.id);

		const garage = allGarages.find(e => e.garageType == buildingId);

		if (!!garage && garage.bought) return false;
		if (!character.pay(price / 50)) return false;

		if (!garage) {
			GaragesService.CreateGarage(character.id.toString(), {
				garageType: garageType,
				ownerCharacterId: character.id,
				bought: false,
				rent_dt: new Date().addDays(7),
			});
		} else {
			garage.rent_dt = !!garage.rent_dt && garage.rent_dt > new Date() ? garage.rent_dt.addDays(7) : new Date().addDays(7);
			GaragesService.SaveGarage(garage);
		}
	}
}
