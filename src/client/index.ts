import "../shared/extensions";
import { Delay } from "../shared/utils/utils";
import { Context } from "./modules/misc/context";
import { Notification } from "./modules/misc/notifications";
import { Overlay } from "./modules/misc/overlay";
import { Shops } from "./modules/shops";
import { Speedometer } from "./modules/misc/speedometer";

class Gamemode {
	public static async initialize() {
		await Delay(1000);

		await Speedometer.initialize();
		// await Context.initialize();
		await Notification.initialize();
		await Overlay.initialize();

		await Shops.initialize();

		
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

Gamemode.initialize();
