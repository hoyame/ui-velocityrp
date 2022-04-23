import { JobId } from "../config/jobs/jobs";
import { IVehicle } from "../types/vehicules";
import { IInventoryItem } from "./inventory";

export interface ICharacterJob {
	id?: JobId;
	rank?: number;
}

export interface ICharacterOrg {
	name?: string;
	rank?: number;
}

export interface ICharacter {
	id: number;
	playerId: number;
	infos: ICharacterInfos;
	money: number;
	vehicles: IVehicle[];
	properties: any;
	inventory: IInventoryItem[];
	lodaout: [];
	billings: any[];
	job: ICharacterJob;
	org: ICharacterOrg;
	jail: number;
}

export interface INewCharacter {
	name: string;
	dateOfBirth: string;
	height: string;
	sex: string;
	skin: Array<number>;
	variations: { [componentId: number]: [number, number] };
	props: { [propId: number]: [number, number] };
}

export interface ILicenses {
	car?: boolean;
	motorCycle?: boolean;
	truck?: boolean;
	bus?: boolean;
	agriculturalVehicle?: boolean;
	hunting?: boolean;
	fireArms?: boolean;
}

export interface ICharacterInfos extends INewCharacter {
	alive: boolean;
	tatoos: [];
	licenses: ILicenses;
	position: any;
	needs: { thirst: number; hunger: number; alcool?: number; weed?: number };
}
