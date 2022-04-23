import { Game, Model, Screen, Vehicle, VehicleLockStatus, World } from "@nativewrappers/client";
import { off } from "process";
import { Delay } from "../../../../shared/utils/utils";
import { Notifications } from "../../../player/notifications";
import { Animations } from "../../../utils/animations";

export abstract class Keys {
	private static ownedVehicles: string[] = [];
	private static previousNotif: number = -1;
	private static isUsingKeys = false;

	public static async initialize() {
		RegisterCommand("+lockVehicle", this.lockVehicle.bind(this), false);
		RegisterKeyMapping("+lockVehicle", "Verrouiller/Déverrouiller un véhicule", "keyboard", "u");
	}

	public static async giveKey(plate: string) {
		if (this.ownedVehicles.find(p => p == plate)) return;
		this.ownedVehicles.push(plate);
		Notifications.Show("Tu à reçu les clés du véhicule:~b~ " + plate, "keys");
	}

	public static hasVehicleKey(vehicle: Vehicle) {
		return vehicle?.exists() && this.ownedVehicles.includes(vehicle.NumberPlate);
	}

	public static async lockVehicle() {
		if (this.isUsingKeys) return;
		this.isUsingKeys = true;

		const pos = Game.PlayerPed.Position;
		const vehicle = Game.PlayerPed.CurrentVehicle || new Vehicle(GetClosestVehicle(pos.x, pos.y, pos.z, 4, 0, 70));

		if (!vehicle?.exists()) return;
		if (Game.PlayerPed.Position.distance(vehicle.Position) > 5) {
			Notifications.ShowError("~r~Vous êtes trop loin du véhicule.", "keys");
			return;
		}
		if (!this.hasVehicleKey(vehicle)) {
			Notifications.ShowError("~r~Vous n'avez pas la clé de ce véhicule.", "keys");
			return;
		}

		if (!Game.PlayerPed.CurrentVehicle) {
			const model = new Model("p_car_keys_01");
			await model.request(1000);
			const keyProp = await World.createProp(model, Game.PlayerPed.Position, false, false);
			if (!keyProp) return
			model.markAsNoLongerNeeded();
			AttachEntityToEntity(
				keyProp.Handle,
				Game.PlayerPed.Handle,
				GetPedBoneIndex(Game.PlayerPed.Handle, 57005),
				0.09,
				0.03,
				-0.02,
				-76,
				13,
				28,
				false,
				true,
				true,
				true,
				0,
				true
			);

			setTimeout(() => {
				ClearPedTasks(Game.PlayerPed.Handle);
				keyProp.detach();
				keyProp.delete();
			}, 1000);
		}

		await Animations.PlaySimple("anim@mp_player_intmenu@key_fob@", "fob_click", -1, 0);

		const isLocked = vehicle.LockStatus === VehicleLockStatus.Locked;
		const label = GetLabelText(GetDisplayNameFromVehicleModel(vehicle.Model.Hash));
		Notifications.Hide(this.previousNotif);
		this.previousNotif = Notifications.Show(`Vous avez ~b~${isLocked ? "déverrouillé" : "verrouillé"} ~w~${label}`, "keys");

		vehicle.LockStatus = isLocked ? VehicleLockStatus.Unlocked : VehicleLockStatus.Locked;

		vehicle.AreLightsOn = true;
		vehicle.soundHorn(100);
		await Delay(200);
		vehicle.AreLightsOn = false;
		await Delay(200);

		vehicle.AreLightsOn = true;
		vehicle.soundHorn(100);
		await Delay(400);
		vehicle.AreLightsOn = false;

		this.isUsingKeys = false;
	}
}
