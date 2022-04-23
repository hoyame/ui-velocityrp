import { INewProperty, IProperty } from "../../../shared/types/property";
import { MySQL } from "../../core/mysql";
import { Property } from "./model";

export class PropertiesService {
	public static async CreateProperty(playerId: string | number, newProperty: INewProperty) {
		const property = new Property({
			id: 0,
			name: newProperty.name || "",
			propertyType: newProperty.propertyType,
			ownerCharacterId: newProperty.ownerCharacterId,
			inventory: [],
			bought: newProperty.bought,
			rent_dt: newProperty.rent_dt,
		});

		const result = await MySQL.QueryAsync(
			`INSERT INTO properties (name, propertyType, ownerCharacterId, inventory, bought, rent_dt, date_updated) VALUES (?, ?, ?, ?, ?, ?, now())`,
			[
				property.name,
				JSON.stringify(property.propertyType),
				+property.ownerCharacterId,
				JSON.stringify(property.inventory),
				property.bought,
				property.rent_dt,
			]
		);

		property.id = result.insertId;

		return property;
	}

	public static async SaveProperty(data: IProperty) {
		await MySQL.QueryAsync(
			"UPDATE properties SET name = ?, propertyType = ?, ownerCharacterId = ?, inventory = ?, bought = ?, rent_dt = ?, date_updated = now() WHERE id=?",
			[
				data.name,
				JSON.stringify(data.propertyType),
				+data.ownerCharacterId,
				JSON.stringify(data.inventory),
				data.bought,
				data.rent_dt,
				data.id,
			]
		);
	}

	public static async GetAllProperties(): Promise<IProperty[]> {
		const result = await MySQL.QueryAsync("SELECT * FROM properties", []);
		if (!result) return [];
		return result.map((row: any) => ({
			...row,
			inventory: JSON.parse(row.inventory),
			propertyType: JSON.parse(row.propertyType),
		}));
	}
}
