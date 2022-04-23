import { OpenOrgMenu, OrgaCreator } from "./menu";
import { OrganisationProperty } from "./property";

export abstract class Organisation {
	public static async initialize() {
		await OrganisationProperty.initialize();

		RegisterCommand("openGerOrg", OpenOrgMenu, false);
		RegisterCommand("orgaCreator", OrgaCreator, false);
	}
}
