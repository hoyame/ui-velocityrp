import { INewPlayer } from "../../../shared/player/player";
import { MySQL } from "../../core/mysql";
import { Player } from "../models/player";
import { VIP } from "./characterService";

export abstract class PlayerService {
	public static async GetActiveBan(license: string, hwid: string) {
		const ban = await MySQL.QueryAsync(
			"SELECT banEnd, reason FROM sanctions WHERE playerId=(SELECT id FROM players WHERE license = ? OR hwid = ? LIMIT 1) AND banEnd > ? ORDER BY banEnd DESC LIMIT 1;",
			[license, hwid, new Date().toMysqlString()]
		);

		return (
			!!ban &&
			ban.length > 0 && {
				reason: ban[0].reason,
				banEnd: new Date(Date.parse(ban[0].banEnd)),
			}
		);
	}

	public static async GetPlayerByLicense(license: string) {
		const data = await MySQL.QueryAsync("SELECT * FROM players WHERE license = ?", [license]);
		return !!data && data.length > 0 && new Player(data[0]);
	}

	public static async CreatePlayer(player: INewPlayer) {
		console.log("create", player);
		const result = await MySQL.QueryAsync(
			"INSERT INTO players (name, steam, license, license2, discord, fivem, xbl, live, ip, hwid, `rank`, coins, vip date_updated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now());",
			[
				player.name,
				player.steam,
				player.license,
				player.license2,
				player.discord,
				player.fivem,
				player.xbl,
				player.live,
				player.ip,
				player.hwid,
				"user",
				0,
				-1,
			]
		);

		return new Player({ ...player, id: result.insertId, rank: "user", coins: 0, vip: -1 });
	}

	static async getCoins(characterId: number) {
		const result = await MySQL.QueryAsync("SELECT coins, vip FROM players WHERE id = ?", [characterId]);
		if (!result) return;
		console.log(result);
		return {
			coins: +result[0].coins,
			vip: +result[0].vip,
		};
	}

	static async addCoins(characterId: number, coins: number) {
		const result = await MySQL.QueryAsync("SELECT coins FROM players WHERE id = ?", [characterId]);
		if (!result) return;
		let n = (result[0].coins += coins);

		await MySQL.QueryAsync("UPDATE players SET coins = ?, date_updated = now() WHERE id=?", [n, characterId]);

		return n;
	}

	static async removeCoins(characterId: number, coins: number) {
		const result = await MySQL.QueryAsync("SELECT coins FROM players WHERE id = ?", [characterId]);
		if (!result) return;
		let n = (result[0].coins -= coins);

		await MySQL.QueryAsync("UPDATE players SET coins = ?, date_updated = now() WHERE id=?", [n, characterId]);

		return n;
	}

	static async setVip(characterId: number, state: VIP) {
		await MySQL.QueryAsync("UPDATE players SET vip = ?, date_updated = now() WHERE id=?", [state, characterId]);

		return state;
	}
}
