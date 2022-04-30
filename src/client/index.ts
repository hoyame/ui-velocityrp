import "../shared/extensions";

import { Context } from "./core/context";
import { notif } from "./core/notifications";
import { Speedometer } from "./modules/speedometer";

class Gamemode {
	public static async Initialize() {
		// FreezeEntityPosition(PlayerPedId(), false);

		Speedometer.initialize();
		Context.initialize();
		notif();

		console.log("GAMEMODE INITIALIZED");
	}
}

Gamemode.Initialize();
