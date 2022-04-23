import { ICharacterInfos } from "../../player/character";

export enum JobId {
	CHOMAGE = 0,
	LSPD = 1,
	EMS,
	LTD,
	RealEstateAgent,
	Taxi,
	Mecano,
	Unicorn,
}

export interface IJob {
	name: string;
	ranks?: string[];
	salary?: number[];
	vehicles?: {
		cars: string[];
		boats: string[];
		heli: string[];
	};
	weapons?: any;
	clothes?: {
		male: {
			variations: ICharacterInfos["variations"];
			props: ICharacterInfos["props"];
		};
		female: {
			variations: ICharacterInfos["variations"];
			props: ICharacterInfos["props"];
		};
	};
}

export const JobsList: { [key in JobId]: IJob } = {
	[JobId.CHOMAGE]: {
		name: "Chômage",
	},
	[JobId.LSPD]: {
		name: "Police",
		ranks: ["cadet", "sergent", "capitaine"],
		salary: [200, 400, 1000],
		vehicles: {
			cars: [],
			boats: [],
			heli: [],
		},
		weapons: [
			["WEAPON_DOUBLEACTION", "WEAPON_COMBATPDW", "WEAPON_PISTOL50"],
			["WEAPON_DOUBLEACTION", "WEAPON_COMBATPDW", "WEAPON_PISTOL50"],
			["WEAPON_DOUBLEACTION", "WEAPON_COMBATPDW", "WEAPON_PISTOL50"],
			["WEAPON_DOUBLEACTION", "WEAPON_COMBATPDW", "WEAPON_PISTOL50"],
			["WEAPON_DOUBLEACTION", "WEAPON_COMBATPDW", "WEAPON_PISTOL50"],
		],
	},
	[JobId.EMS]: {
		name: "Médecin",
		ranks: ["infirmier", "rang 1", "rang 2", "rang 3", "rang 4"],
		salary: [200, 350, 500, 700, 1000],
		vehicles: {
			cars: [],
			boats: [],
			heli: [],
		},
	},
	[JobId.LTD]: {
		name: "LTD",
		ranks: ["vendeur", "patron"],
		salary: [500, 1000],
		vehicles: {
			cars: [],
			boats: [],
			heli: [],
		},
	},
	[JobId.RealEstateAgent]: {
		name: "Agent Immobilier",
		ranks: ["vendeur", "patron"],
		salary: [500, 1000],
		vehicles: {
			cars: [],
			boats: [],
			heli: [],
		},
	},
	[JobId.Taxi]: {
		name: "Taxi",
		ranks: ["Chauffeur", "Patron"],
		salary: [200, 1000],
		vehicles: {
			cars: [],
			boats: [],
			heli: [],
		},
		clothes: {
			male: {
				variations: {
					[1]: [0, 0],
					[3]: [11, 0],
					[4]: [4, 0],
					[5]: [0, 0],
					[6]: [10, 0],
					[7]: [0, 0],
					[8]: [93, 0],
					[9]: [0, 0],
					[10]: [0, 0],
					[11]: [25, 0],
				},
				props: {},
			},
			female: {
				variations: {
					[1]: [0, 0],
					[3]: [0, 0],
					[4]: [0, 1],
					[5]: [0, 0],
					[6]: [0, 0],
					[7]: [0, 0],
					[8]: [24, 0],
					[9]: [0, 0],
					[10]: [0, 0],
					[11]: [28, 6],
				},
				props: {},
			},
		},
	},
	[JobId.Mecano]: {
		name: "Mecano",
		ranks: ["vendeur", "patron"],
		salary: [500, 1000],
		vehicles: {
			cars: [],
			boats: [],
			heli: [],
		},
	},
	[JobId.Unicorn]: {
		name: "Unicorn",
		ranks: ["vendeur", "patron"],
		salary: [500, 1000],
		vehicles: {
			cars: [],
			boats: [],
			heli: [],
		},
	},
};

export const SalaryMinutesInterval = 15;
