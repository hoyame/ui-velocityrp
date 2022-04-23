import { Vector3 } from "@wdesgardin/fivem-js";
import { Delay } from "../../../../shared/utils/utils";
import { ShowHelpNotification } from "../../../core/utils";
import { Notifications } from "../../../player/notifications";
import { Police } from "./police";

interface Action {
	type: string;
	coords: Vector3;
}

export abstract class Tig {
	private static sentenced = false;
	private static disable_actions = false;
	private static actionsRemaining = 0;
	private static prisonerCoords = new Vector3(170.43, -990.7, 30.09);
	private static releaseCoords = new Vector3(427.33, -979.51, 30.2);

	private static availableActions: Action[] = [
		{ type: "cleaning", coords: Vector3.create({ x: 170.0, y: -1006.0, z: 29.34 }) },
		{ type: "cleaning", coords: Vector3.create({ x: 177.0, y: -1007.94, z: 29.33 }) },
		{ type: "cleaning", coords: Vector3.create({ x: 181.58, y: -1009.46, z: 29.34 }) },
		{ type: "cleaning", coords: Vector3.create({ x: 189.33, y: -1009.48, z: 29.34 }) },
		{ type: "cleaning", coords: Vector3.create({ x: 195.31, y: -1016.0, z: 29.34 }) },
		{ type: "cleaning", coords: Vector3.create({ x: 169.97, y: -1001.29, z: 29.34 }) },
		{ type: "cleaning", coords: Vector3.create({ x: 164.74, y: -1008.0, z: 29.43 }) },
		{ type: "cleaning", coords: Vector3.create({ x: 163.28, y: -1000.55, z: 29.35 }) },
		{ type: "gardening", coords: Vector3.create({ x: 181.38, y: -1000.05, z: 29.29 }) },
		{ type: "gardening", coords: Vector3.create({ x: 188.43, y: -1000.38, z: 29.29 }) },
		{ type: "gardening", coords: Vector3.create({ x: 194.81, y: -1002.0, z: 29.29 }) },
		{ type: "gardening", coords: Vector3.create({ x: 198.97, y: -1006.85, z: 29.29 }) },
		{ type: "gardening", coords: Vector3.create({ x: 201.47, y: -1004.37, z: 29.29 }) },
	];

	public static async initialize() {
		RegisterCommand(
			"startTig",
			() => {
				this.startThis(1);
			},
			false
		);

		onNet("gm:jobs:police:tig:start", this.startThis.bind(this));

		const tick = setTick(async () => {
			if (this.actionsRemaining > 0 && this.sentenced == true) {
				console.log("Tig actions remaining: " + this.actionsRemaining);
				this.disableViolentActions();
				this.drawAvailableActions();

				for (let i = 0; i < this.availableActions.length; i++) {
					const availableAction: Action = this.availableActions[i];
					DrawMarker(
						21,
						availableAction.coords.x,
						availableAction.coords.y,
						availableAction.coords.z,
						0.0,
						0.0,
						0.0,
						0.0,
						0.0,
						0.0,
						0.5,
						0.5,
						0.5,
						50,
						50,
						204,
						100,
						false,
						true,
						2,
						true,
						// @ts-ignore
						false,
						false,
						false
					);

					const coords = GetEntityCoords(PlayerPedId(), false);
					const distance = GetDistanceBetweenCoords(
						coords[0],
						coords[1],
						coords[2],
						availableAction.coords.x,
						availableAction.coords.y,
						availableAction.coords.z,
						true
					);

					if (distance <= 1.5) {
						ShowHelpNotification("Appuyer sur ~INPUT_CONTEXT~ pour commencer");

						if (IsControlJustReleased(0, 38)) {
							//this.removeAction(availableAction)
							this.disable_actions = true;

							if (availableAction.type == "cleaning") {
								const cSCoords = GetOffsetFromEntityInWorldCoords(GetPlayerPed(PlayerId()), 0.0, 0.0, -5.0);
								const vassouspawn = CreateObject(
									GetHashKey("prop_tool_broom"),
									cSCoords[0],
									cSCoords[1],
									cSCoords[2],
									true,
									true,
									true
								);
								const netid = ObjToNet(vassouspawn);

								RequestAnimDict("amb@world_human_janitor@male@idle_a");
								TaskPlayAnim(
									PlayerPedId(),
									"amb@world_human_janitor@male@idle_a",
									"idle_a",
									8.0,
									-8.0,
									-1,
									0,
									0,
									false,
									false,
									false
								);
								AttachEntityToEntity(
									vassouspawn,
									GetPlayerPed(PlayerId()),
									GetPedBoneIndex(GetPlayerPed(PlayerId()), 28422),
									-0.005,
									0.0,
									0.0,
									360.0,
									360.0,
									0.0,
									true,
									true,
									false,
									true,
									0,
									true
								);
								let vassour_net = netid;

								setTimeout(() => {
									DetachEntity(NetToObj(vassour_net), true, true);
									DeleteEntity(NetToObj(vassour_net));
									vassour_net = -1;
									ClearPedTasks(PlayerPedId());
									this.actionsRemaining--;
									Notifications.Show("Bien, il vous reste " + this.actionsRemaining + " actions");
								}, 10000);
							} else if (availableAction.type == "gardening") {
								const cSCoords = GetOffsetFromEntityInWorldCoords(GetPlayerPed(PlayerId()), 0.0, 0.0, -5.0);
								const spatulaspawn = CreateObject(
									GetHashKey("bkr_prop_coke_spatula_04"),
									cSCoords[0],
									cSCoords[1],
									cSCoords[2],
									true,
									true,
									true
								);
								const netid = ObjToNet(spatulaspawn);

								TaskStartScenarioInPlace(PlayerPedId(), "world_human_gardener_plant", 0, false);
								AttachEntityToEntity(
									spatulaspawn,
									GetPlayerPed(PlayerId()),
									GetPedBoneIndex(GetPlayerPed(PlayerId()), 28422),
									-0.005,
									0.0,
									0.0,
									190.0,
									190.0,
									-50.0,
									true,
									true,
									false,
									true,
									0,
									true
								);

								let spatula_net = netid;

								setTimeout(() => {
									DetachEntity(NetToObj(spatula_net), true, true);
									DeleteEntity(NetToObj(spatula_net));
									spatula_net = -1;
									ClearPedTasks(PlayerPedId());
									this.actionsRemaining--;
									Notifications.Show("Bien, il vous reste " + this.actionsRemaining + " actions");
								}, 10000);
							}
						}
					}
				}
			} else if (this.actionsRemaining == 0 && this.sentenced == true) {
				this.sentenced = false;
				Notifications.Show("Vous avez terminée votre travail d'interet general");
				SetEntityCoords(PlayerPedId(), this.releaseCoords.x, this.releaseCoords.y, this.releaseCoords.z, true, false, false, true);
			} else {
				await Delay(5000);
			}
		});
	}

	private static startThis(actionsRemaining: number) {
		if (this.sentenced) return;

		Notifications.Show("Vous êtes condamné a effectuer du travail d'interet general (" + actionsRemaining + " actions)");
		SetEntityCoords(PlayerPedId(), this.prisonerCoords.x, this.prisonerCoords.y, this.prisonerCoords.z, true, false, false, true);
		this.sentenced = true;
		this.actionsRemaining = actionsRemaining;
		this.applePrisonerSkin();
	}

	private static drawAvailableActions() {
		for (let i = 0; i < this.availableActions.length; i++) {
			const action: Action = this.availableActions[i];

			//DrawMarker(21, Config.ServiceLocations[i].coords, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.5, 0.5, 0.5, 255, 0, 0, 100, false, true, 2, true, false, false, true)
			DrawMarker(
				21,
				action.coords.x,
				action.coords.y,
				action.coords.z,
				0.0,
				0.0,
				0.0,
				0.0,
				0.0,
				0.0,
				0.5,
				0.5,
				0.5,
				50,
				50,
				204,
				100,
				false,
				true,
				2,
				true,
				// @ts-ignore
				false,
				false,
				false
			);
		}
	}

	private static disableViolentActions() {
		if (this.disable_actions == true) {
			//DisableAllControlActions(0)
		}

		DisableControlAction(2, 37, true);
		DisablePlayerFiring(PlayerPedId(), true);
		DisableControlAction(0, 106, true);
		DisableControlAction(0, 140, true);
		DisableControlAction(0, 141, true);
		DisableControlAction(0, 142, true);

		if (IsDisabledControlJustPressed(2, 37)) {
			SetCurrentPedWeapon(PlayerPedId(), GetHashKey("WEAPON_UNARMED"), true);
		}

		if (IsDisabledControlJustPressed(0, 106)) {
			SetCurrentPedWeapon(PlayerPedId(), GetHashKey("WEAPON_UNARMED"), true);
		}
	}

	private static applePrisonerSkin() {
		if (!DoesEntityExist(PlayerPedId())) return;

		SetPedArmour(PlayerPedId(), 0);
		ClearPedBloodDamage(PlayerPedId());
		ResetPedVisibleDamage(PlayerPedId());
		ClearPedLastWeaponDamage(PlayerPedId());
		ResetPedMovementClipset(PlayerPedId(), 0);
	}
}
