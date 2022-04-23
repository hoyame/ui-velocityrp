import { ICharacterOrg } from "../../shared/player/character";
import { Callback, RegisterServerCallback } from "../core/utils";
import { CharactersController } from "./charactersController";

export abstract class OrgController {
	public static async initialize() {
		RegisterServerCallback("gm:character:org:get", this.get.bind(this));

		onNet("gm:character:org:set", this.set.bind(this));
		onNet("gm:character:org:promote", this.promote.bind(this));
		onNet("gm:character:org:derank", this.derank.bind(this));
		onNet("gm:character:org:recruit", this.recruit.bind(this));
	}

	public static async get(source: number) {
		const character = CharactersController.getCharacter(source);
		if (character) {
			return character.org;
		}
	}

	public static async set(source: string, data: ICharacterOrg) {
		const character = CharactersController.getCharacter(source);

		if (character) {
			character.setOrg(data);
		}
	}

	public static async promote(source: string) {
		const character = CharactersController.getCharacter(source);
		let org = character.org;
		org.rank = org.rank || 0;
		org.rank += 1;

		if (character) {
			character.setOrg(org);
		}
	}

	public static async derank(source: string) {
		const character = CharactersController.getCharacter(source);
		let org = character.org;
		org.rank = org.rank || 0;
		org.rank -= 1;

		if (character) {
			character.setOrg(org);
		}
	}

	public static async recruit(source: string, target: string, data: ICharacterOrg) {
		const character = CharactersController.getCharacter(target);

		if (character) {
			character.setOrg(data);
		}
	}
}
