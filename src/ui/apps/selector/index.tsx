import React from "react";

import "./style.scss";

const Selector = () => {
	const Element = () => {
		return (
			<div className="element">
				<p style={{ marginTop: 15, marginLeft: 15, fontSize: 17 }}>GOLDEN TYCOON</p>

				<div style={{ display: "flex", justifyContent: "flex-end" }}>
					<img
						style={{ width: 150, marginBottom: 10, marginRight: 10 }}
						src="https://cdn.discordapp.com/attachments/749017234743099423/1015225222716194856/unknown.png"
					/>
				</div>
			</div>
		);
	};

	return (
		<div id="selector">
			<div style={{ display: "flex", width: "75%", marginLeft: "15%" }}>
				<div className="list">
					<Element />
					<Element />
					<Element />
				</div>

				<div className="content">
					<div className="header">
						<svg
							style={{ marginRight: 25 }}
							width="2"
							height="58"
							viewBox="0 0 2 58"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<rect width="2" height="58" fill="#D9D9D9" fill-opacity="0.23" />
						</svg>

						<div>
							<p style={{ fontSize: 12, marginBottom: -7.5, opacity: 0.42 }}>COÛT</p>
							<p style={{ fontSize: 30 }}>20 COINS</p>
						</div>
					</div>

					<p
						style={{
							margin: "30px 0",
							color: "#fff",
							fontSize: 80,
							fontWeight: 400,
							marginBottom: 10,
						}}
					>
						GOLDEN TYCOON
					</p>

					<div className="mini-button">PREMIUM</div>

					<div className="button">ACHETER</div>

					<div className="flex-row" style={{ justifyContent: "flex-end" }}>
						<div className="logo">
							<img
								style={{ width: 340, marginBottom: 10, marginRight: 10 }}
								src="https://cdn.discordapp.com/attachments/749017234743099423/1015262543033405461/unknown.png"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Selector;
