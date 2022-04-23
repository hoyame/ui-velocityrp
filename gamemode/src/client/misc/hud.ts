import { Game, Hud as GameHud, HudComponent } from "@nativewrappers/client";
import { LocalEvents } from "../../shared/utils/localEvents";
import { Nui } from "../utils/nui";

export abstract class Hud {
	private static hudVisible = false;
	private static notificationsVisible = false;
	private static hasSpawned = false;

	public static async initialize() {
		setTick(this.hideDefaultHuds.bind(this));
		setInterval(this.interval.bind(this), 100);
		LocalEvents.on("gm:character:spawned", () => (this.hasSpawned = true));
	}

	private static hideDefaultHuds() {
		GameHud.hideComponentThisFrame(HudComponent.MpCash);
		GameHud.hideComponentThisFrame(HudComponent.CashChange);
		GameHud.hideComponentThisFrame(HudComponent.Cash);
	}

	private static interval() {
		const hudVisible = this.hasSpawned && !IsPauseMenuActive() && Game.PlayerPed.isAlive();
		const notificationsVisible = !IsPauseMenuActive();

		if (hudVisible != this.hudVisible || notificationsVisible != this.notificationsVisible) {
			this.hudVisible = hudVisible;
			this.notificationsVisible = notificationsVisible;
			Nui.SendMessage({ action: { type: "SET_HUD", payload: { visible: hudVisible, notificationsVisible } } });
		}
	}
}
