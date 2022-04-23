import { Character } from "../../../player/character";
import { Vehicules } from "../../../player/vehicules";
import { CoraUI } from "../../../core/coraui";
import { TriggerServerCallbackAsync } from "../../../core/utils";
import { IVehicle } from "../../../../shared/types/vehicules";
import { Keys } from "../vehicles/keys";

export const OpenGarageMenu = async () => {
	const vehicules = (await TriggerServerCallbackAsync("gm:vehicle:get")) as IVehicle[];
	const buttons = vehicules
		.filter(v => !v.isOut && !v.privateGarageId)
		.map(v => ({
			name: "~b~" + v.name + "~s~ - " + v.plate,
			rightText: ">",
			onClick: () => {
				Vehicules.useVehicule(v.plate);
				Keys.giveKey(v.plate);
				CoraUI.closeMenu();
			},
		}));

	CoraUI.openMenu({
		name: "Garage",
		subtitle: "Menu Personnel",
		glare: true,
		onOpen: () => FreezeEntityPosition(PlayerPedId(), true),
		onClose: () => FreezeEntityPosition(PlayerPedId(), false),
		buttons: buttons,
	});
};

export const OpenFourriereMenu = async () => {
	//TODO
	const vehicules = (await TriggerServerCallbackAsync("gm:vehicle:get")) as IVehicle[];

	const buttons = vehicules
		.filter(v => v.isOut && !v.privateGarageId)
		.map(v => ({
			name: "~b~" + v.name + "~s~ - " + v.plate,
			rightText: ">",
			onClick: () => {
				Vehicules.useVehicule(v.plate);
				Keys.giveKey(v.plate);
				CoraUI.closeMenu();
			},
		}));

	CoraUI.openMenu({
		name: "Fourriere",
		subtitle: "Menu Personnel",
		onOpen: () => FreezeEntityPosition(PlayerPedId(), true),
		onClose: () => FreezeEntityPosition(PlayerPedId(), false),
		glare: true,
		buttons: buttons,
	});
};
