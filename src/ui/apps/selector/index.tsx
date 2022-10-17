import React, { useState } from "react";

import "./style.scss";

interface ISelector {
	name?: string;
	icon?: string;
	content?: any;
}

const Selector = () => {
	const [data, setData] = useState<ISelector[]>([])
	const [cache, setCache] = useState<ISelector>({})

	const push = (data: any) => {
		fetch(`https://${location.hostname.replace("cfx-nui-", "")}/pushSelector`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},

			body: JSON.stringify(data),
		});
	};

	const onMessage = (event: any) => {
		if (event.data.type == "selector") {
			setData(event.data.selector);
			setCache(event.data.selector[0])
		}
	};

	React.useEffect(() => {
		window.addEventListener("message", onMessage);
		return () => window.removeEventListener("message", onMessage);
	});

	const Element = (props: ISelector) => {
		return (
			<div className={cache.name == props.name ? "selected element" : "element"} onClick={() => setCache(props)}>
				<p style={{ marginTop: 15, marginLeft: 15, fontSize: 17 }}>{props.name}</p>

				<div style={{ display: "flex", justifyContent: "flex-end" }}>
					<img
						style={{ width: 150, marginBottom: 10, marginRight: 10 }}
						src={props.icon}
					/>
				</div>
			</div>
		);
	};

	return (
		<div id="selector">
			<div style={{ display: "flex", width: "75%", marginLeft: "15%" }}>
				<div className="list">
					{data.map((v, k) => {
						return <Element key={k} {...v} />
					})}
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
							<p style={{ fontSize: 12, marginBottom: -7.5, opacity: 0.42 }}>{cache.content ? cache.content.title : ''}</p>
							<p style={{ fontSize: 30 }}>{cache.content ? cache.content.subtitle : ''}</p>
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
						{cache ? cache.name : ''}
					</p>

					<div className="flex-row">
						{cache.content ? cache.content.badges.map((v, k) => {
							return (
								<div className="mini-button">{v}</div>
							)
						}) : ''}
					</div>

					<div onClick={() => push(cache)} className="button">ACHETER</div>

					<div className="flex-row" style={{ justifyContent: "flex-end" }}>
						<div className="logo">
							<img
								style={{ width: 340, marginBottom: 10, marginRight: 10 }}
								src={cache.icon}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Selector;
