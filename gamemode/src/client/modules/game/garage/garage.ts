import { ShowHelpNotification } from "../../../core/utils";
import Config from "../../../../shared/config/world/garages.json";
import { Vehicules } from "../../../player/vehicules";
import { OpenFourriereMenu, OpenGarageMenu } from "./menu";

export abstract class Garage {
	private static MenuOpen = false;

	public static initialize() {
		console.log("v");

		const marker = setTick(() => {
			Config.map((v1: any, k1: any) => {
				v1["positions"].map((v: any, k: any) => {
					if (v1["marker"][0] == true) {
						DrawMarker(
							v1["marker"][1],
							v["x"],
							v["y"],
							v["z"],
							0.0,
							0.0,
							0.0,
							0.0,
							0.0,
							0.0,
							0.75,
							0.75,
							0.75,
							0,
							v1["marker"][2][0],
							v1["marker"][2][1],
							v1["marker"][2][2],
							false,
							true,
							2,
							false,
							// @ts-ignore
							false,
							false,
							false
						);
					}
				});
			});
		});

		const tick = setTick(() => {
			Config[0].positions.forEach(v => {
				const [px, py, pz] = GetEntityCoords(PlayerPedId(), false);

				if (GetDistanceBetweenCoords(px, py, pz, v["x"], v["y"], v["z"], true) < 2.5) {
					ShowHelpNotification(Config[0].mess);

					if (IsControlJustPressed(0, Config[0].touche)) {
						try {
							Vehicules.rangeVehicule(Vehicules.getCustoms(GetVehiclePedIsIn(PlayerPedId(), false)));
						} catch {
							console.log("nikezebi");
						}
					}
				}
			});

			Config[1].positions.forEach(async v => {
				const [px, py, pz] = GetEntityCoords(PlayerPedId(), false);

				if (GetDistanceBetweenCoords(px, py, pz, v["x"], v["y"], v["z"], true) < 2.5) {
					ShowHelpNotification(Config[1].mess);

					if (IsControlJustPressed(0, Config[1].touche)) {
						this.MenuOpen = true;
						OpenGarageMenu();
					}
				}
			});

			Config[2].positions.forEach(v => {
				const [px, py, pz] = GetEntityCoords(PlayerPedId(), false);

				if (GetDistanceBetweenCoords(px, py, pz, v["x"], v["y"], v["z"], true) < 2.5) {
					ShowHelpNotification(Config[2].mess);

					if (IsControlJustPressed(0, Config[2].touche)) {
						OpenFourriereMenu();
					}
				}
			});
		});
	}
}
