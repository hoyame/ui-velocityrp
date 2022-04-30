import React from "react";
import Speedometer from "./speedometer/speedometer";
import "./index.scss";
import { useReduxState } from "../store";
import { useLocation } from "react-router-dom";
import Overlay from "./overlay";
import Notifications from "./notifications/notifications";

const Hud: React.FC = () => {
	const state = useReduxState(state => state.hud);
	const location = useLocation();

	return (
		<React.Fragment>
			<div id="hud" style={{ opacity: state.visible && !location.pathname.includes("inventory") ? "1" : "1" }}>
				<Overlay />

				<Speedometer />
			</div>
			
			<div id="notifications-hud" style={{ opacity: state.notificationsVisible ? "1" : "1" }}>
				<Notifications />
			</div> 
		
		</React.Fragment>
	);
};

export default Hud;
