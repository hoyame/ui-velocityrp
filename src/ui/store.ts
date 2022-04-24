import { TypedUseSelectorHook, useSelector } from "react-redux";
import { combineReducers, createStore } from "redux";
import { HudReducer } from "./hud/reducer";

const reducers = combineReducers({

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
