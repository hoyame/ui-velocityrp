import ClothesConfig from "../../../../shared/config/clothes/clothes.json";
import AccessoriesConfig from "../../../../shared/config/clothes/accessories.json";
import MasksConfig from "../../../../shared/config/clothes/masks.json";
import { Clothes } from "../../../player/clothes";
import { CoraUI, IButton, ICMenu } from "../../../core/coraui";
import { TriggerServerCallbackAsync } from "../../../core/utils";
import { BlipColor, Camera, Color, Control, Game, Screen, Vector3 } from "@nativewrappers/client";
import { IClotheConfig, IClothItem } from "../../../../shared/types/clothes";
import { Character } from "../../../player/character";
import { InstructionalButtons } from "../../../misc/instructional-buttons";
import { IAccessoryConfig, IAccessoryItem } from "../../../../shared/types/accessories";
import { BlipsController } from "../../../misc/blips";
import { InteractionPoints } from "../../../misc/interaction-points";
import { Notifications } from "../../../player/notifications";

export abstract class ClothShop {
	private static currentCam?: Camera;
	private static controlTick: number;

	public static async initialize() {
		InteractionPoints.createPoint({
			position: new Vector3(72.78410339355469, -1398.9068603515625, 28.38),
			helpText: "Appuyez sur ~INPUT_CONTEXT~ pour ouvrir le magasin de vêtements",
			enabled: () => !CoraUI.CurrentMenu,
			marker: true,
			action: () => this.openClothesShop(),
		});
		BlipsController.CreateBlip({
			name: "Magasin de vêtements",
			sprite: 366,
			color: BlipColor.Blue,
			coords: new Vector3(72.78410339355469, -1398.9068603515625, 28.38),
		});

		InteractionPoints.createPoint({
			position: new Vector3(-1187.9609375, -1558.798828125, 3.36525297164917),
			helpText: "Appuyez sur ~INPUT_CONTEXT~ pour ouvrir le magasin de masques",
			marker: true,
			enabled: () => !CoraUI.CurrentMenu,
			action: () => this.openMaskShop(),
		});
		BlipsController.CreateBlip({
			name: "Magasin de masques",
			sprite: 362,
			color: BlipColor.Yellow,
			coords: new Vector3(-1187.9609375, -1558.798828125, 3.38),
		});
	}

	public static openClothesShop() {
		const submenus: { [key: string]: ICMenu } = {};
		const buttons: IButton[] = [];
		let currentClothes = Clothes.getVariations();

		const clothes = ClothesConfig as IClotheConfig[];

		for (let outfitIndex = 0; outfitIndex < clothes.length; outfitIndex++) {
			const clothConfig = clothes[outfitIndex];
			const clothesForGender = Character.getCurrent()?.sex == "1" ? clothConfig.female : clothConfig.male;

			const submenuButtons = clothesForGender.map((cloth, clothIndex) => {
				const btn: IButton = {
					name: cloth.name || `${clothConfig.defaultName} ${clothIndex + 1}`,
					rightText: `~g~${cloth.price}$`,
					onHover: btn => this.putCloth(btn, cloth),
					onClick: async btn => {
						let selectedCloth: any = { outfitIndex, clothIndex };
						if (!!cloth.customVariation) {
							selectedCloth = { ...selectedCloth, texture: Number(btn?.slider?.[btn.indexSlider || 0]) || 0 };
						}

						if (await TriggerServerCallbackAsync("gm:clothes:buy", selectedCloth)) {
							this.putCloth(btn, cloth, true);

							currentClothes = Clothes.getVariations();
							Notifications.ShowSuccess(
								`Vous avez achetté ${cloth.name || `${clothConfig.defaultName} ${clothIndex + 1}`} pour ~g~${cloth.price}$`,
								"money"
							);
						}
					},
				};

				if (!!cloth.customVariation) {
					btn.slider = cloth.customVariation.textures.map(t => t.toString());
					btn.indexSlider = 0;
					btn.onSlide = (_, btn) => this.putCloth(btn, cloth);
				}

				return btn;
			});

			submenus[clothConfig.category] = {
				name: "Vêtements",
				subtitle: clothConfig.category,
				glare: true,
				buttons: submenuButtons,
				onClose: () => Clothes.addVariations(currentClothes),
				onOpen: () => (currentClothes = Clothes.getVariations()),
			};

			buttons.push({
				name: clothConfig.category,
				rightText: ">",
				onClick: () => {
					CoraUI.openSubmenu(clothConfig.category);
				},
			});
		}

		const accessories = AccessoriesConfig as IAccessoryConfig[];
		let currentProps = Clothes.getProps();

		for (let configIndex = 0; configIndex < accessories.length; configIndex++) {
			const accessoryConfig = accessories[configIndex];
			const accessoriesForGender = Character.getCurrent()?.sex == "1" ? accessoryConfig.female : accessoryConfig.male;

			const putAccessory = (btn: IButton, accessory: IAccessoryItem, save = false) => {
				const texture = accessory.textures.length > 1 ? Number(btn?.slider?.[btn.indexSlider || 0]) : accessory.textures[0];
				Clothes.addProp(accessory.componentId, accessory.drawableId, texture, save);
			};

			const submenuButtons = accessoriesForGender.map((accessory, accessoryIndex) => {
				const btn: IButton = {
					name: accessory.name || `${accessoryConfig.defaultName} ${accessoryIndex + 1}`,
					rightText: `~g~${accessory.price}$`,
					onHover: btn => putAccessory(btn, accessory),
					onClick: async btn => {
						const texture = accessory.textures.length > 1 ? Number(btn?.slider?.[btn.indexSlider || 0]) : accessory.textures[0];
						if (await TriggerServerCallbackAsync("gm:clothes:buyAccessory", { configIndex, accessoryIndex, texture })) {
							putAccessory(btn, accessory, true);
							currentProps = Clothes.getProps();
							Notifications.ShowSuccess(
								`Vous avez achetté ${accessory.name || `${accessoryConfig.defaultName} ${accessoryIndex + 1}`} pour ~g~${
									accessory.price
								}$`,
								"money"
							);
						}
					},
				};

				if (accessory.textures.length > 1) {
					btn.slider = accessory.textures.map(t => t.toString());
					btn.indexSlider = 0;
					btn.onSlide = (_, btn) => putAccessory(btn, accessory);
				}

				return btn;
			});

			submenus[accessoryConfig.category] = {
				name: "Vêtements",
				subtitle: accessoryConfig.category,
				glare: true,
				buttons: submenuButtons,
				onClose: () => Clothes.setProps(currentProps),
			};

			buttons.push({
				name: accessoryConfig.category,
				rightText: ">",
				onClick: () => {
					currentProps = Clothes.getProps();
					CoraUI.openSubmenu(accessoryConfig.category);
				},
			});
		}

		this.initShop();

		CoraUI.openMenu({
			name: "Vêtements",
			subtitle: "Catégorie",
			glare: true,
			onClose: this.leaveShop.bind(this),
			buttons,
			submenus,
		});
	}

	public static openMaskShop() {
		this.initShop();

		let currentClothes = Clothes.getVariations();
		const clothesForGender =
			Character.getCurrent()?.sex == "1" ? (MasksConfig.female as IClothItem[]) : (MasksConfig.male as IClothItem[]);

		const buttons = clothesForGender.map((cloth, clothIndex) => {
			const btn: IButton = {
				name: cloth.name || `Masque ${clothIndex + 1}`,
				rightText: `~g~${cloth.price}$`,
				onHover: btn => this.putCloth(btn, cloth),
				onClick: async btn => {
					let selectedCloth: any = { clothIndex };
					if (!!cloth.customVariation) {
						selectedCloth = { ...selectedCloth, texture: Number(btn?.slider?.[btn.indexSlider || 0]) || 0 };
					}

					if (await TriggerServerCallbackAsync("gm:clothes:buyMask", selectedCloth)) {
						this.putCloth(btn, cloth, true);

						currentClothes = Clothes.getVariations();
						Notifications.ShowSuccess(
							`Vous avez achetté ${cloth.name || `Masque ${clothIndex + 1}`} pour ~g~${cloth.price}$`,
							"money"
						);
					}
				},
			};

			if (!!cloth.customVariation) {
				btn.slider = cloth.customVariation.textures.map(t => t.toString());
				btn.indexSlider = 0;
				btn.onSlide = (_, btn) => this.putCloth(btn, cloth);
			}

			return btn;
		});

		this.putCloth(buttons[0], clothesForGender[0]);

		CoraUI.openMenu({
			name: "Masques",
			subtitle: "",
			glare: true,
			onOpen: () => FreezeEntityPosition(PlayerPedId(), true),
			onClose: () => {
				Clothes.addVariations(currentClothes);
				this.leaveShop();
				FreezeEntityPosition(PlayerPedId(), false);
			},
			buttons,
		});
	}

	private static initShop() {
		ClearPedTasksImmediately(Game.PlayerPed.Handle);
		Game.PlayerPed.IsPositionFrozen = true;

		const cam = new Camera(CreateCam("DEFAULT_SCRIPTED_CAMERA", true));
		cam.Position = Vector3.add(
			Game.PlayerPed.Position.add(new Vector3(0, 0, 1)),
			Vector3.fromArray(GetEntityForwardVector(Game.PlayerPed.Handle)).multiply(1.5)
		);
		cam.FieldOfView = 70;
		cam.pointAt(Game.PlayerPed);
		cam.IsActive = true;
		RenderScriptCams(true, true, 1000, false, false);
		this.currentCam = cam;

		InstructionalButtons.setButton("Pivoter votre personnage", Control.MoveLeftRight, true);
		this.controlTick = setTick(() => {
			Game.disableControlThisFrame(0, Control.MoveLeftRight);
			Game.disableControlThisFrame(0, Control.MoveUpDown);
			Game.disableControlThisFrame(0, Control.Attack);
			Game.disableControlThisFrame(0, Control.Attack2);
			Game.disableControlThisFrame(0, Control.Attack2);

			if (Game.isDisabledControlPressed(0, Control.MoveLeftOnly)) {
				Game.PlayerPed.Heading += 1;
			} else if (Game.isDisabledControlPressed(0, Control.MoveLeftRight)) {
				Game.PlayerPed.Heading -= 1;
			}
		});
	}

	private static putCloth(btn: IButton, cloth: IClothItem, save = false) {
		let variations = cloth.variations;

		if (!!cloth.customVariation) {
			const selectedDrawable = btn?.slider?.[btn.indexSlider || 0];
			const drawable = cloth.customVariation.textures.includes(Number(selectedDrawable))
				? Number(selectedDrawable)
				: Number(cloth.customVariation.textures[0] || 0);

			variations = {
				...cloth.variations,
				[cloth.customVariation.componentId]: [cloth.customVariation.drawableId, drawable],
			};
		}

		Clothes.addVariations(variations, save);
	}

	private static leaveShop() {
		this.currentCam?.delete();
		this.currentCam = undefined;
		RenderScriptCams(false, false, 500, true, true);

		InstructionalButtons.setButton("Pivoter votre personnage", Control.MoveLeftRight, false);

		Game.PlayerPed.IsPositionFrozen = false;

		clearTick(this.controlTick);
		this.controlTick = 0;
	}
}
