export interface IGarage {
	id?: number;
	name?: string;
	garageType: number;
	ownerCharacterId: number;
	bought: boolean;
	rent_dt?: Date;
}
