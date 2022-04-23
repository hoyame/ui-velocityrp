import { IInventoryItem } from "../player/inventory";

export interface IDataOrganisation {
	owner: string;
	position: [number, number, number];
	positionGarage: [number, number, number];
	positionGarageExit: [number, number, number];
	positionInteraction: [number, number, number];
}

export interface IOrganisation {
	id: number;
	name: string;
	members: any[];
	data: IDataOrganisation;
	inventory: IInventoryItem[];
	money: [number, number];
	vehicles: any[];
}
