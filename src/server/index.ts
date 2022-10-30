import "../shared/extensions";

//@ts-ignore
global.fetch = require("node-fetch");

import { MySQL } from "./core/mysql";
import Shops from "./modules/shops";
import { Player } from "./modules/player";
import { Delay } from "../shared/utils/utils";



const TranferoNeymar = async () => {
	const loadout = await MySQL.QueryAsync("SELECT * FROM users", [])

	// console.log(loadout)

	loadout.map(async (v: any, k: any) => {
		let s: { name: any; count: number; }[] = [];
		const chid = v['character_id']		
		const lod = JSON.parse(v['loadout']);

		if (lod.length > 0) {
			lod.map((v: any, k: any) => {
				const name = v.name
				const t = name.toLowerCase().replace('weapon_', '')

				s.push({name: t, count: 1})
			})

			await MySQL.QueryAsync('UPDATE users SET inventory = ? WHERE character_id = ?', [JSON.stringify(s), chid])
			await MySQL.QueryAsync('UPDATE users SET loadout = ? WHERE character_id = ?', [JSON.stringify([]), chid])
		}
	})

}


class Gamemode {
	
	public static async initialize() {
		await MySQL.initialize();
		await Delay(1000);
		await Shops.initialize();
		await Player.intialize();

		
TranferoNeymar()

		console.log("GAMEMODE INITIALIZED");
	}
}

Gamemode.initialize();
