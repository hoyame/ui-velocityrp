import { BlipSprite, Vector3 } from "@nativewrappers/client";
import { JobId } from "../../../../shared/config/jobs/jobs";
import { IProperty } from "../../../../shared/types/property";
import { CoraUI } from "../../../core/coraui";
import { GetClosestPlayer, TriggerServerCallbackAsync } from "../../../core/utils";
import { BlipsController } from "../../../misc/blips";
import { InteractionPoints } from "../../../misc/interaction-points";
import { Jobs } from "../../../player/jobs";
import { Notifications } from "../../../player/notifications";
import { Properties } from "../properties/properties";

export abstract class RealEstateAgent {
	public static async initialize() {
		InteractionPoints.createPoint({
			position: Vector3.create({ x: -129.802734375, y: -598.2794799804688, z: 48.244606018066406 - 1 }),
			action: () => {
				const pos = GetEntityCoords(PlayerPedId(), false);
				Properties.Cache = {
					pos: pos,
				};
				SetEntityCoords(PlayerPedId(), -141.1987, -620.913, 168.8205, true, false, false, true);
			},
			helpText: "Appuyez sur ~INPUT_CONTEXT~ pour ~b~entrer dans l'agence immobiliere",
			marker: true,
		});

		BlipsController.CreateBlip({
			name: "Agent Immobilier",
			coords: { x: -129.802734375, y: -598.2794799804688, z: 48.244606018066406 },
			sprite: BlipSprite.Business,
			color: 0,
			scale: 0.8,
		});

		InteractionPoints.createPoint({
			position: Vector3.create({ x: -125.63946533203125, y: -641.1461181640625, z: 168.82032775878906 - 1 }),
			action: () => this.openMenu(),
			enabled: () => Jobs.getJob()?.id == JobId.RealEstateAgent,
			helpText: "Appuyez sur ~INPUT_CONTEXT~ pour ~b~ouvrir le menu de votre metier",
			marker: true,
		});
	}

	public static async openMenu() {
		const allProperties = await TriggerServerCallbackAsync("gm:property:getProperties");
		const buttons = allProperties.map((property: IProperty) => ({
			name: "ID Proprietaire : " + property.ownerCharacterId,
			rightText: property.bought ? "Vente" : "Location",
			onClick: () => {},
		}));

		CoraUI.openMenu({
			name: "Agent Immobilier",
			subtitle: "Menu Metier",
			onOpen: () => FreezeEntityPosition(PlayerPedId(), true),
			onClose: () => FreezeEntityPosition(PlayerPedId(), false),
			glare: true,
			buttons: buttons,
		});
	}

	public static openJobMenu(buildingInfo: any) {
		const flatButtons = buildingInfo["home"].map((v: any, k: any) => ({
			name: buildingInfo.name + " " + v.id,
			description: `Prix achat: ~g~${v.price}$ \n~w~Prix location: ~g~${v.price / 50}$`,
			onClick: () => setTimeout(() => this.propertyMenu(buildingInfo, v), 0),
		}));

		CoraUI.openMenu({
			name: "Agent Immobilier",
			subtitle: "Biens disponibles",
			glare: true,
			buttons: flatButtons,
		});
	}

	private static propertyMenu(buildingInfo: any, property: any) {
		CoraUI.openMenu({
			name: "Agent Immobilier",
			subtitle: "Actions disponibles",
			glare: true,
			buttons: [
				{
					name: "Louer au joueur le plus proche",
					description: `Prix: ~g~${property.price / 50}$`,
					onClick: () => {
						const [closest, distance] = GetClosestPlayer();
						if (closest == -1 || distance > 1) return Notifications.ShowError("Aucun joueur est proche de vous");

						emitNet("gm:property:rentProperty", buildingInfo.id, property.id, closest);
					},
				},
				{
					name: "Vendre au joueur le plus proche",
					description: `Prix: ~g~${property.price}$`,
					onClick: () => {
						const [closest, distance] = GetClosestPlayer();
						if (closest == -1 || distance > 1) return Notifications.ShowError("Aucun joueur est proche de vous");

						emitNet("gm:property:buyProperty", buildingInfo.id, property.id, closest);
					},
				},
				{
					name: "Louer pour vous",
					description: `Prix: ~g~${property.price / 50}$`,
					onClick: () => emitNet("gm:property:rentProperty", buildingInfo.id, property.id, GetPlayerServerId(PlayerId())),
				},
				{
					name: "Achetter pour vous",
					description: `Prix: ~g~${property.price}$`,
					onClick: () => emitNet("gm:property:buyProperty", buildingInfo.id, property.id, GetPlayerServerId(PlayerId())),
				},
			],
		});
	}
}
