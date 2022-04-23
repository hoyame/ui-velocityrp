export interface PlayerIdentifiers {
	license: string;
	license2?: string;
	discord?: string;
	steam?: string;
	live?: string;
	xbl?: string;
	fivem?: string;
	ip?: string;
}

export const GetPlyIdentifiers = (source: string | number): PlayerIdentifiers => {
	const identifiers = getPlayerIdentifiers(source);

	return identifiers.reduce(
		(items, item) => {
			const [idType, value] = item.split(":");
			//@ts-ignore
			items[idType] = value;
			return items;
		},
		{ license: "" }
	);
};
