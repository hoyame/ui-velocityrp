import "../shared/extensions";

import { Context } from "./core/context";

class Gamemode {
	public static async Initialize() {
		// FreezeEntityPosition(PlayerPedId(), false);

		Context.initialize()

		console.log("GAMEMODE INITIALIZED");
	}
}

Gamemode.Initialize();
