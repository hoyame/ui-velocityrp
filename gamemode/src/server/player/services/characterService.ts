import { INewCharacter } from "../../../shared/player/character";
import { MySQL } from "../../core/mysql";
import { Character } from "../models/character";

export enum VIP {
	gold = 1,
	diamond = 2,
}

export abstract class CharacterService {
	public static async CreateCharacter(playerId: number, newCharacter: INewCharacter) {
		const character = new Character({
			id: 0,
			playerId,
			infos: {
				...newCharacter,
				alive: true,
				licenses: {},
				tatoos: [],
				position: [0, 0, 0],
				needs: { thirst: 100, hunger: 100 },
			},
			job: {},
			org: {},
			vehicles: [],
			properties: [[], []],
			inventory: [
				{ itemId: "bt_eau", quantity: 5 },
				{ itemId: "bgt_pain", quantity: 5 },
				{ itemId: "tenue", quantity: 1, metadatas: { variations: newCharacter.variations } },
			],
			lodaout: [],
			billings: [],
			money: 2000,
			jail: -1,
		});

		const result = await MySQL.QueryAsync(
			`INSERT INTO characters(playerId, infos, lodaout, vehicles, properties, money, inventory, job, org, jail, date_updated) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW());`,
			[
				playerId,
				JSON.stringify(character.infos),
				JSON.stringify(character.lodaout),
				JSON.stringify(character.vehicles),
				JSON.stringify(character.properties),
				character.money,
				JSON.stringify(character.inventory),
				JSON.stringify(character.job),
				JSON.stringify(character.org),
				character.jail,
			]
		);
		character.id = result.insertId;

		return character;
	}

	public static async GetCharacter(playerId: number): Promise<Character | undefined> {
		const result = await MySQL.QueryAsync("SELECT * FROM characters WHERE playerId = ?", [playerId]);
		if (!result[0]) return undefined;

		return new Character({
			id: result[0].id,
			playerId: result[0].playerId,
			infos: JSON.parse(result[0].infos),
			lodaout: JSON.parse(result[0].lodaout),
			vehicles: JSON.parse(result[0].vehicles),
			properties: JSON.parse(result[0].properties),
			money: +result[0].money,
			inventory: JSON.parse(result[0].inventory),
			billings: JSON.parse(result[0].billings),
			job: JSON.parse(result[0].job),
			org: JSON.parse(result[0].org),
			jail: +result[0].jail,
		});
	}

	public static async GetCharacterWithCharacterID(characterId: number): Promise<Character | undefined> {
		const result = await MySQL.QueryAsync("SELECT * FROM characters WHERE id = ?", [characterId]);
		if (!result[0]) return undefined;

		return new Character({
			id: result[0].id,
			playerId: result[0].playerId,
			infos: JSON.parse(result[0].infos),
			lodaout: JSON.parse(result[0].lodaout),
			vehicles: JSON.parse(result[0].vehicles),
			properties: JSON.parse(result[0].properties),
			money: +result[0].money,
			inventory: JSON.parse(result[0].inventory),
			billings: JSON.parse(result[0].billings),
			job: JSON.parse(result[0].job),
			org: JSON.parse(result[0].org),
			jail: +result[0].jail,
		});
	}

	static async SaveCharacter(character: Character) {
		await MySQL.QueryAsync(
			"UPDATE characters SET infos = ?, money = ?, vehicles = ?, lodaout = ?, inventory = ?, billings = ?, job = ?, org = ?, jail = ?, date_updated = now() WHERE id=?",
			[
				JSON.stringify(character.infos),
				character.money,
				JSON.stringify(character.vehicles),
				JSON.stringify(character.lodaout),
				JSON.stringify(character.inventory),
				JSON.stringify(character.billings),
				JSON.stringify(character.job),
				JSON.stringify(character.org),
				character.jail,
				character.id,
			]
		);
	}

	static async wipe(characterId: number) {
		await MySQL.QueryAsync("DELETE FROM characters WHERE id = ?", [characterId]);
	}
}
