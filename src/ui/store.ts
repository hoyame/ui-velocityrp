import { TypedUseSelectorHook, useSelector } from "react-redux";
import { combineReducers, createStore } from "redux";
import { ContextMenuReducer } from "./context-menu/reducer";
import { HudReducer } from "./hud/reducer";
import { InventoryReducer } from "./inventory/reducer";

const reducers = combineReducers({
	inventory: InventoryReducer,
	contextMenu: ContextMenuReducer,
	hud: HudReducer,
});

const store = createStore(reducers);

export default store;

export type StoreType = ReturnType<typeof reducers>;
export const useReduxState: TypedUseSelectorHook<StoreType> = useSelector;

export interface StoreAction {
	type: string;
	payload: any;
}
