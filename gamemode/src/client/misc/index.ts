import { Delay } from "../../shared/utils/utils";
import Config from "../../shared/config/client.json";
import { ShowHelpNotification } from "../core/utils";
import { AdminMenuController } from "../modules/game/admin/menu";
import { OpenBankMenu } from "../modules/player/bank/menu";
import { PersonnalMenu } from "../modules/player/personalmenu/menu";
import { OpenShopMenu, OpenDarkShopMenu } from "../modules/game/shop/menu";
import { Character } from "../player/character";
import { Inventory } from "../player/inventory";
import { PedUtils } from "../utils/ped";
import { Streaming } from "../utils/streaming";
import { Utils } from "../utils/utils";
import { BlipsController } from "./blips";
import { NotificationType } from "../../shared/types/notifications";
import { Notifications } from "../player/notifications";

export abstract class Misc {
	public static Loaded = false;
	public static Cache = [];

	public static async initialize() {
		console.log("[GM][Framework] | [Module] - Misc Initialized");
		this.Loaded = true;

		RegisterCommand("+personalmenu", () => PersonnalMenu.Open(), false);
		RegisterKeyMapping("+personalmenu", "Ouvrir menu personnel", "keyboard", "F5");

		RegisterCommand("+rockstareditor", ActivateRockstarEditor, false);

		RegisterCommand("+adminmenu", () => AdminMenuController.OpenMenu(), false);
		RegisterKeyMapping("+adminmenu", "Ouvrir le menu Admin", "keyboard", "F2");

		RegisterCommand(
			"printCoords",
			() => {
				const [x, y, z] = GetEntityCoords(PlayerPedId(), false);
				const h = GetEntityHeading(PlayerPedId());
				emitNet("gm:dev:printCoords", x, y, z, h);
			},
			false
		);

		// gern

		const markers: any = Config["markers"] || [];
		const hover: any = Config["hover"] || [];
		console.log("markers", markers["outfits"]);
		let ltdPeds: any = [];

		setImmediate(() => {
			markers.map((v1: any, k1: any) => {
				v1["positions"].map((v: any, k: any) => {
					if (markers[k1]["blip"][5] == true) {
						BlipsController.CreateBlip({
							name: markers[k1]["blip"][0],
							coords: { x: v["x"], y: v["y"], z: v["z"] },
							sprite: markers[k1]["blip"][1],
							color: markers[k1]["blip"][4],
							scale: 0.8,
						});
					}

					if (markers[k1]["ped"]) {
						let objsRobbery: any = [];
						if (markers[k1]["ped"][1] == "mp_m_shopkeep_01") {
							// si apu
							ltdPeds[k1] = PedUtils.CreatePed(markers[k1]["ped"][1], [v["x"], v["y"], v["z"]], markers[k1]["ped"][2]);

							setTick(async () => {
								await Delay(5);

								if (IsPedArmed(PlayerPedId(), 7)) {
									if (IsPlayerFreeAiming(PlayerId())) {
										ltdPeds.map(async (v: any, k: any) => {
											const [px, py, pz] = GetEntityCoords(PlayerPedId(), false);
											const [ax, ay, az] = GetEntityCoords(v, false);

											if (
												!Character.Busy &&
												HasEntityClearLosToEntityInFront(PlayerPedId(), v) &&
												!IsPedDeadOrDying(v, true) &&
												GetDistanceBetweenCoords(px, py, pz, ax, ay, az, false) <= 5.0
											) {
												Character.toggleBusy();
												Streaming.RequestAnimDictionnaryAsync("missheist_agency2ahands_up");
												Streaming.RequestAnimDictionnaryAsync("mp_am_hold_up");

												TaskPlayAnim(
													v,
													"mp_am_hold_up",
													"holdup_victim_20s",
													8.0,
													-8.0,
													-1,
													2,
													0,
													false,
													false,
													false
												);

												FreezeEntityPosition(v, true);

												await Delay(1500);

												const bag = CreateObject(GetHashKey("prop_poly_bag_01"), ax, ay, az, false, false, false);
												if (objsRobbery[k] == null) {
													SetEntityHeading(bag, markers[k1]["ped"][2]);
													AttachEntityToEntity(
														bag,
														v,
														GetPedBoneIndex(v, 60309),
														0.1,
														-0.11,
														0.08,
														0.0,
														-75.0,
														-75.0,
														true,
														true,
														false,
														false,
														2,
														true
													);
												}

												let timer = GetGameTimer() + 10000;

												while (timer >= GetGameTimer()) {
													if (IsPedDeadOrDying(v, true)) {
														break;
													}

													await Delay(0);
												}

												DetachEntity(bag, true, false);

												timer = GetGameTimer() + 75;

												while (timer >= GetGameTimer()) {
													if (IsPedDeadOrDying(v, true)) {
														break;
													}

													await Delay(0);
												}

												ApplyForceToEntity(
													bag,
													3,
													0.0,
													50.0,
													0.0,
													0.0,
													0.0,
													0.0,
													0,
													true,
													true,
													false,
													false,
													true
												);

												PlaySoundFrontend(-1, "ROBBERY_MONEY_TOTAL", "HUD_FRONTEND_CUSTOM_SOUNDSET", true);
												const amount = Utils.random(300, 500);

												Notifications.ShowSuccess(
													"Braquage Effectuée ! Vous avez récupéré " + amount.toString() + " $",
													"money"
												);
												emitNet("gm:roberry:ltd");
												emitNet("gm:jobs:police:roberry", GetEntityCoords(PlayerPedId(), false));
												Character.toggleBusy();

												DeleteObject(bag);
												TaskPlayAnim(v, "mp_am_hold_up", "cower_intro", 8.0, -8.0, -1, 0, 0, false, false, false);

												timer = GetGameTimer() + 2500;

												while (timer >= GetGameTimer()) {
													if (IsPedDeadOrDying(v, true)) {
														break;
													}

													await Delay(0);
												}

												TaskPlayAnim(v, "mp_am_hold_up", "cower_loop", 8.0, -8.0, -1, 1, 0, false, false, false);

												timer = GetGameTimer() + 1000;

												while (timer >= GetGameTimer()) {
													if (IsPedDeadOrDying(v, true)) {
														break;
													}

													await Delay(0);
												}

												if (IsEntityPlayingAnim(v, "mp_am_hold_up", "cower_loop", 3)) {
													ClearPedTasks(v);
												}
											}
										});
									}
								}
							});
						} else {
							const ped = PedUtils.CreatePed(markers[k1]["ped"][1], [v["x"], v["y"], v["z"] - 1], markers[k1]["ped"][2]);
							FreezeEntityPosition(ped, true);
						}
					}
				});
			});
		});

		setTick(() => {
			markers.map((v1: any, k1: any) => {
				v1["positions"].map((v: any, k: any) => {
					if (markers[k1]["marker"][0] == true) {
						DrawMarker(
							markers[k1]["marker"][1],
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
							markers[k1]["marker"][2][0],
							markers[k1]["marker"][2][1],
							markers[k1]["marker"][2][2],
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

		// event marker
		setTick(() => {
			markers.map((v1: any, k1: any) => {
				v1["positions"].map((v: any, k: any) => {
					const [px, py, pz] = GetEntityCoords(PlayerPedId(), false);

					if (!markers[k1]["mess"]) return;

					if (GetDistanceBetweenCoords(px, py, pz, v["x"], v["y"], v["z"], true) < 2.5) {
						ShowHelpNotification(markers[k1]["mess"]);

						if (IsControlJustPressed(0, markers[k1]["touche"])) {
							console.log("531561", markers[k1]["action"]);

							switch (markers[k1]["action"]) {
								case "openLtdMenu":
									OpenShopMenu(Config["shops"]);
									break;
								case "openDarkShopMenu":
									OpenDarkShopMenu(Config["dark-shops"]);
									break;
								case "openBankMenu":
									OpenBankMenu(Config["dark-shops"]);
									break;
								case "openPhoneShop":
									Inventory.buyItem("phone");
									break;
								default:
									return;
							}
						}
					}
				});
			});
		});

		AddTextEntry("PM_PANE_LEAVE", "~w~Déconnexion de ~b~" + Config.serverName);
		AddTextEntry("PM_PANE_QUIT", `~w~Quitter ~b~${Config.serverName} ~w~et ~r~FiveM`);
		AddTextEntry("PM_SCR_MAP", `Map ~b~${Config.serverName}~w~`);
	}
}
