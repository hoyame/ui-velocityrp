import { Control, Game, Screen, Vector3 } from "@wdesgardin/fivem-js";
import { Door, DoorObject, NewDoor } from "../../../../shared/types/doors";
import { TriggerServerCallbackAsync } from "../../../core/utils";
import { InstructionalButtons } from "../../../misc/instructional-buttons";
import { Utils } from "../../../utils/utils";
import { DoorlocksUtils } from "./doorlocks-utils";
import { OpenDoorOptionsMenu } from "./menu";
import { Delay } from "../../../../shared/utils/utils";
import { LocalEvents } from "../../../../shared/utils/localEvents";
import { Notifications } from "../../../player/notifications";

export abstract class Doorlocks {
	private static allDoors: Door[] = [];
	private static nearbyDoors: number[] = [];

	public static async initialize() {
		onNet("gm:doors:startCreation", this.setDoors.bind(this));
		onNet("gm:doors:new", this.addNewDoor.bind(this));
		onNet("gm:doors:lockedChanged", this.onLockedChanged.bind(this));
		onNet("gm:doors:remove", this.removeDoor.bind(this));
		LocalEvents.on("gm:character:spawned", this.onCharacterSpawned.bind(this));
		setTick(this.interactionTick.bind(this));
		setInterval(this.updateNearbyInterval.bind(this), 2000);
	}

	private static async interactionTick() {
		const nearbyDoors = this.allDoors.filter(d => this.nearbyDoors.includes(d.id));
		if (nearbyDoors.length == 0) {
			await Delay(1000);
			return;
		}

		let closestDoor = nearbyDoors[0];
		let closestDistance = 1000;

		for (const door of nearbyDoors) {
			const distance = Game.PlayerPed.Position.distance(door.textLoc);
			if (distance < door.drawDist) {
				Utils.draw3dText([door.textLoc.x, door.textLoc.y, door.textLoc.z], `${door.locked ? "Fermé [~g~" : "Ouvert [~r~"}E~w~]`);

				if (distance < closestDistance) {
					closestDistance = distance;
					closestDoor = door;
				}
			}
		}

		if (
			Game.isControlJustPressed(0, Control.Pickup) &&
			Game.PlayerPed.Position.distance(closestDoor.textLoc) <= closestDoor.interactDist
		) {
			emitNet("gm:doors:setLocked", closestDoor.id, !closestDoor.locked);
		}
	}

	private static updateNearbyInterval() {
		const nearby: number[] = [];

		for (const door of this.allDoors) {
			if (Game.PlayerPed.Position.distance(door.textLoc) < 50) {
				nearby.push(door.id);
				this.updateDoorObjects(door);
			}
		}

		this.nearbyDoors = nearby;
	}

	private static onLockedChanged(doorId: number, locked: boolean) {
		const door = this.allDoors.find(d => d.id == doorId);
		if (!!door) {
			door.locked = locked;
			this.updateDoorObjects(door);
		}
	}

	private static removeDoor(doorId: number) {
		const door = this.allDoors.find(d => d.id == doorId);
		if (!!door) {
			this.updateDoorObjects({ ...door, locked: false });
			this.allDoors = this.allDoors.filter(d => d.id != doorId);
		}
	}

	private static updateDoorObjects(door: Door) {
		for (const doorObj of door.objects) {
			const obj = GetClosestObjectOfType(
				doorObj.location.x,
				doorObj.location.y,
				doorObj.location.z,
				1,
				doorObj.model,
				false,
				false,
				false
			);
			FreezeEntityPosition(obj, door.locked);

			if (door.locked) {
				SetEntityRotation(obj, doorObj.rotation.x, doorObj.rotation.y, doorObj.rotation.z, 0, true);
			}
		}
	}

	private static async setDoors() {
		const doors = await this.selectDoors();
		if (doors.length == 0) {
			Notifications.ShowError("~r~Création annulée~w~~n~Aucune porte sélectionnée");
		} else {
			const creation = {
				textLoc: await this.getTextLocation(doors),
				objects: doors,
			};
			const options = await OpenDoorOptionsMenu();
			if (!!options) {
				const door: NewDoor = { ...options, ...creation };
				emitNet("gm:doors:save", door);
			} else {
				Notifications.ShowError("~r~Création annulée");
			}
		}
	}

	private static selectDoors() {
		return new Promise<DoorObject[]>(resolve => {
			const doors: { [entity: number]: DoorObject } = {};

			const tick = setTick(() => {
				const [start, end] = this.getCoordsInFrontOfCam([0, 5000]);
				const ray = StartShapeTestRay(start.x, start.y, start.z, end.x, end.y, end.z, 16, Game.PlayerPed.Handle, 5000);
				const [_ray, hit, pos, norm, ent] = GetShapeTestResult(ray);

				const rayB = StartShapeTestRay(start.x, start.y, start.z, end.x, end.y, end.z, 1, PlayerPedId(), 5000);
				const [_rayB, hitB, posB, normB, entB] = GetShapeTestResult(rayB);

				if (Game.isDisabledControlJustReleased(0, Control.FrontendRdown)) {
					clearTick(tick);
					this.setCreateDoorsButtons(false, false, false);
					resolve(Object.values(doors));
					return;
				}

				if (hit && ent > 0) {
					DrawSphere(pos[0], pos[1], pos[2], 0.25, 0, 255, 0, 0.5);
					Game.disableControlThisFrame(0, 24);
					Game.disableControlThisFrame(0, 25);
					Game.disableControlThisFrame(0, 142);
					if (!!doors[ent]) {
						DoorlocksUtils.DrawEntityBoundingBox(ent, 100, 0, 0, 80);

						this.setCreateDoorsButtons(true, false, true);
						if (Game.isDisabledControlJustReleased(0, Control.Attack)) {
							delete doors[ent];
						}
					} else {
						DoorlocksUtils.DrawEntityBoundingBox(ent, 0, 100, 0, 80);

						this.setCreateDoorsButtons(true, true, false);
						if (Game.isDisabledControlJustReleased(0, Control.Attack)) {
							if (this.checkDoor(ent)) {
								doors[ent] = {
									location: Vector3.fromArray(GetEntityCoords(ent, false)),
									rotation: Vector3.fromArray(GetEntityRotation(ent, 0)),
									model: GetEntityModel(ent),
								};
							} else {
								Notifications.ShowError("Cette porte est ~r~déjà utilisée~w~ quelque part.");
							}
						}
					}
				} else {
					DrawSphere(posB[0], posB[1], posB[2], 0.25, 255, 0, 0, 0.5);
					this.setCreateDoorsButtons(true, false, false);
				}

				for (const doorEnt of Object.keys(doors)) {
					if (ent != +doorEnt) {
						DoorlocksUtils.DrawEntityBoundingBox(+doorEnt, 0, 120, 120, 80);
					}
				}
			});
		});
	}

	private static setCreateDoorsButtons(finished: boolean, add: boolean, remove: boolean) {
		InstructionalButtons.setButton("Valider", Control.FrontendRdown, finished);
		InstructionalButtons.setButton("Ajouter la porte", Control.Attack, add);
		InstructionalButtons.setButton("Retirer la porte", Control.Attack, remove);
	}

	private static getCoordsInFrontOfCam(distances: number[]) {
		const coords = Vector3.fromArray(GetGameplayCamCoord());
		const direction = this.rotationToDirection(Vector3.fromArray(GetGameplayCamRot(2)));

		if (distances.length < 1) {
			distances.push(0.000001);
		} else if (distances[0] < 0.000001) {
			distances[0] = 0.000001;
		}

		const result: Vector3[] = [];
		for (let i = 0; i < distances.length; i++) {
			const distance = distances[i];

			if (distance == 0) {
				result.push(coords);
			} else {
				result.push(
					new Vector3(coords.x + distance * direction.x, coords.y + distance * direction.y, coords.z + distance * direction.z)
				);
			}
		}

		return result;
	}

	private static rotationToDirection(rot: Vector3) {
		const rotX = rot.x * (3.141593 / 180.0);
		const rotZ = rot.z * (3.141593 / 180.0);
		const c = Math.cos(rotX);
		const multXY = Math.abs(c);
		return new Vector3(Math.sin(rotZ) * -1 * multXY, Math.cos(rotZ) * multXY, Math.sin(rotX));
	}

	private static checkDoor(entity: number) {
		const pos = Vector3.fromArray(GetEntityCoords(entity, false));
		for (const doors of this.allDoors) {
			for (const door of doors.objects) {
				if (pos.distance(door.location) < 0.5) {
					return false;
				}
			}
		}
		return true;
	}

	private static getTextLocation(doors: DoorObject[]): Promise<Vector3> {
		let moveOffset = Vector3.create(0);

		this.setTextLocationButtons(true);

		let textPos: Vector3;
		if (doors.length > 1) {
			let [x, y, z] = [0, 0, 0];

			for (const door of doors) {
				x += door.location.x;
				y += door.location.y;
				z += door.location.z;
			}

			textPos = new Vector3(x / doors.length, y / doors.length, z / doors.length);
		} else {
			const pos = doors[0].location;
			const [min, max] = GetModelDimensions(doors[0].model);
			const head = doors[0].rotation.z;
			const offset = this.rotateVectorFlat(new Vector3((min[0] + max[0]) / 2, (min[1] + max[1]) / 2, 0), head);
			textPos = Vector3.add(pos, offset);
		}

		return new Promise<Vector3>(resolve => {
			const tick = setTick(() => {
				const modifier = 1.0 * GetFrameTime();

				Screen.displayHelpTextThisFrame("Choisissez la position du texte");

				if (Game.isDisabledControlJustReleased(0, Control.FrontendRdown)) {
					clearTick(tick);
					this.setTextLocationButtons(false);
					resolve(Vector3.add(textPos, moveOffset));
				}

				if (Game.isControlPressed(0, Control.VehiclePrevRadio)) {
					moveOffset = Vector3.add(moveOffset, Vector3.multiply(new Vector3(0.0, 0.0, 1.0), modifier));
				}
				if (Game.isControlPressed(0, Control.VehicleNextRadio)) {
					moveOffset = Vector3.subtract(moveOffset, Vector3.multiply(new Vector3(0.0, 0.0, 1.0), modifier));
				}

				if (Game.isControlPressed(0, Control.PhoneUp)) {
					moveOffset = Vector3.add(moveOffset, Vector3.multiply(new Vector3(1.0, 0.0, 0.0), modifier));
				}
				if (Game.isControlPressed(0, Control.PhoneDown)) {
					moveOffset = Vector3.subtract(moveOffset, Vector3.multiply(new Vector3(1.0, 0.0, 0.0), modifier));
				}

				if (Game.isControlPressed(0, Control.PhoneLeft)) {
					moveOffset = Vector3.add(moveOffset, Vector3.multiply(new Vector3(0.0, 1.0, 0.0), modifier));
				}
				if (Game.isControlPressed(0, Control.PhoneRight)) {
					moveOffset = Vector3.subtract(moveOffset, Vector3.multiply(new Vector3(0.0, 1.0, 0.0), modifier));
				}

				const drawPos = textPos.add(moveOffset);
				Utils.draw3dText([drawPos.x, drawPos.y, drawPos.z], "Unlocked [~g~E~w~]");
			});
		});
	}

	private static setTextLocationButtons(enable: boolean) {
		InstructionalButtons.setButton("Valider", Control.FrontendRdown, enable);
		InstructionalButtons.setButton("Hauteur", [Control.VehicleNextRadio, Control.VehiclePrevRadio], enable);
		InstructionalButtons.setButton("Avancer/Reculer", [Control.PhoneUp, Control.PhoneDown], enable);
		InstructionalButtons.setButton("Droite/Gauche", [Control.PhoneLeft, Control.PhoneRight], enable);
	}

	private static rotateVectorFlat(vec: Vector3, heading: number) {
		heading = heading / 57.2958;
		const cos = Math.cos(heading);
		const sin = Math.sin(heading);
		return new Vector3(cos * vec.x - sin * vec.y, sin * vec.x + cos * vec.y, vec.z);
	}

	private static addNewDoor(door: Door) {
		this.allDoors.push(door);
	}

	private static async onCharacterSpawned() {
		this.allDoors = (await TriggerServerCallbackAsync("gm:doors:get")) as Door[];
	}
}
