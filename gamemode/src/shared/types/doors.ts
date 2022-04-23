import { Vec3 } from "@wdesgardin/fivem-js/lib/utils/Vector3";
import { JobId } from "../config/jobs/jobs";

export interface DoorObject {
	location: Vec3;
	rotation: Vec3;
	model: number;
}

export interface DoorOptions {
	locked: boolean;
	interactInVeh: boolean;
	interactDist: number;
	drawDist: number;
	jobId: JobId;
}

export interface NewDoor extends DoorOptions {
	objects: DoorObject[];
	textLoc: Vec3;
}

export interface Door extends NewDoor {
	id: number;
}
