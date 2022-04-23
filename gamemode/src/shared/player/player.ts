export interface INewPlayer {
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
}

export interface IPlayer extends INewPlayer {
	id: number;
	rank: string;
	coins: number;
	vip: number;
}
