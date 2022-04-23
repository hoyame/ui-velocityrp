import { JobId } from "../../../shared/config/jobs/jobs";
import { RegisterServerCallback } from "../../core/utils";
import { CharactersController } from "../../player/charactersController";
import { VehiclesController } from "../../player/vehiclesController";

enum StatusAgent {
	off = -1,
	finService = 0,
	enService = 1,
	pause = 2,
	standby = 3,
	controleRoutier = 4,
	refusObtemperer = 5,
	delitFuite = 6,
	crime = 7,
}

enum DemandeRenfort {
	petite = 1,
	importante = 2,
	all = 3,
}

interface IPoliceAgent {
	id: number;
	status: StatusAgent;
}

export abstract class Police {
	public static allPoliceAgents: IPoliceAgent[] = [];

	public static async initialize() {
		RegisterServerCallback("gm:jobs:police:citizen:getIdentity", this.getIdentity.bind(this));
		RegisterServerCallback("gm:jobs:police:citizen:getLicencies", this.getLicencies.bind(this));
		RegisterServerCallback("gm:jobs:police:citizen:getVehicleOwner", this.getVehicleOwner.bind(this));
		RegisterServerCallback("gm:jobs:police:jail:get", this.jailGet.bind(this));

		onNet("gm:jobs:police:registerAgent", this.registerAgent.bind(this));
		onNet("gm:jobs:police:updateAgentStatus", this.updateAgentStatus.bind(this));
		onNet("gm:jobs:police:requestArrest", this.requestArrest.bind(this));
		onNet("gm:jobs:police:requestRenfort", this.requestRenfort.bind(this));

		onNet("gm:jobs:police:handcuff", this.handcuff.bind(this));
		onNet("gm:jobs:police:fire", this.fire.bind(this));
		onNet("gm:jobs:police:roberry", this.roberry.bind(this));
		onNet("gm:jobs:police:tigSend", this.tigSend.bind(this));

		onNet("gm:jobs:police:sendJail", this.sendJail.bind(this));
		onNet("gm:jobs:police:jail:sync", this.jailSync.bind(this));
	}

	private static jailGet(source: number) {
		const char = CharactersController.getCharacter(source);
		return char.jail;
	}

	private static jailSync(number: number) {
		const char = CharactersController.getCharacter(source);
		char.updateJail(number);
	}

	private static sendJail(target: number, n: number) {
		if (CharactersController.getCharacter(source).job.id == JobId.LSPD) return false;
		emitNet("gm:jobs:police:jail:jail", target, n);
	}

	private static tigSend(target: number, n: number) {
		if (CharactersController.getCharacter(source).job.id == JobId.LSPD) return false;
		emitNet("gm:jobs:police:tig:start", target, n);
	}

	public static fire(pos: number[]) {
		this.allPoliceAgents.map((v, k) => {
			// @ts-ignore
			if (v.status !== StatusAgent.finService || v.status !== StatusAgent.pause || v.status !== StatusAgent.standby) {
				emitNet("gm:jobs:police:cl:fire", v.id, pos);
			}
		});
	}

	public static roberry(pos: number[]) {
		this.allPoliceAgents.map((v, k) => {
			// @ts-ignore
			if (v.status !== StatusAgent.finService || v.status !== StatusAgent.pause || v.status !== StatusAgent.standby) {
				emitNet("gm:jobs:police:cl:roberry", v.id, pos);
			}
		});
	}

	public static handcuff(target: number) {
		if (CharactersController.getCharacter(source).job.id == JobId.LSPD) return false;
		emitNet("gm:jobs:police:cl:handcuff", target);
	}

	public static requestArrest(target: number, playerHeading: number, playerCoords: number[], playerLocation: any) {
		emitNet("gm:jobs:police:getArrested", target, playerHeading, playerCoords, playerLocation);
		emitNet("gm:jobs:police:doArrested", source);
	}

	public static getVehicleOwner(source: number, plate: string) {
		const ownerVehicle = VehiclesController.getVehicleOwner(plate);
		console.log("ownerVehicle", ownerVehicle);
		return ownerVehicle;
	}

	public static getIdentity(source: number, target: number) {
		const character = CharactersController.getCharacter(target);

		return {
			name: character.infos.name,
			dateOfBirth: character.infos.dateOfBirth,
			height: character.infos.height,
			sex: character.infos.sex,
		};
	}

	public static getLicencies(source: number, target: number) {
		const character = CharactersController.getCharacter(target);

		return {
			name: character.infos.name,
			licenses: character.infos.licenses,
		};
	}

	public static registerAgent() {
		this.allPoliceAgents.push({
			id: parseInt(source),
			status: StatusAgent.off,
		});
	}

	public static updateAgentStatus(status: number) {
		console.log("updateAgentStatus", status);

		const src = parseInt(source);
		const index = this.allPoliceAgents.findIndex(x => x.id == src);
		if (index == -1) return;
		if (!CharactersController.getCharacter(source)) return;
		const sourceName = CharactersController.getCharacter(source).infos.name;

		this.allPoliceAgents[index].status = status;

		this.allPoliceAgents.map((v, k) => {
			console.log(v);

			// @ts-ignore
			emitNet("gm:jobs:police:notifStatus", v.id, sourceName, status);
		});
	}

	public static requestRenfort(level: DemandeRenfort, coords: number[]) {
		this.allPoliceAgents.map((v, k) => {
			emitNet("gm:jobs:police:receiveRenfortRequest", v.id, level, coords);
		});
	}
}
