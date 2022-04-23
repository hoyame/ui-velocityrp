import { clearInterval } from "timers";
import { LocalEvents } from "../../../../shared/utils/localEvents";
import { TriggerServerCallbackAsync } from "../../../core/utils";
import { Notifications } from "../../../player/notifications";

export abstract class Jail {
	private static timer = 0;
	private static duration = 0;
	private static reason = "Aucune raison fournie";
	private static inJail = false;
	private static timerInterval: any;
	private static saveInterval: any;

	public static async initialize() {
		emitNet("gm:jobs:police:jail:jail", this.jail.bind(this));
		emitNet("gm:jobs:police:jail:release", this.release.bind(this));

		LocalEvents.on("gm:character:spawned", async () => {
			const jail = await TriggerServerCallbackAsync("gm:jobs:police:jail:get");

			if (jail > 0) {
				this.jail(this.reason, jail);
			}
		});
	}

	public static release() {
		if (!this.inJail) return;

		this.inJail = false;
		this.duration = 0;
		this.reason = "Aucune raison fournie";

		SetEntityCoords(PlayerPedId(), 1873.17, 2605.02, 45.67, false, false, false, false);
		SetEntityHeading(PlayerPedId(), 269.22);
		emitNet("gm:jobs:police:jail:sync", -1);

		Notifications.Show("Vous êtes plus en prison.");
	}

	private static jail(reason: string, duration: number) {
		if (this.inJail) return;

		this.inJail = true;
		this.reason = reason ? reason : "Aucune raison fournie";
		SetEntityCoords(PlayerPedId(), 1641.6458, 2529.501, 45.56, false, false, false, false);
		emitNet("gm:jobs:police:jail:sync", this.duration);

		Notifications.Show("Vous êtes en prison pendant " + duration + " minutes.");

		this.timerInterval = setInterval(() => {
			this.duration--;
			if (this.duration <= 0) {
				this.release();
				clearInterval(this.timerInterval);
			}
		}, 60000);

		this.saveInterval = setInterval(() => {
			emitNet("gm:jobs:police:jail:sync", this.duration);
		}, 400000);
	}
}
