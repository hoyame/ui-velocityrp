export abstract class PedUtils {
	public static GetPedHeadshotAsync(ped: number): Promise<number> {
		const shot = RegisterPedheadshotTransparent(ped);
		return new Promise(resolve => {
			const interval = setInterval(() => {
				if (IsPedheadshotReady(shot)) {
					clearInterval(interval);
					resolve(shot);
				}
			}, 100);
		});
	}

	public static CreatePed(hash: string, coords: number[], heading: number) {
		RequestModel(GetHashKey(hash));
		const ped = CreatePed(1, hash, coords[0], coords[1], coords[2], heading, false, true);

		SetEntityHeading(ped, heading);
		SetEntityAsMissionEntity(ped, true, true);
		SetPedHearingRange(ped, 0.0);
		SetPedSeeingRange(ped, 0.0);
		SetPedAlertness(ped, 0.0);
		SetPedFleeAttributes(ped, 0, false);
		SetBlockingOfNonTemporaryEvents(ped, true);
		SetPedCombatAttributes(ped, 46, true);
		SetPedFleeAttributes(ped, 0, false);

		return ped;
	}
}
