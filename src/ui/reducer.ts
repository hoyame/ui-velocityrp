import { StoreAction } from "./store";

export interface HudState {
	visible: boolean;
	notificationsVisible: boolean;
	darkmode: boolean;
}

const defaultState: HudState = {
	visible: true,
	notificationsVisible: true,
	darkmode: true,
};

export const HudReducer = (state: HudState = defaultState, action: StoreAction): HudState => {
	switch (action.type) {
		case "SET_HUD":
			return { ...state, ...action.payload };
		case "TOOGLE_DARKMODE":
			return { ...state, ...action.payload };
		default:
			return state;
	}
};
