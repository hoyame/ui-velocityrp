import React from "react";
import "./speedometer.scss";

interface SpeedometerState {
	speed: number;
	maxSpeed: number;
	fuel: number;
	turnLeft: boolean;
	turnRight: boolean;
}

const Speedometer: React.FC = () => {
	const [state, setState] = React.useState<SpeedometerState | undefined>(undefined);

	const getFuelColor = () => {
		if (!state) return "transparent";
		if (state.fuel <= 10) return "#ff0245";
		if (state.fuel <= 20) return "#ffaf02";
		return "#19ce82";
	};

	const onMessage = (event: any) => {
		if (event.data.type == "speedometer") {
			setState(event.data.data);
		}
	};

	React.useEffect(() => {
		window.addEventListener("message", onMessage);
		return () => window.removeEventListener("message", onMessage);
	});

	return (
		<div id="speedometer-container" style={{ opacity: !!state ? 1 : 0 }}>
			<div className="hud dashboard">
				<div className="speedometer">
					<svg className="circle" width="100" height="100">
						<circle
							className="progress"
							stroke="#DEDEDE20"
							strokeWidth="3"
							fill="transparent"
							r="36"
							cx="50"
							cy="50"
							strokeDasharray="164"
							strokeDashoffset="0"
						/>
						<circle
							className="progress progress-speed"
							stroke="url(#gradient)"
							strokeWidth="3"
							fill="transparent"
							r="36"
							cx="50"
							cy="50"
							strokeDasharray={`${!!state ? Math.min((state.speed * 164) / state.maxSpeed, 164) : 0} 1000`}
							strokeDashoffset="0"
						/>

						<defs>
							<linearGradient id="gradient">
								<stop offset="80%" stopColor="#19ce82" stopOpacity="1" />
								<stop offset="100%" stopColor="#19ce82" stopOpacity="0.2" />
							</linearGradient>
						</defs>
					</svg>
					<div className="text">
						<span className="speed">{state?.speed}</span>
					</div>
					<div className={`turn-signal turn-signal-left ${state?.turnLeft && "active"}`}>
						<svg width="11" height="8" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
							<g clipPath="url(#clip0)">
								<path
									d="M20.6583 13.7215H12.5064V19.2405C12.5064 19.4937 12.2026 19.5949 12.0507 19.443L0.60762 9.8734C0.455722 9.77213 0.455722 9.51897 0.60762 9.4177L12.0507 0.556942C12.2532 0.405044 12.5064 0.556942 12.5064 0.810107V6.27846H20.6583C20.8102 6.27846 20.9621 6.43036 20.9621 6.58226V13.4683C20.9621 13.5696 20.8102 13.7215 20.6583 13.7215Z"
									stroke="white"
									strokeOpacity="1"
									strokeWidth=".5"
									strokeMiterlimit="10"
								/>
							</g>
							<defs>
								<clipPath id="clip0">
									<rect width="21.4684" height="20" fill="white" transform="matrix(-1 0 0 1 21.4684 0)" />
								</clipPath>
							</defs>
						</svg>
					</div>
					<div className={`turn-signal turn-signal-right ${state?.turnRight && "active"}`}>
						<svg width="11" height="8" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
							<g clipPath="url(#clip1)">
								<path
									d="M0.81013 13.7215H8.96203V19.2405C8.96203 19.4937 9.26583 19.5949 9.41773 19.443L20.8608 9.8734C21.0127 9.77213 21.0127 9.51897 20.8608 9.4177L9.41773 0.556942C9.21519 0.405044 8.96203 0.556942 8.96203 0.810107V6.27846H0.81013C0.658231 6.27846 0.506332 6.43036 0.506332 6.58226V13.4683C0.506332 13.5696 0.658231 13.7215 0.81013 13.7215Z"
									stroke="white"
									strokeOpacity="1"
									strokeWidth=".5"
									strokeMiterlimit="10"
								/>
							</g>
							<defs>
								<clipPath id="clip1">
									<rect width="21.4684" height="20" fill="white" />
								</clipPath>
							</defs>
						</svg>
					</div>
					<div className="hud fuel">
						<svg className="circle" width="16" height="16">
							<circle
								className="background"
								stroke="#DEDEDE20"
								strokeWidth="1"
								fill="transparent"
								r="7"
								cx="8"
								cy="8"
								strokeDasharray="31 40"
								strokeDashoffset="0"
							/>
							<circle
								className="background fuel-progress"
								strokeWidth="1"
								stroke={getFuelColor()}
								fill="transparent"
								r="7"
								cx="8"
								cy="8"
								strokeDasharray={`${!!state ? (state.fuel * 31) / 100 : 0} 10000`}
								strokeDashoffset="0"
							/>
							<g opacity="1" clipPath="url(#clip0)">
								<path
									className="fuel-icon"
									d="M9.2084 4.27568V1.82575V1.59168V0.920676C9.2084 0.795839 9.09531 0.686606 8.96607 0.686606C8.83683 0.686606 8.72375 0.795839 8.72375 0.920676V1.56047C8.65913 1.90377 8.43296 2.85566 8.01292 3.24577C7.96446 3.29259 7.9483 3.35501 7.9483 3.41743V3.90117C7.9483 4.02601 8.06139 4.13524 8.19063 4.13524H8.72375V4.44733V4.46294C8.72375 4.58778 8.83683 4.69701 8.96607 4.69701C9.27302 4.69701 9.51535 4.93108 9.51535 5.22757V9.58127C9.51535 9.87776 9.27302 10.1118 8.96607 10.1118C8.65913 10.1118 8.4168 9.87776 8.4168 9.58127V8.20806C8.4168 8.08322 8.30371 7.97399 8.17447 7.97399H7.67367V4.43173C7.67367 4.22887 7.57674 4.04161 7.4475 3.91677V0.905072C7.4475 0.405722 7.02746 0 6.5105 0H1.69628C1.17932 0 0.759289 0.405722 0.759289 0.905072V3.91677C0.613893 4.04161 0.533118 4.22887 0.533118 4.43173V11.5319H0.242326C0.113086 11.5319 0 11.6411 0 11.7659C0 11.8908 0.113086 12 0.242326 12H0.759289H7.1567H7.9483C8.07754 12 8.19063 11.8908 8.19063 11.7659C8.19063 11.6411 8.07754 11.5319 7.9483 11.5319H7.65751V8.45774H7.91599V9.59688C7.91599 10.143 8.38449 10.5956 8.94992 10.5956C9.51535 10.5956 9.98384 10.143 9.98384 9.59688V5.24317C10 4.77503 9.66074 4.36931 9.2084 4.27568ZM1.69628 0.780234H6.5105C6.57512 0.780234 6.63974 0.842653 6.63974 0.905072V3.72952H1.56704V0.905072C1.56704 0.842653 1.63166 0.780234 1.69628 0.780234Z"
									fill={getFuelColor()}
								/>
							</g>
							<defs>
								<clipPath id="clip0">
									<rect width="12" height="13" />
								</clipPath>
							</defs>
						</svg>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Speedometer;
