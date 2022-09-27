import React, { useState } from "react";
import Speedometer from "./speedometer/speedometer";
import "./index.scss";
import { useReduxState } from "../../store";
import { useLocation } from "react-router-dom";
import Overlay from "./overlay";
import Notifications from "./notifications/notifications";
import Announcements from "./announcements/announcements";
import Help from "./help";
import Animations from "../animations/animations";
import Staff, { StaffOverlay } from "../staff/staff";

const Hud: React.FC = () => {
	const state = useReduxState(state => state.hud);
	const location = useLocation();
	const [openMenu, setOpenMenu] = useState(false);
	const [route, setRoute] = useState("");
	const [staff, setStaff] = useState(false);
	const [animation, setAnimation] = useState("");
	const [animationOverlay, setAnimationOverlay] = useState("");

	const closeElement = async () => {
		setAnimation("anim-close");
		await new Promise(r => setTimeout(r, 1000));
		setRoute("");
		setAnimation("");
	};

	const closeOverlayStaff = async () => {
		setAnimationOverlay("anim-close");
		await new Promise(r => setTimeout(r, 1000));
		setStaff(false);
		setAnimation("");
	};

	return (
		<React.Fragment>
			<div
				id="hud"
				style={{
					display:
						!location.pathname.includes("context") &&
						!location.pathname.includes("inventory") &&
						!location.pathname.includes("cardealer") &&
						!location.pathname.includes("shop")
							? "block"
							: "none",
				}}
			>
				{/* <Overlay /> */}
				{/* <Speedometer /> */}
			</div>

			{/* <Help /> */}

			<div
				id="notifications-hud"
				style={{
					display:
						!location.pathname.includes("context") &&
						!location.pathname.includes("inventory") &&
						!location.pathname.includes("cardealer") &&
						!location.pathname.includes("shop")
							? "block"
							: "none",
					opacity: state.notificationsVisible ? "1" : "0",
				}}
			>
				<Notifications />
			</div>

			{/* <div id="announcement-hud" style={{ display: !location.pathname.includes("context") && !location.pathname.includes("inventory") && !location.pathname.includes("cardealer") && !location.pathname.includes("shop") ? "block" : "none", opacity: state.notificationsVisible ? "1" : "0" }}>
				<Announcements />
			</div> 
		 */}
		</React.Fragment>
	);
};

export default Hud;
