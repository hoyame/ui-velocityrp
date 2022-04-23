import { BlipsController } from "../../../misc/blips";
import Config from "../../../../shared/config/activity/fishing.json";
import { Player } from "@wdesgardin/fivem-js";
import { Vec3, Vector3 } from "@wdesgardin/fivem-js/lib/utils/Vector3";
import { ItemsConfig } from "../../../../shared/config/items";
import { Delay } from "../../../../shared/utils/utils";
import { CoraUI } from "../../../core/coraui";
import { Vehicules } from "../../../player/vehicules";
import { Money } from "../../../player/money";
import { INewInteractionPoint, InteractionPoints } from "../../../misc/interaction-points";
import { Notifications } from "../../../player/notifications";

export class Fish {
	private static player = new Player(PlayerId());
	private static pause = false;
	private static pauseTimer = 0;
	private static fishing = false;
	private static input = 0;
	private static correctInput = 0;
	private static bait = "";
	private static controls = { 1: 157, 2: 158, 3: 160, 4: 164, 5: 165, 6: 159, 7: 161, 8: 162 };

	public static async initialize() {
		BlipsController.CreateBlip({
			coords: Config.sellPoints.fish.coords,
			...Config.sellPoints.fish.blip,
		});

		for (const [item, point] of Object.entries(Config.sellPoints)) {
			//@ts-ignore
			const ped = point.ped as INewInteractionPoint["ped"];
			InteractionPoints.createSellPoint({
				items: [item],
				position: Vector3.create(point.coords),
				ped,
			});
		}

		for (const position of Config.boats.positions) {
			BlipsController.CreateBlip({
				...Config.boats.blip,
				coords: position.marker,
			});
		}

		for (const boatPos of Config.boats.positions) {
			InteractionPoints.createPoint({
				position: Vector3.create(boatPos.marker),
				ped: { model: "s_m_y_dockwork_01" },
				helpText: "Appuyez sur ~INPUT_TALK~ pour louer un Bateau",
				action: () => this.openMenu(boatPos.boatSpawn),
			});
		}

		onNet("gm:fishing:turtlebait", () => this.setBait("turtlebait"));
		onNet("gm:fishing:fishbait", () => this.setBait("fishbait"));
		onNet("gm:fishing:rod", () => this.useRod());
		onNet("gm:fishing:rodbreak", this.rodBreak.bind(this));

		setTick(async () => {
			await Delay(Math.randomRange(Config.waitTime.min, Config.waitTime.max));
			if (!this.fishing) return;

			this.pause = true;
			this.input = 0;
			this.correctInput = Math.randomRange(1, 8);
			this.pauseTimer = 0;

			Notifications.Show(`Le poisson mord à l'hameçon~w~~n~Appuyez sur ${this.correctInput} pour l'attraper !`);
		});

		setInterval(() => {
			if (this.pause && this.fishing) {
				this.pauseTimer++;
			}
		}, 600);

		setTick(() => {
			if (!this.fishing) return;

			DisableControlAction(2, 73, true);
			if (IsDisabledControlJustPressed(0, 73)) {
				this.fishing = false;
				ClearPedTasksImmediately(this.player.Character.Handle);
				Notifications.Show("Vous avez ~b~rangé~w~ votre Canne à Pêche");
				return;
			}

			if (this.pauseTimer > 3) {
				this.input = 99;
			} else {
				for (const [inpt, ctrl] of Object.entries(this.controls)) {
					if (IsControlJustPressed(0, ctrl)) {
						this.input = Number(inpt);
						break;
					}
				}
			}

			const pos = this.player.Character.Position;
			if (!this.isInFishingArea(pos) || this.player.Character.isInAnyVehicle()) {
				this.fishing = false;
				Notifications.Show("Arrêtez de Pêcher !");
			}

			if (this.player.Character.isDead() || this.player.Character.IsInWater) {
				Notifications.Show("Arrêtez de Pêcher !");
			}

			if (this.pause && this.input) {
				this.pause = false;
				if (this.input == this.correctInput) {
					this.catchFish();
				} else {
					Notifications.Show("Le Poisson s'est libéré !");
				}
			}
		});

		console.log("[GM] | [Module] - Fish Initialized");
	}

	public static openMenu(spawn: Vec3) {
		const buttons = Config.boats.vehicles.map(v => ({
			name: v.name,
			rightText: `${v.price}$`,
			onClick: () => {
				CoraUI.closeMenu();
				this.loanBoat(v, spawn);
			},
		}));

		CoraUI.openMenu({
			name: Config.boats.blip.name,
			subtitle: "",
			glare: true,
			buttons: buttons,
		});
	}

	public static async loanBoat(boat: typeof Config.boats.vehicles[number], pos: Vec3) {
		if (!(await Money.pay(boat.price))) return;

		SetPedCoordsKeepVehicle(this.player.Character.Handle, pos.x, pos.y, pos.z);
		Vehicules.spawnVehicle(boat.model, undefined, [pos.x, pos.y, pos.z, 0]);
		Notifications.ShowSuccess("Votre ~b~bateau ~w~à été livré avec ~g~succés ~w~!", "money");
	}

	public static setBait(bait: "fishbait" | "turtlebait") {
		this.bait = bait;
		Notifications.Show(`Vous avez mis un ~b~${ItemsConfig[bait].name}~w~ sur votre hameçon`);
	}

	public static useRod() {
		if (this.player.Character.isInAnyVehicle()) {
			Notifications.ShowError("Vous ne pouvez pas pêcher depuis un véhicule !");
			return;
		}

		const pos = this.player.Character.Position;
		if (this.isInFishingArea(pos)) {
			Notifications.Show("La Pêche a débutée !");
			TaskStartScenarioInPlace(this.player.Character.Handle, "WORLD_HUMAN_STAND_FISHING", 0, true);
			this.fishing = true;
		} else {
			Notifications.ShowError("Il faut aller plus loin du rivage !");
		}
	}

	public static catchFish() {
		emitNet("gm:fishing:catch", this.bait);
		this.bait = "";
	}

	private static rodBreak() {
		ClearPedTasks(this.player.Character.Handle);
		this.fishing = false;
		Notifications.ShowWarning("C'était énorme et ça a cassé votre canne à pêche!");
	}

	private static isInFishingArea(coords: Vec3) {
		return coords.y >= 1500 || coords.y <= -1500 || coords.x <= -1500 || coords.x >= 1500;
	}
}
