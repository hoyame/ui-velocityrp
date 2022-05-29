import "../shared/extensions";

//@ts-ignore
global.fetch = require("node-fetch");

import { MySQL } from "./core/mysql";
import Shops from "./modules/shops";
import {Player} from "./modules/player";
import { Events } from "./modules/anticheat/events";


class Gamemode {
	public static async initialize() {
		await MySQL.initialize();
		await Shops.initialize();

		await Events.initialize();
		await Player.intialize();

		console.log("GAMEMODE INITIALIZED");
	}
}

Gamemode.initialize();
