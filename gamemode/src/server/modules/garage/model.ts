import { ItemId } from "../../../shared/config/items";
import { IInventoryItem } from "../../../shared/player/inventory";
import { IGarage } from "../../../shared/types/garage";
import { IOrganisation, IDataOrganisation } from "../../../shared/types/organisation";
import { IVehiculesCustom } from "../../../shared/types/vehicules";

export class Garage implements IGarage {
	id?: number;
	name?: string;
	garageType: number;
	ownerCharacterId: number;
	bought: boolean;
	rent_dt?: Date;

	constructor(data: IGarage) {
		this.id = data.id;
		this.name = data.name;
		this.garageType = data.garageType;
		this.ownerCharacterId = data.ownerCharacterId;
		this.bought = data.bought;
		this.rent_dt = data.rent_dt;
	}

	public getOwner() {
		return this.ownerCharacterId;
	}

	public getBought() {
		if (this.bought) {
			return this.rent_dt;
		} else {
			return false;
		}
	}
}
