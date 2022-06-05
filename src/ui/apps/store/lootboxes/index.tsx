import React, { createRef, useState } from "react";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import Sound from "./assets/case.mp3";
import Boutique from "../../../../shared/data/boutique.json";

import "./index.scss";

const winningIndex = 45;

export const Tiers = [
	{ name: "Common", rate: 50 },
	{ name: "Rare", rate: 40 },
	{ name: "Epic", rate: 15 },
	{ name: "Unique", rate: 6 },
	{ name: "Legendary", rate: 1 },
];

//make sure to have at least one item per tier
export const Loots = [
	{ money: 2000, tier: 0 },
	{ money: 4000, tier: 1 },
	{ money: 6000, tier: 2 },
	{ money: 10000, tier: 3 },
	{ money: 50000, tier: 4 },
];

interface ILootboxes {
	case: string;
}

const Lootboxes = (props: ILootboxes) => {
	const [margin, setMargin] = useState(0);
	const audio = createRef<HTMLAudioElement>();
	const winningLoot = 1;
	const history = useHistory()
	const caseSelected = props.case
	const Items = Boutique.cases[caseSelected].content

	const getRandomItems = () => {
		const items = [];
		for (let i = 0; i < 150; i++) {
			const lootIndex = i == winningIndex ? winningLoot : Math.randomRange(0, Loots.length - 1);

			items.push({
				tier: Items[lootIndex].tier,
				description: !!Items[lootIndex].description && `${Items[lootIndex].description}`,
				img: Items[lootIndex].img ? Items[lootIndex].img : "money.png",
			});
		}
		return items;
	};

	const [state] = useState<{ items: any[] }>({ items: getRandomItems() });

	const returnColor = (tier: number) => {
		if (tier == 0) return "#bebcfe";
		if (tier == 1) return "#72c5f6";
		if (tier == 2) return "#22bcfe";
		if (tier == 3) return "#c56e7e";
		if (tier == 4) return "#ffd000";
	}

	const cases = React.useMemo(
		() =>
			state.items?.map((item, index) => (
				<div key={index} className="item-case">
					<img style={{marginTop: 15}} src={item.img} className="item-case-image" />

					<p style={{ display: "flex", flexDirection: "column", width: "80%", justifyContent: "center", alignItems: "center", textAlign: "center"}}>{index} {item.description}</p>
				
					<svg style={{marginBottom: -7.5}} width="161" height="35" viewBox="0 0 161 35" fill="none" xmlns="http://www.w3.org/2000/svg">
						<g filter="url(#filter0_d_1_219)"><rect x="16" y="24" width="129" height="3" fill={returnColor(item.tier)}/></g><defs><filter id="filter0_d_1_219" x="0" y="0" width="161" height="35" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="-8"/><feGaussianBlur stdDeviation="8"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0.541176 0 0 0 0 0.980392 0 0 0 0 0.129412 0 0 0 0.25 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_219"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_219" result="shape"/></filter></defs>
					</svg>
				</div>
			)),
		state.items
	);

	const casesContent = React.useMemo(
		() =>
			state.items?.map((item, index) => (
				<div key={index} className="item-case" style={{height: 150, width: 150}}>
					<img style={{height: 95, marginTop: 12.5}} src="https://cdn.discordapp.com/attachments/956333971908730961/975096961017479240/unknown.png" className="item-case-image" />

					<p style={{ fontSize: 10, display: "flex", flexDirection: "column", width: "80%", justifyContent: "center", alignItems: "center", textAlign: "center"}}>MITSUBUSHI ANANASIKIM EVOLUTIN X</p>
				
					<svg style={{marginBottom: -5}} width="161" height="35" viewBox="0 0 161 35" fill="none" xmlns="http://www.w3.org/2000/svg">
						<g filter="url(#filter0_d_1_219)"><rect x="16" y="24" width="129" height="3" fill={returnColor(item.tier)}/></g><defs><filter id="filter0_d_1_219" x="0" y="0" width="161" height="35" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="-8"/><feGaussianBlur stdDeviation="8"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0.541176 0 0 0 0 0.980392 0 0 0 0 0.129412 0 0 0 0.25 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_219"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_219" result="shape"/></filter></defs>
					</svg>
				</div>
			)),
		state.items
	);

	return (
		<div className="lootboxes">
			<img style={{marginBottom: 40}} src="https://media.discordapp.net/attachments/857379508747239425/974795338789572628/unknown.png?width=1440&height=57" />

			<div className="container">
				<div className="lootboxes-holder">
					<div className="lootboxes-container" style={{ marginLeft: `${margin}px` }}>
						{cases}
					</div>
				</div>
				<audio src={Sound} ref={audio} />
			</div>
			
			<img style={{marginTop: 70, marginLeft: 6, height: 55}} src="https://cdn.discordapp.com/attachments/956333971908730961/975105788102201395/unknown.png?width=1440&height=57" />

			<div className="button" onClick={() => {
				setTimeout(() => {
					audio.current?.play?.();
					
					setTimeout(() => {
						setMargin(-14137);
					}, 1500)
				}, 250);
			}}>
				<p>OUVRIR</p>
			</div>

			<img style={{marginTop: 22, marginLeft: 6, height: 31.5, marginBottom: 30}} src="https://cdn.discordapp.com/attachments/956333971908730961/975155604081508442/unknown.png" ></img>
			<div className="lootboxes-content-holder">
				<div className="lootboxes-content-container">
					{casesContent}
				</div>
			</div>
		</div>

	);
};

export default Lootboxes;
