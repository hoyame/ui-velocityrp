import "../shared/extensions";

//@ts-ignore
global.fetch = require("node-fetch");

import { MySQL } from "./core/mysql";


class Gamemode {
	public static async Initialize() {
		await MySQL.initialize();
		

		console.log("GAMEMODE INITIALIZED");
	}
}

Gamemode.Initialize();
