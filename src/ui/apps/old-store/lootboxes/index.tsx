import React, { createRef, useState } from "react";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import Sound from "./assets/case.mp3";
import Boutique from "../../../../shared/data/boutique.json";

import performante from "../../../assets/cars/18performante.jpg";
import mercedesS from "../../../assets/cars/19S63.jpg";
import bmw20x5 from "../../../assets/cars/20x5m.jpg";
import mercedes190 from "../../../assets/cars/190e.jpg";
import ferrar458 from "../../../assets/cars/458.jpg";
import excsm from "../../../assets/cars/2020excsm.jpg";
import amggtsmansory from "../../../assets/cars/amggtsmansory.jpg";
import aventadors from "../../../assets/cars/aventadors.jpg";
import ayxz from "../../../assets/cars/ayxz.jpg";
import bmci from "../../../assets/cars/bmci.jpg";
import bmwm4 from "../../../assets/cars/bmwm4.jpg";
import brabus700 from "../../../assets/cars/brabus700.jpg";
import c63 from "../../../assets/cars/c63.jpg";
import cargobob2 from "../../../assets/cars/cargobob2.jpg";
import cayenne from "../../../assets/cars/cayenne.jpg";
import cla45sb2 from "../../../assets/cars/cla45sb2.jpg";
import divo from "../../../assets/cars/divo.jpg";
import evovaris from "../../../assets/cars/evovaris.jpg";
import exor from "../../../assets/cars/exor.jpg";
import ferrari812 from "../../../assets/cars/ferrari812.jpg";
import fxxkevo from "../../../assets/cars/fxxkevo.jpg";
import gemera from "../../../assets/cars/gemera.jpg";
import giuliagtam from "../../../assets/cars/giuliagtam.jpg";
import gle from "../../../assets/cars/gle.jpg";
import gle450 from "../../../assets/cars/gle450.jpg";
import gomez from "../../../assets/cars/gomez.jpg";
import gt17 from "../../../assets/cars/gt17.jpg";
import i8 from "../../../assets/cars/i8.jpg";
import jeepg from "../../../assets/cars/jeepg.jpg";
import jesko2020x from "../../../assets/cars/jesko2020x.jpg";
import lb750sv from "../../../assets/cars/lb750sv.jpg";
import lp700 from "../../../assets/cars/lp700.jpg";
import ltrstar from "../../../assets/cars/ltrstar.jpg";
import lykan from "../../../assets/cars/lykan.jpg";
import m3f801 from "../../../assets/cars/m3f801.jpg";
import monza from "../../../assets/cars/monza.jpg";
import panamera17turbo from "../../../assets/cars/panamera17turbo.jpg";
import pm19 from "../../../assets/cars/pm19.jpg";
import q8prior from "../../../assets/cars/q8prior.jpg";
import rmodbacalar from "../../../assets/cars/rmodbacalar.jpg";
import rmodmartin from "../../../assets/cars/rmodmartin.jpg";
import rs6c8 from "../../../assets/cars/rs6c8.jpg";
import s65f from "../../../assets/cars/s65f.jpg";
import senna from "../../../assets/cars/senna.jpg";
import sl65bs from "../../../assets/cars/sl65bs.jpg";
import supervolito2 from "../../../assets/cars/SuperVolito2.jpg";
import terzo from "../../../assets/cars/terzo.jpg";
import topcar911 from "../../../assets/cars/topcar911.jpg";
import ursa from "../../../assets/cars/ursa.jpg";
import urus from "../../../assets/cars/urus.jpg";
import yz450f from "../../../assets/cars/yz450f.jpg";
import zx10r from "../../../assets/cars/zx10r.jpg";

import weapon_assaultsmg from "../../../assets/weapons/assault-smg_276x106.png";
import weapon_vintagepistol from "../../../assets/weapons/vintage-pistol_276x106.png";
import weapon_musket from "../../../assets/weapons/musket_276x106.png";
import weapon_dbshotgun from "../../../assets/weapons/double-barrel-shotgun_276x106.png";
import weapon_smg_mk2 from "../../../assets/weapons/smg-mk2_276x106.png";
import weapon_sawnoffshotgun from "../../../assets/weapons/sawed-off-shotgun_276x106.png";
import weapon_bullpuprifle from "../../../assets/weapons/bullpup-rifle_276x106.png";
import weapon_gusenberg from "../../../assets/weapons/gusenberg-sweeper_276x106.png";
import weapon_compactrifle from "../../../assets/weapons/compact-rifle_276x106.png";
import weapon_combatmg from "../../../assets/weapons/combat-mg_276x106.png";
import weapon_specialcarbine from "../../../assets/weapons/special-carbine_276x106.png";
import weapon_heavysniper_mk2 from "../../../assets/weapons/heavy-sniper-mk2_276x106.png";
import weapon_bullpupshotgun from "../../../assets/weapons/bullpup-shotgun_276x106.png";
import weapon_scar17fm from "../../../assets/weapons_img/weapon_scar17fm.jpg";

const ImgLinksWeapons = {
	"weapon_assaultsmg": weapon_assaultsmg,
	"weapon_vintagepistol": weapon_vintagepistol,
	"weapon_musket": weapon_musket,
	"weapon_dbshotgun": weapon_dbshotgun,
	"weapon_smg_mk2": weapon_smg_mk2,
	"weapon_sawnoffshotgun": weapon_sawnoffshotgun,
	"weapon_bullpuprifle": weapon_bullpuprifle,
	"weapon_gusenberg": weapon_gusenberg,
	"weapon_compactrifle": weapon_compactrifle,
	"weapon_combatmg": weapon_combatmg,
	"weapon_specialcarbine": weapon_specialcarbine,
	"weapon_heavysniper_mk2": weapon_heavysniper_mk2,
	"weapon_bullpupshotgun": weapon_bullpupshotgun,
	"weapon_scar17fm": weapon_scar17fm
}

const ImgLinksCars = {
	"18performante": performante,
	"19S63": mercedesS,
	"20x5m": bmw20x5,
	"190e": mercedes190,
	"458": ferrar458,
	"2020excsm": excsm,
	"amggtsmansory": amggtsmansory,
	"aventadors": aventadors,
	"ayxz": ayxz,
	"bmci": bmci,
	"bmwm4": bmwm4,
	"brabus700": brabus700,
	"c63": c63,
	"cargobob2": cargobob2,
	"cayenne": cayenne,
	"cla45sb2": cla45sb2,
	"divo": divo,
	"evovaris": evovaris,
	"exor": exor,
	"ferrari812": ferrari812,
	"fxxkevo": fxxkevo,
	"gemera": gemera,
	"giuliagtam": giuliagtam,
	"gle": gle,
	"gle450": gle450,
	"gomez": gomez,
	"gt17": gt17,
	"i8": i8,
	"jeepg": jeepg,
	"jesko2020x": jesko2020x,
	"lb750sv": lb750sv,
	"lp700": lp700,
	"ltrstar": ltrstar,
	"lykan": lykan,
	"m3f801": m3f801,
	"monza": monza,
	"panamera17turbo": panamera17turbo,
	"pm19": pm19,
	"q8prior": q8prior,
	"rmodbacalar": rmodbacalar,
	"rmodmartin": rmodmartin,
	"rs6c8": rs6c8,
	"s65f": s65f,
	"senna": senna,
	"sl65bs": sl65bs,
	"SuperVolito2": supervolito2,
	"terzo": terzo,
	"topcar911": topcar911,
	"ursa": ursa,
	"urus": urus,
	"yz450f": yz450f,
	"zx10r": zx10r,
};

import "./index.scss";


interface ILootboxes {
	case: string;
	coins: number;
}

const Lootboxes = (props: ILootboxes) => {
	const [margin, setMargin] = useState(0);
	const audio = createRef<HTMLAudioElement>();	
	const caseSelected = props.case
	const Items = Boutique.cases[caseSelected].content
	const [chargedCase, setChargedCase] = useState([]);
	const [selected, setSelected] = useState<any>(null);
	
    const onMessage = (event: any) => {
        if (event.data.type == "store/case") {
			let chCase = []

			event.data.data.map((v, k) => {
				let fegeg = null

				if (v.args && v.args.type && v.args.type == "vehicule") fegeg = ImgLinksCars[v.img] || v.img
				if (v.args && v.args.type && v.args.type == "helico") fegeg = ImgLinksCars[v.img] || v.img 
				if (v.args && v.args.type && v.args.type == "weapon") fegeg = ImgLinksWeapons[v.img] || v.img
				if (v.args && v.args.type && v.args.type == "coins") fegeg = "https://cdn.discordapp.com/attachments/958102912029032449/983496084712206387/unknown_1.png"
				if (v.args && v.args.type && v.args.type == "money") fegeg = "https://cdn.discordapp.com/attachments/972502080893911090/983496796061978654/unknown.png"
				if (v.args && v.args.type && v.args.type == "vip_gold") fegeg = "https://cdn.discordapp.com/attachments/878647902631780392/983326466173448192/unknown.png"

				chCase.push({
					tier: v["tier"],
                    description: !!v["description"] && `${v["description"]}`,
					img: fegeg,
				})
			})

			setChargedCase(chCase)
		}
	};

    React.useEffect(() => {
		window.addEventListener("message", onMessage);
		return () => window.removeEventListener("message", onMessage);
	});

	const leave = () => {
        fetch(`https://${location.hostname.replace("cfx-nui-", "")}/leave`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(true)
        })
    }

    document.addEventListener('keydown', function(event) {
        if (event.keyCode == 27) leave()
    })

	const returnAllItems: any = () => {
		let items = [];

		Items.map((v, k) => {
			let fegeg = null

			if (v) {
				if (v.args && v.args.type && v.args.type == "vehicule") fegeg = ImgLinksCars[v.img] || v.img
				if (v.args && v.args.type && v.args.type == "helico") fegeg = ImgLinksCars[v.img] || v.img
				if (v.args && v.args.type && v.args.type == "weapon") fegeg = ImgLinksWeapons[v.img] || v.img
				if (v.args && v.args.type && v.args.type == "coins") fegeg = "https://cdn.discordapp.com/attachments/958102912029032449/983496084712206387/unknown_1.png"
				if (v.args && v.args.type && v.args.type == "money") fegeg = "https://cdn.discordapp.com/attachments/972502080893911090/983496796061978654/unknown.png"
				if (v.args && v.args.type && v.args.type == "vip_gold") fegeg = "https://cdn.discordapp.com/attachments/878647902631780392/983326466173448192/unknown.png"

				items.push({
					tier: v["tier"],
					description: !!v["description"] && `${v["description"]}`,
					img: fegeg,
				});
			}

		})

		return items;
	}

	const [state] = useState<{ items: any[], allItems: any[] }>({ items: chargedCase, allItems: returnAllItems() });

	const returnColor = (tier: number) => {
		if (tier == 0) return "#bebcfe";
		if (tier == 1) return "#72c5f6";
		if (tier == 2) return "#22bcfe";
		if (tier == 3) return "#c56e7e";
		if (tier == 4) return "#ffd000";
	}

	const returnColorElement = (tier: number) => {
		if (tier == 0) return "#bebcfe8f";
		if (tier == 1) return "#72c6f680";
		if (tier == 2) return "#22bcfe80";
		if (tier == 3) return "#c56e7e8c";
		if (tier == 4) return "#ffd0008a";
	}

	const casesContent = React.useMemo(
		() =>
			state.allItems.map((item, index) => (
				<div key={index} className="item-case" style={{height: 150, width: 150}}>
					<img style={{height: 95, marginTop: 12.5}} src={item.img} className="item-case-image" />

					<p style={{ fontSize: 10, display: "flex", flexDirection: "column", width: "80%", justifyContent: "center", alignItems: "center", textAlign: "center"}}>{item.description}</p>
				
					<svg style={{marginBottom: -8.5}} width="161" height="35" viewBox="0 0 161 35" fill="none" xmlns="http://www.w3.org/2000/svg">
						<g filter="url(#filter0_d_1_219)"><rect x="16" y="24" width="129" height="3" fill={returnColor(item.tier)}/></g><defs><filter id="filter0_d_1_219" x="0" y="0" width="161" height="35" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="-8"/><feGaussianBlur stdDeviation="8"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0.541176 0 0 0 0 0.980392 0 0 0 0 0.129412 0 0 0 0.25 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_219"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_219" result="shape"/></filter></defs>
					</svg>
				</div>
			)),
		state.allItems
	);

	if (selected) {
		return (
			<div style={{
				height: "100%",
				width: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: returnColorElement(selected.tier),
				transitionDuration: "800ms"
			}}>
				<div style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					marginBottom: 25
				}}>
					<img style={{
						marginTop: 15,
						zIndex: 2,
						width: '475px',
						height: '430px',
						objectFit: 'contain'
					}} src={selected.img} />
				
					<p style={{ display: "flex", flexDirection: "column", width: "80%", justifyContent: "center", alignItems: "center", textAlign: "center", fontSize: 30}}>{selected.description}</p>
				</div>

				<div style={{height: 60, width: 200, display: "flex", alignItems: "center", justifyContent: "center"}}>
                    <div style={{ height: 40, width: 60, backgroundColor: "#fff", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginRight: 15  }}>
                        ESC
                    </div>

                    <p style={{ fontSize: 20 }}>
                        Pour quitter
                    </p>
                </div>
			</div>
		)
	}

	return (
		<div className="lootboxes">
			<img style={{marginBottom: 40}} src="https://media.discordapp.net/attachments/857379508747239425/974795338789572628/unknown.png?width=1440&height=57" />

			<div className="container">
				<div className="lootboxes-holder">
					<div className="lootboxes-container" style={{ marginLeft: `${margin}px` }}>
						{
							chargedCase.map((item, index) => {
								return (
									<div key={index} className="item-case" style={{backgroundColor: index == 70 ? returnColorElement(item.tier) : ""}}>
										<img style={{marginTop: 15}} src={item.img} className="item-case-image" />

										<p style={{ display: "flex", flexDirection: "column", width: "80%", justifyContent: "center", alignItems: "center", textAlign: "center"}}>{item.description}</p>
									
										<svg style={{marginBottom: -7.5}} width="161" height="35" viewBox="0 0 161 35" fill="none" xmlns="http://www.w3.org/2000/svg">
											<g filter="url(#filter0_d_1_219)"><rect x="16" y="24" width="129" height="3" fill={returnColor(item.tier)}/></g><defs><filter id="filter0_d_1_219" x="0" y="0" width="161" height="35" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="-8"/><feGaussianBlur stdDeviation="8"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0.541176 0 0 0 0 0.980392 0 0 0 0 0.129412 0 0 0 0.25 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_219"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_219" result="shape"/></filter></defs>
										</svg>
									</div>
								)
							})
						}
					</div>
				</div>
				<audio src={Sound} ref={audio} />
			</div>
			
			<img style={{marginTop: 70, marginLeft: 6, height: 55}} src="https://cdn.discordapp.com/attachments/956333971908730961/975105788102201395/unknown.png?width=1440&height=57" />

			<div className="button" onClick={() => {
				setTimeout(() => {
					if (props.coins < Boutique.cases[caseSelected].price) return;

					fetch(`https://${location.hostname.replace("cfx-nui-", "")}/buyCase`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},

						body: JSON.stringify(true)
					})

					audio.current?.play?.();
					console.log("[Lootboxes] Lootboxes have been claimed!");

					setTimeout(() => {
						setMargin(-14137);
					}, 1500)

					setTimeout(() => {
						chargedCase.map((v, k) => {
							if (k == 70) {
								console.log(JSON.stringify(v))
								setSelected(v)
							}
						})
					}, 10200)

				}, 250);
			}}>
				<p style={{color: props.coins < Boutique.cases[caseSelected].price ? "#DC143C" : ""}}>OUVRIR</p>
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
