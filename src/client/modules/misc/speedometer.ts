import { Game, Player, VehicleSeat } from "@wdesgardin/fivem-js";
import { Delay } from "../../../shared/utils/utils";
import { Nui } from "../../core/nui";

export abstract class Speedometer {
	private static uiVisible = true;

	public static async initialize() {
		setTick(async () => {
			const vehicle = Game.PlayerPed.CurrentVehicle;

			if (!vehicle?.exists() || vehicle.getPedOnSeat(VehicleSeat.Driver).Handle != Game.PlayerPed.Handle) {
				if (this.uiVisible) {
					this.uiVisible = false;
					Nui.SendMessage({ type: "speedometer" });
				}

				await Delay(1000);
				return;
			}

			this.uiVisible = true;

			Nui.SendMessage({
				type: "speedometer",
				data: {
					speed: vehicle.IsEngineRunning ? Math.ceil(vehicle.Speed * 3.6) : 0,
					gear: GetVehicleCurrentGear(vehicle.Handle),
				},
			});

			await Delay(40);
		});

		console.log("[GM] | [Module] - Speedometer Initialized");
	}
}