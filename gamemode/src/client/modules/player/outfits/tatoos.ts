import { Character } from "../../../player/character";
import { CoraUI } from "../../../core/coraui";
import TatoosC from "../../../../shared/config/tatoos.json";
import { CamCreate, CamDestroy } from "./cam";
import { Delay } from "../../../../shared/utils/utils";
import { InteractionPoints } from "../../../misc/interaction-points";
import { Control, Vector3 } from "@nativewrappers/client";
import { Money } from "../../../player/money";

import { Tatoos as TatoosPlayer } from "../../../player/tatoos";
import { Clothes } from "../../../player/clothes";
import { InstructionalButtons } from "../../../misc/instructional-buttons";

export class Tatoos {
	public static async initialize() {
		InteractionPoints.createPoint({
			position: Vector3.create({ x: 319.728515625, y: 180.8586883544922, z: 103.58658599853516 - 0.9 }),
			action: this.openMenu,
			helpText: "Appuyez sur ~INPUT_CONTEXT~ pour ~b~vous faire tatouer",
			marker: false,
			ped: {
				model: "s_f_m_fembarber",
				heading: 249.946,
			},
		});
	}

	public static openMenu() {
		let tatoos: any = Character.getCurrent()?.tatoos;
		let price: number = 0;

		InstructionalButtons.setButton("Pour tourner votre personnage", 22, true);

		const tick = setTick(() => {
			if (IsControlJustPressed(0, 22)) {
				SetEntityHeading(PlayerPedId(), GetEntityHeading(PlayerPedId()) + 180);
			}
		});

		const save = async () => {
			if (!Money.pay(price)) return;
			Character.update({
				tatoos: tatoos,
			});
			ClearPedDecorations(PlayerPedId());
			await Clothes.putClothes();
			await TatoosPlayer.set();
			CoraUI.closeMenu();
			CamDestroy();
		};

		let ZONE_HEAD: any = [
			{
				name: "Visualiser le panier",
				onClick: () => {
					TatoosPlayer.setCustom(tatoos);
				},
				backgroundColor: [255, 165, 0],
			},
			{
				name: "Sauvegarder",
				onClick: async () => await save(),
				backgroundColor: [3, 132, 252],
			},
			{
				name: "Réinitialiser",
				onClick: () => {
					tatoos = Character.getCurrent()?.tatoos;
				},
				backgroundColor: [189, 43, 38],
			},
		];
		let ZONE_TORSO: any = [
			{
				name: "Visualiser le panier",
				onClick: () => {
					TatoosPlayer.setCustom(tatoos);
				},
				backgroundColor: [255, 165, 0],
			},
			{
				name: "Sauvegarder",
				onClick: async () => await save(),
				backgroundColor: [3, 132, 252],
			},
			{
				name: "Réinitialiser",
				onClick: () => {
					tatoos = Character.getCurrent()?.tatoos;
				},
				backgroundColor: [189, 43, 38],
			},
		];
		let ZONE_RIGHT_LEG: any = [
			{
				name: "Visualiser le panier",
				onClick: () => {
					TatoosPlayer.setCustom(tatoos);
				},
				backgroundColor: [255, 165, 0],
			},
			{
				name: "Sauvegarder",
				onClick: async () => await save(),
				backgroundColor: [3, 132, 252],
			},
			{
				name: "Réinitialiser",
				onClick: () => {
					tatoos = Character.getCurrent()?.tatoos;
				},
				backgroundColor: [189, 43, 38],
			},
		];

		let ZONE_RIGHT_ARM: any = [
			{
				name: "Visualiser le panier",
				onClick: () => {
					TatoosPlayer.setCustom(tatoos);
				},
				backgroundColor: [255, 165, 0],
			},
			{
				name: "Sauvegarder",
				onClick: async () => await save(),
				backgroundColor: [3, 132, 252],
			},
			{
				name: "Réinitialiser",
				onClick: () => {
					tatoos = Character.getCurrent()?.tatoos;
				},
				backgroundColor: [189, 43, 38],
			},
		];
		let ZONE_LEFT_LEG: any = [
			{
				name: "Visualiser le panier",
				onClick: () => {
					TatoosPlayer.setCustom(tatoos);
				},
				backgroundColor: [255, 165, 0],
			},
			{
				name: "Sauvegarder",
				onClick: async () => await save(),
				backgroundColor: [3, 132, 252],
			},
			{
				name: "Réinitialiser",
				onClick: () => {
					tatoos = Character.getCurrent()?.tatoos;
				},
				backgroundColor: [189, 43, 38],
			},
		];

		let ZONE_LEFT_ARM: any = [
			{
				name: "Visualiser le panier",
				onClick: () => {
					TatoosPlayer.setCustom(tatoos);
				},
				backgroundColor: [255, 165, 0],
			},
			{
				name: "Sauvegarder",
				onClick: async () => await save(),
				backgroundColor: [3, 132, 252],
			},
			{
				name: "Réinitialiser",
				onClick: () => {
					tatoos = Character.getCurrent()?.tatoos;
				},
				backgroundColor: [189, 43, 38],
			},
		];

		const setTatoos = (collection: string, hash: string, price: number) => {
			SetPedDecoration(PlayerPedId(), collection, hash);

			if (tatoos.length >= 20) return;

			const ifTatoosExist = tatoos.find((d: any) => d[1] === hash);
			if (ifTatoosExist) return;

			tatoos.push([collection, hash]);
			price += price;
		};

		TatoosC.map((v: any, k: any) => {
			const hash = Character.getCurrent()?.skin[0] ? v["HashNameMale"] : v["HashNameFemale"];

			switch (v["Zone"]) {
				case "ZONE_HEAD":
					ZONE_HEAD.push({
						name: GetLabelText(v["Name"]),
						description: "Appuyez pour ajouter au panier",
						onClick: () => {
							setTatoos(v["Collection"], hash, v["Price"]);
						},
						onHover: () => {
							ClearPedDecorations(PlayerPedId());
							SetPedDecoration(PlayerPedId(), v["Collection"], hash);
						},
					});
				case "ZONE_TORSO":
					ZONE_TORSO.push({
						name: GetLabelText(v["Name"]),
						description: "Appuyez pour ajouter au panier",
						onClick: () => {
							setTatoos(v["Collection"], hash, v["Price"]);
						},
						onHover: () => {
							ClearPedDecorations(PlayerPedId());
							SetPedDecoration(PlayerPedId(), v["Collection"], hash);
						},
					});
				case "ZONE_RIGHT_LEG":
					ZONE_RIGHT_LEG.push({
						name: GetLabelText(v["Name"]),
						description: "Appuyez pour ajouter au panier",
						onClick: () => {
							setTatoos(v["Collection"], hash, v["Price"]);
						},
						onHover: () => {
							ClearPedDecorations(PlayerPedId());
							SetPedDecoration(PlayerPedId(), v["Collection"], hash);
						},
					});
				case "ZONE_RIGHT_ARM":
					ZONE_RIGHT_ARM.push({
						name: GetLabelText(v["Name"]),
						description: "Appuyez pour ajouter au panier",
						onClick: () => {
							setTatoos(v["Collection"], hash, v["Price"]);
						},
						onHover: () => {
							ClearPedDecorations(PlayerPedId());
							SetPedDecoration(PlayerPedId(), v["Collection"], hash);
						},
					});
				case "ZONE_LEFT_LEG":
					ZONE_LEFT_LEG.push({
						name: GetLabelText(v["Name"]),
						description: "Appuyez pour ajouter au panier",
						onClick: () => {
							setTatoos(v["Collection"], hash, v["Price"]);
						},
						onHover: () => {
							ClearPedDecorations(PlayerPedId());
							SetPedDecoration(PlayerPedId(), v["Collection"], hash);
						},
					});
				case "ZONE_LEFT_ARM":
					ZONE_LEFT_ARM.push({
						name: GetLabelText(v["Name"]),
						description: "Appuyez pour ajouter au panier",
						onClick: () => {
							setTatoos(v["Collection"], hash, v["Price"]);
						},
						onHover: () => {
							ClearPedDecorations(PlayerPedId());
							SetPedDecoration(PlayerPedId(), v["Collection"], hash);
						},
					});
				default:
			}
		});

		CoraUI.openMenu({
			name: "Tatouages",
			subtitle: "Choix catégorie",
			glare: true,
			onOpen: () => {
				if (Character.getCurrent()?.skin[0] == 0) {
					SetPedComponentVariation(GetPlayerPed(-1), 8, 15, 0, 2);
					SetPedComponentVariation(GetPlayerPed(-1), 4, 21, 0, 2);
					SetPedComponentVariation(GetPlayerPed(-1), 6, 34, 0, 2);
				} else {
					SetPedComponentVariation(GetPlayerPed(-1), 8, 2, 0, 2);
					SetPedComponentVariation(GetPlayerPed(-1), 4, 15, 0, 2);
					SetPedComponentVariation(GetPlayerPed(-1), 6, 35, 0, 2);
				}

				SetPedComponentVariation(GetPlayerPed(-1), 11, 15, 0, 2);
				SetPedComponentVariation(GetPlayerPed(-1), 3, 15, 0, 2);

				SetEntityCoords(PlayerPedId(), 324.3616638183594, 180.23101806640625, 102.58649444580078, false, false, false, true);
				SetEntityHeading(PlayerPedId(), 108.2991943359375);

				CamCreate("default");
			},
			onClose: async () => {
				ClearPedDecorations(PlayerPedId());
				await Clothes.putClothes();
				await TatoosPlayer.set();
				InstructionalButtons.setButton("Pour tourner votre personnage", 22, false);
				clearTick(tick);
				CamCreate("bags_1");
				await Delay(200);
				CamDestroy();
			},
			buttons: [
				{
					name: "Tête",
					onClick: () => {
						CamCreate("default_face");
						CoraUI.openSubmenu("ZONE_HEAD");
					},
				},
				{
					name: "Torse",
					onClick: () => {
						CamCreate("tshirt_1");
						CoraUI.openSubmenu("ZONE_TORSO");
					},
				},
				{
					name: "Bras droit",
					onClick: () => {
						CamCreate("arms");
						CoraUI.openSubmenu("ZONE_RIGHT_ARM");
					},
				},
				{
					name: "Bras gauche",
					onClick: () => {
						CamCreate("arms");
						CoraUI.openSubmenu("ZONE_LEFT_ARM");
					},
				},
				{
					name: "Jambe droite",
					onClick: () => {
						CamCreate("pants_1");
						CoraUI.openSubmenu("ZONE_RIGHT_LEG");
					},
				},
				{
					name: "Jambe gauche",
					onClick: () => {
						CamCreate("pants_1");
						CoraUI.openSubmenu("ZONE_LEFT_LEG");
					},
				},
			],
			submenus: {
				ZONE_HEAD: {
					name: "Tatouages",
					subtitle: "Choix catégorie",
					glare: true,
					buttons: ZONE_HEAD,
					onClose: () => CamCreate("default"),
				},
				ZONE_TORSO: {
					name: "Tatouages",
					subtitle: "Choix catégorie",
					glare: true,
					buttons: ZONE_TORSO,
					onClose: () => CamCreate("default"),
				},
				ZONE_RIGHT_LEG: {
					name: "Tatouages",
					subtitle: "Choix catégorie",
					glare: true,
					buttons: ZONE_RIGHT_LEG,
					onClose: () => CamCreate("default"),
				},
				ZONE_RIGHT_ARM: {
					name: "Tatouages",
					subtitle: "Choix catégorie",
					glare: true,
					buttons: ZONE_RIGHT_ARM,
					onClose: () => CamCreate("default"),
				},
				ZONE_LEFT_LEG: {
					name: "Tatouages",
					subtitle: "Choix catégorie",
					glare: true,
					buttons: ZONE_LEFT_LEG,
					onClose: () => CamCreate("default"),
				},
				ZONE_LEFT_ARM: {
					name: "Tatouages",
					subtitle: "Choix catégorie",
					glare: true,
					buttons: ZONE_LEFT_ARM,
					onClose: () => CamCreate("default"),
				},
			},
		});
	}
}
