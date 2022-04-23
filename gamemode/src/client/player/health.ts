import { Alignment, Color, Control, Font, Game, Point, Screen, Text, Vector3 } from "@wdesgardin/fivem-js";
import { Environnment } from "../../shared/utils/environnment";
import { LocalEvents } from "../../shared/utils/localEvents";
import { Delay } from "../../shared/utils/utils";
import { TriggerServerCallbackAsync } from "../core/utils";
import { Character } from "./character";
import { Needs } from "./needs";
import { Notifications } from "./notifications";

export abstract class Health {
	private static dead = false;
	private static deadTickHandle: number;
	private static nextCall = 0;

	static async initialize() {
		onNet("gm:revive", this.Resurect.bind(this));
		onNet("gm:heal", this.Heal.bind(this));
		LocalEvents.on("gm:character:spawned", this.onPlayerSpawned.bind(this));

		if (Environnment.IsDev) {
			RegisterCommand(
				"suicide",
				() => {
					Game.PlayerPed.kill();
				},
				false
			);
		}

		let knockedOut = false;
		let wait = 15;
		let count = 60;
		let hurt = false;

		setTick(() => {
			if (GetEntityHealth(PlayerPedId()) <= 159) {
				Character.setHurt();
				hurt = true;
			} else if (hurt && GetEntityHealth(PlayerPedId()) > 160) {
				Character.setNotHurt();
				hurt = false;
			}
		});

		setTick(async () => {
			await Delay(1);
			const myPed = PlayerPedId();
			if (IsPedInMeleeCombat(myPed)) {
				if (GetEntityHealth(myPed) < 115) {
					SetPlayerInvincible(PlayerId(), true);
					// @ts-ignore
					SetPedToRagdoll(myPed, 1000, 1000, 0, 0, 0, 0);
					Notifications.Show("Vous êtes ~b~KO!");
					wait = 15;
					knockedOut = true;
					SetEntityHealth(myPed, 116);
				}
			}
			if (knockedOut) {
				SetPlayerInvincible(PlayerId(), true);
				DisablePlayerFiring(PlayerId(), true);
				//@ts-ignore
				SetPedToRagdoll(myPed, 1000, 1000, 0, 0, 0, 0);
				ResetPedRagdollTimer(myPed);
				if (wait >= 0) {
					count = count - 1;
					if (count == 0) {
						count = 60;
						wait = wait - 1;
						SetEntityHealth(myPed, GetEntityHealth(myPed) + 4);
					}
				} else {
					SetPlayerInvincible(PlayerId(), false);
					knockedOut = false;
				}
			}
		});
	}

	private static onPlayerSpawned() {
		if (!!Character.getCurrent()?.alive) {
			StopScreenEffect("DeathFailOut");
		} else {
			Game.PlayerPed.kill();
		}
		setTick(this.checkPlayerHealth.bind(this));
	}

	private static async checkPlayerHealth() {
		if (!NetworkIsPlayerActive(Game.Player.Handle)) {
			await Delay(500);
			return;
		}

		if (Game.PlayerPed.isDead() && !this.dead) {
			this.dead = true;
			this.onDeath();
		} else if (Game.PlayerPed.isAlive() && this.dead) {
			this.dead = false;
		}

		await Delay(100);
	}

	private static onDeath() {
		if (!!this.deadTickHandle) clearTick(this.deadTickHandle);
		this.deadTickHandle = setTick(this.PlayerDeadTick.bind(this));
		StartScreenEffect("DeathFailOut", 0, false);
		TriggerEvent("gm:player:death");
	}

	public static Resurect(health?: number) {
		ClearPedBloodDamage(Game.PlayerPed.Handle);
		Needs.reset();
		StopScreenEffect("DeathFailOut");
		const pos = Game.PlayerPed.Position;
		NetworkResurrectLocalPlayer(pos.x, pos.y, pos.z, Game.PlayerPed.Heading, true, false);
		Game.PlayerPed.Health = health || Game.PlayerPed.MaxHealth;
	}

	private static async PlayerDeadTick() {
		if (!Game.PlayerPed.isDead()) {
			clearTick(this.deadTickHandle);
			this.deadTickHandle = 0;
			return;
		}

		const callTimeout = this.nextCall - GetGameTimer();
		new Text(
			`Appuyez sur E pour contacter une ambulance ${callTimeout > 0 ? "(" + Math.round(callTimeout / 1000) + "s)" : ""}`,
			new Point(Screen.Width * 0.5, Screen.Height * 0.8),
			0.8,
			Color.fromRgb(160, 0, 0),
			Font.ChaletComprimeCologne,
			Alignment.Centered,
			true
		).draw();

		new Text(
			"Appuyez sur X pour réapparaître à l'hopital",
			new Point(Screen.Width * 0.5, Screen.Height * 0.86),
			0.7,
			Color.fromRgb(255, 255, 255),
			Font.ChaletComprimeCologne,
			Alignment.Centered,
			true
		).draw();

		Game.disableAllControlsThisFrame(0);
		if (callTimeout <= 0 && Game.isDisabledControlJustPressed(0, Control.Pickup)) {
			if (await TriggerServerCallbackAsync("gm:jobs:emsCall")) {
				Notifications.ShowSuccess("Votre appel a ~g~envoyé~w~ au 912", "call");
				this.nextCall = GetGameTimer() + 2 * 60 * 1000;
			} else {
				Notifications.ShowError("~r~Aucun médecin~w~ n'est disponible actuellement.");
			}
		}

		if (Game.isDisabledControlJustPressed(0, Control.VehicleDuck)) {
			clearTick(this.deadTickHandle);
			this.deadTickHandle = 0;

			this.RespawnInHospital();
		}

		if (Environnment.IsDev) {
			new Text(
				"(DEV) Espace pour Revive",
				new Point(Screen.Width * 0.5, Screen.Height * 0.5),
				0.7,
				Color.fromRgb(255, 255, 0),
				Font.ChaletComprimeCologne,
				Alignment.Centered,
				true
			).draw();

			if (Game.isDisabledControlJustPressed(0, Control.Jump)) {
				this.Resurect();
			}
		}
	}

	private static async RespawnInHospital() {
		DoScreenFadeOut(500);

		Game.PlayerPed.IsVisible = false;
		await Delay(3000);
		Game.PlayerPed.Position = new Vector3(327.6, -602.5, 42.3);
		Game.PlayerPed.IsVisible = true;

		this.Resurect(Game.PlayerPed.MaxHealth - 50);

		DoScreenFadeIn(500);
	}

	private static async Heal(heal: number) {
		if (Game.PlayerPed.isAlive()) {
			SetEntityHealth(Game.PlayerPed.Handle, Math.min(200, GetEntityHealth(Game.PlayerPed.Handle) + heal));
			Notifications.Show("Vous avez été ~g~soigné");
		}
	}
}
