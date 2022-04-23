import { IInventoryItem, TargetType } from "../../shared/player/inventory";
import { StoreAction } from "../store";

export interface InventoryState {
	items: IInventoryItem[];
	maxWeight: number;
	target?: {
		name: string;
		items: IInventoryItem[];
		maxWeight: number;
		type: TargetType;
	};
}

const defaultState: InventoryState = { items: [], maxWeight: 0 };

export const InventoryReducer = (state: InventoryState = defaultState, action: StoreAction): InventoryState => {
	switch (action.type) {
		case "SET_INVENTORY":
			return { ...state, target: action.payload?.target, ...action.payload };
		default:
			return state;
	}
};
