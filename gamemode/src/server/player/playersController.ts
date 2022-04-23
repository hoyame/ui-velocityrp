import { PlayerService } from "./services/playerService";
import { Player } from "./models/player";
import { GetPlyIdentifiers } from "./playerIdentifiers";
import { Environnment } from "../../shared/utils/environnment";
import { RegisterServerCallback } from "../core/utils";

export class PlayersController {
	private static allPlayers: { [id: number]: Player } = {};

	public static getPlayers() {
		return this.allPlayers;
	}

	public static getPlayer(networkId: number | string) {
		return this.allPlayers[+networkId];
	}

	public static async initialize() {
		on("playerConnecting", this.onPlayerConnecting.bind(this));
		on("playerDropped", this.onPlayerDropped.bind(this));
		RegisterServerCallback("gm:character:getCoinsData", this.getCoinsData.bind(this));

		RegisterCommand(
			"addCoins",
			(sourceId: string, args: string[]) => {
				if (parseInt(sourceId) !== 0) return;
				console.log(sourceId);
				const characterId = parseInt(args[0]);
				const amount = parseInt(args[1]);

				this.addCoins(characterId, amount);
			},
			false
		);

		RegisterCommand(
			"setVip",
			(sourceId: string, args: string[]) => {
				if (parseInt(sourceId) !== 0) return;
				console.log(sourceId);
				const characterId = parseInt(args[0]);
				const state = parseInt(args[1]);

				this.setVip(characterId, state);
			},
			false
		);

		console.log("[GM][Framework] | [Module] - PlayerManager Initialized");
	}

	private static async getCoinsData(source: number) {
		const character = this.getPlayer(source).id;
		const d = await PlayerService.getCoins(character);

		return {
			id: character,
			coins: d?.coins,
			vip: d?.vip,
		};
	}

	private static async addCoins(characterId: number, amount: number) {
		return await PlayerService.addCoins(characterId, amount);
	}

	private static async setVip(characterId: number, state: number) {
		return await PlayerService.setVip(characterId, state);
	}

	public static async loadPlayer(source: number) {
		if (this.allPlayers[source]) return this.allPlayers[source];

		const identifiers = GetPlyIdentifiers(source);
		let player = await PlayerService.GetPlayerByLicense(identifiers.license);
		if (!player) {
			player = await PlayerService.CreatePlayer({
				name: GetPlayerName(source.toString()),
				license: identifiers.license,
				license2: identifiers.license2 || "",
				steam: identifiers.steam || "",
				live: identifiers.live || "",
				xbl: identifiers.xbl || "",
				discord: identifiers.discord || "",
				fivem: identifiers.fivem || "",
				ip: identifiers.ip || "",
				hwid: GetPlayerToken(source.toString(), 0),
			});
		}

		this.allPlayers[source] = player;
		console.log(`Player ${GetPlayerName(source.toString())} added (source: ${source}, id: ${player.id})`);
		if (Environnment.IsDev) {
			//console.log("DEV: " + JSON.stringify(identifiers));
		}

		return player;
	}

	private static async onPlayerConnecting(name: string, _: any, deferrals: any) {
		deferrals.defer();

		const identifiers = GetPlyIdentifiers(source);
		if (!identifiers.license) {
			setTimeout(() => deferrals.done("Connection impossible. license introuvable."), 0);
			return;
		}

		const hwid = GetPlayerToken(source, 0);
		const ban = await PlayerService.GetActiveBan(identifiers.license, hwid);
		if (!!ban) {
			setTimeout(() => {
				console.log(`Disconnecting banned player ${name}`);
				deferrals.done(`Vous avez été banni jusqu'au ${ban.banEnd.toLocaleString()}. Motif: ${ban.reason}`);
			}, 0);
			return;
		}

		if (Environnment.IsDev) {
			setTimeout(() => deferrals.done(), 0);
			return;
		}

		deferrals.presentCard(
			{
				type: "AdaptiveCard",
				body: [
					{
						type: "ColumnSet",
						columns: [
							{
								type: "Column",
								items: [
									{
										type: "Image",
										url: "https://pbs.twimg.com/ext_tw_video_thumb/1422877849107804168/pu/img/4IvltHvgsIG7Dm0n.jpg",
										size: "Large",
									},
									{
										type: "TextBlock",
										weight: "Bolder",
										text: "AdversityLife v2",
										wrap: true,
									},
								],
								width: "auto",
							},
						],
					},
					{
						type: "TextBlock",
						text: "Rendez vous sur le discord pour trouver le mot de passe !",
						wrap: true,
					},
					{
						type: "Input.Text",
						placeholder: "Veuillez entrer le mot de passe ci-dessous.",
						id: "mdp",
					},
					{
						type: "ActionSet",
						actions: [
							{
								type: "Action.Submit",
								title: "Se Connecter",
							},
						],
					},
					{
						type: "ActionSet",
						actions: [
							{
								type: "Action.OpenUrl",
								title: "Rejoindre le Discord",
								url: "https://discord.gg/1111111",
							},
						],
					},
				],
				$schema: "http://adaptivecards.io/schemas/adaptive-card.json",
				version: "1.0",
			},
			(data: { mdp: string }, rawData: any) => {
				if ("zebi" == data.mdp) {
					deferrals.done();
				} else {
					deferrals.done("Mauvais mot de passe, il est trouvable sur le discord : discord.gg/DBQZpUHdQB");
				}
			}
		);
	}

	private static onPlayerDropped(reason: any) {
		delete this.allPlayers[+source];
		console.log(`Player ${GetPlayerName(source)} dropped (Reason: ${reason}).`);
	}
}
