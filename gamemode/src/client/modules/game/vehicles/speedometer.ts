import { Game, Player, VehicleSeat } from "@wdesgardin/fivem-js";
import { Fuel } from "./fuel";
import Config from "../../../../shared/config/client.json";
import { Nui } from "../../../utils/nui";
import { Delay } from "../../../../shared/utils/utils";

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
					fuelCapacity: Fuel.GetVehicleFuelCapacity(vehicle),
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

		setTick(async () => {
			const vehicle = Game.PlayerPed.CurrentVehicle;
			if (!vehicle?.exists()) await Delay(1000);

			if (
				IsControlJustPressed(1, Config.touches.vehicleLeftIndicator) &&
				vehicle?.exists() &&
				vehicle.getPedOnSeat(VehicleSeat.Driver).Handle == Game.PlayerPed.Handle
			) {
				vehicle.IsLeftIndicatorLightOn = !vehicle.IsLeftIndicatorLightOn;
			}

			if (
				IsControlJustPressed(1, Config.touches.vehicleRightIndicator) &&
				vehicle?.exists() &&
				vehicle.getPedOnSeat(VehicleSeat.Driver).Handle == Game.PlayerPed.Handle
			) {
				vehicle.IsRightIndicatorLightOn = !vehicle.IsRightIndicatorLightOn;
			}
		});

		console.log("[GM] | [Module] - Speedometer Initialized");
	}
}
