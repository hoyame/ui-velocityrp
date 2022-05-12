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
			<div id="hud" style={{ display: !location.pathname.includes("context") && !location.pathname.includes("inventory") && !location.pathname.includes("cardealer") && !location.pathname.includes("shop") ? "block" : "none" }}>
				<Overlay />
				<Speedometer />
			</div>
			
			<div id="notifications-hud" style={{ display: !location.pathname.includes("context") && !location.pathname.includes("inventory") && !location.pathname.includes("cardealer") && !location.pathname.includes("shop") ? "block" : "none", opacity: state.notificationsVisible ? "1" : "0" }}>
				<Notifications />
			</div> 
		
		</React.Fragment>
	);
};

export default Hud;
