export abstract class Raycast {
	static getEntInFrontOfPlayer(ped: number, distance: number = 1.5) {
		const entCoords = GetEntityCoords(ped, true);
		const worldCoords = GetOffsetFromEntityInWorldCoords(ped, 0.0, distance, 0.0);
		const raycastResult = GetRaycastResult(
			StartShapeTestRay(entCoords[0], entCoords[1], entCoords[2], worldCoords[0], worldCoords[1], worldCoords[2], -1, ped, 0)
		);
		return raycastResult[4];
	}

	private static getCoordsFromCam(distance: number) {
		const rot = GetGameplayCamRot(2);
		const coord = GetGameplayCamCoord();
		const tZ = rot[2] * 0.0174532924;
		const tX = rot[0] * 0.0174532924;
		const num = Math.abs(Math.cos(tX));
		const newCoordX = coord[0] + -Math.sin(tZ) * (num + distance);
		const newCoordY = coord[1] + Math.cos(tZ) * (num + distance);
		const newCoordZ = coord[2] + Math.sin(tX) * 8.0;
		return [newCoordX, newCoordY, newCoordZ];
	}

	static getTarget(ped: number, distance: number, flag: number = -1) {
		const camCoords = GetGameplayCamCoord();
		const farCoords = this.getCoordsFromCam(distance);
		const raycastResult = GetRaycastResult(
			StartShapeTestRay(camCoords[0], camCoords[1], camCoords[2], farCoords[0], farCoords[1], farCoords[2], flag, ped, 2)
		);
		return raycastResult[4];
	}
}
