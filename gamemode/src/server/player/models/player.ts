import { ICharacter } from "../../../shared/player/character";
import { IPlayer } from "../../../shared/player/player";
import { Character } from "./character";

export class Player implements IPlayer {
	id: number;
	name: string;
	steam: string;
	license: string;
	license2: string;
	discord: string;
	fivem: string;
	xbl: string;
	live: string;
	ip: string;
	hwid: string;
	rank: string;
	coins: number;
	vip: number;

	constructor(player: IPlayer) {
		this.id = player.id;
		this.name = player.name;
		this.steam = player.steam;
		this.license = player.license;
		this.license2 = player.license2;
		this.discord = player.discord;
		this.fivem = player.fivem;
		this.xbl = player.xbl;
		this.live = player.live;
		this.ip = player.ip;
		this.hwid = player.hwid;
		this.rank = player.rank;
		this.coins = player.coins;
		this.vip = player.vip;
	}

	public addCoins(amount: number) {
		this.coins += amount;
		return amount;
	}

	public getCoins() {
		return this.coins;
	}

	public removeCoins(amount: number) {
		this.coins -= amount;
	}
}
