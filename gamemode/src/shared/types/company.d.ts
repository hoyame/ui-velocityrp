import { IInventoryItem } from "../player/inventory";

export interface ICompany {
	id: number;
	idJob: number;
	name: string;
	inventory: IInventoryItem[];
	money: number;
}
