import { Vector3 } from "@wdesgardin/fivem-js";
import { Door, NewDoor } from "../../../../shared/types/doors";
import { MySQL } from "../../../core/mysql";
import { RegisterServerCallback } from "../../../core/utils";
import { CharactersController } from "../../../player/charactersController";
import { SendErrorNotification, SendNotification, SendSuccessNotification } from "../../../utils/notifications";

export abstract class Doorlocks {
	private static doors: Door[];

	public static async initialize() {
		await this.loadDoors();
		RegisterCommand("doors:make", (source: number) => emitNet("gm:doors:startCreation", source), true);
		RegisterCommand("doors:remove", this.removeDoor.bind(this), true);
		onNet("gm:doors:save", this.saveDoor.bind(this));
		onNet("gm:doors:setLocked", this.setLocked.bind(this));
		RegisterServerCallback("gm:doors:get", this.getAllDoors.bind(this));
	}

	private static async loadDoors() {
		const result: any[] = await MySQL.QueryAsync("SELECT * FROM doors", []);
		this.doors = result.map(row => ({
			objects: JSON.parse(row.objects),
			textLoc: JSON.parse(row.textLoc),
			id: row.id,
			interactDist: row.interactDist,
			drawDist: row.drawDist,
			locked: !!row.locked,
			interactInVeh: !!row.interactInVeh,
			jobId: 1,
		}));
	}

	private static async removeDoor(source: string) {
		if (this.doors.length == 0 || !IsPlayerAceAllowed(source, "doorlocks")) return;
		const src = source;

		const coords = Vector3.fromArray(GetEntityCoords(GetPlayerPed(source)));
		let closest = this.doors[0];
		let closestDist = coords.distance(this.doors[0].textLoc);

		for (let i = 1; i < this.doors.length; i++) {
			const dist = coords.distance(this.doors[i].textLoc);
			if (dist < closestDist) {
				closestDist = dist;
				closest = this.doors[i];
			}
		}

		if (closestDist < 4) {
			await MySQL.QueryAsync("DELETE FROM doors WHERE id = ?", [closest.id]);
			this.doors = this.doors.filter(d => d.id != closest.id);
			emitNet("gm:doors:remove", -1, closest.id);
			SendSuccessNotification(src, "La porte a été ~g~supprimée");
		} else {
			SendErrorNotification(src, "~r~Action impossible,~w~ rapprochez vous");
		}
	}

	private static setLocked(doorId: number, locked: boolean) {
		const door = this.doors.find(d => d.id == doorId);
		if (!door) return;

		const character = CharactersController.getCharacter(source);
		if (!character) return;

		if (character.job?.id != door.jobId && !IsPlayerAceAllowed(source, "doorlocks")) {
			SendErrorNotification(source, "Vous n'êtes pas ~r~autorisé~w~ à ouvrir cette porte");
		} else {
			emitNet("gm:doors:lockedChanged", -1, doorId, locked);
		}
	}

	private static async saveDoor(door: NewDoor) {
		if (!IsPlayerAceAllowed(source, "doorlocks")) return;
		const src = source;

		const result = await MySQL.QueryAsync(
			`INSERT INTO doors (objects, textLoc, interactDist, drawDist, locked, interactInVeh, jobId) values (?, ?, ?, ?, ?, ?, ?);`,
			[
				JSON.stringify(door.objects),
				JSON.stringify(door.textLoc),
				door.interactDist,
				door.drawDist,
				door.locked,
				door.interactInVeh,
				door.jobId,
			]
		);
		const createdDoor: Door = { ...door, id: result.insertedId };
		this.doors.push(createdDoor);

		emitNet("gm:doors:new", -1, createdDoor);
		SendSuccessNotification(src, "La porte a été ~g~créée");
	}

	private static getAllDoors() {
		return this.doors;
	}
}
