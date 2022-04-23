import { KeyboardInput } from "../../../core/utils";
import { Money } from "../../../player/money";
import { CoraUI } from "../../../core/coraui";

export const OpenBankMenu = async (data: any) => {
	let Banque: any = [];
	let btn: any = [];
	const money = await Money.getMoney();

	CoraUI.openMenu({
		name: "Banque",
		subtitle: "Menu Personnel",
		glare: true,
		onOpen: () => FreezeEntityPosition(PlayerPedId(), true),
		onClose: () => FreezeEntityPosition(PlayerPedId(), false),
		buttons: [
			{
				name: "Retirer",
				backgroundColor: [3, 132, 252],
				rightText: "~g~" + money + " $",
			},

			{
				name: "Retirer",
				rightText: ">",
				onClick: async () => {
					const n = await KeyboardInput("Montant à retirer", 25);
					Money.retrait(parseInt(n));
					CoraUI.closeMenu();
				},
			},

			{
				name: "Deposer",
				rightText: ">",
				onClick: async () => {
					const n = await KeyboardInput("Montant à deposer", 25);
					Money.deposer(parseInt(n));
					CoraUI.closeMenu();
				},
			},
		],

		submenus: {
			retirer: {
				name: "Banque",
				subtitle: "Menu Personnel",
				glare: true,
				buttons: [],
			},

			transfert: {
				name: "Banque",
				subtitle: "Menu Personnel",
				glare: true,
				buttons: [],
			},
		},
	});
};
