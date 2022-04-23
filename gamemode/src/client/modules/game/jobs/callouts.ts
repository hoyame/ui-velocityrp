import { BlipSprite, Game } from "@nativewrappers/client";
import { Blip } from "../../../core/blips";
import { Vector3 } from "@nativewrappers/client/lib/utils/Vector3";
import { Callout } from "../../../../shared/types/callouts";
import { Delay } from "../../../../shared/utils/utils";
import { ICMenu } from "../../../core/coraui";
import { Jobs } from "../../../player/jobs";
import { Notifications } from "../../../player/notifications";

export abstract class Callouts {
	private static callouts: { time: number; callout: Callout; takenBy: string[] }[] = [];
	private static blip?: Blip;

	public static async initialize() {
		onNet("gm:jobs:addCallout", this.addCallout.bind(this));
		onNet("gm:jobs:calloutTaken", this.calloutTaken.bind(this));
		setTick(this.keyHandlerTick.bind(this));
		setTick(this.blipHandler.bind(this));
	}

	private static async addCallout(callout: Callout) {
		const streetName = GetStreetNameFromHashKey(GetStreetNameAtCoord(callout.position.x, callout.position.y, callout.position.z)[0]);
		const pos = Game.PlayerPed.Position;
		const travelDistance = CalculateTravelDistanceBetweenPoints(
			pos.x,
			pos.y,
			pos.z,
			callout.position.x,
			callout.position.y,
			callout.position.z
		);
		const message = `~b~Identité: ~w~${callout.senderName}~n~~b~Localistation:~w~~n~${streetName} (${travelDistance}m)~n~~b~Infos:~w~~n~${callout.infos}`;

		Notifications.ShowAdvanced(
			message + "~n~~n~Appuyez sur ~b~Y~w~ pour ~b~prendre l'appel",
			"~b~Centrale",
			"~b~" + callout.title,
			"call"
		);

		this.callouts = [{ time: GetGameTimer(), callout, takenBy: [] }, ...this.callouts];
		while (this.callouts.length > 30) {
			this.callouts.pop();
		}
	}

	private static keyHandlerTick() {
		if (Game.isControlJustPressed(0, 246)) {
			const lastCallout = this.callouts[this.callouts.length - 1];
			if (lastCallout?.time + 10000 > GetGameTimer()) {
				this.takeCallout(lastCallout.callout);
			}
		}
	}

	public static takeCallout(callout: Callout) {
		if (this.blip?.exists()) this.blip.delete();

		this.blip = Blip.create(Vector3.create(callout.position));
		this.blip.Sprite = BlipSprite.PoliceArea;
		this.blip.Scale = 0.2;
		this.blip.Name = callout.title;
		this.blip.IsShortRange = true;
		this.blip.ShowRoute = true;

		const jobId = Jobs.getJob()?.id;
		if (!!jobId) emitNet("gm:jobs:takeCallout", jobId, callout.sender, callout.id);
	}

	public static getCalloutSubmenu(): ICMenu {
		return {
			name: "Callouts",
			subtitle: "Historique des appels",
			glare: true,
			buttons: this.callouts.map(callout => ({
				name: callout.callout.title,
				rightText: () => `${Math.round((GetGameTimer() - callout.time) / 60000)} min`,
				description: () =>
					callout.callout.infos +
					(callout.takenBy.length > 0 ? `~n~~g~Pris par: ${callout.takenBy.join(", ")}` : "~n~~r~L'appel n'a pas été pris"),
				onClick: () => Callouts.takeCallout(callout.callout),
			})),
		};
	}

	private static async blipHandler() {
		if (!this.blip?.exists()) {
			await Delay(2000);
			return;
		}

		if (Game.PlayerPed.Position.distance(this.blip.Position) < 20) {
			this.blip.delete();
			this.blip = undefined;
		}

		await Delay(100);
	}

	private static calloutTaken(calloutId: string, name: string) {
		console.log("taken", calloutId, name);
		Notifications.Show("L'appel vient d'être pris ~n~par ~b~" + name, "call");
		const callout = this.callouts.find(callout => callout.callout.id === calloutId);
		if (!!callout && !callout.takenBy.includes(name)) callout.takenBy.push(name);
	}
}
