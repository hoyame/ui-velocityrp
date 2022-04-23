import { ICharacterJob } from "../../shared/player/character";
import { RegisterServerCallback } from "../core/utils";
import { CharactersController } from "./charactersController";

export abstract class JobController {
	public static async initialize() {
		RegisterServerCallback("gm:character:job:get", this.get.bind(this));

		onNet("gm:character:job:set", this.set.bind(this));
		onNet("gm:character:job:promote", this.promote.bind(this));
		onNet("gm:character:job:derank", this.derank.bind(this));
		onNet("gm:character:job:recruit", this.recruit.bind(this));
		onNet("gm:character:job:kick", this.kick.bind(this));
	}

	public static async get(source: number) {
		const character = CharactersController.getCharacter(source);
		if (character) {
			return character.job;
		}
	}

	public static async set(source: string, target: string, data: ICharacterJob) {
		const character = CharactersController.getCharacter(target);

		if (character) {
			character.setJob(data);
		}
	}

	public static async promote(source: string, target: string) {
		const character = CharactersController.getCharacter(source);
		if (character.job.rank !== 4) return false;

		const targetCharacter = CharactersController.getCharacter(target);
		let job = targetCharacter.job;
		job.rank = job.rank || 0;
		job.rank += 1;

		if (targetCharacter) {
			targetCharacter.setJob(job);
		}
	}

	public static async kick(source: string, target: string) {
		const character = CharactersController.getCharacter(source);
		if (character.job.rank !== 4) return false;

		const targetCharacter = CharactersController.getCharacter(target);

		if (targetCharacter) {
			targetCharacter.setJob({});
		}
	}

	public static async derank(source: string, target: string) {
		const character = CharactersController.getCharacter(source);
		if (character.job.rank !== 4) return false;

		const targetCharacter = CharactersController.getCharacter(target);
		let job = targetCharacter.job;
		job.rank = job.rank || 0;
		job.rank -= 1;

		if (targetCharacter) {
			targetCharacter.setJob(job);
		}
	}

	public static async recruit(source: string, target: string) {
		const character = CharactersController.getCharacter(source);
		if (character.job.rank !== 4) return false;

		const targetCharacter = CharactersController.getCharacter(target);

		if (targetCharacter) {
			targetCharacter.setJob({
				rank: 0,
				id: character.job.id,
			});
		}
	}
}
