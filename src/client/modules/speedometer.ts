import { Game, Player, VehicleSeat } from "@wdesgardin/fivem-js";
import { Nui } from "../core/nui";
import { Delay } from "../core/utils";

export abstract class Speedometer {
	private static cache = { vehicleHandle: 0, maxSpeed: 0, fuelCapacity: 0 };
	private static uiVisible = true;

	public static async initialize() {
		setTick(async () => {
			const vehicle = Game.PlayerPed.CurrentVehicle;

			if (!vehicle?.exists() || vehicle.getPedOnSeat(VehicleSeat.Driver).Handle != Game.PlayerPed.Handle) {
				if (this.uiVisible) {
					this.uiVisible = false;
					Nui.SendMessage({ type: "speedometer" });
				}

				await Delay(5000);
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