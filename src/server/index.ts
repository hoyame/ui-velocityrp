import "../shared/extensions";

//@ts-ignore
global.fetch = require("node-fetch");

import { MySQL } from "./core/mysql";
import Shops from "./modules/shops";


class Gamemode {
	public static async Initialize() {
		await MySQL.initialize();
		await Shops.initialize();
		

		console.log("GAMEMODE INITIALIZED");
	}
}

Gamemode.Initialize();
