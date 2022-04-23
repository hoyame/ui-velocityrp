import { GetClosestPlayer, TriggerServerCallbackAsync } from "../../../core/utils";
import { Control, Game, Screen, Vector3, Prop, Ped } from "@nativewrappers/client";
import { Delay } from "../../../../shared/utils/utils";
import { CoraUI } from "../../../core/coraui";
import { Vehicules } from "../../../player/vehicules";
import { JobId, JobsList } from "../../../../shared/config/jobs/jobs";
import { Streaming } from "../../../utils/streaming";
import { Animations } from "../../../utils/animations";
import { Props, PropType } from "../../world/props";
import { Callouts } from "./callouts";
import { Jobs } from "../../../player/jobs";
import { Keys } from "../vehicles/keys";
import { Notifications } from "../../../player/notifications";

interface AttachedObject {
	anim: { name: string; dictionnary: string; flag: number };
	offsetPos: Vector3;
	offsetRot: Vector3;
	helpText: string;
	boneIndex: () => number;
	vertextIndex: number;
	model: string;
}

export abstract class EMS {
	public static Calls: any = [];
	private static objects = {
		stretcher: {
			helpText: "le brancard",
			offsetPos: new Vector3(0, 2, -0.4),
			offsetRot: new Vector3(0, 0, 0),
			boneIndex: () => 11816,
			vertextIndex: 2,
			anim: { dictionnary: "missfinale_c2ig_11", name: "pushcar_offcliff_m", flag: 49 },
			model: "v_med_bed2",
		},
		wheelchair: {
			helpText: "le fauteuil",
			offsetPos: new Vector3(-0.0, -0.3, -0.73),
			offsetRot: new Vector3(195.0, 180.0, 180.0),
			boneIndex: () => GetPedBoneIndex(Game.PlayerPed.Handle, 28422),
			vertextIndex: 0,
			anim: { dictionnary: "anim@heists@box_carry@", name: "idle", flag: 50 },
			model: "prop_wheelchair_01",
		},
	};

	private static attachedObject?: { instance: Prop; config: AttachedObject };

	public static async initialize() {
		console.log("[GM] | [Module][Job] - EMS Initialized");
		setTick(this.attachedObjectTick.bind(this));
	}

	public static openMenu() {
		CoraUI.openMenu({
			name: "Médecin",
			subtitle: "Menu Metier",
			glare: true,
			buttons: [
				Jobs.getOnDutyButton(),
				{
					name: "Historique des appels",
					onClick: () => CoraUI.openSubmenu("calls"),
				},
				{
					name: "Général",
					onClick: () => CoraUI.openSubmenu("options"),
				},
				{
					name: "Soigner",
					onClick: () => CoraUI.openSubmenu("heal"),
				},
				{
					name: "Objets",
					onClick: () => CoraUI.openSubmenu("props"),
				},
			],
			submenus: {
				calls: {
					...Callouts.getCalloutSubmenu(),
				},
				heal: {
					name: "EMS",
					subtitle: "Soigner",
					glare: true,
					buttons: [
						{
							name: "Reanimer",
							onClick: this.revive.bind(this),
						},
						{
							name: "Soigner petites blessures",
							onClick: () => this.heal(40),
						},
						{
							name: "Soigner grosse blessures",
							onClick: () => this.heal(100),
						},
					],
				},
				options: {
					name: "EMS",
					subtitle: "Menu Metier",
					glare: true,
					buttons: [
						{
							name: "Mettre une facture",
							onClick: Jobs.billing.bind(Jobs),
						},
						{
							name: "Donner un certificat medical",
							onClick: async () => {
								const [pCloset, pClosetDst] = GetClosestPlayer();
								const idTarget = pCloset;
								if (pCloset <= 0) {
									Notifications.ShowError("~r~Action impossible~w~~n~Rapprochez vous de la cible");
									return;
								}
								emitNet("gm:ems:certif", idTarget);
							},
						},
						{
							name: "Prise de sang",
							onClick: this.bloodTest.bind(this),
						},
					],
				},
				props: {
					name: "Props",
					subtitle: "Menu Metier",
					glare: true,
					buttons: [
						{
							name: "Sortir la chaise roulante",
							onClick: () => this.spawnAttachedObject(this.objects.wheelchair),
						},
						{
							name: "Sortir le brancard",
							onClick: () => this.spawnAttachedObject(this.objects.stretcher),
						},
						{
							name: "Poser une barrière",
							onClick: () => Props.SpawnProp(PropType.Barrier),
						},
						{
							name: "Poser un cône",
							onClick: () => Props.SpawnProp(PropType.RoadCon),
						},
						{
							name: "Pose une trousse de soins",
							onClick: () => Props.SpawnProp(PropType.MedBag),
						},
					],
				},
			},
		});
	}

	public static openGarage() {
		const vehicleToButton = (model: string) => ({
			name: GetDisplayNameFromVehicleModel(GetHashKey(model)),
			onClick: () => {
				Vehicules.spawnVehicle(model);
				const plate = GetVehicleNumberPlateText(GetVehiclePedIsIn(PlayerPedId(), false))?.trim();
				Keys.giveKey(plate);
			},
		});

		CoraUI.openMenu({
			name: JobsList[JobId.EMS].name,
			subtitle: "Sortir un vehicule",
			glare: true,
			buttons: [
				{ name: "Voitures", onClick: () => CoraUI.openSubmenu("cars") },
				{ name: "Bateaux", onClick: () => CoraUI.openSubmenu("boats") },
				{ name: "Helicos", onClick: () => CoraUI.openSubmenu("helis") },
			],
			submenus: {
				cars: {
					name: JobsList[JobId.EMS].name,
					subtitle: "Voitures",
					glare: true,
					buttons: JobsList[JobId.EMS].vehicles?.cars.map(vehicleToButton) || [],
				},
				boats: {
					name: JobsList[JobId.EMS].name,
					subtitle: "Bâteaux",
					glare: true,
					buttons: JobsList[JobId.EMS].vehicles?.boats.map(vehicleToButton) || [],
				},
				helis: {
					name: JobsList[JobId.EMS].name,
					subtitle: "Hélicos",
					glare: true,
					buttons: JobsList[JobId.EMS].vehicles?.heli.map(vehicleToButton) || [],
				},
			},
		});
	}

	private static async spawnAttachedObject(objectConfig: AttachedObject) {
		if (!!this.attachedObject) {
			this.removeAttachedObject();
		}

		await Streaming.RequestAnimDictionnaryAsync(objectConfig.anim.dictionnary);

		const pos = Game.PlayerPed.Position;
		const hash = GetHashKey(objectConfig.model);
		await Streaming.RequestModelAsync(hash);

		this.attachedObject = { instance: new Prop(CreateObject(hash, pos.x, pos.y, pos.z, true, true, false)), config: objectConfig };
		SetModelAsNoLongerNeeded(hash);

		if (!this.attachedObject?.instance.exists()) {
			return;
		}

		this.attachedObject.instance.Heading = Game.PlayerPed.Heading;
		AttachEntityToEntity(
			this.attachedObject.instance.Handle,
			Game.PlayerPed.Handle,
			objectConfig.boneIndex(),
			objectConfig.offsetPos.x,
			objectConfig.offsetPos.y,
			objectConfig.offsetPos.z,
			objectConfig.offsetRot.x,
			objectConfig.offsetRot.y,
			objectConfig.offsetRot.z,
			false,
			false,
			false,
			false,
			objectConfig.vertextIndex,
			true
		);

		await Animations.PlaySimple(objectConfig.anim.dictionnary, objectConfig.anim.name, -1, objectConfig.anim.flag);
		RemoveAnimDict(objectConfig.anim.dictionnary);
	}

	private static async attachedObjectTick() {
		if (!this.attachedObject) {
			await Delay(500);
			return;
		}

		DisablePlayerFiring(Game.PlayerPed.Handle, true);
		SetPedPathCanUseLadders(PlayerPedId(), false);
		Game.disableControlThisFrame(0, Control.Enter);
		Game.disableControlThisFrame(0, Control.Jump);

		Screen.displayHelpTextThisFrame("Appuyez sur ~INPUT_CONTEXT~ pour ~r~ranger~w~ " + this.attachedObject.config.helpText);
		if (Game.isControlJustPressed(0, Control.Pickup)) {
			this.removeAttachedObject();
		}
	}

	private static removeAttachedObject() {
		Game.PlayerPed.detach();

		if (this.attachedObject?.instance.exists()) {
			this.attachedObject.instance.detach();
			this.attachedObject.instance.markAsNoLongerNeeded();
			this.attachedObject.instance.delete();
		}
		this.attachedObject = undefined;

		ClearPedTasks(Game.PlayerPed.Handle);
		ClearPedSecondaryTask(Game.PlayerPed.Handle);
	}

	private static async revive() {
		const [pCloset, pClosetDst] = GetClosestPlayer();
		if (pCloset <= 0) {
			Notifications.ShowError("~r~Action impossible~w~~n~Rapprochez vous de la cible");
			return;
		}

		const closestPlayerPed = new Ped(GetPlayerPed(pCloset));

		if (closestPlayerPed.isDead()) {
			await Animations.PlaySimple("missheistfbi3b_ig8_2", "cpr_loop_paramedic", 12000, 44);
			emitNet("gm:jobs:EMS:revive", pCloset, closestPlayerPed.MaxHealth - 50);
			Notifications.ShowSuccess("Vous avez ~g~réanimé ~w~la cible");
		} else {
			Notifications.ShowError("~r~Action impossible~w~~n~La cible n'a pas besoin d'être réanimée");
		}
	}

	private static async heal(heal: number) {
		const [pCloset, pClosetDst] = GetClosestPlayer();
		if (pCloset <= 0) {
			Notifications.ShowError("~r~Action impossible~w~~n~Rapprochez vous de la cible");
			return;
		}

		TaskStartScenarioInPlace(PlayerPedId(), "CODE_HUMAN_MEDIC_TEND_TO_DEAD", 0, true);
		await Delay(6000);
		ClearPedTasks(Game.PlayerPed.Handle);
		emitNet("gm:jobs:EMS:heal", pCloset, heal);
		Notifications.ShowSuccess("Vous avez ~g~soigné ~w~la cible");
	}

	private static async bloodTest() {
		let [pCloset, pClosetDst] = GetClosestPlayer();
		if (pCloset <= 0) {
			Notifications.ShowError("~r~Action impossible~w~~n~Rapprochez vous de la cible");
			return;
		}

		TaskStartScenarioInPlace(PlayerPedId(), "CODE_HUMAN_MEDIC_TEND_TO_DEAD", 0, true);
		await Delay(6000);
		ClearPedTasks(Game.PlayerPed.Handle);

		const testResult = await TriggerServerCallbackAsync("gm:ems:bloodTest", pCloset);
		if (!!testResult) Math.round;
		Notifications.Show(
			`~b~Prise de sang:~w~~n~Alcool ${(testResult.alcool / 100).toFixed(2)} g/L~n~Cannabis ${(testResult.weed / 100).toFixed(2)} g/L`
		);
	}
}
