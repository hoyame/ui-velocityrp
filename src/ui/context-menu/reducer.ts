import { StoreAction } from "../store";
import { IContextMenuItem } from "../../shared/types/contextmenu";

export interface ContextMenuState {
	items?: IContextMenuItem[];
	target?: number;
}

const defaultState: ContextMenuState = {};

export const ContextMenuReducer = (state: ContextMenuState = defaultState, action: StoreAction): ContextMenuState => {
	switch (action.type) {
		case "SET_CONTEXT_MENU":
			return action.payload;
		default:
			return state;
	}
};
