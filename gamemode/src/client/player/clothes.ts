import { Game, Model, Screen } from "@nativewrappers/client";
import { JobsList } from "../../shared/config/jobs/jobs";
import { ICharacterInfos } from "../../shared/player/character";
import Config from "../../shared/config/client.json";
import { Admin } from "../core/admin";
import { CharacterCreator } from "../modules/player/character/charactercreator";
import { Character } from "./character";
import { Inventory } from "./inventory";
import { Jobs } from "./jobs";
import { Notifications } from "./notifications";

export const maleDefaultVariations = {
	[1]: [0, 0],
	[3]: [15, 0],
	[4]: [21, 0],
	[5]: [0, 0],
	[6]: [34, 0],
	[7]: [0, 0],
	[8]: [15, 0],
	[9]: [0, 0],
	[10]: [0, 0],
	[11]: [15, 0],
};

export const femaleDefaultVariations = {
	[1]: [0, 0],
	[3]: [15, 0],
	[4]: [15, 0],
	[5]: [0, 0],
	[6]: [35, 0],
	[7]: [0, 0],
	[8]: [2, 0],
	[9]: [0, 0],
	[10]: [0, 0],
	[11]: [15, 0],
};

export class Clothes {
	private static variations: ICharacterInfos["variations"] = {};
	private static props: ICharacterInfos["props"] = {};

	static hasVariations(variations: { [key: string]: number[] }) {
		for (const [componentId, variation] of Object.entries(variations)) {
			if (
				!this.variations[+componentId] ||
				this.variations[+componentId][0] != variation[0] ||
				this.variations[+componentId][1] != (variation[1] || 0)
			) {
				return false;
			}
		}
		return true;
	}

	public static addVariations(variations: { [key: string]: number[] }, save = true) {
		if (!this.ensureCanChangeClothes()) return;

		if (save && !!variations["5"]) {
			if (variations["5"][0] == 0 && this.variations[5]?.[0] > 0) {
				if (Inventory.canRemoveBag()) {
					emitNet("gm:inventory:haveBag", false);
				} else {
					Notifications.ShowError(
						"~r~Action impossible~w~~n~Vous ne pouvez pas enlever votre sac, vous portez trop d'objets sur vous"
					);
					return;
				}
			} else if (variations["5"][0] != 0 && (!this.variations[5] || this.variations[5]?.[0] == 0)) {
				emitNet("gm:inventory:haveBag", true);
			}
		}

		for (const [componentId, variation] of Object.entries(variations)) {
			SetPedComponentVariation(PlayerPedId(), +componentId, variation[0] || 0, variation[1] || 0, 0);
			if (save) this.variations[+componentId] = [variation[0], variation[1] || 0];

			if (componentId == "1") {
				const hash = GetHashNameForComponent(Game.PlayerPed.Handle, 1, variation[0], variation[1] || 0);
				if (DoesShopPedApparelHaveRestrictionTag(hash, GetHashKey("shrink_head"), 0)) {
					this.shrinkPedHead();
				} else {
					this.resetPedHead();
				}
			}
		}

		Inventory.updateMaxWeight();
	}

	private static shrinkPedHead() {
		const pedModel = Game.PlayerPed.Model;
		const skin = Character.getCurrent()?.skin;
		if (!!skin) {
			if (pedModel.Hash == new Model("mp_m_freemode_01").Hash) {
				SetPedHeadBlendData(Game.PlayerPed.Handle, 0, 0, 0, skin[1], skin[2], 0, 0, skin[4], 0, false);
				SetPedComponentVariation(Game.PlayerPed.Handle, 0, 0, 0, 2);
			} else {
				SetPedHeadBlendData(Game.PlayerPed.Handle, 21, 0, 0, skin[1], skin[2], 0, 0, skin[4], 0, false);
				SetPedComponentVariation(Game.PlayerPed.Handle, 0, 21, 0, 2);
			}
		}

		for (let i = 0; i < 19; i++) {
			SetPedFaceFeature(Game.PlayerPed.Handle, i, 0);
		}
	}

	private static resetPedHead() {
		const skin = Character.getCurrent()?.skin;
		if (!skin) return;
		SetPedHeadBlendData(Game.PlayerPed.Handle, skin[1], skin[2], 0, skin[1], skin[2], 0, skin[3], skin[4], 0, false);
		SetPedComponentVariation(Game.PlayerPed.Handle, 0, skin[1], 0, 2);
		SetPedFaceFeature(Game.PlayerPed.Handle, 0, skin[5]);
		SetPedFaceFeature(Game.PlayerPed.Handle, 1, skin[6]);
		SetPedFaceFeature(Game.PlayerPed.Handle, 2, skin[7]);
		SetPedFaceFeature(Game.PlayerPed.Handle, 3, skin[8]);
		SetPedFaceFeature(Game.PlayerPed.Handle, 4, skin[9]);
		SetPedFaceFeature(Game.PlayerPed.Handle, 5, skin[10]);
		SetPedFaceFeature(Game.PlayerPed.Handle, 6, skin[11]);
		SetPedFaceFeature(Game.PlayerPed.Handle, 7, skin[12]);
		SetPedFaceFeature(Game.PlayerPed.Handle, 8, skin[13]);
		SetPedFaceFeature(Game.PlayerPed.Handle, 9, skin[14]);
		SetPedFaceFeature(Game.PlayerPed.Handle, 11, skin[15]);
		SetPedFaceFeature(Game.PlayerPed.Handle, 12, skin[16]);
		SetPedFaceFeature(Game.PlayerPed.Handle, 13, skin[17]);
		SetPedFaceFeature(Game.PlayerPed.Handle, 14, skin[18]);
		SetPedFaceFeature(Game.PlayerPed.Handle, 15, skin[19]);
		SetPedFaceFeature(Game.PlayerPed.Handle, 16, skin[20]);
		SetPedFaceFeature(Game.PlayerPed.Handle, 17, skin[21]);
		SetPedFaceFeature(Game.PlayerPed.Handle, 18, skin[22]);
	}

	public static toggleVariation(variations: { [key: string]: number[] }) {
		if (!this.ensureCanChangeClothes()) return;
		for (const [componentId, variation] of Object.entries(variations)) {
			if (
				!this.variations[+componentId] ||
				this.variations[+componentId][0] != variation[0] ||
				this.variations[+componentId][1] != (variation[1] || 0)
			) {
				this.addVariations(variations);
				return;
			}
		}

		const defaultVariations = Character.getCurrent()?.sex == "1" ? femaleDefaultVariations : maleDefaultVariations;

		for (const componentId of Object.keys(variations)) {
			//@ts-ignore
			this.addVariations({ [componentId]: defaultVariations[+componentId] });
		}
	}

	public static getVariations() {
		return { ...this.variations };
	}

	public static addProp(componentId: number, drawableId: number, textureId: number, save = true) {
		if (!this.ensureCanChangeClothes()) return;
		SetPedPropIndex(PlayerPedId(), componentId, drawableId, textureId, true);
		if (save) this.props[componentId] = [drawableId, textureId];
	}

	public static setProps(props: { [key: number]: [number, number] }) {
		if (!this.ensureCanChangeClothes()) return;
		for (const componentId of [0, 1, 2, 6, 7]) {
			if (!!props[componentId]) {
				this.addProp(componentId, props[componentId][0], props[componentId][1]);
			} else {
				ClearPedProp(PlayerPedId(), componentId);
			}
		}
	}

	public static toggleProp(componentId: number, drawableId: number, textureId: number) {
		if (!this.ensureCanChangeClothes()) return;
		if (this.props[componentId]?.[0] == drawableId && this.props[componentId]?.[1] == textureId) {
			ClearPedProp(PlayerPedId(), componentId);
			delete this.props[componentId];
		} else {
			this.addProp(componentId, drawableId, textureId);
		}
	}

	public static getProps() {
		return { ...this.props };
	}

	public static async putClothes() {
		if (!this.ensureCanChangeClothes()) return;
		const character = Character.getCurrent();
		if (!character) return;
		Clothes.addVariations(character.variations);
		Clothes.setProps(character.props);
	}

	public static async putJobClothes() {
		const jobId = Jobs.getJob()?.id;
		const jobClothes = !!jobId && JobsList[jobId]?.clothes;
		if (!jobClothes || Admin.isAdminModeEnable) return;

		const clothes = Character?.getCurrent()?.sex == "1" ? jobClothes.female : jobClothes.male;

		for (const componentId of [0, 1, 2, 6, 7]) {
			if (!!clothes.props[componentId]) {
				SetPedPropIndex(PlayerPedId(), +componentId, clothes.props[componentId][0], clothes.props[componentId][1], true);
			} else {
				ClearPedProp(PlayerPedId(), +componentId);
			}
		}

		for (const [componentId, variations] of Object.entries(clothes.variations)) {
			//@ts-ignore
			SetPedComponentVariation(PlayerPedId(), +componentId, variations[0], variations[1], 2);
		}
	}

	public static async putAdminClothes() {
		const clothes: any = Character?.getCurrent()?.sex == "1" ? Config.adminMode.femaleClothes : Config.adminMode.maleClothes;

		for (const componentId of ["0", "1", "2", "6", "7"]) {
			if (!!clothes.props[componentId]) {
				SetPedPropIndex(PlayerPedId(), +componentId, clothes.props[componentId][0], clothes.props[componentId][1], true);
			} else {
				ClearPedProp(PlayerPedId(), +componentId);
			}
		}

		for (const [componentId, variations] of Object.entries(clothes.variations)) {
			//@ts-ignore
			SetPedComponentVariation(PlayerPedId(), +componentId, variations[0], variations[1], 2);
		}
	}

	private static ensureCanChangeClothes() {
		if (Admin.isAdminModeEnable) {
			Notifications.ShowError("Vous ne pouvez pas changer de vêtements tant que le ~r~mode admin~w~ est activé");
			return false;
		}

		const jobId = Jobs.getJob()?.id;
		if (!!jobId && Jobs.isOnDuty && !!JobsList[jobId].clothes) {
			Notifications.ShowError("Vous ne pouvez pas changer de vêtements tant que vous êtes ~r~en service");
			return false;
		}

		return true;
	}

	public static hasBag() {
		return !!this.variations[5]?.[0] && this.variations[5]?.[0] != 0;
	}
}
