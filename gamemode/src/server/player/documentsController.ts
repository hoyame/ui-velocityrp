import { ICharacterInfos } from "../../shared/player/character";

export abstract class DocumentsController {
	public static async initialize() {
		onNet("gm:showId", (targets: (number | string)[], name: string, document: string) => {
			for (const target of targets) {
				TriggerClientEvent("gm:showIdTarget", target, name, source, document);
			}
		});

		onNet("gm:documents:showDriving", (targets: (number | string)[], name: string, licenses: ICharacterInfos["licenses"]) => {
			for (const target of targets) {
				TriggerClientEvent("gm:showDrivingTarget", target, name, source, licenses);
			}
		});

		onNet("gm:documents:showPolice", (targets: (number | string)[], name: string) => {
			for (const target of targets) {
				TriggerClientEvent("gm:showPoliceTarget", target, name, source);
			}
		});

		onNet("gm:documents:showCertificat", (targets: (number | string)[], name: string, doctor: string) => {
			for (const target of targets) {
				TriggerClientEvent("gm:showCertificatTarget", target, name, doctor);
			}
		});
	}
}
