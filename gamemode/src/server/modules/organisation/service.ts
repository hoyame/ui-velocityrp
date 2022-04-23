import { IOrganisation } from "../../../shared/types/organisation";
import { MySQL } from "../../core/mysql";
import { SendNotification, SendSuccessNotification } from "../../utils/notifications";
import { Organisation } from "./model";

export class OrganisationService {
	public static async CreateOrganisation(playerId: string, newOrganisation: IOrganisation) {
		const src = source;
		const allOrgs = await this.GetAllOrganisations();
		console.log("checkOrganisation");

		if (!allOrgs) return false;
		if (allOrgs.find((v: IOrganisation) => JSON.parse(v.name) == newOrganisation.name))
			return SendNotification(src, "Cette organisation exisite deja");

		const organisation = new Organisation({
			id: 0,
			name: newOrganisation.name,
			members: [playerId],
			data: {
				owner: playerId,
				position: newOrganisation.data.position,
				positionGarage: newOrganisation.data.positionGarage,
				positionGarageExit: newOrganisation.data.positionGarageExit,
				positionInteraction: newOrganisation.data.positionInteraction,
			},
			inventory: [],
			money: [0, 0],
			vehicles: [],
		});

		const orgExist: boolean | any = await this.GetOrganisation(newOrganisation.name);
		if (orgExist) return false;

		const result = await MySQL.QueryAsync(`INSERT INTO organisations(name, members, data, date_updated) VALUES(?, ?, ?, NOW());`, [
			JSON.stringify(organisation.name),
			JSON.stringify(organisation.members),
			JSON.stringify(organisation.data),
			JSON.stringify(organisation.inventory),
			JSON.stringify(organisation.money),
			JSON.stringify(organisation.vehicles),
		]);

		console.log("organisation.id", organisation.id);
		organisation.id = result.insertId;
		SendSuccessNotification(src, "Organisation crée avec succées");

		return organisation;
	}

	public static async AddOrganisation(organisation: IOrganisation) {
		const org = new Organisation({
			id: organisation.id,
			name: organisation.name,
			members: organisation.members,
			data: organisation.data,
			inventory: organisation.inventory,
			money: organisation.money,
			vehicles: organisation.vehicles,
		});

		return org;
	}

	public static async GetOrganisation(id: string) {
		const result = await MySQL.QueryAsync("SELECT * FROM organisations WHERE name = ?", [id]);
		if (!result[0]) return false;

		return new Organisation({
			id: result[0].id,
			name: JSON.parse(result[0].name),
			members: JSON.parse(result[0].members),
			data: JSON.parse(result[0].data),
			inventory: JSON.parse(result[0].inventory),
			money: JSON.parse(result[0].money),
			vehicles: JSON.parse(result[0].vehicles),
		});
	}

	public static async SaveOrganisation(data: IOrganisation) {
		await MySQL.QueryAsync("UPDATE organisations SET name = ?, members = ?, data = ?, date_updated = now() WHERE id=?", [
			JSON.stringify(data.name),
			JSON.stringify(data.members),
			JSON.stringify(data.data),
			JSON.stringify(data.inventory),
			JSON.stringify(data.money),
			JSON.stringify(data.vehicles),
			data.id,
		]);
	}

	public static async GetAllOrganisations() {
		const result = await MySQL.QueryAsync("SELECT * FROM organisations", []);
		if (!result) return undefined;
		let resultArray: IOrganisation[] = [];

		result.map((v: any) => {
			resultArray.push({
				id: v.id,
				name: v.name,
				members: v.members,
				data: v.data,
				inventory: v.inventory,
				money: v.money,
				vehicles: v.vehicles,
			});
		});

		return resultArray;
	}
}
