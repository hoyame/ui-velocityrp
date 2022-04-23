import { Animations } from "../../../utils/animations";
import { Graphics } from "../../../utils/graphics";
import { Nui } from "../../../utils/nui";
import { Raycast } from "../../../utils/raycast";
import { Utils } from "../../../utils/utils";
import {
	Control,
	Game,
	Ped,
	Screen,
	Vector3,
	Vehicle,
	VehicleClass,
	VehicleDoorIndex,
	VehicleLockStatus,
	VehicleSeat,
} from "@wdesgardin/fivem-js";
import { GetClosestPlayer, GetNearbyPlayers, RegisterClientCallback, TriggerServerCallbackAsync } from "../../../core/utils";
import { Inventory } from "../../../player/inventory";
import { Delay } from "../../../../shared/utils/utils";
import { Streaming } from "../../../utils/streaming";
import { InstructionalButtons } from "../../../misc/instructional-buttons";
import { IContextMenuItem } from "../../../../shared/types/contextmenu";
import { Environnment } from "../../../../shared/utils/environnment";
import { Notifications } from "../../../player/notifications";
import { NotificationType } from "../../../../shared/types/notifications";
import { EntityUtils } from "../../../utils/entity";

export class ContextMenuController {
	private static menuOpen = false;
	private static handsUp = false;
	private static cuffed = false;
	private static carrying = 0;
	private static beingCarried = false;
	private static dragPed?: Ped;
	private static dragAnimFinisehd = false;
	private static inTrunk: boolean;
	private static hasPushedCarControl = false;

	private static mask: {
		hasMask: boolean;
		timeoutHandle?: NodeJS.Timeout;
		tickHandle?: number;
	} = {
		hasMask: false,
	};

	static async initialize() {
		Nui.RegisterCallback("disableFocus", () => this.OnDisableFocus());
		Nui.RegisterCallback("menuClick", data => this.OnMenuClick(data));

		RegisterCommand("+handsup", this.ToggleHandsUp.bind(this), false);
		RegisterKeyMapping("+handsup", "Lever les mains", "keyboard", "X");

		on("gm:player:death", this.onPlayerDeath.bind(this));
		onNet("gm:toggleCuffTarget", () => this.ToggleCuff());
		onNet("gm:putMaskTarget", () => this.ToggleMask());
		onNet("gm:putIntoVehicleTarget", () => this.PutInVehicle());
		onNet("gm:outOfVehicleTarget", () => this.LeaveVehicle());
		onNet("gm:carryTarget", (carried: boolean, playerId: number) => this.ToggleCarried(carried, playerId));
		onNet("gm:dragAttach", this.dragAttach.bind(this));
		onNet("gm:dragDettach", this.dragDettach.bind(this));

		RegisterClientCallback("gm:hasHandsUpTarget", (cb: any) => cb(this.handsUp));

		setTick(this.Tick.bind(this));
		setTick(this.DragTick.bind(this));

		console.log("[GM][Framework] | [InteractMenu] - Initialized");
	}

	private static OnDisableFocus() {
		this.menuOpen = false;
		Nui.SetFocus(false, false, false);
	}

	private static onPlayerDeath() {
		if (!!this.carrying) this.stopCarrying();
	}

	private static async OnMenuClick(data: any) {
		const coords = Vector3.fromArray(GetEntityCoords(PlayerPedId(), true));
		const targetCoords = Vector3.fromArray(GetEntityCoords(data.targetId, true));

		// if (coords.distance2d(targetCoords) > 6) {
		// 	Notifications.ShowError("Action impossible, la cible est top loin de vous.");
		// 	return;
		// }

		switch (data.actionId) {
			case "cuff":
				await this.OnCuffClick(data.targetId);
				break;
			case "carry":
				await this.OnCarryClick(data.targetId);
				break;
			case "put-vehicle":
				this.OnPutVehicleClick(data.targetId);
				break;
			case "out-vehicle":
				this.OnOutVehicleClick(data.targetId);
				break;
			case "mask":
				this.OnMaskClick(data.targetId);
				break;
			case "search":
				this.OnSearchClick(data.targetId);
				break;
			case "drag":
				this.OnDragClick(data.targetId);
				break;
			case "in-trunk":
				this.OnTrunkClick(data.targetId);
				break;
			case "out-trunk":
				this.OnOutTrunkClick(data.targetId);
				break;
			case "anchor":
				this.OnAnchorClick(data.targetId);
				break;
			case "pushcar":
				this.OnPushCarClick(data.targetId);
				break;
		}
	}

	private static async OnTrunkClick(target: number) {
		const vehicle = new Vehicle(target);
		if (!vehicle?.exists()) return;

		if (vehicle.LockStatus == VehicleLockStatus.Locked) {
			Notifications.ShowError("~r~Action impossible~w~~n~Ce véhicule est fermé");
			return;
		}

		if (Game.PlayerPed.Position.distance(vehicle.Position) > 5) {
			Notifications.ShowError("~r~Action impossible~w~~n~Le véhicule est trop loin");
			return;
		}

		const nearbyPlayers = GetNearbyPlayers();
		for (const player of nearbyPlayers) {
			if (player.Character.isAttachedTo(vehicle)) {
				Notifications.ShowError("~r~Action impossible~w~~n~Quelqu'un est déjà dans le coffre");
				return;
			}
		}

		if (!vehicle.Doors.hasDoor(VehicleDoorIndex.Trunk)) {
			Notifications.ShowError("~r~Action impossible~w~~n~Ce véhicule n'a pas de coffre");
			return;
		}
		const trunk = vehicle.Doors.getDoors(VehicleDoorIndex.Trunk);
		if (!trunk) return
		trunk.open();

		await Delay(350);
		AttachEntityToEntity(Game.PlayerPed.Handle, vehicle.Handle, -1, 0, -2.2, 0.5, 0, 0, 0, false, false, false, false, 20, true);
		await Animations.PlaySimple("timetable@floyd@cryingonbed@base", "base", -1, 1);
		RemoveAnimDict("timetable@floyd@cryingonbed@base");
		await Delay(50);
		trunk.close();

		this.inTrunk = true;
	}

	private static async OnOutTrunkClick(target: number) {
		const vehicle = new Vehicle(target);
		if (!vehicle?.exists()) return;

		this.inTrunk = false;
		vehicle.Doors.getDoors(VehicleDoorIndex.Trunk)?.open();
		await Delay(750);
		DetachEntity(PlayerPedId(), true, true);
		SetEntityVisible(PlayerPedId(), true, false);
		ClearPedTasks(PlayerPedId());
		Game.PlayerPed.Position = Vector3.fromArray(GetOffsetFromEntityInWorldCoords(Game.PlayerPed.Handle, 0, -2, -0.75));
		await Delay(250);
		vehicle.Doors.getDoors(VehicleDoorIndex.Trunk)?.close();
		SetEntityCollision(PlayerPedId(), true, true);
	}

	private static async OnAnchorClick(target: number) {
		const vehicle = new Vehicle(target);
		if (!vehicle.exists() || vehicle.ClassType != VehicleClass.Boats || vehicle.Position.distance(Game.PlayerPed.Position) > 8) return;

		SetBoatAnchor(vehicle.Handle, !IsBoatAnchoredAndFrozen(vehicle.Handle));
		TaskStartScenarioInPlace(Game.PlayerPed.Handle, "CODE_HUMAN_MEDIC_TEND_TO_DEAD", 0, true);
		await Delay(10000);
		Notifications.Show(
			IsBoatAnchoredAndFrozen(vehicle.Handle) ? "Vous avez ~g~ancré~w~ le bateau" : "Vous avez ~g~remonté l'ancre",
			"anchor",
			IsBoatAnchoredAndFrozen(vehicle.Handle) ? NotificationType.Success : NotificationType.Error
		);
		ClearPedTasks(Game.PlayerPed.Handle);
	}

	private static async OnCuffClick(target: number) {
		if (IsPedCuffed(target)) {
			await Animations.PlaySimple("mp_arresting", "a_uncuff", 2200, 16);
		} else {
			Animations.PlaySimple("mp_arrest_paired", "cop_p2_back_right", 3500, 16);
		}

		emitNet("gm:toggleCuff", GetPlayerServerId(NetworkGetPlayerIndexFromPed(target)));
	}

	private static OnCarryClick(target: number) {
		ClearPedTasksImmediately(PlayerPedId());

		if (!this.carrying) {
			this.startCarrying(target);
		} else {
			this.stopCarrying();
		}
	}

	private static startCarrying(target: number) {
		Animations.PlaySimple("missfinale_c2mcs_1", "fin_c2_mcs_1_camman", -1, 49);
		emitNet("gm:carry", GetPlayerServerId(NetworkGetPlayerIndexFromPed(target)), true);
		this.carrying = target;
	}

	private static stopCarrying() {
		emitNet("gm:carry", GetPlayerServerId(NetworkGetPlayerIndexFromPed(this.carrying)), false);
		this.carrying = 0;
	}

	private static OnPutVehicleClick(target: number) {
		if (IsPedInAnyVehicle(target, true)) {
			Notifications.ShowError("Action impossible, la cible se trouve déjà dans un véhicule");
			return;
		}

		const targetCoords = GetEntityCoords(target, true);
		const vehicle = GetClosestVehicle(targetCoords[0], targetCoords[1], targetCoords[2], 6, 0, 71);
		if (!DoesEntityExist(vehicle)) {
			Notifications.ShowError("Action impossible, aucun véhicule à proximité");
			return;
		}

		emitNet("gm:putIntoVehicle", GetPlayerServerId(NetworkGetPlayerIndexFromPed(target)));
	}

	private static OnOutVehicleClick(target: number) {
		if (!IsPedInAnyVehicle(target, true)) {
			Notifications.ShowError("Action impossible, la cible n'est pas dans un véhicule");
			return;
		}
		emitNet("gm:outOfVehicle", GetPlayerServerId(NetworkGetPlayerIndexFromPed(target)));
	}

	private static OnMaskClick(target: number) {
		emitNet("gm:putMask", GetPlayerServerId(NetworkGetPlayerIndexFromPed(target)));
	}

	private static async OnSearchClick(target: number) {
		await Inventory.openUi({ targetId: GetPlayerServerId(NetworkGetPlayerIndexFromPed(target)).toString() });
	}

	private static async OnDragClick(target: number) {
		this.dragPed = new Ped(target);

		await Streaming.RequestAnimDictionnaryAsync("combat@drag_ped@");

		TaskPlayAnim(Game.PlayerPed.Handle, "combat@drag_ped@", "injured_pickup_back_plyr", 2.0, 2.0, 5700, 1, 0, false, false, false);
		await Delay(5700);
		emitNet("gm:dragAttach", GetPlayerServerId(NetworkGetPlayerIndexFromPed(this.dragPed.Handle)));
		this.dragAnimFinisehd = true;

		this.setInstructionalButtons(true);

		TaskPlayAnim(Game.PlayerPed.Handle, "combat@drag_ped@", "injured_drag_plyr", 2.0, 2.0, -1, 1, 0, false, false, false);
	}

	private static async DragTick() {
		if (!this.dragPed || !this.dragAnimFinisehd) {
			await Delay(1000);
			return;
		}
	}

	private static async OnPushCarClick(target: number) {
		const veh = new Vehicle(target);
		if (!veh?.exists() || !IsThisModelACar(veh.Model.Hash) || !veh.isSeatFree(VehicleSeat.Driver)) return;

		const attachedPlayer = GetNearbyPlayers().filter(p => IsEntityAttachedToEntity(p.Character.Handle, veh.Handle));
		if (attachedPlayer.length > 1) {
			Notifications.ShowError("~r~Action impossible~w~ 2 autres personnes poussent déjà ce véhicule");
			return;
		}

		const inFront =
			Game.PlayerPed.Position.distance(veh.Position.add(Vector3.fromArray(GetEntityForwardVector(veh.Handle)))) <
			Game.PlayerPed.Position.distance(veh.Position.add(Vector3.fromArray(GetEntityForwardVector(veh.Handle)).multiply(-1)));

		const pos1 = new Vector3(-0.5, inFront ? veh.Model.Dimensions.y / 2 + 0.1 : (veh.Model.Dimensions.y / 2 + +0.1) * -1, 0.3);
		const pos2 = new Vector3(0.5, inFront ? veh.Model.Dimensions.y / 2 + 0.1 : (veh.Model.Dimensions.y / 2 + +0.1) * -1, 0.3);

		const pos =
			attachedPlayer.length == 1 &&
			attachedPlayer[0].Character.Position.distance(veh.Position.add(pos1)) <
				attachedPlayer[0].Character.Position.distance(veh.Position.add(pos2))
				? pos2
				: pos1;

		AttachEntityToEntity(
			Game.PlayerPed.Handle,
			veh.Handle,
			0,
			pos.x,
			pos.y,
			pos.z,
			0.0,
			0.0,
			inFront ? 180 : 0,
			false,
			false,
			false,
			true,
			0,
			true
		);

		await Streaming.RequestAnimDictionnaryAsync("missfinale_c2ig_11");
		TaskPlayAnim(Game.PlayerPed.Handle, "missfinale_c2ig_11", "pushcar_offcliff_m", 2.0, -8.0, -1, 35, 0, false, false, false);
		await Delay(200);

		await EntityUtils.RequestNetworkControlAsync(veh);

		InstructionalButtons.setButton("Déplacements", Control.MoveLeftRight, true);
		InstructionalButtons.setButton("Arrêter de pousser", Control.Pickup, true);

		const tick = setTick(async () => {
			if (Game.isControlPressed(0, Control.Pickup) || !veh?.exists()) {
				InstructionalButtons.setButton("Déplacements", Control.MoveLeftRight, false);
				InstructionalButtons.setButton("Arrêter de pousser", Control.Pickup, false);
				Game.PlayerPed.detach();
				ClearPedTasks(Game.PlayerPed.Handle);
				clearTick(tick);
				return;
			}

			if (veh?.LockStatus == VehicleLockStatus.Locked) {
				Screen.displayHelpTextThisFrame("Le véhicule est verouillé. Vous ne pouvez pas le pousser");
				return;
			}

			const attachedPlayer = GetNearbyPlayers().find(p => IsEntityAttachedToEntity(p.Character.Handle, veh.Handle));
			if (!attachedPlayer) {
				Screen.displayHelpTextThisFrame("Vous devez être 2 pour pousser le véhicule");
				InstructionalButtons.setButton("Déplacements", Control.MoveLeftRight, false);
				return;
			}

			await Delay(5);

			if (NetworkHasControlOfEntity(veh.Handle)) {
				SetVehicleForwardSpeed(veh.Handle, inFront ? -1 : 1);

				if (IsDisabledControlPressed(0, Control.MoveLeftOnly)) {
					TaskVehicleTempAction(Game.PlayerPed.Handle, veh.Handle, 11, 1000);
				}

				if (IsDisabledControlPressed(0, Control.MoveRightOnly)) {
					TaskVehicleTempAction(Game.PlayerPed.Handle, veh.Handle, 10, 1000);
				}

				if (HasEntityCollidedWithAnything(veh.Handle)) {
					SetVehicleOnGroundProperly(veh.Handle);
				}

				InstructionalButtons.setButton("Déplacements", Control.MoveLeftRight, true);
			} else {
				InstructionalButtons.setButton("Déplacements", Control.MoveLeftRight, false);
			}
		});

		if (Game.isControlPressed(0, Control.MoveRightOnly)) {
			Game.PlayerPed.Heading += 0.5;
		} else if (Game.isControlPressed(0, Control.MoveLeftOnly)) {
			Game.PlayerPed.Heading -= 0.5;
		} else if (Game.isControlJustPressed(0, Control.Detonate)) {
			await Streaming.RequestAnimDictionnaryAsync("combat@drag_ped@");
			TaskPlayAnim(Game.PlayerPed.Handle, "combat@drag_ped@", "injured_putdown_plyr", 2.0, 2.0, 5500, 1, 0, false, false, false);

			if (!!this.dragPed) emitNet("gm:dragDettach", GetPlayerServerId(NetworkGetPlayerIndexFromPed(this.dragPed.Handle)));

			this.dragAnimFinisehd = false;
			this.dragPed = undefined;
			this.setInstructionalButtons(false);
		}
	}

	private static ToggleCuff() {
		this.cuffed = !this.cuffed;

		ClearPedTasksImmediately(PlayerPedId());
		SetEnableHandcuffs(PlayerPedId(), this.cuffed);

		if (this.cuffed) {
			this.handsUp = false;
			SetCurrentPedWeapon(PlayerPedId(), GetHashKey("WEAPON_UNARMED"), true);
			Animations.PlaySimple("mp_arresting", "idle", -1, 50);
		}
	}

	private static ToggleMask() {
		this.mask.hasMask = !this.mask.hasMask;
		if (this.mask.timeoutHandle) clearTimeout(this.mask.timeoutHandle);
		if (this.mask.tickHandle) clearTick(this.mask.tickHandle);

		const ped = PlayerPedId();
		if (this.mask.hasMask) {
			SetPedComponentVariation(ped, 1, 69, 1, 2);

			this.mask.tickHandle = setTick(() => {
				HideHudAndRadarThisFrame();
				DrawRect(0.0, 0.0, 2.0, 2.0, 0, 0, 0, 255);
				SetPauseMenuActive(false);
				Graphics.DrawText(0.5, 0.5, 0.8, 4, "Vous avez un sac sur la tête.");
			});

			this.mask.timeoutHandle = setTimeout(
				() => {
					if (this.mask.tickHandle) clearTick(this.mask.tickHandle);
					this.mask = { hasMask: false };
					SetPedComponentVariation(ped, 1, 0, 0, 0);
				},
				Environnment.IsDev ? 5000 : 7 * 60 * 1000
			);
		} else {
			SetPedComponentVariation(ped, 1, 0, 0, 0);
		}
	}

	private static PutInVehicle() {
		const playerPed = PlayerPedId();
		const coords = GetEntityCoords(playerPed, true);

		const vehicle = GetClosestVehicle(coords[0], coords[1], coords[2], 6, 0, 71);
		if (!DoesEntityExist(vehicle)) return;

		let seat = GetVehicleMaxNumberOfPassengers(vehicle);

		while (seat >= 0) {
			if (IsVehicleSeatFree(vehicle, seat)) {
				TaskWarpPedIntoVehicle(playerPed, vehicle, seat);
				return;
			}
			seat--;
		}
	}

	private static LeaveVehicle() {
		TaskLeaveAnyVehicle(PlayerPedId(), 0, 0);
	}

	private static ToggleCarried(carried: boolean, playerId: number) {
		this.beingCarried = carried;
		ClearPedTasksImmediately(PlayerPedId());
		if (this.beingCarried) {
			const targetPed = GetPlayerPed(GetPlayerFromServerId(playerId));
			AttachEntityToEntity(PlayerPedId(), targetPed, 0, 0.27, 0.15, 0.63, 0.5, 0.5, 180, false, false, false, false, 2, false);
			Animations.PlaySimple("nm", "firemans_carry", -1, 33);
		} else {
			DetachEntity(PlayerPedId(), true, false);
			Animations.PlaySimple("mp_arresting", "idle", -1, 50);
		}
	}

	private static Tick() {
		if (IsControlJustPressed(0, 25)) {
			this.OnMenuKey();
		}

		if (this.cuffed) {
			DisableControlAction(0, 25, true);
			DisableControlAction(1, 140, true);
			DisableControlAction(1, 141, true);
			DisableControlAction(1, 142, true);
			DisableControlAction(0, 75, true);
			DisableControlAction(0, 23, true);
			SetPedPathCanUseLadders(PlayerPedId(), false);
			if (IsPedInAnyVehicle(PlayerPedId(), false)) DisableControlAction(0, 59, true);
		}

		if (this.menuOpen) {
			DisableControlAction(0, 1, true);
			DisableControlAction(0, 2, true);
			DisableControlAction(0, 4, true);
			DisableControlAction(0, 5, true);
		}

		if (this.inTrunk && !Game.PlayerPed.getEntityAttachedTo()?.exists()) {
			DetachEntity(PlayerPedId(), true, true);
			SetEntityVisible(PlayerPedId(), true, false);
			ClearPedTasks(PlayerPedId());
			Game.PlayerPed.Position = Vector3.fromArray(GetOffsetFromEntityInWorldCoords(Game.PlayerPed.Handle, 0, -0.5, -0.75));
			SetEntityCollision(PlayerPedId(), true, true);
		}

		if (this.cuffed || this.menuOpen || this.handsUp) {
			DisablePlayerFiring(Game.Player.Handle, true);
		}

		if (this.carrying) {
			Game.disableControlThisFrame(0, Control.Enter);
		}
	}

	private static async OnMenuKey() {
		if (this.carrying) {
			this.ShowMenu(this.carrying, [{ title: "Déposer", actionId: "carry" }]);
			return;
		}

		if (this.inTrunk) {
			const vehicle = Game.PlayerPed.getEntityAttachedTo();
			if (vehicle?.exists()) {
				this.ShowMenu(vehicle.Handle, [{ title: "Sortir du véhicule", actionId: "out-trunk", overrideIcon: "trunk" }]);
				return;
			}
		}

		const target = this.getTarget();
		if (
			!DoesEntityExist(target) ||
			GetEntityType(target) == 3 ||
			(GetEntityType(target) == 1 && (target == Game.PlayerPed.Handle || !IsPedAPlayer(target)))
		)
			return;

		const items: IContextMenuItem[] = [];
		//player ped
		if (GetEntityType(target) == 1) {
			if (IsPedDeadOrDying(target, true)) {
				items.push({ title: "Tirer", actionId: "drag", overrideIcon: "carry" });
			} else if (IsPedCuffed(target)) {
				if (IsPedInAnyVehicle(target, true)) {
					items.push({ title: "Sortir du véhicule", actionId: "out-vehicle", overrideIcon: "vehicle" });
				} else {
					items.push({ title: "Démenotter", actionId: "cuff" });
					items.push({ title: "Fouiller", actionId: "search" });
					items.push({ title: "Porter", actionId: "carry" });
					items.push({ title: "Mettre dans le véhicule", actionId: "put-vehicle", overrideIcon: "vehicle" });
					items.push({ title: "Mettre un masque", actionId: "mask" });
				}
			} else {
				const targetHasHandsUp = await TriggerServerCallbackAsync(
					"gm:hasPlayerHandsUp",
					GetPlayerServerId(NetworkGetPlayerIndexFromPed(target))
				);
				if (targetHasHandsUp) items.push({ title: "Menotter", actionId: "cuff" });
			}
		} else if (GetEntityType(target) == 2) {
			const veh = new Vehicle(target);
			if (!veh.exists()) return;

			if (!Game.PlayerPed.CurrentVehicle && veh?.Doors.hasDoor(VehicleDoorIndex.Trunk) && veh.LockStatus != VehicleLockStatus.Locked)
				items.push({ title: "Monter dans le coffre", actionId: "in-trunk", overrideIcon: "trunk" });

			if (!Game.PlayerPed.CurrentVehicle && veh.ClassType == VehicleClass.Boats) {
				items.push({ title: IsBoatAnchoredAndFrozen(veh.Handle) ? "Remonter l'ancre" : "Ancrer", actionId: "anchor" });
			}

			if (!Game.PlayerPed.CurrentVehicle && veh.isSeatFree(VehicleSeat.Driver) && IsThisModelACar(veh.Model.Hash)) {
				items.push({ title: "Pousser le véhicule", actionId: "pushcar" });
			}

			const [player, distance] = GetClosestPlayer();
			if (distance <= 2) {
				const ped = GetPlayerPed(GetPlayerFromServerId(player));
				if (ped != Game.PlayerPed.Handle && IsPedInVehicle(ped, target, true) && IsPedCuffed(ped)) {
					items.push({ title: "Sortir du véhicule", actionId: "out-vehicle", overrideIcon: "vehicle", overrideTarget: player });
				}
			}
		}

		if (items.length > 0) this.ShowMenu(target, items);
	}

	private static getTarget(): number {
		//TODO: use something like qtarget https://github.com/QuantusRP/qtarget, bad ux with raycast
		let target = Raycast.getTarget(PlayerPedId(), 6);
		if (!DoesEntityExist(target) || GetEntityType(target) == 0 || GetEntityType(target) > 3) {
			const [closest, distance] = GetClosestPlayer();
			if (distance <= 1) {
				target = GetPlayerPed(GetPlayerFromServerId(closest));
			}
		}
		return target;
	}

	private static async dragAttach(playerId: number) {
		const targetPed = new Ped(GetPlayerPed(GetPlayerFromServerId(playerId)));
		if (!targetPed.exists()) return;

		const coords = Game.PlayerPed.Position;
		Game.PlayerPed.PositionNoOffset = coords;
		NetworkResurrectLocalPlayer(coords.x, coords.y, coords.z, GetEntityHeading(targetPed.Handle), true, false);
		Game.PlayerPed.Heading = targetPed.Heading;

		AttachEntityToEntity(Game.PlayerPed.Handle, targetPed.Handle, 11816, 0.0, 0.5, 0.0, 0, 0, 0, false, false, true, false, 2, false);

		await Streaming.RequestAnimDictionnaryAsync("combat@drag_ped@");
		TaskPlayAnim(Game.PlayerPed.Handle, "combat@drag_ped@", "injured_pickup_back_ped", 2.0, 2.0, -1, 1, 0, false, false, false);
		await Delay(5700);
		TaskPlayAnim(Game.PlayerPed.Handle, "combat@drag_ped@", "injured_drag_ped", 2.0, 2.0, -1, 1, 0, false, false, false);
	}

	private static async dragDettach(playerId: number) {
		const targetPed = new Ped(GetPlayerPed(GetPlayerFromServerId(playerId)));
		if (!targetPed.exists()) return;

		await Streaming.RequestAnimDictionnaryAsync("combat@drag_ped@");
		TaskPlayAnim(Game.PlayerPed.Handle, "combat@drag_ped@", "injured_putdown_ped", 2.0, 2.0, 5700, 1, 0, false, false, false);

		await Delay(5700);
		Game.PlayerPed.detach();
		Game.PlayerPed.kill();
	}

	private static setInstructionalButtons(enable: boolean) {
		InstructionalButtons.setButton("Déplacements", Control.MoveLeftRight, enable);
		InstructionalButtons.setButton("Arrêter de tirer", Control.Detonate, enable);
	}

	public static ShowMenu(target: number, items: IContextMenuItem[]) {
		Nui.SetFocus(true, true, true);
		Nui.SendMessage({ action: { type: "SET_CONTEXT_MENU", payload: { target, items } }, path: "context-menu" });
		this.menuOpen = true;
	}

	private static ToggleHandsUp() {
		if (!this.handsUp && Game.PlayerPed.isInAnyVehicle()) {
			Notifications.ShowError("~r~Action impossible~w~ dans un véhicule");
			return;
		}

		this.handsUp = !this.handsUp;

		if (this.handsUp) {
			ClearPedTasksImmediately(PlayerPedId());
			Animations.PlaySimple("missminuteman_1ig_2", "handsup_enter", -1, 50);
		} else {
			ClearPedSecondaryTask(PlayerPedId());
			Utils.DisableControlForDuration(73, 500);
		}
	}
}
