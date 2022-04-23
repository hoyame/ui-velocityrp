import { ItemId } from "../config/items";

export interface IInventoryItem {
	itemId: ItemId;
	quantity: number;
	renamed?: string;
	metadatas?: {
		renamed?: string;
		sexRestriction?: string;
		variations?: { [componentId: number]: number[] };
		pedProp?: { componentId: number; drawableId: number; textureId: number };
		[key: string]: any;
	};
}

export enum TargetType {
	Player,
	Vehicle,
	Property,
}
