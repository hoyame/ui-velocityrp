import { BlipColor, BlipSprite, Player, Vehicle, VehicleSeat } from "@wdesgardin/fivem-js";
import { KeyboardInput, ShowHelpNotification } from "../../../core/utils";
import Config from "../../../../shared/config/fuel.json";
import { BlipsController } from "../../../misc/blips";
import { Vector3 } from "@wdesgardin/fivem-js/lib/utils/Vector3";
import { Animations } from "../../../utils/animations";
import { Money } from "../../../player/money";
import { Notifications } from "../../../player/notifications";

export abstract class Fuel {
	private static player: Player;
	private static gameTime = GetGameTimer();
	private static closestStation: any;

	public static async initialize() {
		this.player = new Player(PlayerId());

		this.CreateStationsBlips();

		setInterval(() => {
			const vehicle = this.player.Character.CurrentVehicle;
			if (!vehicle || !vehicle.IsEngineRunning || vehicle.FuelLevel <= 0) return;
			if (vehicle.getPedOnSeat(VehicleSeat.Driver).Handle != this.player.Character.Handle) return;
			if (!vehicle.Model.IsCar && !vehicle.Model.IsBike) return;

			const newTime = GetGameTimer();
			const elapsedTimeFactor = (newTime - this.gameTime) / 1000;
			this.gameTime = newTime;

			const consumedFuel =
				Math.pow(vehicle.CurrentRPM, 1.5) * Config.fuelRPMImpact +
				vehicle.Acceleration * Config.accelerationImpact +
				vehicle.MaxTraction * Config.tractionImpact;

			vehicle.FuelLevel = Math.max(0, vehicle.FuelLevel - consumedFuel * elapsedTimeFactor);
		}, 1000);

		setInterval(() => (this.closestStation = this.GetClosestStation(this.player.Character.Position)), 1000);

		setTick(async () => {
			if (!this.closestStation || !this.IsNearPump(this.player.Character.Position, this.closestStation)) return;

			if (IsControlJustPressed(0, 38)) {
				const pos = this.player.Character.Position;
				const vehicle = new Vehicle(GetClosestVehicle(pos.x, pos.y, pos.z, 6, 0, 71));
				if (!vehicle.exists()) {
					Notifications.ShowError("Impossible de faire le plein. Vous être trop loin du véhicule");
					return;
				}

				const capacity = this.GetVehicleFuelCapacity(vehicle);
				const maxQuantity = Math.ceil(capacity - vehicle.FuelLevel);

				const inputQty = await KeyboardInput(`Faire le plein (Maximum: ${maxQuantity}L, ${Config.fuelPrice}$/L)`, maxQuantity);
				const quantity = Number(inputQty);
				if (!quantity || quantity < 1 || quantity > maxQuantity) {
					Notifications.ShowError("Impossible de faire le plein. La quantité est invalide.");
					return;
				}

				const toPay = quantity * Config.fuelPrice;
				if (!(await Money.pay(toPay))) return;

				await Animations.PlaySimple(
					"weapon@w_sp_jerrycan",
					"fire_intro",
					Math.max(quantity * Config.refuelAnimMsPerLiter, 5000),
					50
				);
				Notifications.ShowSuccess(`Vous avez fait le plein pour ${quantity * Config.fuelPrice}$`, "money");
				await Animations.PlaySimple(
					"weapon@w_sp_jerrycan",
					"fire_outro",
					GetAnimDuration("weapon@w_sp_jerrycan", "fire_outro") * 1000,
					50
				);
				vehicle.FuelLevel = Math.min(capacity, vehicle.FuelLevel + quantity);
			} else {
				ShowHelpNotification("Appuyez sur ~INPUT_PICKUP~ pour faire le plein.");
			}
		});
	}

	private static GetClosestStation(playerPos: Vector3) {
		return Config.stations.find(station => playerPos.distance2d(station.coords) < Config.stationRadius);
	}

	private static IsNearPump(playerPos: Vector3, station: typeof Config.stations[number]) {
		return !!station.pumps.find(pump => playerPos.distance2d(pump) < Config.pumpRadius);
	}

	public static GetVehicleFuelCapacity(vehicle: Vehicle) {
		return GetVehicleHandlingFloat(vehicle.Handle, "CHandlingData", "fPetrolTankVolume");
	}

	private static CreateStationsBlips() {
		for (const station of Config.stations) {
			BlipsController.CreateBlip({
				name: "Station Essence",
				coords: station.coords,
				sprite: BlipSprite.JerryCan,
				color: BlipColor.Red,
			});
		}
	}
}
