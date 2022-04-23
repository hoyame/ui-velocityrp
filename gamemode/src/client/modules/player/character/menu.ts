import { KeyboardInput } from "../../../core/utils";
import { Skin } from "../../../player/skin";
import { CoraUI } from "../../../core/coraui";
import { CharacterCreator } from "./charactercreator";
import { Clothes } from "../../../player/clothes";
import { INewCharacter } from "../../../../shared/player/character";
import { Notifications } from "../../../player/notifications";

export const OpenIdentityCreator = (cb?: (identity: { name: string; height: string; dateOfBirth: string }) => void) => {
	let identity = {
		name: "",
		dateOfBirth: "",
		height: "",
	};

	CoraUI.openMenu({
		name: "Votre Personnage",
		subtitle: "Identité",
		glare: true,
		closable: true,
		buttons: [
			{
				name: "Nom & Prenom",
				rightText: identity.name,
				onClick: async () => {
					const name = await KeyboardInput("Nom & Prénom", 20, "");

					if (name.length < 3) {
						Notifications.ShowError("Votre nom est ~r~trop court");
					} else if (name.length > 20) {
						Notifications.ShowError("Votre nom est ~r~trop long");
					} else if (!/^[a-zA-Z\-åäöÅÄÖ\s]+$/.test(name)) {
						Notifications.ShowError("Votre nom contient des ~r~caractères spéciaux~w~ qui ne sont pas autorisés");
					} else if (!/^\S+\s\S+$/.test(name)) {
						Notifications.ShowError("Votre nom doit contenir ~r~un espace~w~, seulement entre votre nom et prénom");
					} else {
						//toutes les lettres en minuscule, sauf la première et celles après un espace ou -
						identity.name = name.toLowerCase().replace(/\w[^-\s]*/g, w => w.replace(/^\w/, c => c.toUpperCase()));
						CoraUI.CurrentMenu.buttons[0].rightText = identity.name;
					}
				},
			},
			{
				name: "Date de naissance",
				rightText: identity.dateOfBirth,
				onClick: async () => {
					const dob = await KeyboardInput("Date de naissance | (DD/MM/AAAA)", 25);
					const maxYear = new Date().getFullYear() - 14;
					if (!/\d{2}\/\d{2}\/\d{4}/.test(dob)) {
						Notifications.ShowError("Votre date de naissance n'est pas ~r~valide~w~. Respectez le format (ex: 01/01/1990)");
					} else if (Number(dob.substring(6)) < 1930 || Number(dob.substring(6)) > maxYear) {
						Notifications.ShowError("L'année de naissance doit être comprise entre ~r~1930~w~ et ~r~" + maxYear);
					} else {
						CoraUI.CurrentMenu.buttons[1].rightText = dob;
						identity.dateOfBirth = dob;
					}
				},
			},
			{
				name: "Taille",
				rightText: identity.height,
				onClick: async () => {
					const height = await KeyboardInput("Taille | cm", 25);
					if (!Number(height) || Number(height) < 110 || Number(height) > 210) {
						Notifications.ShowError("Votre ~r~taille~w~ doit être comprise entre 110 et 210 (cm)");
					} else {
						identity.height = Number(height) / 100 + " m";
						CoraUI.CurrentMenu.buttons[2].rightText = identity.height;
					}
				},
			},
			{
				name: "Sauvegarder & Continuer",
				backgroundColor: [3, 132, 252],
				onClick: () => {
					if (!identity.name || !identity.dateOfBirth || !identity.height) {
						Notifications.ShowError("Vous devez remplir toutes les ~r~informations");
					} else {
						cb?.(identity);
						CoraUI.closeMenu();
					}
				},
			},
		],
	});
};

export const OpenCharacterCreatorMenu = async (
	cb: (char: { sex: string; skin: number[]; variations: INewCharacter["variations"]; props: INewCharacter["props"] }) => void
) => {
	let Sex = 0;

	let CharCust = [
		0, // sexe

		0, // faceMum
		0, // faceDad
		0.5, // ressemblance
		0.5, // skinMix

		0, // noseWidth
		0, // nosePeakLength
		0, // nosePeakHeight
		0, // noseBoneHeight
		0, // nosePeaklowering
		0, // noseBoneTwist
		0, // eyebrowHeight
		0, // eyebrowForward
		0, // cheeksBoneHeight
		0, // cheeksBoneWidth

		0, // eyeOpening
		0, // lipsThickness
		0, // jawBoneWidth
		0, // jawBoneBackLength
		0, // chimpBoneLowering
		0, // chimpBoneLength
		0, // chimpBoneWidth
		0, // chimpHole
		//22

		0, // hairStyle
		0, // hairColorOne
		0, // hairColorTwo
		0, // beardStyle
		0, // beardOpacity
		0, // beardColorOne
		0, // beardColorTwo

		0, // ageingStyle
		0, // ageingOpacity
		0, // lipstickStyle
		0, // lipstickOpacity
		0, // lipstickColorOne
		0, // lipstickColorYwo
		0, // makeupStyle,
		0, // makeupOpacity,
		0, // makeupColorOne
		0, // makeupColorTwo
		0, // eyeStyle

		0, // blemishesStyle
		0, // blemishesOpacity
		0, // complexionStyle
		0, // skinAspectStyle
		0, // skinAspectOpacity
		0, // frecklesStyle
		0, // frecklesOpacity
	];

	const maleOutfit = [
		{
			variations: {
				"1": [0, 0],
				"3": [0, 0],
				"4": [4, 0],
				"5": [0, 0],
				"6": [8, 0],
				"7": [0, 0],
				"8": [1, 0],
				"9": [0, 0],
				"10": [0, 0],
				"11": [1, 0],
			},
			props: {},
		},
		{
			variations: {
				"1": [0, 0],
				"3": [0, 0],
				"4": [43, 1],
				"5": [0, 0],
				"6": [48, 0],
				"7": [0, 0],
				"8": [5, 0],
				"9": [0, 0],
				"10": [0, 0],
				"11": [75, 0],
			},
			props: {},
		},
		{
			variations: {
				"1": [0, 0],
				"3": [1, 0],
				"4": [45, 0],
				"5": [0, 0],
				"6": [21, 0],
				"7": [0, 0],
				"8": [36, 0],
				"9": [0, 0],
				"10": [0, 0],
				"11": [32, 0],
			},
			props: {},
		},
	];

	const femaleOutfit = [
		{
			variations: {
				"1": [0, 0],
				"3": [12, 0],
				"4": [4, 0],
				"5": [0, 0],
				"6": [3, 0],
				"7": [0, 0],
				"8": [14, 0],
				"9": [0, 0],
				"10": [0, 0],
				"11": [23, 0],
			},
			props: {},
		},
		{
			variations: {
				"1": [0, 0],
				"3": [14, 0],
				"4": [58, 1],
				"5": [0, 0],
				"6": [64, 0],
				"7": [0, 0],
				"8": [13, 0],
				"9": [0, 0],
				"10": [0, 0],
				"11": [78, 0],
			},
			props: {},
		},
		{
			variations: {
				"1": [0, 0],
				"3": [14, 0],
				"4": [52, 0],
				"5": [0, 0],
				"6": [0, 0],
				"7": [0, 0],
				"8": [25, 0],
				"9": [0, 0],
				"10": [0, 0],
				"11": [70, 0],
			},
			props: {},
		},
	];

	await Skin.setPed("mp_m_freemode_01");
	CharCust[0] = 0;
	Sex = 0;
	Clothes.addVariations(maleOutfit[0].variations);
	Clothes.setProps(maleOutfit[0].props);

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
	let RidesName = [
		"Aucune",
		"Rides yeux",
		"Rides 1",
		"Rides 2",
		"Rides 3",
		"Rides 4",
		"Rides 5",
		"Rides 6",
		"Rides 7",
		"Rides 8",
		"Rides 9",
		"Rides 10",
		"Rides EX 1",
		"Rides EX 2",
		"Cernes",
	];
	let Lipstick = ["Aucune"];
	let MaquillageList = ["Aucune"];
	let ComplexionsList = ["Aucune"];
	let EyesList = [
		"Vert",
		"Emmeraude",
		"Bleu",
		"Bleu ciel",
		"Marron clair",
		"Marron",
		"Noisette",
		"Gris sombre",
		"Gris propre",
		"Rose",
		"Jaune",
		"Violet",
		"Blackout",
		"Ombre grise",
		"Soleil tequila",
		"Atomic",
		"Faux",
		"Cola",
		"Ranger",
		"Ying-yang",
		"Bull",
		"Lezard",
		"Dragon",
		"Extra-terrestre",
		"Chèvre",
		"Smiley",
		"Possédé",
		"Démon",
		"Infecté",
		"Alien",
		"Mort",
		"Zombie",
	];
	let tachList = [
		"Aucune",
		"Peu de tâches",
		"Tâches peu visibles",
		"Tâches baladées",
		"Tâches éparpillées",
		"Tâches sauvages",
		"Tâches centrées",
		"Tâches joues",
		"Tâches visage",
		"Infection visage",
		"Infection joues",
		"Rougeur",
		"Rougeur infectée",
		"Rougeurs front",
		"Acnée",
		"Acnée sévère",
		"Acnée baladée",
		"Acnée épaisse",
		"Acnée front",
		"Acnée totale",
	];
	let SkinList = ["Aucune"];
	let MoleList = ["Aucune"];

	let TraitsButtons = [];

	for (let i = 0; i < 18; i++) {
		TraitsButtons[i] = {
			name: TraitsButtonsName[i],
			slideNum: 10,
			onSlide: (e: any) => {
				CharCust[i + 5] = i <= 17 ? e / 5 : e;
				Skin.setSkin(PlayerPedId(), CharCust);
			},
		};
	}

	for (let i = 1; i < 29; i++) {
		const a = i - 1;
		BarbeName[i] = GetLabelText("CC_BEARD_" + a.toString());
	}

	for (let i = 1; i < 11; i++) {
		const a = i - 1;
		SkinList[i] = GetLabelText("CC_SKINCOM_" + a.toString());
	}

	for (let i = 1; i < 10; i++) {
		const a = i - 1;
		Lipstick[i] = GetLabelText("CC_LIPSTICK_" + a.toString());
	}

	for (let i = 0; i < 71; i++) {
		const a = i - 1;
		MaquillageList[i] = GetLabelText("CC_MKUP_" + a.toString());
	}

	for (let i = 1; i < 11; i++) {
		const a = i - 1;
		ComplexionsList[i] = GetLabelText("CC_MOLEFRECK_" + a.toString());
	}

	for (let i = 1; i < 18; i++) {
		const a = i - 1;
		MoleList[i] = GetLabelText("CC_MOLEFRECK_" + a.toString());
	}

	CoraUI.openMenu({
		name: "Votre Personnage",
		subtitle: "Votre Personnage",
		glare: true,
		closable: true,
		buttons: [
			{
				name: "Sexe",
				slider: ["Homme", "Femme"],
				onSlide: async (e: any) => {
					await Skin.setPed(e == 0 ? "mp_m_freemode_01" : "mp_f_freemode_01");
					CharCust[0] = e;
					Skin.setSkin(PlayerPedId(), CharCust);
					Sex = e;
					const clothes = CharCust[0] == 0 ? maleOutfit[0] : femaleOutfit[0];
					Clothes.addVariations(clothes.variations);
					Clothes.setProps(clothes.props);
				},
			},
			{ name: "Heritage", onClick: () => CoraUI.openSubmenu("heridity") },
			{ name: "Traits du visage", onClick: () => CoraUI.openSubmenu("traits") },
			{ name: "Apparence", onClick: () => CoraUI.openSubmenu("apparence") },
			{
				name: "Tenues",
				slider: ["Décontracté", "Rue", "Sophistiqué"],
				onSlide: (index: number) => {
					const clothes = CharCust[0] == 0 ? maleOutfit[index] : femaleOutfit[index];
					Clothes.addVariations(clothes.variations);
					Clothes.setProps(clothes.props);
				},
			},
			{
				name: "Sauvegarder & Continuer",
				backgroundColor: [3, 132, 252],
				onClick: () => {
					const variations = Clothes.getVariations();
					const props = Clothes.getProps();
					cb({ sex: Sex.toString(), skin: CharCust, variations, props });
					CoraUI.closeMenu();
				},
			},
		],
		submenus: {
			heridity: {
				name: "Votre Personnage",
				subtitle: "Heritage",
				glare: true,
				heritagePanel: true,
				indexHeritagePanel: [0, 0, 0, 0],
				onOpen: () => CharacterCreator.zoomCamOnFace(),
				onClose: () => CharacterCreator.resetCamZooom(),
				buttons: [
					{
						name: "Père",
						onSlide: (e: any) => {
							CoraUI.updateIndexHeritagePanel(0, e);
							CharCust[2] = e;
							Skin.setSkin(PlayerPedId(), CharCust);
						},
						slideNum: 21,
					},
					{
						name: "Mère",
						onSlide: (e: any) => {
							CoraUI.updateIndexHeritagePanel(1, e);
							CharCust[1] = e;
							Skin.setSkin(PlayerPedId(), CharCust);
						},
						slideNum: 21,
					},
					{
						name: "Ressemblance",
						onHeritageSlider: (e: any) => {
							CharCust[3] = e / 10;
							Skin.setSkin(PlayerPedId(), CharCust);
						},
						heritageSliderValue: CharCust[3] * 10,
					},
					{
						name: "Couleur de peau",
						onHeritageSlider: (e: any) => {
							CharCust[4] = e / 10;
							Skin.setSkin(PlayerPedId(), CharCust);
						},
						heritageSliderValue: CharCust[4] * 10,
					},
				],
			},
			traits: {
				name: "Votre Personnage",
				subtitle: "Traits du visage",
				glare: true,
				buttons: TraitsButtons,
				onOpen: () => CharacterCreator.zoomCamOnFace(),
				onClose: () => CharacterCreator.resetCamZooom(),
			},
			apparence: {
				name: "Votre Personnage",
				subtitle: "Apparence",
				glare: true,
				onOpen: () => CharacterCreator.zoomCamOnFace(),
				onClose: () => CharacterCreator.resetCamZooom(),
				buttons: [
					{
						name: "Cheveux",
						onSlide: (e: any) => {
							CharCust[23] = e;
							Skin.setSkin(PlayerPedId(), CharCust);
						},
						slider: CheveuxName[Sex],
					},

					{
						name: "Couleur primaire cheveux",
						customColorPanel: HairColoursPanel,
						onColorPanel: (e: any) => {
							CharCust[24] = e;
							Skin.setSkin(PlayerPedId(), CharCust);
						},
					},

					{
						name: "Couleur secondaire cheveux",
						customColorPanel: HairColoursPanel,
						onColorPanel: (e: any) => {
							CharCust[25] = e;
							Skin.setSkin(PlayerPedId(), CharCust);
						},
					},

					{
						name: "Barbe",
						onSlide: (e: any) => {
							CharCust[26] = e;
							Skin.setSkin(PlayerPedId(), CharCust);
						},
						slider: BarbeName,
					},

					{
						name: "Opacité Barbe",
						onPourcentage: (e: any) => {
							CharCust[27] = e / 10;
							Skin.setSkin(PlayerPedId(), CharCust);
						},
					},

					{
						name: "Couleur primaire barbe",
						customColorPanel: HairColoursPanel,
						onColorPanel: (e: any) => {
							CharCust[28] = e;
							Skin.setSkin(PlayerPedId(), CharCust);
						},
					},

					{
						name: "Couleur secondaire barbe",
						customColorPanel: HairColoursPanel,
						onColorPanel: (e: any) => {
							CharCust[29] = e;
							Skin.setSkin(PlayerPedId(), CharCust);
						},
					},

					{
						name: "Rides",
						onSlide: (e: any) => {
							CharCust[30] = e;
							Skin.setSkin(PlayerPedId(), CharCust);
						},
						slider: RidesName,
					},

					{
						name: "Opacité rides",
						onPourcentage: (e: any) => {
							CharCust[31] = e / 10;
							Skin.setSkin(PlayerPedId(), CharCust);
						},
					},

					{
						name: "Rouge à levres",
						onSlide: (e: any) => {
							CharCust[32] = e;
							Skin.setSkin(PlayerPedId(), CharCust);
						},
						slider: Lipstick,
					},

					{
						name: "Opacité rouge à levres",
						onPourcentage: (e: any) => {
							CharCust[33] = e / 100;
							Skin.setSkin(PlayerPedId(), CharCust);
						},
					},

					{
						name: "Couleur primaire rouge à levres",
						onColorPanel: (e: any) => {
							CharCust[34] = e;
							Skin.setSkin(PlayerPedId(), CharCust);
						},
					},

					{
						name: "Couleur secondaire rouge à levres",
						onColorPanel: (e: any) => {
							CharCust[35] = e;
							Skin.setSkin(PlayerPedId(), CharCust);
						},
					},

					{
						name: "Maquillage",
						onSlide: (e: any) => {
							CharCust[36] = e;
							Skin.setSkin(PlayerPedId(), CharCust);
						},
						slider: MaquillageList,
					},

					{
						name: "Opacité maquillage",
						onPourcentage: (e: any) => {
							CharCust[37] = e / 100;
							Skin.setSkin(PlayerPedId(), CharCust);
						},
					},

					{
						name: "Couleur primaire maquillage",
						onColorPanel: (e: any) => {
							CharCust[38] = e;
							Skin.setSkin(PlayerPedId(), CharCust);
						},
					},

					{
						name: "Couleur secondaire maquillage",
						onColorPanel: (e: any) => {
							CharCust[39] = e;
							Skin.setSkin(PlayerPedId(), CharCust);
						},
					},

					{
						name: "Yeux",
						onSlide: (e: any) => {
							CharCust[40] = e;
							Skin.setSkin(PlayerPedId(), CharCust);
						},
						slider: EyesList,
					},

					{
						name: "Imperfections",
						onSlide: (e: any) => {
							CharCust[41] = e;
							Skin.setSkin(PlayerPedId(), CharCust);
						},
						slider: tachList,
					},

					{
						name: "Opacité imperfections",
						onPourcentage: (e: any) => {
							CharCust[42] = e / 100;
							Skin.setSkin(PlayerPedId(), CharCust);
						},
					},

					{
						name: "Complexions",
						onSlide: (e: any) => {
							CharCust[43] = e;
							Skin.setSkin(PlayerPedId(), CharCust);
						},
						slider: ComplexionsList,
					},

					{
						name: "Aspect de la peau",
						onSlide: (e: any) => {
							CharCust[44] = e;
							Skin.setSkin(PlayerPedId(), CharCust);
						},
						slider: SkinList,
					},

					{
						name: "Opacité aspect de la peau",
						onPourcentage: (e: any) => {
							CharCust[45] = e / 100;
							Skin.setSkin(PlayerPedId(), CharCust);
						},
					},

					{
						name: "Taches de rousseur",
						onSlide: (e: any) => {
							CharCust[46] = e;
							Skin.setSkin(PlayerPedId(), CharCust);
						},
						slider: MoleList,
					},

					{
						name: "Opacité taches de rousseur",
						onPourcentage: (e: any) => {
							CharCust[47] = e / 100;
							Skin.setSkin(PlayerPedId(), CharCust);
						},
					},
				],
			},
		},
	});
};
