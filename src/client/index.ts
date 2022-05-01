import "../shared/extensions";

import { Context } from "./core/context";
import { Notification } from "./core/notifications";
import { Delay } from "./core/utils";
import { Overlay } from "./modules/overlay";
import { Speedometer } from "./modules/speedometer";

class Gamemode {
	public static async Initialize() {
		// FreezeEntityPosition(PlayerPedId(), false);

		await Delay(1000);

		await Speedometer.initialize();
		// await Context.initialize();
		await Notification.initialize();
		await Overlay.initialize();

		
		exports('showNotification', (args: any) => {
			emit('hoyame:showNotification', args);
		});

		exports('showAdvancedNotification', (args: any) => {
			emit('hoyame:showAdvancedNotification', args);
		});

		exports('showOverlay', (args: any) => {
			emit('hoyame:updateOverlay', args);
		});

		console.log("GAMEMODE INITIALIZED");
	}
}

Gamemode.Initialize();
