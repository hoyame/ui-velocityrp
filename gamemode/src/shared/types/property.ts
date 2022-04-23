import { IInventoryItem } from "../player/inventory";

export interface IProperty extends INewProperty {
	id: number;
}

export interface INewProperty {
	name?: string;
	propertyType: [number | string, number];
	ownerCharacterId: number | string;
	inventory: IInventoryItem[];
	bought: boolean;
	rent_dt?: Date;
}
