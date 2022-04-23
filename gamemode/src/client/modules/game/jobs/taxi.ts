import { Game, Model, Ped, Screen, Vector3, Vehicle, VehicleSeat } from "@wdesgardin/fivem-js";
import { JobId, JobsList } from "../../../../shared/config/jobs/jobs";
import { Delay } from "../../../../shared/utils/utils";
import { CoraUI } from "../../../core/coraui";
import { DrawText2, TriggerServerCallbackAsync } from "../../../core/utils";
import { InteractionPoints } from "../../../misc/interaction-points";
import { Jobs } from "../../../player/jobs";
import { Notifications } from "../../../player/notifications";
import { Vehicules } from "../../../player/vehicules";
import { Nui } from "../../../utils/nui";
import { Keys } from "../vehicles/keys";
import { Callouts } from "./callouts";
import { BlipColor, BlipSprite } from "../../../core/enums/blips";
import { Blip } from "../../../core/blips";

export abstract class Taxi {
	private static taxiHash = new Model("TAXI").Hash;
	private static missionStep = 0;
	private static missionPed?: Ped;
	private static destinationBlip?: Blip;
	private static pedBlip?: Blip;
	private static previousPedHandle = 0;
	private static missionEnabled = false;

	private static taximeterEnabled = false;
	private static taximeterPosition: Vector3;
	private static taximaterFare = 0;
	private static taximeterVisible = false;

	public static async initialize() {
		setTick(this.missionTick.bind(this));
		setTick(this.taxiMeterTick.bind(this));
		setTick(this.drawFindCustomerHelpText.bind(this));

		onNet("gm:taxi:updateTaximeterTarget", this.updateTaximeterTarget.bind(this));

		InteractionPoints.createPoint({
			position: new Vector3(902.32, -174.94, 73.07),
			marker: true,
			action: () => this.openGarageMenu(),
			helpText: "Appuyez sur ~INPUT_PICKUP~ pour accèder au garage",
			enabled: () => Jobs.getJob()?.id == JobId.Taxi,
		});
	}

	private static async missionTick() {
		await Delay(1000);
		if (!this.missionEnabled || !Jobs.isOnDuty || Jobs.getJob()?.id != JobId.Taxi) {
			this.resetMission();
			return;
		}

		const playerVehicle = Game.PlayerPed.CurrentVehicle;
		if (playerVehicle?.Model?.Hash != this.taxiHash) return;

		if (this.missionStep == 0 && !this.missionPed?.exists()) {
			this.findCustomer();
		} else if (this.missionStep == 1 && this.missionPed?.exists()) {
			this.pickupCustomer(playerVehicle, this.missionPed);
		} else if (this.missionStep == 2 && this.missionPed?.exists()) {
			await this.driveCustomerToDestination(playerVehicle, this.missionPed);
		}

		if (!!this.missionPed && this.isCustomerDeadOrTooFar(this.missionPed)) {
			if (this.missionPed.exists() && this.missionPed.CurrentVehicle?.exists())
				TaskLeaveVehicle(this.missionPed.Handle, this.missionPed.CurrentVehicle.Handle, 0);

			SetEntityAsNoLongerNeeded(this.missionPed.Handle);
			this.resetMission();

			Notifications.ShowWarning("Votre client n'est ~y~plus disponible~w~ pour effectuer la course !", "taxi");
		}
	}

	private static async taxiMeterTick() {
		if (
			Jobs.getJob()?.id == JobId.Taxi &&
			Jobs.isOnDuty &&
			Game.PlayerPed.CurrentVehicle?.Model?.Hash == this.taxiHash &&
			Game.PlayerPed.CurrentVehicle?.Driver?.Handle == Game.PlayerPed.Handle
		) {
			if (this.taximeterEnabled) {
				const start = this.taximeterPosition;
				const current = Game.PlayerPed.Position;
				this.taximaterFare +=
					CalculateTravelDistanceBetweenPoints(start.x, start.y, start.z, current.x, current.y, current.z) / 500;
				this.taximeterPosition = current;
				this.taximeterVisible = true;

				Nui.SendMessage({ type: "taximeter", data: this.taximaterFare });

				const passengers = Game.PlayerPed.CurrentVehicle?.Passengers?.map(p =>
					GetPlayerServerId(NetworkGetPlayerIndexFromPed(p.Handle))
				);
				if (passengers?.length > 0) emitNet("gm:taxi:updateTaximeter", passengers, this.taximaterFare);
			} else if (this.taximeterVisible) {
				this.taximeterVisible = false;
				Nui.SendMessage({ type: "taximeter" });
				const passengers = Game.PlayerPed.CurrentVehicle?.Passengers?.map(p =>
					GetPlayerServerId(NetworkGetPlayerIndexFromPed(p.Handle))
				);
				if (passengers?.length > 0) emitNet("gm:taxi:updateTaximeter", passengers, undefined);
			}
		} else if (this.taximeterVisible && Game.PlayerPed.CurrentVehicle?.Model?.Hash != this.taxiHash) {
			this.taximeterVisible = false;
			Nui.SendMessage({ type: "taximeter" });
		}
		await Delay(1000);
	}

	private static isCustomerDeadOrTooFar(customer: Ped) {
		return !customer.exists() || customer.isDead() || customer.Position.distance(Game.PlayerPed.Position) > 75;
	}

	private static findCustomer() {
		const pos = Game.PlayerPed.Position;
		const targetPed = new Ped(GetRandomPedAtCoord(pos.x, pos.y, pos.z, 30, 30, 30, 26));
		if (!targetPed?.exists() || targetPed.Handle == this.previousPedHandle || !targetPed.IsHuman || targetPed.IsPlayer) return;

		this.missionStep = 1;
		this.missionPed = targetPed;

		ClearPedTasksImmediately(targetPed.Handle);
		SetEntityAsMissionEntity(targetPed.Handle, true, true);
		SetBlockingOfNonTemporaryEvents(targetPed.Handle, true);
		TaskStandStill(targetPed.Handle, 30 * 1000);

		Notifications.ShowWarning("Allez ~y~chercher~w~ votre client !", "taxi");

		if (!!this.pedBlip?.exists()) this.pedBlip.delete();
		this.pedBlip = new Blip(AddBlipForEntity(targetPed.Handle));
		this.pedBlip.Sprite = 57;
		this.pedBlip.Color = 28;
		this.pedBlip.Scale = 0.5;
		SetBlipCategory(this.pedBlip.Handle, 3);
	}

	private static pickupCustomer(playerVehicle: Vehicle, customer: Ped) {
		TaskLookAtEntity(customer.Handle, playerVehicle.Handle, -1, 2048, 3);
		if (Game.PlayerPed.Position.distance(customer.Position) < 10) {
			const leftOffset = Vector3.fromArray(GetOffsetFromEntityInWorldCoords(playerVehicle.Handle, 1.5, 0.0, 0.0));
			const rightOffset = Vector3.fromArray(GetOffsetFromEntityInWorldCoords(playerVehicle.Handle, -1.5, 0.0, 0.0));
			const seat =
				customer.Position.distance(leftOffset) < customer.Position.distance(rightOffset)
					? VehicleSeat.RightRear
					: VehicleSeat.LeftRear;

			TaskEnterVehicle(customer.Handle, playerVehicle.Handle, -1, seat, 2.0, 1, 0);
			PlayAmbientSpeech2(customer.Handle, "GENERIC_HI", "SPEECH_PARAMS_FORCE");
			this.missionStep = 2;
		}
	}

	private static async driveCustomerToDestination(playerVehicle: Vehicle, customer: Ped) {
		if (customer.CurrentVehicle?.Handle == playerVehicle.Handle) {
			if (!this.destinationBlip?.exists()) {
				this.pedBlip?.delete();
				const destination = await TriggerServerCallbackAsync("gm:taxi:createMission");
				this.destinationBlip = new Blip(AddBlipForCoord(destination.x, destination.y, destination.z));
				this.destinationBlip.Sprite = 57;
				this.destinationBlip.Color = 28;
				this.destinationBlip.Scale = 0.5;
				this.destinationBlip.ShowRoute = true;
				Notifications.ShowWarning("Conduisez le client à la ~y~position~w~ indiquée sur votre GPS", "taxi");
			}

			if (this.destinationBlip.Position.distance(Game.PlayerPed.Position) < 10) {
				const reward = await TriggerServerCallbackAsync("gm:taxi:endMission");
				if (reward > 0) {
					SetEntityAsNoLongerNeeded(customer.Handle);
					TaskLeaveVehicle(customer.Handle, playerVehicle.Handle, 0);
					this.previousPedHandle = customer.Handle;
					this.resetMission();

					Notifications.ShowSuccess(`Vous avez été payé ~g~${reward}$~w~ pour la course`, "money");
					await Delay(5000);
				}
			}
		}
	}

	private static resetMission() {
		this.pedBlip?.delete();
		this.destinationBlip?.delete();
		this.missionStep = 0;
		this.missionPed = undefined;
	}

	private static async drawFindCustomerHelpText() {
		if (this.missionEnabled && this.missionStep == 0 && Jobs.isOnDuty) {
			Screen.displayHelpTextThisFrame("~b~Déplacez vous~w~ dans une zone ou il y a des piétons pour trouver un client");
		} else {
			await Delay(1000);
		}
	}

	public static openMenu() {
		CoraUI.openMenu({
			name: JobsList[JobId.Taxi].name,
			subtitle: "Menu Metier",
			buttons: [
				Jobs.getOnDutyButton(),
				{
					name: "Activer les missions",
					statusCheckbox: this.missionEnabled,
					checkbox: () => (this.missionEnabled = !this.missionEnabled),
				},
				{
					name: "Historique des appels",
					onClick: () => CoraUI.openSubmenu("calls"),
				},
				{
					name: "Faire une facture",
					onClick: () => Jobs.billing(),
				},
				{
					name: "Afficher le taximètre",
					checkbox: () => {
						this.taximeterEnabled = !this.taximeterEnabled;
						this.taximeterPosition = Game.PlayerPed.Position;
						this.taximaterFare = 0;
						this.taxiMeterTick();
					},
					statusCheckbox: this.taximeterEnabled,
				},
				{
					name: "Réinitialiser taximètre",
					onClick: () => (this.taximaterFare = 0),
				},
			],
			submenus: {
				calls: {
					...Callouts.getCalloutSubmenu(),
				},
			},
		});
	}

	public static openGarageMenu() {
		CoraUI.openMenu({
			name: JobsList[JobId.Taxi].name,
			subtitle: "Garage",
			buttons: [
				{
					name: "Sortir un véhicule",
					onClick: () => {
						if (Jobs.getJob()?.id != JobId.Taxi || !Jobs.isOnDuty) {
							Notifications.ShowError("~r~Action impossible~w~~n~Vous n'êtes pas en service");
						} else {
							Vehicules.spawnVehicle("TAXI", undefined, [902.32, -174.94, 73.07, 237.6], true);
							const plate = GetVehicleNumberPlateText(GetVehiclePedIsIn(PlayerPedId(), false))?.trim();
							Keys.giveKey(plate);
							CoraUI.closeMenu();
						}
					},
				},
				{
					name: "Ranger mon véhicule",
					onClick: () => {
						const veh = Game.PlayerPed.CurrentVehicle;
						if (veh?.Model?.Hash == new Model("TAXI").Hash) {
							NetworkRequestControlOfEntity(veh.Handle);
							veh.markAsNoLongerNeeded();
							veh.delete();
							CoraUI.closeMenu();
						} else {
							Notifications.ShowError("Impossible de ranger ce véhicule");
						}
					},
				},
			],
		});
	}

	private static updateTaximeterTarget(fare?: number) {
		this.taximeterVisible = !!fare;
		Nui.SendMessage({ type: "taximeter", data: fare });
	}
}
