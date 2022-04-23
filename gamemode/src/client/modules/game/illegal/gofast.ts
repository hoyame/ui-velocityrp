import { Blip, BlipColor, BlipSprite, Control, Game, Vector3, Vehicle, VehicleLockStatus } from "@nativewrappers/client";
import { InteractionPoints } from "../../../misc/interaction-points";
import Config from "../../../../shared/config/activity/gofast.json";
import { ShowHelpNotification } from "../../../core/utils";
import { Vec3 } from "@nativewrappers/client/lib/utils/Vector3";
import { Streaming } from "../../../utils/streaming";
import { Utils } from "../../../utils/utils";
import { Environnment } from "../../../../shared/utils/environnment";
import { Delay } from "../../../../shared/utils/utils";
import { Notifications } from "../../../player/notifications";

const screen = {
	baseX: 0.918,
	baseY: 0.984,
	offsetX: 0.018,
	offsetY: -0.0165,
	timerBarWidth: 0.165,
	timerBarHeight: 0.035,
};

export abstract class GoFast {
	private static currentMission?: {
		timerEnd: number;
		pos: Vec3;
		blip: Blip;
		inMissionCar: boolean;
		vehicle: Vehicle;
		timeout?: NodeJS.Timeout;
	};
	private static currentTickHandle: number;

	public static async initialize() {
		this.addPoints();

		onNet("gm:gofast:begin", this.onMissionReceived.bind(this));
		onNet("gm:gofast:reward", this.gofastReward.bind(this));

		if (Environnment.IsDev) {
			RegisterCommand("tpgofast", this.enterStartIpl.bind(this), false);
			RegisterCommand("startgofast", this.beginMission.bind(this), false);
		}
	}

	private static addPoints() {
		InteractionPoints.createPoint({
			position: Vector3.create(Config.enterIpl),
			action: this.enterStartIpl.bind(this),
			helpText: "Appuyez sur ~INPUT_CONTEXT~ pour ~b~rentrer",
			marker: true,
		});
		InteractionPoints.createPoint({
			position: Vector3.create(Config.exitIpl),
			action: this.exitStartIpl.bind(this),
			helpText: "Appuyez sur ~INPUT_CONTEXT~ pour ~b~sortir",
			marker: true,
		});

		InteractionPoints.createPoint({
			position: Vector3.create(Config.beginMission),
			action: this.beginMission.bind(this),
			helpText: "Appuyez sur ~INPUT_CONTEXT~ pour ~b~commencer la mission",
			ped: { model: "a_m_m_eastsa_01" },
		});
	}

	private static enterStartIpl() {
		Game.PlayerPed.Position = Vector3.create(Config.exitIpl);
	}

	private static exitStartIpl() {
		Game.PlayerPed.Position = Vector3.create(Config.enterIpl);
	}

	private static beginMission() {
		emitNet("gm:gofast:begin");
	}

	private static async onMissionReceived(pos: Vec3) {
		//shouldn't happen, but who knows...
		this.clearMission();

		const vehPos = Config.vehicleSpawn[Math.randomRange(0, Config.vehicleSpawn.length - 1)];
		const model = Config.vehicleModels[Math.randomRange(0, Config.vehicleModels.length - 1)];

		await Streaming.RequestModelAsync(GetHashKey(model));
		const vehicle = new Vehicle(CreateVehicle(GetHashKey(model), vehPos.x, vehPos.y, vehPos.z, 0, true, false));
		await Delay(200);
		if (!vehicle?.exists()) {
			this.onMissionReceived(pos);
			return;
		}
		vehicle.NumberPlate = "";

		this.currentMission = {
			pos,
			vehicle,
			blip: this.createMissionBlip(vehicle.Position),
			timerEnd: GetGameTimer() + 10 * 60 * 1000,
			inMissionCar: false,
		};

		await Streaming.RequestTextureDictionnaryAsync("timerbars");
		this.currentTickHandle = setTick(this.missionTick.bind(this));

		Notifications.Show("Votre véhicule vous attend à la ~b~position sur votre GPS");
	}

	private static missionTick() {
		if (!this.currentMission || this.currentMission.timerEnd < GetGameTimer()) {
			this.clearMission();
			Notifications.ShowWarning("Echec de la mission~n~ Vous n'avez pas livré le colis à temps");
			return;
		}

		if (!this.currentMission.inMissionCar && Game.PlayerPed.isInVehicle(this.currentMission.vehicle)) {
			this.currentMission.blip.delete();
			this.currentMission.blip = this.createMissionBlip(this.currentMission.pos);
			this.currentMission.timeout = setTimeout(this.notifyLspd.bind(this), 90000);

			this.currentMission.inMissionCar = true;

			Notifications.Show("Ramenez le véhicule à la ~b~position sur votre GPS");
		}

		this.drawMissionHUD();

		if (Game.PlayerPed.Position.distance(this.currentMission.pos) < 4) {
			ShowHelpNotification("Appuyez sur ~INPUT_PICKUP~ pour ~b~effectuer la livraison");
			Game.disableControlThisFrame(0, Control.Pickup);
			if (Game.isDisabledControlJustPressed(0, Control.Pickup)) {
				if (!Game.PlayerPed.isInAnyVehicle() || !Game.PlayerPed.isInVehicle(this.currentMission.vehicle)) {
					Notifications.ShowError("~r~Livraision impossible~n~~w~Vous n'avez pas ramené le bon véhicule");
				} else {
					emitNet("gm:gofast:reward");
				}
			}
		}
	}

	private static createMissionBlip(pos: Vec3) {
		const blip = new Blip(AddBlipForCoord(pos.x, pos.y, pos.z));
		blip.Sprite = BlipSprite.Standard;
		blip.Scale = 0.85;
		blip.Color = BlipColor.Red;
		PulseBlip(blip.Handle);
		SetBlipRoute(blip.Handle, true);
		return blip;
	}

	private static drawMissionHUD() {
		if (!this.currentMission) return;
		HideHudComponentThisFrame(6);
		HideHudComponentThisFrame(7);
		HideHudComponentThisFrame(8);
		HideHudComponentThisFrame(9);

		const safeZone = GetSafeZoneSize();
		const safeZoneX = (1.0 - safeZone) * 0.5;
		const safeZoneY = (1.0 - safeZone) * 0.5;

		DrawSprite(
			"timerbars",
			"all_black_bg",
			screen.baseX - safeZoneX,
			screen.baseY - safeZoneY,
			screen.timerBarWidth,
			screen.timerBarHeight,
			0.0,
			255,
			255,
			255,
			160
		);

		const remaining = Math.max(0, this.currentMission?.timerEnd - GetGameTimer());

		Utils.DrawText2(
			`Temps restant: ${Math.floor(remaining / 60000)}:${Math.floor((remaining % 60000) / 1000)
				.toString()
				.padStart(2, "0")}`,
			screen.baseX - safeZoneX + screen.offsetX,
			screen.baseY - safeZoneY + screen.offsetY,
			0.425,
			0,
			[255, 255, 255, 255],
			2,
			0
		);
	}

	private static notifyLspd() {
		if (!this.currentMission) return;
		emitNet("gm:gofast:notifyLsdp");
	}

	private static clearMission() {
		if (!!this.currentTickHandle) clearTick(this.currentTickHandle);
		this.currentTickHandle = 0;
		SetStreamedTextureDictAsNoLongerNeeded("timerbars");

		if (!!this.currentMission?.timeout) clearTimeout(this.currentMission.timeout);

		if (this.currentMission?.vehicle?.exists()) {
			this.currentMission.vehicle.EngineHealth = -4000;
			this.currentMission.vehicle.LockStatus = VehicleLockStatus.Locked;
			this.currentMission?.vehicle.markAsNoLongerNeeded();
		}

		this.currentMission?.blip?.delete?.();
		this.currentMission = undefined;
	}

	private static gofastReward(money: string) {
		this.clearMission();

		if (Game.PlayerPed.isInAnyVehicle()) {
			//@ts-ignore
			Game.PlayerPed.CurrentVehicle.Doors.getDoors(5).open();
			//@ts-ignore
			Game.PlayerPed.CurrentVehicle.Doors.getDoors(0).open();
			TaskLeaveAnyVehicle(Game.PlayerPed.Handle, 0, 0);
		}

		Notifications.ShowSuccess(`Livraison effectuée !~w~ Vous avez gagné ~g~${money}$`, "money");
	}
}
