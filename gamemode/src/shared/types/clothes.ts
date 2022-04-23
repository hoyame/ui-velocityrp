export interface IClothItem {
	name?: string;
	price: number;
	customVariation?: { componentId: number; drawableId: number; textures: number[] };
	variations: { [componentId: string]: number[] };
}

export interface IClotheConfig {
	category: string;
	defaultName: string;
	itemId: string;
	male: IClothItem[];
	female: IClothItem[];
}
