import { Game, Model, Vector3, VehicleSeat, World, Player, BlipSprite, BlipColor, Ped, Control } from "@wdesgardin/fivem-js";
import { KeyboardInput, TriggerServerCallbackAsync } from "./utils";
import { Vec3 } from "@wdesgardin/fivem-js/lib/utils/Vector3";
import { Delay } from "../../shared/utils/utils";
import { InstructionalButtons } from "../misc/instructional-buttons";
import { Clothes } from "../player/clothes";
import { Notifications } from "../player/notifications";
import { Blip } from "../core/blips";

export class Admin {
	private static tickHandle: number;

	private static adminModeEnable = false;
	public static get isAdminModeEnable() {
		return this.adminModeEnable;
	}

	public static showGamerTags = false;
	private static gamerTags: { [id: number]: number } = {};

	private static activeAdmins: number[] = [];

	private static blips: { [id: string]: Blip } = {};
	private static blipsEnable = false;
	public static get areBlipsEnable() {
		return this.blipsEnable;
	}

	public static async initialize() {
		onNet("gm:admin:goto", (coords: Vec3) => (Game.PlayerPed.Position = Vector3.create(coords)));
		onNet("gm:admin:kill", () => Game.PlayerPed.kill());
		onNet("gm:admin:msg", (message: string) => Notifications.ShowWarning("~y~Admin~w~~n~" + message));
		onNet("gm:admin:activeAdmins", (admins: number[]) => (this.activeAdmins = admins));
		onNet("gm:admin:warn", (message: string) => Notifications.ShowWarning("~y~Admin - Avertissement~w~~n~" + message));
		onNet("gm:admin:blips", (players: { [id: string]: any }) => this.UpdateBlips(players));

		console.log("[GM][Framework] | [Module] - Admin Initialized");
	}

	public static ToggleAdminMode() {
		this.adminModeEnable = !this.adminModeEnable;

		emitNet("gm:admin:status", this.adminModeEnable);

		if (this.tickHandle) clearTick(this.tickHandle);

		if (this.adminModeEnable) {
			this.tickHandle = setTick(async () => await this.Tick());
			Clothes.putAdminClothes();
			Notifications.ShowSuccess("Mode admin ~g~activé");
		} else {
			Game.PlayerPed.IsInvincible = false;
			Game.PlayerPed.IsVisible = true;
			Game.PlayerPed.IsCollisionEnabled = true;
			this.showGamerTags = false;
			this.ClearGamerTags();
			Clothes.putClothes();
			Spectate.stop();
			Notifications.ShowSuccess("Mode admin ~g~désactivé", "");
			if (this.blipsEnable) this.DisableBlips();
		}
	}

	private static async Tick() {
		await Delay(250);

		if (!this.showGamerTags) {
			this.ClearGamerTags();
			return;
		}

		const activePlayers = GetActivePlayers() as number[];

		for (const playerId of activePlayers.filter(id => id != PlayerId())) {
			const player = new Player(playerId);

			if (player.Character.Position.distance(Game.PlayerPed.Position) < 250) {
				this.gamerTags[playerId] = CreateFakeMpGamerTag(
					player.Character.Handle,
					`[${GetPlayerServerId(playerId)}] ${GetPlayerName(playerId)}`,
					false,
					false,
					"",
					0
				);
				SetMpGamerTagAlpha(this.gamerTags[playerId], 4, 255);
				SetMpGamerTagAlpha(this.gamerTags[playerId], 2, 255);

				if (this.activeAdmins.includes(GetPlayerServerId(playerId))) {
					SetMpGamerTagColour(this.gamerTags[playerId], 0, 6);
				}

				SetMpGamerTagVisibility(this.gamerTags[playerId], 4, NetworkIsPlayerTalking(playerId));
			}
		}
	}

	private static ClearGamerTags() {
		for (const tag of Object.values(this.gamerTags)) {
			RemoveMpGamerTag(tag);
		}
	}

	public static EnableBlips() {
		emitNet("gm:admin:enableBlips");
		this.blipsEnable = true;
	}

	public static DisableBlips() {
		emitNet("gm:admin:disableBlips");
		this.blipsEnable = false;

		for (const blip of Object.values(this.blips)) {
			blip.delete();
		}

		this.blips = {};
	}

	private static UpdateBlips(players: { [id: string]: any }) {
		{
			const myServerId = GetPlayerServerId(PlayerId());

			for (const player of Object.values(players)) {
				if (player.id == myServerId) continue;

				//si le blip existe déjà màj de la pos..
				if (!!this.blips[player.id]) {
					this.blips[player.id].Position = Vector3.fromArray(player.coords);
				} else {
					const blip = Blip.create(Vector3.fromArray(player.coords));
					blip.Sprite = BlipSprite.Player;
					blip.Scale = 0.75;
					blip.Color = BlipColor.Green;
					blip.IsShortRange = true;
					blip.Name = player.name;
					this.blips[player.id] = blip;
				}
			}

			//supression des blips pour les joueurs qui ne sont plus dans la liste = déco
			for (const [id, blip] of Object.entries(this.blips)) {
				if (!players[id]) {
					blip.delete();
					delete this.blips[id];
				}
			}
		}
	}

	public static TpWaypoint() {
		const WaypointHandle = GetFirstBlipInfoId(8);
		if (DoesBlipExist(WaypointHandle)) {
			const [x, y, z]: any = Citizen.invokeNative("0xFA7C7F0AADF25D09", WaypointHandle, Citizen.resultAsVector());
			Game.PlayerPed.PositionNoOffset = new Vector3(x, y, -199.5);
		} else {
			Notifications.ShowError("Vous devez créer un marqueur pour vous télèporter.");
		}
	}

	public static async Ban(playerId: number) {
		const duration = await KeyboardInput("Durée du ban (-1 pour permanent, 2d pour 2 jours, 12h pour 12heures...)", 20);
		if (!duration) {
			Notifications.ShowError("Durée invalide");
			return;
		}
		const reason = await KeyboardInput("Motif du ban", 256);
		if (!reason) {
			Notifications.ShowError("Motif invalide");
			return;
		}

		await this.BanFor(playerId, duration, reason);
	}

	public static async BanFor(playerId: number, duration: string, reason: string) {
		ExecuteCommand(`ban ${playerId} ${duration} ${reason}`);
		Notifications.Show(`Vous avez banni le joueur ${duration == "-1" ? "définitivement" : duration} pour le motif: ${reason}`);
	}

	public static async SendPrivateMessage(playerId: number) {
		const message = await KeyboardInput("Envoyer un message - Joueur id " + playerId, 256);
		if (!message) {
			Notifications.ShowError("Message invalide");
		} else {
			emitNet("gm:admin:msg", playerId, message);
			Notifications.Show(`Message envoyé au joueur ${playerId}`);
		}
	}

	public static async SendWarning(playerId: number) {
		const message = await KeyboardInput("Raison de l'avertissement - Joueur id " + playerId, 256);
		if (!message) {
			Notifications.ShowError("Message invalide");
		} else {
			ExecuteCommand(`warn ${playerId} ${message}`);
			Notifications.ShowSuccess(`Avertissement envoyé au joueur ${playerId}`);
		}
	}

	public static async SetTrollerBucket(playerId: number) {
		emitNet("gm:admin:setTrollerBucket", playerId);
	}

	public static async SpawnVehicle() {
		const modelName = await KeyboardInput("Nom du véhicule", 25);
		const model = new Model(modelName);
		if (!model.IsValid || !model.IsVehicle) {
			Notifications.ShowError(`Le véhicule ${modelName} n'existe pas`);
			return;
		}

		const vehicle = await World.createVehicle(model, Game.PlayerPed.Position, Game.PlayerPed.Heading);
		if (!vehicle) return;
		Game.PlayerPed.setIntoVehicle(vehicle, VehicleSeat.Driver);
	}

	public static FixCurrentVehicle() {
		const vehicle = Game.PlayerPed.CurrentVehicle;
		if (vehicle?.exists()) {
			SetVehicleFixed(vehicle.Handle);
			SetVehicleDeformationFixed(vehicle.Handle);
			SetVehicleUndriveable(vehicle.Handle, false);
			Notifications.ShowSuccess(`Vous avez ~g~réparé~w~ votre véhicule`);
		} else {
			Notifications.ShowError("Vous n'êtes pas dans un véhicule");
		}
	}

	public static async FixClosestVehiclePosition() {
		const player = PlayerPedId();
		const [px, py, pz] = GetEntityCoords(player, false);
		const carTargetDep = GetClosestVehicle(px, py, pz, 10.0, 0, 70);
		const [xx, xy, xz] = GetEntityCoords(PlayerPedId(), false);
		SetEntityCoords(carTargetDep, xx, xy + 2, xz, false, false, false, false);
	}

	public static async CustomCurrentVehicle() {
		const currentVehicle = Game.PlayerPed.CurrentVehicle;
		if (!currentVehicle?.exists()) {
			Notifications.ShowError("Vous n'êtes pas dans un véhicule.");
			return;
		}

		const vehicle = currentVehicle.Handle;
		SetVehicleModKit(vehicle, 0);
		SetVehicleMod(vehicle, 14, 0, true);
		SetVehicleNumberPlateTextIndex(vehicle, 5);
		ToggleVehicleMod(vehicle, 18, true);
		SetVehicleColours(vehicle, 0, 0);
		SetVehicleCustomPrimaryColour(vehicle, 0, 0, 0);
		SetVehicleModColor_2(vehicle, 5, 0);
		SetVehicleExtraColours(vehicle, 111, 111);
		SetVehicleWindowTint(vehicle, 2);
		ToggleVehicleMod(vehicle, 22, true);
		SetVehicleMod(vehicle, 23, 11, false);
		SetVehicleMod(vehicle, 24, 11, false);
		SetVehicleWheelType(vehicle, 12);
		SetVehicleWindowTint(vehicle, 3);
		ToggleVehicleMod(vehicle, 20, true);
		SetVehicleTyreSmokeColor(vehicle, 0, 0, 0);
		LowerConvertibleRoof(vehicle, true);
		SetVehicleIsStolen(vehicle, false);
		SetVehicleIsWanted(vehicle, false);
		SetVehicleHasBeenOwnedByPlayer(vehicle, true);
		SetVehicleNeedsToBeHotwired(vehicle, false);
		SetCanResprayVehicle(vehicle, true);
		SetPlayersLastVehicle(vehicle);
		SetVehicleFixed(vehicle);
		SetVehicleDeformationFixed(vehicle);
		SetVehicleTyresCanBurst(vehicle, false);
		SetVehicleWheelsCanBreak(vehicle, false);
		SetVehicleCanBeTargetted(vehicle, false);
		SetVehicleExplodesOnHighExplosionDamage(vehicle, false);
		SetVehicleHasStrongAxles(vehicle, true);
		SetVehicleDirtLevel(vehicle, 0);
		SetVehicleCanBeVisiblyDamaged(vehicle, false);
		IsVehicleDriveable(vehicle, true);
		SetVehicleEngineOn(vehicle, true, true, false);
		SetVehicleStrong(vehicle, true);
		RollDownWindow(vehicle, 0);
		RollDownWindow(vehicle, 1);
		SetVehicleNeonLightEnabled(vehicle, 0, true);
		SetVehicleNeonLightEnabled(vehicle, 1, true);
		SetVehicleNeonLightEnabled(vehicle, 2, true);
		SetVehicleNeonLightEnabled(vehicle, 3, true);
		SetVehicleNeonLightsColour(vehicle, 0, 0, 255);

		Notifications.ShowSuccess(`Vous avez amélioré votre véhicule.`);
	}
}

export abstract class Spectate {
	private static previousPos?: Vector3;
	private static target: number;
	private static tick: number;

	public static async Start(target: number) {
		if (!this.previousPos) this.previousPos = Game.PlayerPed.Position;
		this.target = +target;

		Game.PlayerPed.IsCollisionEnabled = false;
		Game.PlayerPed.IsPositionFrozen = true;
		Game.PlayerPed.IsVisible = false;

		emitNet("gm:inst:joinPlayer", target);

		const coords = await TriggerServerCallbackAsync("gm:admin:getPlayerCoords", this.target);
		Game.PlayerPed.Position = coords;

		if (!!this.tick) return;

		this.tick = setTick(() => {
			const targetPed = new Ped(GetPlayerPed(GetPlayerFromServerId(this.target)));
			if (targetPed?.exists()) {
				Game.PlayerPed.Position = targetPed.Position;
			}

			Game.disableControlThisFrame(0, 57);
			if (Game.isDisabledControlJustPressed(0, 57)) {
				this.stop();
			}
		});

		this.setInstructionalButtons(true);
	}

	private static setInstructionalButtons(enable: boolean) {
		InstructionalButtons.setButton("Quitter le mode spectateur", 57, enable);
	}

	public static stop() {
		clearTick(this.tick);
		this.tick = 0;

		emitNet("gm:inst:leave");

		if (!!this.previousPos) {
			Game.PlayerPed.Position = this.previousPos;
			this.previousPos = undefined;
		}

		Game.PlayerPed.IsCollisionEnabled = true;
		Game.PlayerPed.IsPositionFrozen = false;
		Game.PlayerPed.IsVisible = true;

		this.setInstructionalButtons(false);
	}
}

export abstract class NoClip {
	private static Tick = 0;
	private static noClipSpeed = 2;

	public static async Start() {
		this.setInstructionalButtons(true);

		this.Tick = setTick(async () => {
			Game.disableControlThisFrame(0, 57);
			if (Game.isDisabledControlJustPressed(0, 57)) {
				clearTick(this.Tick);
				this.SetPedProperties(false);
				this.setInstructionalButtons(false);
				return;
			}

			HideHudComponentThisFrame(19);
			this.SetPedProperties(true);
			this.ProcessMovements();
		});
	}

	private static GetCamDirection() {
		const heading = GetGameplayCamRelativeHeading() + GetEntityHeading(PlayerPedId());
		const pitch = GetGameplayCamRelativePitch();
		let coords = new Vector3(
			-Math.sin((heading * Math.PI) / 180.0),
			Math.cos((heading * Math.PI) / 180.0),
			Math.sin((pitch * Math.PI) / 180.0)
		);
		const len = Math.sqrt(coords.x * coords.x + coords.y * coords.y + coords.z * coords.z);

		if (len) coords = Vector3.divide(coords, len);

		return coords;
	}

	private static SetPedProperties(enable: boolean) {
		Game.PlayerPed.IsPositionFrozen = enable;
		Game.PlayerPed.IsInvincible = enable;
		Game.PlayerPed.IsVisible = !enable;
		Game.PlayerPed.IsCollisionEnabled = !enable;
		SetEveryoneIgnorePlayer(Game.PlayerPed.Handle, enable);
		SetPoliceIgnorePlayer(Game.PlayerPed.Handle, enable);
	}

	private static setInstructionalButtons(enable: boolean) {
		InstructionalButtons.setButton("Accélérer", 208, enable);
		InstructionalButtons.setButton("Ralentir", 207, enable);
		InstructionalButtons.setButton("Déplacements", Control.MoveUpDown, enable);
		InstructionalButtons.setButton("Désactiver NoClip", 56, enable);
	}

	private static ProcessMovements() {
		Game.PlayerPed.Velocity = Vector3.create(0);

		let pCoords = Game.PlayerPed.Position;
		const camCoords = this.GetCamDirection();

		if (Game.isControlPressed(0, 32)) {
			pCoords = Vector3.add(pCoords, camCoords.multiply(this.noClipSpeed));
		}

		if (Game.isControlPressed(0, 269)) {
			pCoords = Vector3.subtract(pCoords, camCoords.multiply(this.noClipSpeed));
		}

		if (Game.isControlPressed(1, 208)) {
			this.noClipSpeed += 0.1;
		}

		if (Game.isControlPressed(1, 207)) {
			this.noClipSpeed = Math.max(0, this.noClipSpeed - 0.5);
		}

		Game.PlayerPed.PositionNoOffset = pCoords;
	}
}
