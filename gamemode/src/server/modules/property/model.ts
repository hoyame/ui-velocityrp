import { IProperty } from "../../../shared/types/property";
import { withInventory } from "../../player/models/withInventory";

export class Property extends withInventory implements IProperty {
	id: number;
	name?: string;
	propertyType: [number | string, number];
	ownerCharacterId: number | string;
	bought: boolean;
	rent_dt?: Date;

	constructor(data: IProperty) {
		super(data.inventory);
		this.id = data.id;
		this.name = data.name;
		this.propertyType = data.propertyType;
		this.ownerCharacterId = data.ownerCharacterId;
		this.bought = data.bought;
		this.rent_dt = data.rent_dt;
		this.maxWeight = 200;
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
