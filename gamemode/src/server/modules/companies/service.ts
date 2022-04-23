import { ICompany } from "../../../shared/types/company";
import { MySQL } from "../../core/mysql";
import { Company } from "./model";

export class CompanyService {
	// imo pas besoin

	//private static async CreateCompany(playerId: string, newCompany: ICompany) {
	//	const company = new Company({
	//		id: 0,
	//		idJob: newCompany.idJob,
	//		name: newCompany.name,
	//		members: [playerId],
	//		inventory: [],
	//		money: [0, 0],
	//	});

	//	const result = await MySQL.QueryAsync(`INSERT INTO companies(name, members, data, date_updated) VALUES(?, ?, ?, NOW());`, [
	//		JSON.stringify(company.idJob),
	//		JSON.stringify(company.name),
	//		JSON.stringify(company.members),
	//		JSON.stringify(company.inventory),
	//		JSON.stringify(company.money),
	//	]);

	//	company.id = result.insertId;

	//	return company;
	//}

	public static AddCompany(company: ICompany) {
		const cmp = new Company({
			id: company.id,
			idJob: company.idJob,
			name: company.name,
			inventory: company.inventory,
			money: company.money,
		});

		return cmp;
	}

	public static async GetCompany(id: number) {
		const result = await MySQL.QueryAsync("SELECT * FROM companies WHERE id = ?", [id]);
		if (!result[0]) return undefined;

		return new Company({
			id: result[0].id,
			idJob: result[0].idJob,
			name: JSON.parse(result[0].name),
			inventory: JSON.parse(result[0].inventory),
			money: JSON.parse(result[0].money),
		});
	}

	public static async SaveCompany(data: ICompany) {
		await MySQL.QueryAsync("UPDATE companies SET inventory = ?, money = ?, date_updated = now() WHERE id=?", [
			JSON.stringify(data.name),
			JSON.stringify(data.inventory),
			JSON.stringify(data.money),
			data.id,
		]);
	}

	public static async GetAllCompanies() {
		const result = await MySQL.QueryAsync("SELECT * FROM companies", []);
		if (!result) return undefined;

		return result;
	}
}
