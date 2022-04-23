export interface IAccessoryItem {
	name?: string;
	price: number;
	componentId: number;
	drawableId: number;
	textures: number[];
}

export interface IAccessoryConfig {
	category: string;
	defaultName: string;
	itemId: string;
	male: IAccessoryItem[];
	female: IAccessoryItem[];
}
