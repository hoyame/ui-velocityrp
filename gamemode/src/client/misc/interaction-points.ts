import { Color, Control, Game, MarkerType, Model, Ped, World } from "@nativewrappers/client";
import { Vec3, Vector3 } from "@nativewrappers/client/lib/utils/Vector3";
import { ItemId } from "../../shared/config/items";
import { ShowHelpNotification } from "../core/utils";
import { Character } from "../player/character";
import { Streaming } from "../utils/streaming";
import { Inventory } from "../player/inventory";
import { Notifications } from "../player/notifications";

interface IInteractionPointBase {
	position: Vector3;
	ped?: {
		model: string;
		heading?: number;
	};
	marker?: boolean;
	actionDistance?: number;
	enabled?: () => boolean;
}

export interface ISellPoint extends IInteractionPointBase {
	items: ItemId[];
}

export interface INewInteractionPoint extends IInteractionPointBase {
	helpText?: string | (() => string);
	action: Function;
}

interface IInteractionPoint extends INewInteractionPoint {
	id: number;
}

export abstract class InteractionPoints {
	private static pointId: number;
	private static interactionPoints: IInteractionPoint[] = [];
	private static currentSell?: { interval: NodeJS.Timeout; point: ISellPoint };

	public static async initialize() {
		setTick(this.markerTick.bind(this));
	}

	public static async createPoint(point: INewInteractionPoint) {
		const createdPoint = { id: ++this.pointId, ...point };
		this.interactionPoints.push(createdPoint);

		if (!!createdPoint.ped) await this.createPed(createdPoint.ped.model, createdPoint.position, createdPoint.ped.heading);

		return createdPoint.id;
	}

	public static async createSellPoint(point: ISellPoint) {
		const action = () => {
			if (!!this.currentSell) {
				clearInterval(this.currentSell.interval);
				this.currentSell = undefined;
				Notifications.ShowSuccess("Vente terminée", "money");
				return;
			}

			const interval = setInterval(async () => {
				if (!this.currentSell) return;

				// if (Game.PlayerPed.Position.absDistance2D(this.currentSell.point.position) > 5) {
				// 	clearInterval(interval);
				// 	this.currentSell = undefined;
				// 	Notifications.ShowError("~r~Vente terminée~n~~w~Vous êtes trop loin du vendeur");
				// } else if (!(await Inventory.sell(point.items))) {
				// 	Notifications.ShowSuccess("Vente terminée", "money");
				// 	clearInterval(interval);
				// 	this.currentSell = undefined;
				// }
			}, 1000);

			this.currentSell = {
				interval,
				point,
			};
		};

		this.createPoint({
			...point,
			action,
			helpText: () => `Appuyez sur ~INPUT_PICKUP~ pour ${!!this.currentSell ? "~r~arrêter" : "~g~démarrer"} la vente`,
		});
	}

	private static async createPed(model: string, position: Vec3, heading?: number) {
		await Streaming.RequestModelAsync(model);
		const ped = new Ped(CreatePed(0, GetHashKey(model), position.x, position.y, position.z, heading || 0, false, true));
		SetModelAsNoLongerNeeded(GetHashKey(model));
		ped.IsInvincible = true;
		ped.IsPositionFrozen = true;
		SetEntityAsMissionEntity(ped.Handle, true, true);
		SetPedHearingRange(ped.Handle, 0.0);
		SetPedSeeingRange(ped.Handle, 0.0);
		SetPedAlertness(ped.Handle, 0.0);
		SetPedFleeAttributes(ped.Handle, 0, false);
		SetBlockingOfNonTemporaryEvents(ped.Handle, true);
		SetPedCombatAttributes(ped.Handle, 46, true);
		SetPedFleeAttributes(ped.Handle, 0, false);
	}

	public static removePoint(id: number) {
		const point = this.interactionPoints.find(p => p.id == id);
		if (!!point?.ped) {
			const modelHash = new Model(point.ped.model).Hash;
			const worldPed = World.getAllPeds().find(p => p.Model.Hash == modelHash && p.Position.distance(point.position) < 3);
			if (!!worldPed?.exists()) {
				worldPed.markAsNoLongerNeeded();
				worldPed.delete();
			}
		}

		this.interactionPoints = this.interactionPoints.filter(p => p.id != id);
	}

	private static async markerTick() {
		const playerPos = Game.PlayerPed.Position;

		for (const marker of this.interactionPoints) {
			const distance = playerPos.distance(marker.position);
			if (distance > 20 || marker?.enabled?.() === false) continue;

			if (!!marker.marker) {
				World.drawMarker(
					MarkerType.HorizontalCircleSkinny,
					marker.position,
					Vector3.create(0),
					Vector3.create(0),
					Vector3.create(0.8),
					Color.fromRgb(0, 130, 230)
				);
			}

			if (distance < (marker.actionDistance || 2)) {
				if (!!marker.helpText) {
					ShowHelpNotification(typeof marker.helpText == "string" ? marker.helpText : marker.helpText());
					Game.disableControlThisFrame(0, Control.Pickup);
					if (Game.isDisabledControlJustPressed(0, Control.Pickup)) {
						marker.action();
					}
				} else {
					marker.action();
				}
			}
		}
	}
}
