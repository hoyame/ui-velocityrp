import { Control, Game, Notification, WeaponHash } from "@nativewrappers/client";
import { Vec3 } from "@nativewrappers/client/lib/utils/Vector3";
import { Delay } from "../../shared/utils/utils";
import { Safezones } from "../../shared/config/world/safezones";
import { LocalEvents } from "../../shared/utils/localEvents";
import { Notifications } from "../player/notifications";

export abstract class SafeZone {
	private static zoneRadius = 52;
	private static currentlyInZone = false;
	private static closestZone: Vec3;

	public static async initialize() {
		LocalEvents.on("gm:character:spawned", () => {
			this.checkClosestZone();
			setTick(this.tick.bind(this));
			setInterval(this.checkClosestZone.bind(this), 15000);
		});
	}

	private static async tick() {
		if (Game.PlayerPed.Position.distance(this.closestZone) > this.zoneRadius) {
			if (this.currentlyInZone) {
				this.currentlyInZone = false;
				NetworkSetFriendlyFireOption(true);
				Notifications.ShowWarning("Tu n'es plus dans une ~y~zone safe");
			}
			await Delay(1000);
		} else {
			if (!this.currentlyInZone) {
				this.currentlyInZone = true;
				NetworkSetFriendlyFireOption(false);
				Notifications.ShowWarning("Tu es dans une ~y~zone safe");
			}

			DisablePlayerFiring(Game.PlayerPed.Handle, true);

			Game.disableControlThisFrame(0, Control.MeleeAttackLight);
			Game.disableControlThisFrame(2, Control.SelectWeapon);
			Game.disableControlThisFrame(0, Control.VehicleMouseControlOverride);

			if (
				Game.isDisabledControlJustPressed(2, Control.SelectWeapon) ||
				Game.isDisabledControlJustPressed(0, Control.VehicleMouseControlOverride)
			) {
				SetCurrentPedWeapon(Game.PlayerPed.Handle, WeaponHash.Unarmed, true);
			}
		}
	}

	private static checkClosestZone() {
		let closest = Safezones[0];
		let distance = Game.PlayerPed.Position.distance(closest);
		let d = 0;

		for (let i = 1; i < Safezones.length; i++) {
			d = Game.PlayerPed.Position.distance(Safezones[i]);
			if (d < distance) {
				closest = Safezones[i];
				distance = d;
			}
		}

		this.closestZone = closest;
	}
}
