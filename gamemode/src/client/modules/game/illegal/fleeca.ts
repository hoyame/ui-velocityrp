import { BlipColor, Control, Game, Model, Prop, Screen, Vector3, World } from "@wdesgardin/fivem-js";
import Config from "../../../../shared/config/activity/fleeca.json";
import { JobId } from "../../../../shared/config/jobs/jobs";
import { Delay } from "../../../../shared/utils/utils";
import { GetNearbyPlayers } from "../../../core/utils";
import { BlipsController } from "../../../misc/blips";
import { InteractionPoints } from "../../../misc/interaction-points";
import { Jobs } from "../../../player/jobs";
import { Notifications } from "../../../player/notifications";
import { EntityUtils } from "../../../utils/entity";
import { Streaming } from "../../../utils/streaming";
import { Utils } from "../../../utils/utils";

export abstract class Fleeca {
	private static availableLoots: { [bankIndex: number]: number[] } = {};
	private static disableInputs = false;
	private static doorLocked = Config.banks.map(_ => true);
	private static doorMoving = false;
	private static currentDoorInterval?: NodeJS.Timeout;

	public static async initialize() {
		onNet("gm:fleeca:openDoorAnim", this.openDoorAnim.bind(this));
		onNet("gm:fleeca:toggleDoor", this.toggleDoor.bind(this));
		onNet("gm:fleeca:toggleSecondDoor", this.toogleSecondDoor.bind(this));
		onNet("gm:fleeca:startLoot", this.startLoot.bind(this));
		onNet("gm:fleeca:updateLoots", this.updateLooots.bind(this));
		setTick(this.inputsTick.bind(this));
		await this.addInteractionPoints();
	}

	private static async addInteractionPoints() {
		for (let i = 0; i < Config.banks.length; i++) {
			const bank = Config.banks[i];

			const helpText = () => {
				if (this.doorMoving || (Jobs.getJob()?.id != JobId.LSPD && !this.doorLocked[i])) return "";
				if (Jobs.getJob()?.id != JobId.LSPD) return "Appuyez sur ~INPUT_CONTEXT~ pour ~b~démarrer~w~ le braquage";
				return `Appuyez sur ~INPUT_CONTEXT~ pour ${this.doorLocked[i] ? "~g~ouvrir" : "~r~fermer"}~w~ la porte`;
			};

			const action = () => {
				if (this.doorMoving) return;
				Jobs.getJob()?.id != JobId.LSPD
					? emitNet("gm:fleeca:startRobbery", i)
					: emitNet("gm:fleeca:policeToggleDoor", i, !this.doorLocked[i]);
			};

			await InteractionPoints.createPoint({
				action,
				helpText,
				position: Vector3.create(bank.doors.startloc),
				actionDistance: 0.5,
			});

			await InteractionPoints.createPoint({
				action: () => emitNet("gm:fleeca:openSecondDoor", i),
				helpText: "Appuyez sur ~INPUT_CONTEXT~ pour ~b~déverouiller~w~ la porte",
				position: Vector3.create(bank.doors.secondloc),
				actionDistance: 0.5,
			});

			BlipsController.CreateBlip({
				name: "Fleeca",
				coords: Vector3.create(bank.blipPos),
				sprite: 272,
				color: 25,
				scale: 1,
			});
		}
	}

	private static async openDoorAnim(bankIndex: number, isFirstDoor: boolean) {
		const bank = Config.banks[bankIndex];
		if (!bank) return;

		this.disableInputs = true;

		if (isFirstDoor) {
			this.cleanUp(bankIndex);
			setTimeout(() => this.startTimer(), 2400);
		}
		const door = isFirstDoor ? bank.doors.startloc : bank.doors.secondloc;

		Game.PlayerPed.Position = Vector3.create(door.animcoords);
		Game.PlayerPed.Heading = door.animcoords.h;
		const prop = await World.createProp(new Model("prop_cs_credit_card"), Game.PlayerPed.Position, false, true);
		if (!prop) return 

		AttachEntityToEntity(
			prop.Handle,
			Game.PlayerPed.Handle,
			GetPedBoneIndex(Game.PlayerPed.Handle, 28422),
			0.12,
			0.028,
			0.001,
			10.0,
			175.0,
			0.0,
			true,
			true,
			false,
			true,
			1,
			true
		);

		TaskStartScenarioInPlace(Game.PlayerPed.Handle, "PROP_HUMAN_ATM", 0, true);
		await Delay(1500);

		prop.detach();
		prop.markAsNoLongerNeeded();
		prop.delete();

		await Delay(500);
		ClearPedTasksImmediately(Game.PlayerPed.Handle);
		this.disableInputs = false;

		await Delay(1000);
		Notifications.ShowSuccess(`Vous avez ~g~ouvert~w~ ${isFirstDoor ? "le coffre" : "la porte"} !`);
		PlaySoundFrontend(-1, "ATM_WINDOW", "HUD_FRONTEND_DEFAULT_SOUNDSET", false);
		if (isFirstDoor) {
			Notifications.Show("Vous avez 2 minutes jusqu'a l'activation du système de sécurité.");
			await this.spawnTrolleys(bankIndex);
		}
	}

	private static async spawnTrolleys(index: number) {
		for (const pos of Config.banks[index].trolleys) {
			const trolley = await World.createProp(new Model("hei_prop_hei_cash_trolly_01"), Vector3.create(pos), false, true);
			if (!trolley) return
			trolley.Heading = trolley.Heading + pos.h;
		}

		const playersInArea = GetNearbyPlayers(25).map(p => GetPlayerServerId(p.Handle));
		TriggerServerEvent("gm:fleeca:lootReady", index, playersInArea);
	}

	private static toggleDoor(bankIndex: number, locked: boolean) {
		const bank = Config.banks[bankIndex];
		if (!bank) return;

		const door = new Prop(
			GetClosestObjectOfType(
				bank.doors.startloc.x,
				bank.doors.startloc.y,
				bank.doors.startloc.z,
				2,
				new Model("v_ilev_gb_vauldr").Hash,
				false,
				false,
				false
			)
		);

		if (!door.exists()) return;
		this.doorMoving = true;
		this.doorLocked[bankIndex] = locked;

		const targetHeading = locked ? bank.doors.startloc.h : Math.max(0, bank.doors.startloc.h - 90);
		const headingIncrease = targetHeading - door.Heading < 0 ? -0.1 : 0.1;

		if (!!this.currentDoorInterval) clearInterval(this.currentDoorInterval);
		this.currentDoorInterval = setInterval(() => {
			if (!door.exists() || Math.abs(targetHeading - door.Heading) < 1) {
				if (!!this.currentDoorInterval) clearInterval(this.currentDoorInterval);
				this.currentDoorInterval = undefined;
				this.doorMoving = false;
			}
			door.Heading += headingIncrease;
		}, 10);
	}

	private static startLoot(bankIndex: number) {
		const bank = Config.banks[bankIndex];
		if (!bank) return;

		this.availableLoots[bankIndex] = bank.trolleys.map((_, index) => index);
		const timeout = GetGameTimer() + 120000;
		const lootTick = setTick(async () => {
			if (this.availableLoots[bankIndex].length == 0 || GetGameTimer() > timeout) {
				clearTick(lootTick);
				return;
			}

			if (Game.PlayerPed.Position.distance(bank.doors.startloc) > 40) {
				await Delay(1000);
				return;
			}

			for (const index of this.availableLoots[bankIndex]) {
				if (Game.PlayerPed.Position.distance(bank.trolleys[index]) < 1.25) {
					Screen.displayHelpTextThisFrame("Appuyez sur ~INPUT_PICKUP~ pour prendre ~g~l'argent");
					if (Game.isControlJustPressed(0, Control.Pickup)) {
						this.takeMoney(bankIndex, index);
						return;
					}
				}
			}
		});
	}

	public static async takeMoney(bankIndex: number, index: number) {
		emitNet("gm:fleeca:beginLoot", bankIndex, index);
		this.disableInputs = true;

		await Streaming.RequestAnimDictionnaryAsync("anim@heists@ornate_bank@grab_cash");

		const trolley = new Prop(
			GetClosestObjectOfType(
				Game.PlayerPed.Position.x,
				Game.PlayerPed.Position.y,
				Game.PlayerPed.Position.z,
				1.0,
				GetHashKey("hei_prop_hei_cash_trolly_01"),
				false,
				false,
				false
			)
		);
		if (!trolley?.exists() || IsEntityPlayingAnim(trolley.Handle, "anim@heists@ornate_bank@grab_cash", "cart_cash_dissapear", 3))
			return;

		await EntityUtils.RequestNetworkControlAsync(trolley);
		const bag = await World.createProp(new Model("hei_p_m_bag_var22_arm_s"), Game.PlayerPed.Position, false, false);
		if (!bag) return
				
		const scene1 = NetworkCreateSynchronisedScene(
			trolley.Position.x,
			trolley.Position.y,
			trolley.Position.z,
			trolley.Rotation.x,
			trolley.Rotation.y,
			trolley.Rotation.z,
			2,
			false,
			false,
			1065353216,
			0,
			1.3
		);

		NetworkAddPedToSynchronisedScene(
			Game.PlayerPed.Handle,
			scene1,
			"anim@heists@ornate_bank@grab_cash",
			"intro",
			1.5,
			-4.0,
			1,
			16,
			1148846080,
			0
		);
		NetworkAddEntityToSynchronisedScene(bag.Handle, scene1, "anim@heists@ornate_bank@grab_cash", "bag_intro", 4.0, -8.0, 1);
		SetPedComponentVariation(Game.PlayerPed.Handle, 5, 0, 0, 0);
		NetworkStartSynchronisedScene(scene1);
		await Delay(1500);

		const grabObject = await World.createProp(new Model("hei_prop_heist_cash_pile"), Game.PlayerPed.Position, false, false);
		if (!grabObject) return
		grabObject.IsPositionFrozen = true;
		grabObject.IsInvincible = true;
		grabObject.IsVisible = false;
		Game.PlayerPed.setNoCollision(grabObject, true);
		AttachEntityToEntity(
			grabObject.Handle,
			Game.PlayerPed.Handle,
			GetPedBoneIndex(Game.PlayerPed.Handle, 60309),
			0.0,
			0.0,
			0.0,
			0.0,
			0.0,
			0.0,
			false,
			false,
			false,
			false,
			0,
			true
		);

		const interval = setInterval(() => {
			Game.disableControlThisFrame(0, 73);

			//seems strange?
			if (HasAnimEventFired(Game.PlayerPed.Handle, GetHashKey("CASH_APPEAR")) && !grabObject.IsVisible) {
				grabObject.IsVisible = true;
			}
			if (HasAnimEventFired(Game.PlayerPed.Handle, GetHashKey("RELEASE_CASH_DESTROY")) && grabObject.IsVisible) {
				grabObject.IsVisible = false;
			}
		}, 0);
		const scene2 = NetworkCreateSynchronisedScene(
			trolley.Position.x,
			trolley.Position.y,
			trolley.Position.z,
			trolley.Rotation.x,
			trolley.Rotation.y,
			trolley.Rotation.z,
			2,
			false,
			false,
			1065353216,
			0,
			1.3
		);
		NetworkAddPedToSynchronisedScene(
			Game.PlayerPed.Handle,
			scene2,
			"anim@heists@ornate_bank@grab_cash",
			"grab",
			1.5,
			-4.0,
			1,
			16,
			1148846080,
			0
		);
		NetworkAddEntityToSynchronisedScene(bag.Handle, scene2, "anim@heists@ornate_bank@grab_cash", "bag_grab", 4.0, -8.0, 1);
		NetworkAddEntityToSynchronisedScene(
			trolley.Handle,
			scene2,
			"anim@heists@ornate_bank@grab_cash",
			"cart_cash_dissapear",
			4.0,
			-8.0,
			1
		);
		NetworkStartSynchronisedScene(scene2);
		await Delay(37000);
		clearInterval(interval);
		grabObject.delete();

		const scene3 = NetworkCreateSynchronisedScene(
			trolley.Position.x,
			trolley.Position.y,
			trolley.Position.z,
			trolley.Rotation.x,
			trolley.Rotation.y,
			trolley.Rotation.z,
			2,
			false,
			false,
			1065353216,
			0,
			1.3
		);
		NetworkAddPedToSynchronisedScene(
			Game.PlayerPed.Handle,
			scene3,
			"anim@heists@ornate_bank@grab_cash",
			"exit",
			1.5,
			-4.0,
			1,
			16,
			1148846080,
			0
		);
		NetworkAddEntityToSynchronisedScene(bag.Handle, scene3, "anim@heists@ornate_bank@grab_cash", "bag_exit", 4.0, -8.0, 1);
		NetworkStartSynchronisedScene(scene3);

		TriggerServerEvent("gm:fleeca:take", bankIndex, index);

		const newTrolley = await World.createProp(
			new Model("hei_prop_hei_cash_trolly_03"),
			Vector3.add(trolley.Position, new Vector3(0.0, 0.0, -0.985)),
			false,
			false
		);
		if (!newTrolley) return
		newTrolley.Rotation = trolley.Rotation;

		await EntityUtils.RequestNetworkControlAsync(trolley);
		trolley.delete();

		PlaceObjectOnGroundProperly(newTrolley.Handle);
		await Delay(1000);

		bag.delete();
		SetPedComponentVariation(Game.PlayerPed.Handle, 5, 45, 0, 0);
		RemoveAnimDict("anim@heists@ornate_bank@grab_cash");
		bag.Model.markAsNoLongerNeeded();

		this.disableInputs = false;
	}

	private static updateLooots(bankIndex: number, index: number) {
		if (!!this.availableLoots[bankIndex]) this.availableLoots[bankIndex] = this.availableLoots[bankIndex].filter(i => i != index);
	}

	private static toogleSecondDoor(bankIndex: number, locked: boolean) {
		const bank = Config.banks[bankIndex];
		if (!bank) return;

		const door = GetClosestObjectOfType(
			bank.doors.secondloc.x,
			bank.doors.secondloc.y,
			bank.doors.secondloc.z,
			3,
			GetHashKey("v_ilev_gb_vaubar"),
			false,
			false,
			false
		);
		FreezeEntityPosition(door, locked);

		if (locked) {
			SetEntityHeading(door, bank.doors.secondloc.h);
		}
	}

	private static async cleanUp(bankIndex: number) {
		const bank = Config.banks[bankIndex];
		if (!bank) return;

		for (const trolley of bank.trolleys) {
			for (const model of [GetHashKey("hei_prop_hei_cash_trolly_01"), GetHashKey("hei_prop_hei_cash_trolly_03")]) {
				const obj = new Prop(GetClosestObjectOfType(trolley.x, trolley.y, trolley.z, 1, model, false, false, false));
				if (obj.exists()) {
					await EntityUtils.RequestNetworkControlAsync(obj);
					obj.markAsNoLongerNeeded();
					obj.delete();
				}
			}
		}
	}

	private static async inputsTick() {
		if (!this.disableInputs) {
			await Delay(250);
			return;
		}

		Game.disableControlThisFrame(0, 73);
		Game.disableControlThisFrame(0, 24);
		Game.disableControlThisFrame(0, 257);
		Game.disableControlThisFrame(0, 25);
		Game.disableControlThisFrame(0, 263);
		Game.disableControlThisFrame(0, 32);
		Game.disableControlThisFrame(0, 34);
		Game.disableControlThisFrame(0, 31);
		Game.disableControlThisFrame(0, 30);
		Game.disableControlThisFrame(0, 45);
		Game.disableControlThisFrame(0, 22);
		Game.disableControlThisFrame(0, 44);
		Game.disableControlThisFrame(0, 37);
		Game.disableControlThisFrame(0, 23);
		Game.disableControlThisFrame(0, 288);
		Game.disableControlThisFrame(0, 289);
		Game.disableControlThisFrame(0, 170);
		Game.disableControlThisFrame(0, 167);
		Game.disableControlThisFrame(0, 73);
		Game.disableControlThisFrame(2, 199);
		Game.disableControlThisFrame(0, 47);
		Game.disableControlThisFrame(0, 264);
		Game.disableControlThisFrame(0, 257);
		Game.disableControlThisFrame(0, 140);
		Game.disableControlThisFrame(0, 141);
		Game.disableControlThisFrame(0, 142);
		Game.disableControlThisFrame(0, 143);
	}

	private static startTimer() {
		const screen = {
			baseX: 0.918,
			baseY: 0.984,
			offsetX: 0.018,
			offsetY: -0.0165,
			timerBarWidth: 0.165,
			timerBarHeight: 0.035,
		};

		const end = GetGameTimer() + 120000;

		Streaming.RequestTextureDictionnaryAsync("timerbars");
		const timerTick = setTick(() => {
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

			const remaining = Math.max(0, end - GetGameTimer());
			if (remaining <= 0) {
				clearTick(timerTick);
				SetStreamedTextureDictAsNoLongerNeeded("timerbars");
				return;
			}

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
		});
	}
}
