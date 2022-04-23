import { Vec3, Vector3 } from "@wdesgardin/fivem-js/lib/utils/Vector3";
import { CharactersController } from "../../player/charactersController";
import { SendErrorNotification, SendNotification } from "../../utils/notifications";
import Config from "../../../shared/config/activity/gofast.json";
import { Jobs } from "../jobs";
import { NotificationType } from "../../../shared/types/notifications";

export abstract class GoFast {
	private static onGoingGoFast: { [playerId: string]: { coords: Vec3; end: number; lspdNotified: boolean } } = {};

	public static async initialize() {
		onNet("gm:gofast:begin", this.beginGoFast.bind(this));
		onNet("gm:gofast:reward", this.goFastReward.bind(this));
		onNet("gm:gofast:notifyLsdp", this.notifyLsdp.bind(this));
	}

	private static beginGoFast() {
		if (!!this.onGoingGoFast[source] && this.onGoingGoFast[source].end > GetGameTimer()) {
			SendErrorNotification(source, "~r~Action impossible.~w~ Vous avez déjà une mission en cours");
			return;
		}

		const coords = Config.destinations[Math.randomRange(0, Config.destinations.length - 1)];
		this.onGoingGoFast[source] = {
			coords,
			end: GetGameTimer() + 10 * 60 * 1000 + 5000,
			lspdNotified: false,
		};
		emitNet("gm:gofast:begin", source, coords);
	}

	private static goFastReward() {
		const character = CharactersController.getCharacter(source);
		const vehicle = GetVehiclePedIsIn(GetPlayerPed(source), false);

		if (
			!character ||
			!this.onGoingGoFast[source] ||
			this.onGoingGoFast[source]?.end < GetGameTimer() ||
			!vehicle ||
			Vector3.distance2d(Vector3.fromArray(GetEntityCoords(GetPlayerPed(source))), this.onGoingGoFast[source].coords) > 10
		)
			return;

		const reward = Math.max(200, GetVehicleBodyHealth(vehicle) / 2 + GetVehicleEngineHealth(vehicle) / 2);
		character.giveSaleMoney(reward);
		emitNet("gm:gofast:reward", source, reward);

		delete this.onGoingGoFast[source];
	}

	private static notifyLsdp() {
		if (!this.onGoingGoFast[source] || this.onGoingGoFast[source].lspdNotified) return;
		this.onGoingGoFast[source].lspdNotified = true;

		const pos = Vector3.fromArray(GetEntityCoords(GetPlayerPed(source)));
		Jobs.SendLspdCallout("Un véhicule sans plaque d'immatriculation roule dangereusement !", pos);

		SendNotification(source, "Quelqu'un a signalé votre position à la ~b~police !", "call", NotificationType.Warning);
	}
}
