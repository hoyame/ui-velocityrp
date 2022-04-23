import React from "react";
import Needs from "./needs/needs";
import Speedometer from "./speedometer/speedometer";
import "./index.scss";
import { useReduxState } from "../store";
import { useLocation } from "react-router-dom";
import Taximeter from "./taximeter/taximeter";
import Notifications from "./notifications/notifications";

const Hud: React.FC = () => {
	const state = useReduxState(state => state.hud);
	const location = useLocation();

	return (
		<React.Fragment>
			<div id="hud" style={{ opacity: state.visible && !location.pathname.includes("inventory") ? "1" : "0" }}>
				<Speedometer />
				<Needs />
				<Taximeter />
			</div>
			<div id="notifications-hud" style={{ opacity: state.notificationsVisible ? "1" : "0" }}>
				<Notifications />
			</div>
		</React.Fragment>
	);
};

export default Hud;
