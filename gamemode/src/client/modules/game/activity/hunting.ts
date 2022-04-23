import { Control, Game, Model, Notification, Vector3, WeaponHash, World } from "@nativewrappers/client";
import { Environnment } from "../../../../shared/utils/environnment";
import { Delay } from "../../../../shared/utils/utils";
import Config from "../../../../shared/config/activity/hunting.json";
import { ShowHelpNotification, TriggerServerCallbackAsync } from "../../../core/utils";
import { BlipsController } from "../../../misc/blips";
import { Animations } from "../../../utils/animations";
import { Utils } from "../../../utils/utils";
import { InteractionPoints } from "../../../misc/interaction-points";
import { Notifications } from "../../../player/notifications";

export abstract class Hunting {
	private static animalHashs = Config.animals.map(a => new Model(a.model).Hash);

	private static outZoneTimeout?: number;

	public static async initialize() {
		BlipsController.CreateBlip(Config.startPoint);
		InteractionPoints.createPoint({
			position: Vector3.create(Config.startPoint.coords),
			ped: { model: "s_m_y_armymech_01", heading: 50 },
			action: this.weaponLocation.bind(this),
			helpText: () =>
				`Appuyez sur ~INPUT_PICKUP~ pour ~b~${
					HasPedGotWeapon(Game.PlayerPed.Handle, WeaponHash.Musket, false) ? "rendre l'" : "emprunter une "
				}arme de chasse.`,
		});

		BlipsController.CreateBlip(Config.sellPoint);
		InteractionPoints.createSellPoint({
			position: Vector3.create(Config.sellPoint.coords),
			ped: { model: "s_m_m_strvend_01", heading: 132 },
			items: Config.animals.map(a => a.item),
		});

		setTick(async () => {
			const closestAnimal = this.GetClosestDeadAnimal();
			if (!closestAnimal) {
				await Delay(1000);
				return;
			}

			ShowHelpNotification("Appuyez sur ~INPUT_PICKUP~ pour récupérer la viande.");
			if (Game.isControlJustPressed(0, Control.Pickup)) {
				await Animations.PlaySimple("amb@medic@standing@kneel@base", "base", 3000, 0);

				const item = await TriggerServerCallbackAsync("gm:hunting:getmeat", closestAnimal.NetworkId);
				if (!!item) Notifications.ShowSuccess("Vous avez récupéré 1 ~g~" + item);
			}
		});

		setTick(async () => {
			if (!HasPedGotWeapon(Game.PlayerPed.Handle, WeaponHash.Musket, false)) {
				await Delay(5000);
				return;
			}

			if (!Utils.IsPointInPolygon(Game.PlayerPed.Position, Config.huntingZone)) {
				if (!this.outZoneTimeout) {
					this.outZoneTimeout = GetGameTimer() + 10000;
					Notifications.ShowWarning("Vous sortez de la zone de chasse. Votre Carabine vous sera retiré dans 10 secondes");
				} else if (GetGameTimer() > this.outZoneTimeout) {
					Game.PlayerPed.removeWeapon(WeaponHash.Musket);
					Notifications.ShowError("Vous avez perdu votre Carabine");

					this.outZoneTimeout = undefined;
					return;
				}
			} else if (!!this.outZoneTimeout) {
				this.outZoneTimeout = undefined;
				Notifications.ShowWarning("Vous êtes entré dans la zone de chasse");
			}
			await Delay(1000);
		});

		if (Environnment.IsDev) {
			RegisterCommand(
				"tpanimal",
				() => {
					const animal = World.getAllPeds()
						.filter(p => p.isAlive() && this.animalHashs.includes(p.Model.Hash))
						.sort(() => Math.random() * 100)[0];
					if (animal?.exists()) {
						Game.PlayerPed.Position = animal.Position;
						animal.IsPositionFrozen = true;
					}
				},
				false
			);
		}
	}

	private static GetClosestDeadAnimal() {
		const plyPos = Game.PlayerPed.Position;

		const deadAnimalsNearby = World.getAllPeds().filter(
			p => this.animalHashs.includes(p.Model.Hash) && p.isDead() && p.Position.absDistance2D(plyPos) < 3
		);
		if (deadAnimalsNearby.length == 0) return;

		let closest = deadAnimalsNearby[0];
		for (let i = 1; i < deadAnimalsNearby.length; i++) {
			if (deadAnimalsNearby[i].Position.absDistance2D(plyPos) < closest.Position.absDistance2D(plyPos)) {
				closest = deadAnimalsNearby[i];
			}
		}

		return closest;
	}

	private static weaponLocation() {
		const hasWeapon = HasPedGotWeapon(Game.PlayerPed.Handle, WeaponHash.Musket, false);
		if (hasWeapon) {
			emitNet("gm:hunting:returnWeapon");
		} else {
			emitNet("gm:hunting:rentWeapon");
		}
	}
}
