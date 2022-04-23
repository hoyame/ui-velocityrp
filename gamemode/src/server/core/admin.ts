import { Ped, Vector3 } from "@wdesgardin/fivem-js";
import { ScreenshotUtils } from "../utils/screenshot";
import { DiscordUtils } from "../utils/discord";
import { RegisterServerCallback } from "./utils";
import { MySQL } from "./mysql";
import { ISanction } from "../../shared/player/sanction";
import { IReport } from "../../shared/player/report";
import { Delay } from "../../shared/utils/utils";
import { PlayersController } from "../player/playersController";
import { CharactersController } from "../player/charactersController";
import { ItemId, ItemsConfig } from "../../shared/config/items";
import { SendErrorNotification, SendSuccessNotification } from "../utils/notifications";
import { CharacterService } from "../player/services/characterService";
import { Jobs } from "../modules/jobs";
import { JobId } from "../../shared/config/jobs/jobs";
import { ILicenses } from "../../shared/player/character";

export abstract class Admin {
	private static bringBackPos: { [id: number]: Vector3 } = {};
	private static activeAdmins: string[] = [];
	private static adminsWithBlips: string[] = [];
	private static reports: IReport[] = [];
	private static reportId = 0;
	private static updateBlipsInterval = 1000;

	public static async initialize() {
		this.registerCommands();

		onNet("gm:admin:goto", this.goto.bind(this));
		onNet("gm:admin:msg", this.forwardMessage.bind(this));
		onNet("gm:admin:kick", this.kick.bind(this));
		onNet("gm:admin:freeze", this.freeze.bind(this));
		onNet("gm:admin:unfreeze", this.unfreeze.bind(this));
		onNet("gm:admin:kill", this.kill.bind(this));
		onNet("gm:admin:status", this.adminStatusChanged.bind(this));
		onNet("gm:admin:takeReport", this.takeReport.bind(this));
		onNet("gm:admin:deleteReport", this.deleteReport.bind(this));
		onNet("gm:admin:enableBlips", () => this.adminsWithBlips.push(source));
		onNet("gm:admin:setTrollerBucket", () => this.setTrollerBucket(source));
		onNet("gm:admin:disableBlips", () => (this.adminsWithBlips = this.adminsWithBlips.filter(id => id != source)));

		onNet("gm:admin:resetIdentity", (target: string) => {
			emitNet("gm:character:identiy:reset", target);
		});

		RegisterServerCallback("gm:admin:canOpenMenu", () => IsPlayerAceAllowed(source, "admin_menu"));
		RegisterServerCallback("gm:admin:getSanctions", this.getPlayerSanctions.bind(this));
		RegisterServerCallback("gm:admin:getReports", () => this.reports);
		RegisterServerCallback("gm:admin:getPlayers", this.getPlayers.bind(this));
		RegisterServerCallback("gm:admin:characterInfos", this.getCharacterInfos.bind(this));
		RegisterServerCallback("gm:admin:getPlayerCoords", this.getPlayerCoords.bind(this));

		on("playerDropped", this.onPlayerDropped.bind(this));

		setTick(this.blipsTick.bind(this));

		console.log("[GM][Framework] | [Module] - Admin Initialized");
	}

	private static registerCommands() {
		RegisterCommand(
			"report",
			(source: string, messageParts: string[]) => {
				if (!messageParts) return;
				const message = messageParts.join(" ");

				this.reports.push({
					id: ++this.reportId,
					serverId: source,
					message: message,
					dt: Date.now(),
				});

				emitNet("chat:addMessage", source, {
					color: [255, 20, 147],
					args: ["Report", `votre message a été transmis aux modérateurs`],
				});

				for (const admin of this.adminsWithBlips) {
					emitNet("chat:addMessage", admin, {
						color: [255, 20, 147],
						args: ["Nouveau report", `${message} (${GetPlayerName(source)} - ${source})`],
					});
				}
			},
			false
		);

		this.registerAdminCommand(
			"giveItem",
			(_: any, id: string, itemId: ItemId, amount: string) => {
				if (!Number(amount) || Number(amount) < 1) {
					console.log("Quantité invalide");
					return;
				}

				if (!ItemsConfig[itemId]) {
					console.log("Id item invalide");
					return;
				}

				CharactersController.getCharacter(id).additem(itemId, Number(amount), true);
				console.log(`Vous avez donne ${amount} ${itemId} au joueur ${id}`);
			},
			{ minArgs: 3 }
		);

		this.registerAdminCommand(
			"giveMoney",
			(_: any, id: string, transactionId: string, amount: string) => {
				const character = CharactersController.getCharacter(id);
				const money = Number(amount);
				if (!character || !money) return;

				if (transactionId == "1") {
					character.giveBank(money);
				} else if (transactionId == "2") {
					character.giveSaleMoney(money);
				} else {
					character.giveMoney(money);
				}

				console.log(`Vous avez donné ${amount}$ au joueur ${id}`);
			},
			{ minArgs: 3 }
		);

		this.registerAdminCommand(
			"clearInventory",
			(_: string, id: string) => {
				emitNet("gm:player:updateInventory", id, 0);
			},
			{ minArgs: 1 }
		);

		this.registerAdminCommand(
			"clearGarage",
			(src: string, id: string) => {
				emitNet("gm:player:updateGarage", id, 0);
			},
			{ minArgs: 1 }
		);

		this.registerAdminCommand("saveServer", () => CharactersController.saveAll());

		this.registerAdminCommand(
			"screenshot",
			async (source: number, playerId: string) => {
				if (!playerId) return;
				console.log("Screenshot en cours de création...");
				const image = await ScreenshotUtils.takeScreenshot(playerId);
				await DiscordUtils.SendPlayerScreenshot(`Screenshot - Id joueur: ${playerId}`, image);
				console.log("Le screenshot a été envoyé sur Discord.");
			},
			{ minArgs: 1 }
		);

		this.registerAdminCommand(
			"bring",
			(src: string, targetId: string) => {
				if (!targetId) return;

				const pos = new Ped(GetPlayerPed(targetId)).Position;
				this.bringBackPos[Number(targetId)] = pos;

				emitNet("gm:admin:goto", targetId, new Ped(GetPlayerPed(src)).Position);
			},
			{ minArgs: 1, disableInConsole: false }
		);

		this.registerAdminCommand(
			"bringBack",
			(source: string, target: string) => {
				const targetId = Number(target);
				const previousPos = this.bringBackPos[targetId];
				if (!previousPos) return;
				emitNet("gm:admin:goto", targetId, previousPos);
			},
			{ minArgs: 1, disableInConsole: false }
		);

		this.registerAdminCommand("revive", (source: string, target: string) => emitNet("gm:revive", target || source));

		this.registerAdminCommand(
			"warn",
			async (source: string, target: string, ...message: string[]) => {
				const playerId = PlayersController.getPlayer(target)?.id;
				const sourceId = PlayersController.getPlayer(source)?.id;
				if (!playerId || !sourceId || !message) return;

				const msg = message.join(" ");

				await MySQL.QueryAsync("INSERT INTO sanctions (playerId, reason, dt, createdBy, createdByName) VALUES (?,?,?,?,?);", [
					playerId,
					msg,
					new Date().toMysqlString(),
					sourceId,
					GetPlayerName(source),
				]);

				TriggerClientEvent("gm:admin:warn", target, msg);
			},
			{ minArgs: 2, disableInConsole: false }
		);

		this.registerAdminCommand(
			"ban",
			async (source: string, target: string, duration: string, ...reasonParts: string[]) => {
				const targetId = PlayersController.getPlayer(target)?.id;
				const sourceId = PlayersController.getPlayer(source)?.id;
				const reason = reasonParts?.join(" ");

				const endDate = await this.ban(GetPlayerName(source), sourceId, targetId, duration, reason);
				if (!!endDate) DropPlayer(target, `Vous avez été banni jusqu'au ${endDate.toLocaleString()}. Motif: ${reason}`);
			},
			{ minArgs: 3, disableInConsole: false }
		);

		this.registerAdminCommand(
			"banoffline",
			async (source: string, targetId: string, duration: string, ...reasonParts: string[]) => {
				const sourceId = PlayersController.getPlayer(source)?.id;
				const reason = reasonParts?.join(" ");
				await this.ban(GetPlayerName(source), sourceId, Number(targetId), duration, reason);
			},
			{ minArgs: 3, disableInConsole: false }
		);

		this.registerAdminCommand(
			"unbanoffline",
			async (_: string, targetId: string) => {
				try {
					await MySQL.QueryAsync("UPDATE sanctions SET banEnd = ? WHERE banEnd > ? AND playerId = ?", [
						new Date().toMysqlString(),
						new Date().toMysqlString(),
						targetId,
					]);
				} catch (error) {
					console.log("Erreur. Vérifiez que l'id du player est correct.");
					return;
				}

				console.log(`Vous avez débanni ${targetId}.`);
			},
			{ minArgs: 1 }
		);

		this.registerAdminCommand(
			"tp",
			(source: string, x: string, y: string, z: string) => {
				SetEntityCoords(
					GetPlayerPed(source),
					Number(x.replace(",", "")) || 0,
					Number(y.replace(",", "")) || 0,
					Number(z.replace(",", "")) || 0,
					false,
					false,
					false,
					false
				);
			},
			{ minArgs: 3, disableInConsole: false }
		);

		this.registerAdminCommand(
			"dv",
			(source: string, radius: string) => {
				const dist = Math.max(0, Math.min(Number(radius) || 5, 50));
				const pos = Vector3.fromArray(GetEntityCoords(GetPlayerPed(source)));
				let deleted = 0;

				for (const vehicle of GetAllVehicles() as number[]) {
					if (DoesEntityExist(vehicle) && pos.distance(Vector3.fromArray(GetEntityCoords(vehicle))) <= dist) {
						DeleteEntity(vehicle);
						deleted++;
					}
				}

				SendSuccessNotification(source, `~g~${deleted} ~w~vehicule(s) supprimé(s)`);
			},
			{ minArgs: 0, disableInConsole: false }
		);

		this.registerAdminCommand(
			"wipe",
			(source: string, target: string) => {
				const character = CharactersController.getCharacter(target);
				if (!character) {
					if (!!source) {
						console.log(`Le joueur ${target} ~r~n'existe pas`);
					} else {
						SendErrorNotification(source, `Le joueur ${target} ~r~n'existe pas`);
					}
					return;
				}

				DropPlayer(target, "Votre personnage a été wipe par un membre du staff");
				CharacterService.wipe(character.id);
			},
			{ minArgs: 1 }
		);

		this.registerAdminCommand(
			"setJob",
			(source: string, target: string, job: JobId, rank?: string) => {
				if (Jobs.setCharacterJob(target, job, Number(rank))) {
					!!source
						? SendSuccessNotification(source, `Le job de ${target} a été mis à jour`)
						: console.log(`Le job de ${target} a été mis à jour`);
				} else {
					!!source
						? SendErrorNotification(source, `Joueur introuvable et/ou job incorrect`)
						: console.log(`Joueur introuvable et/ou job incorrect`);
				}
			},
			{ minArgs: 2 }
		);

		this.registerAdminCommand(
			"giveLicense",
			(source: string, target: string, licenseName: string) => {
				const char = CharactersController.getCharacter(target);
				if (!char) {
					!source ? console.log(`Joueur introuvable`) : SendErrorNotification(source, `Joueur introuvable`);
					return;
				}

				const key = licenseName as keyof ILicenses;
				if (!key) {
					!source ? console.log(`Nom de license invalide`) : SendErrorNotification(source, `Nom de license invalide`);
					return;
				}

				char.infos.licenses[key] = true;
				emitNet("gm:character:licensesChanged", target, char.infos.licenses);
			},
			{ minArgs: 2 }
		);
	}

	private static registerAdminCommand(
		commandName: string,
		commandHandler: Function,
		options: { disableInConsole?: boolean; minArgs?: number } = {}
	) {
		ExecuteCommand(`add_ace group.admin command.${commandName} allow`);

		RegisterCommand(
			commandName,
			(sourceId: string, args: string[]) => {
				if (!!options?.disableInConsole && !sourceId) {
					console.error(`La command ${commandName} ne peut pas etre executee depuis la console.`);
				} else if (!!options?.minArgs && args.length < options.minArgs) {
					if (!!sourceId) {
						emitNet("chat:addMessage", sourceId, {
							color: [255, 20, 147],
							args: ["Admin", `La command ${commandName} requiert au minimum ${options.minArgs} argument(s)`],
						});
					} else {
						console.error(`La command ${commandName} requiert au minimum ${options.minArgs} argument(s)`);
					}
				} else {
					commandHandler(sourceId, ...args);
				}
			},
			true
		);
	}

	private static async blipsTick() {
		{
			if (this.adminsWithBlips.length == 0) {
				await Delay(1000);
				return;
			}

			const players = getPlayers();

			if (players.length > 512) {
				this.updateBlipsInterval = 10000;
			} else if (players.length > 256) {
				this.updateBlipsInterval = 5000;
			} else if (players.length > 128) {
				this.updateBlipsInterval = 4000;
			} else if (players.length > 96) {
				this.updateBlipsInterval = 3000;
			} else if (players.length > 64) {
				this.updateBlipsInterval = 2000;
			} else {
				this.updateBlipsInterval = 1000;
			}

			const playersData: { [id: string]: any } = {};

			for (const player of players) {
				const id = player.toString();
				const ped = GetPlayerPed(id);

				if (!ped || !DoesEntityExist(ped)) continue;

				playersData[id] = {
					id,
					name: GetPlayerName(id),
					coords: GetEntityCoords(ped),
				};
			}

			for (const admin of this.adminsWithBlips) {
				emitNet("gm:admin:blips", admin, playersData);
			}

			await Delay(this.updateBlipsInterval);
		}
	}

	private static adminStatusChanged(status: boolean) {
		if (status) {
			DiscordUtils.SendAdminLog(
				"**AdversityLife Modération** \n```diff\nLe Staff & ID : " +
					GetPlayerName(source) +
					" (" +
					source +
					")\nVient d'activer le staffMode```"
			);
			this.activeAdmins.push(source);
		} else {
			DiscordUtils.SendAdminLog(
				"**AdversityLife Modération** \n```diff\nLe Staff & ID : " +
					GetPlayerName(source) +
					" (" +
					source +
					")\nVient de désactiver le staffMode```"
			);
			this.activeAdmins = this.activeAdmins.filter(i => i != source);
		}

		this.notifyActiveAdmins();
	}

	private static notifyActiveAdmins() {
		for (const admin of this.activeAdmins) {
			TriggerClientEvent("gm:admin:activeAdmins", admin, this.activeAdmins);
		}
	}

	private static getPlayers() {
		const playersId = getPlayers();
		return playersId.map(id => ({
			id,
			name: GetPlayerName(id.toString()),
			charname: CharactersController.getCharacter(id)?.infos?.name,
		}));
	}

	private static setTrollerBucket(playerId: string) {
		SetPlayerRoutingBucket(playerId, 99999);
	}

	public static goto(targetId: string) {
		const pos = new Ped(GetPlayerPed(targetId)).Position;
		emitNet("gm:admin:goto", source, pos);
	}

	public static forwardMessage(targetId: any, message: any) {
		emitNet("gm:admin:msg", targetId, message);
	}

	public static kick(targetId: any, message: string) {
		DropPlayer(targetId, message);
	}

	public static kill(id: any) {
		const src = source;
		emitNet("gm:admin:kill", src, id);
	}

	public static freeze(targetId: string) {
		new Ped(GetPlayerPed(targetId)).IsPositionFrozen = true;
	}

	public static unfreeze(targetId: string) {
		new Ped(GetPlayerPed(targetId)).IsPositionFrozen = false;
	}

	private static async getPlayerSanctions(source: number, id: number): Promise<ISanction[]> {
		const playerId = PlayersController.getPlayer(id).id;
		if (!id) return [];

		const rows = await MySQL.QueryAsync(
			"SELECT id, reason, dt, (banEnd IS NOT NULL) as isBan, createdByName FROM sanctions WHERE playerId=? ORDER BY dt DESC;",
			[playerId]
		);

		return rows.map((row: any) => ({
			...row,
			dt: Date.parse(row.dt),
		}));
	}

	private static takeReport(reportId: number) {
		const report = this.reports.find(r => r.id == reportId);
		if (!report) return;
		report.takenById = source;

		for (const admin of this.activeAdmins) {
			emitNet("chat:addMessage", admin, {
				color: [255, 20, 147],
				args: ["Report", `Le report ${report.id} a été prit par ${GetPlayerName(source)}`],
			});
		}
	}

	private static deleteReport(reportId: number) {
		const report = this.reports.find(r => r.id == reportId);
		if (!report) return;
		this.reports = this.reports.filter(r => r.id != reportId);

		for (const admin of this.activeAdmins) {
			emitNet("chat:addMessage", admin, {
				color: [255, 20, 147],
				args: ["Report", `Le report ${report.id} a été supprimé par ${GetPlayerName(source)}`],
			});
		}
	}

	private static getCharacterInfos(source: number, id: number) {
		const character = CharactersController.getCharacter(id);
		return {
			bank: character?.money,
			money: character?.getMoney(),
			saleMoney: character?.getSaleMoney(),
			infos: character?.infos,
			job: character?.job,
		};
	}

	private static onPlayerDropped() {
		this.activeAdmins = this.activeAdmins.filter(id => id != source);
		this.adminsWithBlips = this.adminsWithBlips.filter(id => id != source);
		this.notifyActiveAdmins();
	}

	private static async ban(adminName: string, adminId: number, targetId: number, duration: string, ...reasonParts: string[]) {
		if (!adminId || !targetId || !duration || !reasonParts) return;

		let endDate = new Date();
		if (duration == "-1") {
			endDate = endDate.addDays(365 * 50);
		} else if (duration.endsWith("d")) {
			const days = Number(duration.substring(0, duration.length - 1));
			if (!days || days <= 0) return;
			endDate = endDate.addDays(days);
		} else if (duration.endsWith("h")) {
			const hours = Number(duration.substring(0, duration.length - 1));
			if (!hours || hours <= 0) return;
			endDate = endDate.addHours(hours);
		} else {
			return;
		}

		const reason = reasonParts.join(" ");

		console.log(targetId, reason, adminId);

		try {
			await MySQL.QueryAsync("INSERT INTO sanctions (playerId, reason, banEnd, dt, createdBy, createdByName) VALUES (?,?,?,?,?,?);", [
				targetId,
				reason,
				endDate.toMysqlString(),
				new Date().toMysqlString(),
				adminId,
				adminName,
			]);
		} catch (error) {
			console.log("Erreur. Vérifiez que l'id du player est correct.");
			return;
		}

		console.log(`Vous avez banni ${targetId} jusqu'au ${endDate.toLocaleString()}. Motif: ${reason}`);
		return endDate;
	}

	private static getPlayerCoords(_: any, id: string) {
		return Vector3.fromArray(GetEntityCoords(GetPlayerPed(id)));
	}
}
