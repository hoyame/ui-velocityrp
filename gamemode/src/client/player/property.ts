import { Character } from "./character";

export class Property {
	public static async initialize() {
		console.log("[GM][Framework] | [Module] - Property Initialized");
	}

	public static addProperty(propertyName: string, propertyId: string) {
		// let properties = Character.getCurrent()?.properties;
		// properties?.push([propertyName, propertyId]);
		// Character.updatePlayer({
		// 	properties: properties,
		// });
	}

	public static removeProperty(propertiesId: string) {
		// let properties = Character.getCurrent()?.properties;
		// properties = properties.filter((x: any) => x[1] != propertiesId);
		// Character.updatePlayer({
		// 	properties: properties,
		// });
	}

	public static returnProperties() {
		// return Character.getCurrent()?.properties;
	}
}
