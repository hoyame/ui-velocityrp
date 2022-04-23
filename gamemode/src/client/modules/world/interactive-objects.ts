import { Control, Game, Model, Prop, World } from "@wdesgardin/fivem-js";
import { Vector3 } from "@wdesgardin/fivem-js/lib/utils/Vector3";
import { Environnment } from "../../../shared/utils/environnment";
import { Delay } from "../../../shared/utils/utils";
import { ShowHelpNotification } from "../../core/utils";
import { Streaming } from "../../utils/streaming";

interface InteractiveObject {
	models: number[];
	anim: { name: string; dictionnary: string; simple?: boolean };
	offsetPos: Vector3;
	offsetRot: Vector3;
	actionText: string;
	action: (prop: Prop, config: InteractiveObject) => void;
	cancel: () => void;
	cancelText: string;
	attach?: boolean;
}

export abstract class InteractiveObjects {
	private static currentObject?: { config: InteractiveObject; instance: Prop };

	private static objects: InteractiveObject[] = [
		{
			//lit hopital
			models: [new Model("v_med_emptybed").Hash],
			anim: { name: "m_sleep_loop_countryside", dictionnary: "savecountryside@" },
			offsetPos: new Vector3(-0.1, 0, 0.4),
			offsetRot: new Vector3(0, 0, 185),
			action: InteractiveObjects.Seat.bind(InteractiveObjects),
			actionText: "vous allonger",
			cancel: InteractiveObjects.LiftUp.bind(InteractiveObjects),
			cancelText: "vous relever",
		},
		{
			//lit hopital
			models: [new Model("v_med_bed1").Hash],
			anim: { name: "m_sleep_loop_countryside", dictionnary: "savecountryside@" },
			offsetPos: new Vector3(-0.1, 0, 0.6),
			offsetRot: new Vector3(0, 0, 185),
			action: InteractiveObjects.Seat.bind(InteractiveObjects),
			actionText: "vous allonger",
			cancel: InteractiveObjects.LiftUp.bind(InteractiveObjects),
			cancelText: "vous relever",
		},
		{
			//lit hopital - irm
			models: [-289946279],
			anim: { name: "m_sleep_loop_countryside", dictionnary: "savecountryside@" },
			offsetPos: new Vector3(-0.1, 0, 1.6),
			offsetRot: new Vector3(0, 0, 185),
			action: InteractiveObjects.Seat.bind(InteractiveObjects),
			actionText: "vous allonger",
			cancel: InteractiveObjects.LiftUp.bind(InteractiveObjects),
			cancelText: "vous relever",
		},
		{
			//lit hopital - radio
			models: [-1519439119],
			anim: { name: "m_sleep_loop_countryside", dictionnary: "savecountryside@" },
			offsetPos: new Vector3(-0.1, 0, 1.16),
			offsetRot: new Vector3(0, 0, 185),
			action: InteractiveObjects.Seat.bind(InteractiveObjects),
			actionText: "vous allonger",
			cancel: InteractiveObjects.LiftUp.bind(InteractiveObjects),
			cancelText: "vous relever",
		},
		{
			//brancard ems
			models: [new Model("v_med_bed2").Hash],
			anim: { name: "m_sleep_loop_countryside", dictionnary: "savecountryside@" },
			offsetPos: new Vector3(-0.1, 0, 0.68),
			offsetRot: new Vector3(0, 0, 185),
			attach: true,
			action: InteractiveObjects.Seat.bind(InteractiveObjects),
			actionText: "vous allonger",
			cancel: InteractiveObjects.LiftUp.bind(InteractiveObjects),
			cancelText: "vous relever",
		},
		{
			//wheelchair
			models: [new Model("prop_wheelchair_01").Hash],
			anim: { name: "_leadin_loop2_lester", dictionnary: "missfinale_c2leadinoutfin_c_int", simple: true },
			offsetPos: new Vector3(0, 0.0, 0.4),
			offsetRot: new Vector3(0.0, 0.0, 180.0),
			attach: true,
			action: InteractiveObjects.Seat.bind(InteractiveObjects),
			actionText: "vous asseoir",
			cancel: InteractiveObjects.LiftUp.bind(InteractiveObjects),
			cancelText: "vous relever",
		},
	];

	private static nearbyObjects: Prop[] = [];

	public static async initialize() {
		setTick(this.Tick.bind(this));
		setInterval(this.updateNearbyInterval.bind(this), 2000);

		if (Environnment.IsDev) {
			RegisterCommand(
				"tpobject",
				(src: string, args: string) => {
					const pos = this.nearbyObjects.find(o => o.Model.Hash.toString() == args[0])?.Position;
					if (!!pos) Game.PlayerPed.Position = pos;
				},
				false
			);
		}
	}

	private static async Tick() {
		if (!!this.currentObject) {
			ShowHelpNotification("Appuyez sur ~INPUT_PICKUP~ pour ~b~" + this.currentObject.config.cancelText);

			Game.disableControlThisFrame(0, Control.Pickup);
			if (Game.isDisabledControlJustPressed(0, Control.Pickup) || !this.currentObject.instance.exists()) {
				this.currentObject.config.cancel();
				this.currentObject = undefined;
			}
			return;
		}

		const closestObject = this.nearbyObjects.find(o => o.Position.distance(Game.PlayerPed.Position) < 2);
		if (!closestObject?.exists() || closestObject.isAttachedTo(Game.PlayerPed)) {
			await Delay(500);
			return;
		}

		const objectConfig = this.objects.find(o => o.models.find(m => m == closestObject.Model.Hash));
		if (!objectConfig) return;

		ShowHelpNotification("Appuyez sur ~INPUT_PICKUP~ pour ~b~" + objectConfig.actionText);
		Game.disableControlThisFrame(0, Control.Pickup);
		if (Game.isDisabledControlJustPressed(0, Control.Pickup)) {
			this.currentObject = { config: objectConfig, instance: closestObject };
			this.currentObject.config.action(closestObject, objectConfig);
		}
	}

	private static updateNearbyInterval() {
		this.nearbyObjects =
			Game.PlayerPed.isInAnyVehicle() || Game.PlayerPed.isDead()
				? []
				: World.getAllProps().filter(p => this.objects.find(o => o.models.find(m => m == p.Model.Hash)));
	}

	private static async Seat(prop: Prop, config: InteractiveObject) {
		if (!!config.attach) Game.PlayerPed.attachTo(prop, config.offsetPos, config.offsetRot);

		await Streaming.RequestAnimDictionnaryAsync(config.anim.dictionnary);

		SetPedKeepTask(Game.PlayerPed.Handle, true);
		TaskSetBlockingOfNonTemporaryEvents(Game.PlayerPed.Handle, true);
		Game.PlayerPed.IsCollisionEnabled = false;
		Game.PlayerPed.IsPositionFrozen = true;

		if (!!config.anim.simple) {
			TaskPlayAnim(Game.PlayerPed.Handle, config.anim.dictionnary, config.anim.name, 8.0, 8.0, -1, 69, 1, false, false, false);
		} else {
			const pos = GetOffsetFromEntityInWorldCoords(prop.Handle, config.offsetPos.x, config.offsetPos.y, config.offsetPos.z);
			TaskPlayAnimAdvanced(
				Game.PlayerPed.Handle,
				config.anim.dictionnary,
				config.anim.name,
				pos[0],
				pos[1],
				pos[2],
				config.offsetRot.x,
				config.offsetRot.y,
				config.offsetRot.z + prop.Heading,
				8,
				-8,
				-1,
				1,
				0,
				0,
				0
			);
		}
	}

	private static LiftUp() {
		if (Game.PlayerPed.isAttached()) Game.PlayerPed.detach();
		ClearPedTasks(Game.PlayerPed.Handle);
		Game.PlayerPed.IsCollisionEnabled = true;
		SetPedKeepTask(Game.PlayerPed.Handle, false);
		TaskSetBlockingOfNonTemporaryEvents(Game.PlayerPed.Handle, false);
		SetBlockingOfNonTemporaryEvents(Game.PlayerPed.Handle, false);
		Game.PlayerPed.IsPositionFrozen = false;
	}
}
