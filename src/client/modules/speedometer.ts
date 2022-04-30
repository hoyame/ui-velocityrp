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

				await Delay(1000);
				return;
			}

			this.uiVisible = true;

			if (this.cache.vehicleHandle != vehicle.Handle) {
				const estimatedMeterSecond = GetVehicleEstimatedMaxSpeed(vehicle.Handle) || 55;

				this.cache = {
					vehicleHandle: vehicle.Handle,
					fuelCapacity: 100,
					maxSpeed: Math.ceil(estimatedMeterSecond * 3.6),
				};
			}

			Nui.SendMessage({
				type: "speedometer",
				data: {
					speed: vehicle.IsEngineRunning ? Math.ceil(vehicle.Speed * 3.6) : 0,
					maxSpeed: this.cache.maxSpeed,
					turnRight: vehicle.IsRightIndicatorLightOn,
					turnLeft: vehicle.IsLeftIndicatorLightOn,
					fuel: Math.ceil((vehicle.FuelLevel * 100) / this.cache.fuelCapacity),
				},
			});

			await Delay(40);
		});

		// setTick(async () => {
		// 	const vehicle = Game.PlayerPed.CurrentVehicle;
		// 	if (!vehicle?.exists()) await Delay(1000);

		// });

		console.log("[GM] | [Module] - Speedometer Initialized");
	}
}