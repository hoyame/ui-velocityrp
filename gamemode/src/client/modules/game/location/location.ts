import { Delay } from "../../../../shared/utils/utils";
import { CoraUI } from "../../../core/coraui";
import { Money } from "../../../player/money";
import { Vehicules } from "../../../player/vehicules";
import Config from "../../../../shared/config/client.json";
import { BlipsController } from "../../../misc/blips";
import { Game, Vector3 } from "@nativewrappers/client";
import { BlipColor } from "../../../core/enums/blips";
import { InteractionPoints } from "../../../misc/interaction-points";
import { Utils } from "../../../utils/utils";
import { Streaming } from "../../../utils/streaming";
import { Notifications } from "../../../player/notifications";

const screen = {
	baseX: 0.918,
	baseY: 0.984,
	offsetX: 0.018,
	offsetY: -0.013,
	timerBarWidth: 0.165,
	timerBarHeight: 0.035,
};

export abstract class Location {
	public static end: number = 0;
	private static tick: number = 0;
	public static vehicle: number;

	public static async initialize() {
		Config["locations"].map((garage, k) => {
			garage.positions.map((v, k) => {
				BlipsController.CreateBlip({
					name: "Location",
					coords: { x: v.x, y: v.y, z: v.z },
					sprite: 494,
					color: BlipColor.Blue,
					scale: 0.8,
				});

				InteractionPoints.createPoint({
					position: Vector3.create({ x: v.x, y: v.y, z: v.z - 0.9 }),
					action: () => this.openMenu(["adder", "t20"], Config["locations"][k]["spawnpoint"]),
					helpText: "Appuyez sur ~INPUT_CONTEXT~ pour ~b~louer un véhicule",
					marker: false,
					ped: {
						model: "s_f_m_fembarber",
						heading: 80.745,
					},
				});
			});
		});

		BlipsController.CreateBlip({
			name: "Agence de location",
			coords: { x: -285.8402404785156, y: -889.1629028320312, z: 31.08061408996582 },
			sprite: 494,
			color: BlipColor.DarkPurple,
			scale: 0.8,
		});

		InteractionPoints.createPoint({
			position: Vector3.create({ x: -285.8402404785156, y: -889.1629028320312, z: 31.08061408996582 - 0.9 }),
			action: () => {
				clearTick(this.tick);
				DeleteVehicle(this.vehicle);
				this.vehicle = 0;
				this.end = 0;
			},
			helpText: "Appuyez sur ~INPUT_CONTEXT~ pour ~b~ ranger un véhicule louer",
			marker: true,
		});

		const marker = setTick(() => {
			Config["locations"].map((v1: any, k1: any) => {
				v1["positions"].map((v: any, k: any) => {
					if (v1["marker"][0] == true) {
						DrawMarker(
							v1["marker"][1],
							v["x"],
							v["y"],
							v["z"],
							0.0,
							0.0,
							0.0,
							0.0,
							0.0,
							0.0,
							0.75,
							0.75,
							0.75,
							0,
							v1["marker"][2][0],
							v1["marker"][2][1],
							v1["marker"][2][2],
							false,
							true,
							2,
							false,
							// @ts-ignore
							false,
							false,
							false
						);
					}
				});
			});
		});
	}

	private static timerVeh(veh: any, timer: number) {
		this.end = GetGameTimer() + timer;
		Streaming.RequestTextureDictionnaryAsync("timerbars");
		const tick = setTick(async () => {
			if (this.end < GetGameTimer()) {
				TaskLeaveVehicle(PlayerPedId(), veh, 0);
				SetVehicleDoorsLocked(veh, 2);
				await Delay(10000);
				DeleteVehicle(veh);
				clearTick(tick);
				SetStreamedTextureDictAsNoLongerNeeded("timerbars");
			}

			if (Game.PlayerPed.CurrentVehicle?.Handle == veh) {
				const safeZone = GetSafeZoneSize();
				const safeZoneX = (1.0 - safeZone) * 0.5;
				const safeZoneY = (1.0 - safeZone) * 0.5;

				DrawSprite(
					"timerbars",
					"all_black_bg",
					screen.baseX - safeZoneX,
					screen.baseY - safeZoneY,
					screen.timerBarWidth,
					screen.timerBarHeight,
					0.0,
					255,
					255,
					255,
					160
				);

				const remaining = Math.max(0, this.end - GetGameTimer());

				Utils.DrawText2(
					`Fin de la location: ${Math.floor(remaining / 60000)}:${Math.floor((remaining % 60000) / 1000)
						.toString()
						.padStart(2, "0")}`,
					screen.baseX - safeZoneX + screen.offsetX,
					screen.baseY - safeZoneY + screen.offsetY,
					0.36,
					0,
					[255, 255, 255, 255],
					2,
					0
				);
			} else {
				await Delay(1000);
			}
		});
	}

	public static openMenu(vehicules: string[], spawnpoint?: number[]) {
		if (this.end > GetGameTimer()) {
			Notifications.ShowError("Vous ne pouvez pas louer de vehicule pour le moment");
			return;
		}

		let vehiculesButtons: any = [];

		vehicules.map((v, k) => {
			vehiculesButtons.push({
				name: GetDisplayNameFromVehicleModel(GetHashKey(v)),
				description: "Appuyez pour choisir la durée",
				onClick: async () => {
					await Delay(100);
					CoraUI.openMenu({
						name: "Location",
						subtitle: "Louer un vehicule",
						glare: true,
						buttons: [
							{
								name: "1h -- 100$",
								onClick: async () => {
									const timer = 60000 * 60;
									this.vehicle = await Vehicules.spawnVehicle(v, undefined, spawnpoint, true);
									if (!(await Money.pay(100))) return;
									this.timerVeh(this.vehicle, timer);
									FreezeEntityPosition(PlayerPedId(), false);
									CoraUI.closeMenu();
								},
							},

							{
								name: "2h -- 250$",
								onClick: async () => {
									const timer = 60000 * 120;
									this.vehicle = await Vehicules.spawnVehicle(v, undefined, spawnpoint, true);
									if (!(await Money.pay(250))) return;
									this.timerVeh(this.vehicle, timer);
									FreezeEntityPosition(PlayerPedId(), false);
									CoraUI.closeMenu();
								},
							},

							{
								name: "4h -- 500$",
								onClick: async () => {
									const timer = 60000 * 240;
									this.vehicle = await Vehicules.spawnVehicle(v, undefined, spawnpoint, true);
									if (!(await Money.pay(500))) return;
									this.timerVeh(this.vehicle, timer);
									FreezeEntityPosition(PlayerPedId(), false);
									CoraUI.closeMenu();
								},
							},
						],
					});
				},
			});
		});

		CoraUI.openMenu({
			name: "Location",
			subtitle: "Louer un vehicule",
			glare: true,
			onOpen: () => FreezeEntityPosition(PlayerPedId(), true),
			onClose: () => FreezeEntityPosition(PlayerPedId(), false),
			buttons: vehiculesButtons,
		});
	}
}
