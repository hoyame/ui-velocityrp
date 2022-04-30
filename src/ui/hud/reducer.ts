import { StoreAction } from "../store";

export interface HudState {
	visible: boolean;
	notificationsVisible: boolean;
}

const defaultState: HudState = {
	visible: true,
	notificationsVisible: true,
};

export const HudReducer = (state: HudState = defaultState, action: StoreAction): HudState => {
	switch (action.type) {
		case "SET_HUD":
			return { ...state, ...action.payload };
		default:
			return state;
	}
};
