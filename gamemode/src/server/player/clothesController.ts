import { RegisterServerCallback } from "../core/utils";
import { CharactersController } from "./charactersController";
import ClothesConfig from "../../shared/config/clothes/clothes.json";
import AccessoriesConfig from "../../shared/config/clothes/accessories.json";
import MasksConfig from "../../shared/config/clothes/masks.json";
import { SendErrorNotification, SendNotification } from "../utils/notifications";
import { IClotheConfig, IClothItem } from "../../shared/types/clothes";
import { IAccessoryConfig } from "../../shared/types/accessories";

export abstract class ClothesController {
	private static clothes = ClothesConfig as IClotheConfig[];
	private static accessories = AccessoriesConfig as IAccessoryConfig[];

	public static async initialize() {
		RegisterServerCallback("gm:clothes:buy", this.buyClothes.bind(this));
		RegisterServerCallback("gm:clothes:buyAccessory", this.buyAccessory.bind(this));
		RegisterServerCallback("gm:clothes:buyMask", this.buyMask.bind(this));
	}

	private static buyClothes(source: number, args: { outfitIndex: number; clothIndex: number; texture?: number }) {
		const character = CharactersController.getCharacter(source);
		if (!character) return;

		const cloth =
			character?.infos?.sex == "1"
				? this.clothes[args.outfitIndex]?.female?.[args.clothIndex]
				: this.clothes[args.outfitIndex]?.male?.[args.clothIndex];

		const item = this.clothes[args.outfitIndex]?.itemId;
		if (!cloth || !item) return;

		if (!character.canCarry(item, 1)) {
			SendErrorNotification(source, "Vous n'avez ~r~pas assez de place~w~ pour porter ceci");
			return false;
		}

		if (!character.pay(cloth.price)) {
			SendErrorNotification(source, "Vous n'avez ~r~pas assez d'argent~w~ pour achetter ceci", "money");
			return false;
		}

		let variations = cloth.variations;
		if (!!cloth.customVariation) {
			const drawableTexture =
				args.texture != undefined && cloth.customVariation.textures.includes(args.texture)
					? args.texture
					: Number(cloth.customVariation.textures[0] || 0);

			variations = {
				...cloth.variations,
				[cloth.customVariation.componentId]: [cloth.customVariation.drawableId, drawableTexture],
			};
		}

		character.additem(item, 1, true, {
			variations,
			sexRestriction: character?.infos?.sex || "0",
			renamed: cloth.name || `${this.clothes[args.outfitIndex]?.defaultName} ${args.clothIndex + 1}`,
		});

		return true;
	}

	private static buyAccessory(source: number, args: { configIndex: number; accessoryIndex: number; texture: number }) {
		const character = CharactersController.getCharacter(source);
		if (!character) return;

		const accessory =
			character?.infos?.sex == "1"
				? this.accessories[args.configIndex]?.female?.[args.accessoryIndex]
				: this.accessories[args.configIndex]?.male?.[args.accessoryIndex];

		const item = this.accessories[args.configIndex]?.itemId;
		if (!accessory || !item) return;

		if (!character.canCarry(item, 1)) {
			SendErrorNotification(source, "Vous n'avez ~r~pas assez de place~w~ pour porter ceci");
			return false;
		}

		if (!character.pay(accessory.price)) {
			SendErrorNotification(source, "Vous n'avez ~r~pas assez d'argent~w~ pour achetter ceci", "money");
			return false;
		}

		const texture = accessory.textures.includes(args.texture) ? args.texture : Number(accessory.textures[0] || 0);

		character.additem(item, 1, true, {
			pedProp: { componentId: accessory.componentId, drawableId: accessory.drawableId, textureId: texture },
			sexRestriction: character?.infos?.sex || "0",
			renamed: accessory.name || `${this.accessories[args.configIndex]?.defaultName} ${args.accessoryIndex + 1}`,
		});

		return true;
	}

	private static buyMask(source: number, args: { clothIndex: number; texture?: number }) {
		const character = CharactersController.getCharacter(source);
		if (!character) return;

		const cloth = (
			character?.infos?.sex == "1" ? MasksConfig.female?.[args.clothIndex] : MasksConfig.male?.[args.clothIndex]
		) as IClothItem;

		if (!cloth) return;

		if (!character.canCarry("mask", 1)) {
			SendErrorNotification(source, "Vous n'avez ~r~pas assez de place~w~ pour porter ceci");
			return false;
		}

		if (!character.pay(cloth.price)) {
			SendErrorNotification(source, "Vous n'avez ~r~pas assez d'argent~w~ pour achetter ceci", "money");
			return false;
		}

		let variations = cloth.variations;
		if (!!cloth.customVariation) {
			const drawableTexture =
				args.texture != undefined && cloth.customVariation.textures.includes(args.texture)
					? args.texture
					: Number(cloth.customVariation.textures[0] || 0);

			variations = {
				...cloth.variations,
				[cloth.customVariation.componentId]: [cloth.customVariation.drawableId, drawableTexture],
			};
		}

		character.additem("mask", 1, true, {
			variations,
			sexRestriction: character?.infos?.sex || "0",
			renamed: cloth.name || `Masque ${args.clothIndex + 1}`,
		});

		return true;
	}
}
