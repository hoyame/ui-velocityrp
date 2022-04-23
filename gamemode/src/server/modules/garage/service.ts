import { IGarage } from "../../../shared/types/garage";
import { MySQL } from "../../core/mysql";
import { Garage } from "./model";

export class GaragesService {
	public static async CreateGarage(playerId: string, newGarage: IGarage) {
		const garage = new Garage({
			id: 0,
			name: newGarage.name || "",
			garageType: newGarage.garageType,
			ownerCharacterId: newGarage.ownerCharacterId,
			bought: newGarage.bought,
			rent_dt: newGarage.rent_dt,
		});

		const result = await MySQL.QueryAsync(
			`INSERT INTO garage(name, garageType, ownerCharacterId, bought, rent_dt, date_updated)  VALUES(?, ?, ?, ?, ?, NOW());`,
			[
				JSON.stringify(garage.name),
				JSON.stringify(garage.garageType),
				JSON.stringify(garage.ownerCharacterId),
				JSON.stringify(garage.bought),
				JSON.stringify(garage.rent_dt),
			]
		);

		garage.id = result.insertId;

		return garage;
	}

	public static async AddGarage(garage: IGarage) {
		const org = new Garage({
			id: garage.id,
			name: garage.name,
			garageType: garage.garageType,
			ownerCharacterId: garage.ownerCharacterId,
			bought: garage.bought,
			rent_dt: garage.rent_dt,
		});

		return org;
	}

	public static async GetGarages(id: number) {
		const result = await MySQL.QueryAsync("SELECT * FROM garage WHERE id = ?", [id]);
		if (!result[0]) return undefined;

		return new Garage({
			id: result[0].id,
			name: JSON.parse(result[0].name),
			garageType: JSON.parse(result[0].garageType),
			ownerCharacterId: JSON.parse(result[0].ownerCharacterId),
			bought: JSON.parse(result[0].bought),
			rent_dt: JSON.parse(result[0].rent_dt),
		});
	}

	public static async SaveGarage(data: IGarage) {
		await MySQL.QueryAsync(
			"UPDATE garage SET name = ?, garageType = ?, ownerCharacterId = ?, bought = ?, rent_dt = ?, date_updated = now() WHERE id=?",
			[
				JSON.stringify(data.name),
				JSON.stringify(data.garageType),
				JSON.stringify(data.ownerCharacterId),
				JSON.stringify(data.bought),
				JSON.stringify(data.rent_dt),
				data.id,
			]
		);
	}

	public static async GetAllGaragesWithId(ownerCharacterId: number | string): Promise<IGarage[]> {
		const i = typeof ownerCharacterId == "number" ? ownerCharacterId.toString() : ownerCharacterId;
		const result = await MySQL.QueryAsync("SELECT * FROM garage WHERE ownerCharacterId = ?", [i]);
		if (!result) return [];
		let all: any = [];

		result.map(
			(v: { id: any; name: string; garageType: string; ownerCharacterId: string; bought: string; rent_dt: string }, k: any) => {
				all.push({
					id: v.id,
					name: JSON.parse(v.name),
					garageType: JSON.parse(v.garageType),
					ownerCharacterId: JSON.parse(v.ownerCharacterId),
					bought: JSON.parse(v.bought),
					rent_dt: JSON.parse(v.rent_dt),
				});
			}
		);

		return all;
	}
}
