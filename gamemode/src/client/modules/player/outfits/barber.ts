import { BlipSprite, Game, Prop, Vector3 } from "@nativewrappers/client";
import { Delay } from "../../../../shared/utils/utils";
import { CoraUI } from "../../../core/coraui";
import { BlipsController } from "../../../misc/blips";
import { InteractionPoints } from "../../../misc/interaction-points";
import { Character } from "../../../player/character";
import { Skin } from "../../../player/skin";
import { PedUtils } from "../../../utils/ped";
import { Streaming } from "../../../utils/streaming";

let ped: any;
let cam: any;

export abstract class Barber {
	private static scissors?: Prop;

	public static async initialize() {
		InteractionPoints.createPoint({
			position: Vector3.create({ x: 134.7235107421875, y: -1707.9981689453125, z: 29.291601181030273 - 0.9 }),
			action: this.start.bind(this),
			helpText: "Appuyez sur ~INPUT_CONTEXT~ pour ~b~ vous faire coiffer",
			marker: false,
			ped: {
				model: "s_f_m_fembarber",
				heading: 147.049,
			},
		});

		BlipsController.CreateBlip({
			name: "Coiffeur",
			coords: { x: 134.7235107421875, y: -1707.9981689453125, z: 29.291601181030273 },
			sprite: BlipSprite.Barber,
			color: 0,
			scale: 0.8,
		});
	}

	public static start() {
		this.preparePlayer();
		this.createBarber();
	}

	public static async preparePlayer() {
		TaskPedSlideToCoord(PlayerPedId(), 137.12, -1709.45, 29.3, 205.75, 1.0);
		DoScreenFadeOut(1000);

		SetEntityCoords(PlayerPedId(), 137.72, -1710.64, 28.6, false, false, false, false);
		SetEntityHeading(PlayerPedId(), 237.22);
		ClearPedTasks(PlayerPedId());

		let behindPlayer = GetOffsetFromEntityInWorldCoords(PlayerPedId(), 0.0, 0 - 0.5, -0.5);
		TaskStartScenarioAtPosition(
			PlayerPedId(),
			"PROP_HUMAN_SEAT_CHAIR_MP_PLAYER",
			behindPlayer[0],
			behindPlayer[1],
			behindPlayer[2],
			GetEntityHeading(PlayerPedId()),
			0,
			true,
			false
		);

		await Delay(1000);
		emitNet("gm:inst:create");
		await Delay(1000);
		DoScreenFadeIn(1000);
	}

	public static async createBarber() {
		await Streaming.RequestModelAsync("s_f_m_fembarber");
		await Streaming.RequestModelAsync("p_cs_scissors_s");

		ped = PedUtils.CreatePed("s_f_m_fembarber", [141.48, -1705.59, 29.29 - 0.95], 0.0);
		const pos = Game.PlayerPed.Position;
		this.scissors = new Prop(CreateObject(GetHashKey("p_cs_scissors_s"), pos.x, pos.y, pos.z, false, false, false));
		AttachEntityToEntity(
			this.scissors.Handle,
			ped,
			GetPedBoneIndex(ped, 28422),
			0.0,
			0.0,
			0.0,
			0.0,
			0.0,
			0.0,
			true,
			true,
			false,
			true,
			1,
			true
		);

		SetModelAsNoLongerNeeded(GetHashKey("p_cs_scissors_s"));
		SetModelAsNoLongerNeeded(GetHashKey("s_f_m_fembarber"));

		SetEntityHeading(ped, 123.37);
		SetEntityInvincible(ped, true);
		SetBlockingOfNonTemporaryEvents(ped, true);
		TaskPedSlideToCoord(ped, 137.15, -1710.5, 29.3, 205.75, 1.0);
		await Delay(5000);
		FreezeEntityPosition(ped, true);

		this.openMenu();
		this.createCam(true);
	}

	public static createCam(d: boolean) {
		RenderScriptCams(false, false, 0, true, false);
		DestroyCam(cam, false);

		if (!DoesCamExist(cam)) {
			if (d) {
				cam = CreateCamWithParams("DEFAULT_SCRIPTED_CAMERA", 138.45, -1711.05, 29.7, 0.0, 0.0, 45.0, 65.0, false, 0);
			} else {
				cam = CreateCamWithParams("DEFAULT_SCRIPTED_CAMERA", 137.72, -1709.87, 29.9, 0.0, 0.0, 135.0, 85.0, false, 0);
			}

			SetCamActive(cam, true);
			RenderScriptCams(true, false, 0, true, false);
		}
	}

	public static destroyCam() {
		RenderScriptCams(false, false, 0, true, false);
		DestroyCam(cam, false);
	}

	public static openMenu() {
		const HairColoursPanel = [
			[28, 31, 33],
			[39, 42, 44],
			[49, 46, 44],
			[53, 38, 28],
			[75, 50, 31],
			[92, 59, 36],
			[109, 76, 53],
			[107, 80, 59],
			[118, 92, 69],
			[127, 104, 78],
			[153, 129, 93],
			[167, 147, 105],
			[175, 156, 112],
			[187, 160, 99],
			[214, 185, 123],
			[218, 195, 142],
			[159, 127, 89],
			[132, 80, 57],
			[104, 43, 31],
			[97, 18, 12],
			[100, 15, 10],
			[124, 20, 15],
			[160, 46, 25],
			[182, 75, 40],
			[162, 80, 47],
			[170, 78, 43],
			[98, 98, 98],
			[128, 128, 128],
			[170, 170, 170],
			[197, 197, 197],
			[70, 57, 85],
			[90, 63, 107],
			[118, 60, 118],
			[237, 116, 227],
			[235, 75, 147],
			[242, 153, 188],
			[4, 149, 158],
			[2, 95, 134],
			[2, 57, 116],
			[63, 161, 106],
			[33, 124, 97],
			[24, 92, 85],
			[182, 192, 52],
			[112, 169, 11],
			[67, 157, 19],
			[220, 184, 87],
			[229, 177, 3],
			[230, 145, 2],
			[242, 136, 49],
			[251, 128, 87],
			[226, 139, 88],
			[209, 89, 60],
			[206, 49, 32],
			[173, 9, 3],
			[136, 3, 2],
			[31, 24, 20],
			[41, 31, 25],
			[46, 34, 27],
			[55, 41, 30],
			[46, 34, 24],
			[35, 27, 21],
			[2, 2, 2],
			[112, 108, 102],
			[157, 122, 80],
		];

		let CheveuxName = [];

		CheveuxName[0] = [
			"Chauve",
			"Longue queue",
			"Chignon",
			"Queue courte",
			"Biker",
			"Pecno",
			"Macbeat",
			"Trunks",
			"Coiffure 10",
			"Coiffure 11",
			"Coiffure 12",
			"Court",
			"Faux Hawk",
			"Hipster",
			"Side Parting",
			"Shorter Cut",
			"Biker",
			"Ponytail",
			"Cornrows",
			"Slicked",
			"Short Brushed",
			"Spikey",
			"Caesar",
			"Chopped",
			"Dreads",
			"Long Hair",
			"Shaggy Curls",
			"Surfer Dude",
			"Short Side Part",
			"High Slicked Sides",
			"Long Slicked",
			"Hipster Youth",
			"Mullet",
			"Classic Cornrows",
			"Palm Cornrows",
			"Lightning Cornrows",
			"Whipped Cornrows",
			"Zig Zag Cornrows",
			"Snail Cornrows",
			"Hightop",
			"Loose Swept Back",
			"Undercut Swept Back",
			"Undercut Swept Side",
			"Spiked Mohawk",
			"Mod",
			"Layered Mod",
			"Flattop",
			"Military Buzzcut",
		];

		CheveuxName[1] = [
			"Crâne rasé",
			"Long",
			"Coiffure 03",
			"Court",
			"Coiffure 04",
			"Long épaule",
			"Coiffure 06",
			"Dread",
			"Coiffure 08",
			"Coiffure 09",
			"Coiffure 10",
			"Coiffure 11",
			"Coiffure 12",
			"Coiffure 13",
			"Coiffure 14",
			"Coiffure 15",
			"Coiffure 16",
			"Short",
			"Layered Bob",
			"Pigtails",
			"Ponytail",
			"Braided Mohawk",
			"Braids",
			"Bob",
			"Faux Hawk",
			"French Twist",
			"Long Bob",
			"Loose Tied",
			"Pixie",
			"Shaved Bangs",
			"Top Knot",
			"Wavy Bob",
			"Messy Bun",
			"Pin Up Girl",
			"Tight Bun",
			"Twisted Bob",
			"Flapper Bob",
			"Big Bangs",
			"Braided Top Knot",
			"Mullet",
			"Pinched Cornrows",
			"Leaf Cornrows",
			"Zig Zag Cornrows",
			"Pigtail Bangs",
			"Wave Braids",
			"Coil Braids",
			"Rolled Quiff",
			"Loose Swept Back",
			"Undercut Swept Back",
			"Undercut Swept Side",
			"Spiked Mohawk",
			"Bandana and Braid",
			"Layered Mod",
			"Skinbyrd",
			"Neat Bun",
			"Short Bob",
		];

		let BarbeName = ["Aucune"];

		for (let i = 1; i < 29; i++) {
			const a = i - 1;
			BarbeName[i] = GetLabelText("CC_BEARD_" + a.toString());
		}

		let TraitsButtonsName = [
			"Largeur du nez",
			"Longueur du nez",
			"Hauteur du nez",
			"Hauteur de l'os du nez",
			"Abaissement du pic du nez",
			"Torsion de l'os du nez",
			"Hauteur des sourcils",
			"Position des sourcils",
			"Hauteur des joues",
			"Largeur des joues",
			"Ouverture des yeux",
			"Epaisseur des lèvres",
			"Largeur des os de la mâchoire",
			"Longueur de l'os de la mâchoire",
			"Abaissement du menton",
			"Longueur du menton",
			"Largeur du menton",
			"Forme du menton",
		];

		let skin: number[] = Character.getCurrent()?.skin || [];

		CoraUI.openMenu({
			name: "Votre Personnage",
			subtitle: "Barber",
			glare: true,
			closable: false,
			buttons: [
				{ name: "Cheveux", onClick: () => CoraUI.openSubmenu("cheveux") },
				{ name: "Barbe", onClick: () => CoraUI.openSubmenu("barbe") },
				{ name: "Sourcils", onClick: () => CoraUI.openSubmenu("sourcils") },

				{
					name: "Sauvegarder & Continuer",
					backgroundColor: [3, 132, 252],
					onClick: async () => {
						Character.update({
							skin: skin,
						});
						this.exitAnim();
					},
				},
				{
					name: "Annuler & quitter",
					onClick: async () => {
						Skin.setSkin(PlayerPedId(), Character.getCurrent()?.skin);
						this.exit();
					},
				},
			],

			submenus: {
				cheveux: {
					name: "Votre Personnage",
					subtitle: "Cheveux",
					glare: true,
					buttons: [
						{
							name: "Cheveux",
							onSlide: (e: any) => {
								skin[23] = e;
								Skin.setSkin(PlayerPedId(), skin);
							},
							slider: CheveuxName[skin[0]],
						},

						{
							name: "Couleur primaire cheveux",
							customColorPanel: HairColoursPanel,
							onColorPanel: (e: any) => {
								skin[24] = e;
								Skin.setSkin(PlayerPedId(), skin);
							},
						},

						{
							name: "Couleur secondaire cheveux",
							customColorPanel: HairColoursPanel,
							onColorPanel: (e: any) => {
								skin[25] = e;
								Skin.setSkin(PlayerPedId(), skin);
							},
						},
					],
				},

				barbe: {
					name: "Votre Personnage",
					subtitle: "Barbe",
					glare: true,
					buttons: [
						{
							name: "Barbe",
							onSlide: (e: any) => {
								skin[26] = e;
								Skin.setSkin(PlayerPedId(), skin);
							},
							slider: BarbeName,
						},

						{
							name: "Opacité Barbe",
							onPourcentage: (e: any) => {
								skin[27] = e / 10;
								Skin.setSkin(PlayerPedId(), skin);
							},
						},

						{
							name: "Couleur primaire barbe",
							customColorPanel: HairColoursPanel,
							onColorPanel: (e: any) => {
								skin[28] = e;
								Skin.setSkin(PlayerPedId(), skin);
							},
						},

						{
							name: "Couleur secondaire barbe",
							customColorPanel: HairColoursPanel,
							onColorPanel: (e: any) => {
								skin[29] = e;
								Skin.setSkin(PlayerPedId(), skin);
							},
						},
					],
				},

				sourcils: {
					name: "Votre Personnage",
					subtitle: "Sourcils",
					glare: true,
					buttons: [
						{
							name: TraitsButtonsName[6],
							slideNum: 10,
							onSlide: (e: any) => {
								skin[6 + 5] = 6 <= 17 ? e / 5 : e;
								Skin.setSkin(PlayerPedId(), skin);
							},
						},

						{
							name: TraitsButtonsName[7],
							slideNum: 10,
							onSlide: (e: any) => {
								skin[7 + 5] = 7 <= 17 ? e / 5 : e;
								Skin.setSkin(PlayerPedId(), skin);
							},
						},
					],
				},
			},
		});
	}

	private static async exitAnim() {
		RequestAnimDict("misshair_shop@barbers");
		TaskPlayAnim(ped, "misshair_shop@barbers", "keeper_idle_b", 8.0, 8.0, 15000, 0, 0, false, false, false);
		await Delay(9000);
		await this.exit();
	}

	private static async exit() {
		DoScreenFadeOut(500);
		ClearPedTasks(GetPlayerPed(-1));
		TaskPedSlideToCoord(ped, 141.48, -1705.59, 29.29 - 0.95, 123.37, 1.0);
		if (this.scissors?.exists()) {
		}
		DeletePed(ped);
		this.destroyCam();
		CoraUI.closeMenu();
		await Delay(1000);
		emitNet("gm:inst:leave");
		await Delay(1000);
		SetEntityCoords(PlayerPedId(), 133.55, -1708.86, 28.29, false, false, false, false);
		SetEntityHeading(PlayerPedId(), 237.22);
		DoScreenFadeIn(2000);
	}
}
