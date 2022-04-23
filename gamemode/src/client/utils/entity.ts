import { Entity } from "@nativewrappers/client";

export abstract class EntityUtils {
	private static timeOut: number = 6000;

	public static RequestNetworkControlAsync(entity: Entity) {
		return new Promise(resolve => {
			if (NetworkHasControlOfEntity(entity.Handle)) resolve(true);

			NetworkRequestControlOfEntity(entity.Handle);

			const start = GetGameTimer();
			const interval = setInterval(() => {
				const hasControl = NetworkHasControlOfEntity(entity.Handle);
				if (hasControl || GetGameTimer() - start > this.timeOut) {
					clearInterval(interval);
					resolve(hasControl);
				}
			}, 200);
		});
	}
}
