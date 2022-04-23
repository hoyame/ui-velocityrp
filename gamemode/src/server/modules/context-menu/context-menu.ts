import { Environnment } from "../../../shared/utils/environnment";
import { RegisterServerCallback, TriggerClientCallbackAsync } from "../../core/utils";

export class InteractMenu {
	public static Initialize() {
		onNet("gm:toggleCuff", (targetId: number) => {
			emitNet("gm:toggleCuffTarget", targetId);
		});

		RegisterServerCallback("gm:hasPlayerHandsUp", async (_: number, target: any) => {
			return await TriggerClientCallbackAsync("gm:hasHandsUpTarget", target);
		});

		onNet("gm:putMask", (targetId: number) => {
			emitNet("gm:putMaskTarget", targetId);
		});

		onNet("gm:putIntoVehicle", (targetId: number) => {
			emitNet("gm:putIntoVehicleTarget", targetId);
		});

		onNet("gm:outOfVehicle", (targetId: number) => {
			emitNet("gm:outOfVehicleTarget", targetId);
		});

		onNet("gm:carry", (targetId: number, carrying: boolean) => {
			emitNet("gm:carryTarget", targetId, carrying, source);
		});

		onNet("gm:dragAttach", (targetId: number) => emitNet("gm:dragAttach", targetId, source));
		onNet("gm:dragDettach", (targetId: number) => emitNet("gm:dragDettach", targetId, source));

		if (Environnment.IsDev) {
			RegisterCommand("cuff", (source: string, targetId: number) => emitNet("gm:toggleCuffTarget", targetId), true);
		}

		console.log("[GM][Framework] | ContextMenu Initialized");
	}
}
