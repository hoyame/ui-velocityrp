import { IOrganisation } from "../../../../shared/types/organisation";
import { KeyboardInput, TriggerServerCallbackAsync } from "../../../core/utils";
import { CoraUI } from "../../../core/coraui";

async function onMoneyOpen() {
	CoraUI.CurrentMenu.buttons = [];
	const money = await TriggerServerCallbackAsync("gm:organisations:ctrl:getMoney");
	if (!money) return;

	CoraUI.CurrentMenu.buttons = [
		{ name: `Espece : ~g~${money[0]}$` },
		{ name: `Banque : ~g~${money[1]}$` },
		{ name: `Sale : ~g~${money[2]}$` },
	];
}

export const OrgaCreator = () => {
	let data: IOrganisation = {
		id: -1,
		name: "",
		members: [],
		data: {
			owner: "",
			position: [0, 0, 0],
			positionGarage: [0, 0, 0],
			positionGarageExit: [0, 0, 0],
			positionInteraction: [0, 0, 0],
		},
		inventory: [],
		money: [0, 0],
		vehicles: [],
	};

	CoraUI.openMenu({
		name: "Mode Createur",
		subtitle: "Tenues",
		glare: true,
		buttons: [
			{
				name: "Nom de l'organisation",
				onClick: async () => {
					const n = await KeyboardInput("Nom de l'organisation", 25);
					CoraUI.CurrentMenu.buttons[0].rightText = n;
					data.name = n;
				},
			},

			{
				name: "Créer",
				backgroundColor: [3, 132, 252],
				onClick: () => {
					console.log("6464");
					emitNet("gm:organisations:create", data);
					CoraUI.closeMenu();
				},
			},
		],
	});
};

export const OpenOrgMenu = () => {
	const Loock = (t: string) => {
		switch (t) {
			case "complexe":
				break;
			case "qg":
				break;
			case "bureau":
				break;
			default:
				return;
		}
	};

	CoraUI.openMenu({
		name: "Gestion Organisation",
		subtitle: "Menu Personnel",
		glare: true,
		buttons: [
			{ name: "Quartier General", onClick: () => CoraUI.openSubmenu("qg") },
			{ name: "Vehicules", onClick: () => CoraUI.openSubmenu("vehicles") },
			{ name: "Argent", onClick: () => CoraUI.openSubmenu("argent") },
		],
		submenus: {
			argent: {
				name: "Argent",
				subtitle: "Menu Personnel",
				glare: true,
				onOpen: onMoneyOpen.bind(CoraUI),
				buttons: [
					{ name: "Rafraichir" },
					{
						name: "Retirer",
						onClick: async () => {
							const n = await KeyboardInput("Montant", 25);
							CoraUI.CurrentMenu.buttons[0].rightText = n;

							emitNet("gm:organisations:ctrl:takeMoney", n);
						},
					},
				],
			},

			vehicles: {
				name: "Vehicules",
				subtitle: "Menu Personnel",
				glare: true,
				buttons: [
					{
						name: "Pack luxe",
						description: "1 500 000$ - [Adder, T20, Sultan RS]",
						onClick: () => {
							// add au garage et payer avec pessos societée
						},
					},

					{
						name: "Pack vintage",
						description: "2 500 000$ - [veh tah le vintage]",
						onClick: () => {
							// add au garage et payer avec pessos societée
						},
					},
				],
			},
		},
	});
};

RegisterCommand("gangmenu", OpenOrgMenu, false);
