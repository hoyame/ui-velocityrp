import { ICharacter, ICharacterInfos, ILicenses, INewCharacter } from "../../shared/player/character";
import { Environnment } from "../../shared/utils/environnment";
import { BroadcastAbovePedText, onMeCommand, RegisterServerCallback } from "../core/utils";
import { Character } from "./models/character";
import { PlayersController } from "./playersController";
import { CharacterService } from "./services/characterService";
import Config from "../../shared/config/server.json";
import { parse } from "path";

export abstract class CharactersController {
	private static allCharacters: { [id: number]: Character } = {};

	public static getCharacters() {
		return this.allCharacters;
	}

	public static getCharacter(networkId: number | string) {
		return this.allCharacters[+networkId];
	}

	public static async initialize() {
		exports("getCharacterId", (source: string | number) => this.allCharacters[+source]?.id);
		exports(
			"getSourceFromCharacterId",
			(id: string | number) => Object.entries(this.allCharacters).find(([_, char]) => char.id == id)?.[0]
		);
		RegisterServerCallback("gm:character:create", this.createCharacter.bind(this));
		RegisterServerCallback("gm:character:getInfos", this.getCharacterInfos.bind(this));
		RegisterServerCallback("gm:character:getMoney", this.getCharacterMoney.bind(this));
		RegisterServerCallback("gm:pay", this.pay.bind(this));
		RegisterServerCallback("gm:character:getLodaout", this.getLodaout.bind(this));
		RegisterServerCallback("gm:character:getBillings", this.getBillings.bind(this));

		RegisterCommand("me", onMeCommand, false);

		onNet("gm:character:updateInfos", this.updateCharacterInfos.bind(this));
		onNet("gm:character:updateLodaout", this.updateLodaout.bind(this));

		onNet("gm:character:setJob", this.setJob.bind(this));
		onNet("gm:character:setOrg", this.setOrg.bind(this));

		onNet("gm:character:bigWeaponOut", () => BroadcastAbovePedText("* Sort une arme lourde *", source));
		onNet("gm:character:weaponOut", () => BroadcastAbovePedText("* Sort une arme *", source));
		onNet("gm:character:meleeWeaponOut", () => BroadcastAbovePedText("* Sort une arme blanche *", source));
		onNet("gm:character:addLicense", () => this.addLicense.bind(this));
		onNet("gm:character:removeLicense", () => this.removeLicense.bind(this));
		onNet("gm:character:giveWeapon", () => this.giveWeapon.bind(this));

		on("playerDropped", this.onPlayerDropped.bind(this));

		setInterval(this.saveAll.bind(this), Environnment.IsDev ? 10000 : Config.autoSave);
	}

	private static giveWeapon(target: number, weapon: string, ammo: number) {
		if (!source) return;
		if (!target) return;

		emitNet("gm:character:weapon:removeWeapon", source, weapon, ammo);
		emitNet("gm:character:weapon:addWeapon", target, weapon, ammo);
	}

	private static async createCharacter(source: number, newCharacter: INewCharacter) {
		const player = PlayersController.getPlayer(source);
		const character = await CharacterService.CreateCharacter(player.id, newCharacter);
		this.allCharacters[source] = character;
		return character.infos;
	}

	public static async getCharacterWithCharacterID(characterId: number): Promise<Character | undefined> {
		return await CharacterService.GetCharacterWithCharacterID(characterId);
	}

	private static async getCharacterInfos(source: number) {
		const player = await PlayersController.loadPlayer(source);
		const character = await CharacterService.GetCharacter(player.id);

		if (!!character) {
			for (const [src, char] of Object.entries(this.allCharacters)) {
				if (char.id == character.id) {
					DropPlayer(src, "Double connexion");
					delete this.allCharacters[+src];
				}
			}
			this.allCharacters[source] = character;
		}

		return character?.infos;
	}

	private static async getBillings(source: number, target?: number) {
		const src = target || source;

		return this.allCharacters[src]?.billings || [];
	}

	private static async getCharacterMoney(source: number) {
		return this.allCharacters[source]?.money;
	}

	private static updateCharacterInfos(characterInfos: ICharacterInfos) {
		const character = this.allCharacters[+source];
		if (!!character) {
			if (!!GetPlayerRoutingBucket(source)) characterInfos.position = character.infos.position;
			character.infos = characterInfos;
		}
	}

	private static getLodaout(source: number, callback: Function) {
		return this.getCharacter(source)?.lodaout || [];
	}

	private static updateLodaout(lodaout: []) {
		this.allCharacters[+source].lodaout = lodaout;
	}

	public static updateVehicles(id: number, vehicles: any[]) {
		this.allCharacters[id].vehicles = vehicles;
	}

	private static async onPlayerDropped() {
		const character = this.allCharacters[+source];
		if (!!character) {
			await CharacterService.SaveCharacter(character);
			delete this.allCharacters[+source];
		}
	}

	private static pay(source: number, amount: number) {
		return !!this.allCharacters[source]?.pay(amount);
	}

	private static setJob(data: ICharacter["job"]) {
		return this.allCharacters[parseInt(source)]?.setJob(data);
	}

	private static setOrg(data: ICharacter["org"]) {
		return this.allCharacters[parseInt(source)]?.setOrg(data);
	}

	public static async saveAll() {
		console.log("Auto-save start...");
		const start = GetGameTimer();

		const characters = Object.values(this.allCharacters);
		for (const character of characters) {
			await CharacterService.SaveCharacter(character);
		}
		console.log(`Auto save done. ${characters.length} character(s) saved in ${GetGameTimer() - start} ms`);
	}

	public static removeLicense(license: keyof ILicenses, id: string) {
		const character = this.getCharacter(source || id);
		if (!character) return;

		character.infos.licenses[license] = false;
	}

	public static addLicense(license: keyof ILicenses, id?: string) {
		const character = this.getCharacter(id || source);
		const licenseName = license.toString();
		if (!character) return;

		if (license == "car") {
			if (!character.pay(Config.licenses["car"])) return;
		} else if (license == "motorCycle") {
			if (!character.pay(Config.licenses["motorCycle"])) return;
		} else if (license == "truck") {
			if (!character.pay(Config.licenses["truck"])) return;
		}

		character.infos.licenses[license] = true;
	}

	public static deposer(src: string, amount: number) {
		const source = parseInt(src);
		const character = this.allCharacters[source];

		if (!character) return;
		const money = character.getItemQuantity("money");
		if (money < amount) return;

		character.removeMoney(amount);
		character.giveBank(amount);
	}

	public static retirer(src: string, amount: number) {
		const source = parseInt(src);
		const character = this.allCharacters[source];

		if (!character || character.money < amount) return;

		character.removeBank(amount);
		character.giveMoney(amount);
	}

	public static removeCharacter(source: number | string) {
		delete this.allCharacters[+source];
	}
}
