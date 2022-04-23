import { Vector3, Prop, Model, Screen, World, Game, Control } from "@nativewrappers/client";
import { JobId } from "../../../shared/config/jobs/jobs";
import { Delay } from "../../../shared/utils/utils";
import { Jobs } from "../../player/jobs";
import { Notifications } from "../../player/notifications";
import { Utils } from "../../utils/utils";

export enum PropType {
	Barrier,
	RoadCon,
	MedBag,
	Herse,
}

export abstract class Props {
	private static props = {
		[PropType.Barrier]: {
			model: new Model("prop_mp_barrier_02b"),
			limit: 10,
			condition: () => Jobs.getJob()?.id == JobId.EMS || Jobs.getJob()?.id == JobId.LSPD,
		},
		[PropType.RoadCon]: {
			model: new Model("prop_roadcone01a"),
			limit: 10,
			condition: () => Jobs.getJob()?.id == JobId.EMS || Jobs.getJob()?.id == JobId.LSPD,
		},
		[PropType.MedBag]: {
			model: new Model("prop_med_bag_01b"),
			limit: 10,
			condition: () => Jobs.getJob()?.id == JobId.EMS,
		},
		[PropType.Herse]: {
			model: new Model("P_ld_stinger_s"),
			limit: 10,
			condition: () => Jobs.getJob()?.id == JobId.LSPD,
		},
	};

	private static spawnedProps: Prop[] = [];

	public static async initialize() {
		setTick(this.removePropTick.bind(this));
	}

	public static async SpawnProp(prop: PropType) {
		const config = this.props[prop];
		if (!config) return;

		if (!!config.condition && !config.condition()) return;

		if (!!config.limit) {
			const spawnedCount = this.spawnedProps.filter(p => p.exists() && p.Model.Hash == config.model.Hash).length;
			if (spawnedCount >= config.limit) {
				Notifications.ShowError("~r~Action impossible~w~~n~Vous avez atteind la limite pour cet objet");
				return;
			}
		}

		const forward = Vector3.fromArray(GetEntityForwardVector(Game.PlayerPed.Handle));

		const newProp = await World.createProp(config.model, Vector3.add(Game.PlayerPed.Position, forward), false, true);
		if (!newProp) return;
		newProp.IsPositionFrozen = true;
		newProp.Heading = Game.PlayerPed.Heading;
		this.spawnedProps.push(newProp);
	}

	private static async removePropTick() {
		const closestObject = this.spawnedProps.find(o => o.Position.distance(Game.PlayerPed.Position) < 1.6);
		if (!closestObject?.exists()) {
			await Delay(500);
			return;
		}

		Utils.draw3dText(
			[closestObject.Position.x, closestObject.Position.y, closestObject.Position.z + 1],
			"Appuyez sur ~b~E~w~ pour ramasser"
		);
		Game.disableControlThisFrame(0, Control.Pickup);
		if (Game.isDisabledControlJustPressed(0, Control.Pickup)) {
			if (NetworkRequestControlOfNetworkId(closestObject.NetworkId)) {
				closestObject.markAsNoLongerNeeded();
				closestObject.delete();
				this.spawnedProps = this.spawnedProps.filter(p => p.Handle != closestObject.Handle);
			}
		}
	}
}
