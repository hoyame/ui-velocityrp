import { Delay } from "../../../../shared/utils/utils";
import { CoraUI } from "../../../core/coraui";
import { GetClosestPlayer, getVehicleInDirection, KeyboardInput, TriggerServerCallbackAsync } from "../../../core/utils";
import { Props, PropType } from "../../world/props";
import { Documents } from "../../../player/documents";
import { Vehicules } from "../../../player/vehicules";
import { LocalEvents } from "../../../../shared/utils/localEvents";
import { JobId, JobsList } from "../../../../shared/config/jobs/jobs";
import { Vector3 } from "@nativewrappers/client";
import { InteractionPoints } from "../../../misc/interaction-points";
import Config from "../../../../shared/config/jobs/jobs.json";
import { Jobs } from "../../../player/jobs";
import { Clothes } from "../../../player/clothes";
import { ILicenses } from "../../../../shared/player/character";
import { Keys } from "../vehicles/keys";
import { Notifications } from "../../../player/notifications";
import { Tig } from "./tig";
import { Jail } from "./jail";
import CfgBillings from "../../../../shared/config/jobs/billings.json";

enum StatusAgent {
	off = -1,
	finService = 0,
	enService = 1,
	pause = 2,
	standby = 3,
	controleRoutier = 4,
	refusObtemperer = 5,
	delitFuite = 6,
	crime = 7,
}

const StatusName = [
	"Fin de service",
	"En service",
	"En pause",
	"Standby",
	"Controle Routier",
	"Refus d'obtemperer",
	"Delit de fuite",
	"Crime",
];

enum DemandeRenfort {
	petite = 1,
	importante = 2,
	all = 3,
}

export abstract class Police {
	public static Status: StatusAgent = -1;
	public static allBlips: number[] = [];
	public static handcuffed = false;

	public static async initialize() {
		await Tig.initialize();
		await Jail.initialize();

		onNet("gm:jobs:police:receiveRenfortRequest", this.receiveRenfortRequest.bind(this));
		onNet("gm:jobs:police:notifStatus", this.notifStatus.bind(this));

		onNet("gm:jobs:police:cl:roberry", this.roberryNotif.bind(this));
		onNet("gm:jobs:police:cl:fire", this.fireNotif.bind(this));

		const tick = setTick(async () => {
			if (IsPedShooting(PlayerPedId())) {
				const pos = GetEntityCoords(PlayerPedId(), false);
				emitNet("gm:jobs:police:fire", pos);
				await Delay(100000);
			}
		});

		LocalEvents.on("gm:character:spawned", async () => {
			const currentJob = await TriggerServerCallbackAsync("gm:character:getJob");
			const isLspd = currentJob.id == JobId.LSPD;
			const rank = currentJob.rank;
			let shown = false;
			let freeze = false;
			let radar = {
				info: "",
			};

			isLspd && emitNet("gm:jobs:police:registerAgent");

			/*
			isLspd &&
				setTick(() => {
					if (GetSelectedPedWeapon(GetPlayerPed(-1)) == GetHashKey("WEAPON_VINTAGEPISTOL")) {
						DisableControlAction(0, 24, true) 
						DisablePlayerFiring(GetPlayerPed( -1 ), true) 
						DisableControlAction(0, 142, true)
					}


					if (shown) {
						DrawRect(0.508, 0.94, 0.196, 0.116, 0, 0, 0, 150)
						DrawAdvancedText(0.600, 0.903, 0.005, 0.0028, 0.4, "Radar Gun", 0, 191, 255, 255, 6, 0)
						DrawAdvancedText(0.6, 0.928, 0.005, 0.0028, 0.4, radar.info, 255, 255, 255, 255, 6, 0)
					}

					if (IsControlJustPressed(1, 246)) {
						if (GetSelectedPedWeapon(GetPlayerPed(-1)) == GetHashKey("WEAPON_VINTAGEPISTOL")) {
							if (shown == true) {
								ShowAboveRadarMessage("Radargun chargée");
								shown = false;
							} else {
								shown = true;
							}
						}
					}

					if (IsControlJustPressed(1, 38)) {
						freeze = false;
						radar.info = "~y~Initializing Radar Gun...~w~321...~y~Loaded! "
					}

					if (shown) {
						if (IsPlayerFreeAiming(PlayerId())) {
							const player = GetPlayerPed(-1)
							const coordA = GetOffsetFromEntityInWorldCoords(player, 0.0, 1.0, 1.0)
							const coordB = GetOffsetFromEntityInWorldCoords(player, 0.0, 105.0, 0.0)
							const frontcar = StartShapeTestCapsule(coordA[0], coordA[1], coordA[2], coordB[0], coordB[1], coordB[2], 15.0, 10, player, 7)
							const [a, b, c, d, e] = GetShapeTestResult(frontcar)
							const playerId = PlayerId()
							const pos = GetEntityCoords(e, false)

							if (IsEntityAVehicle(e)) {
								DrawMarker(0, pos[0], pos[1], pos[2] +2.5, 0, 0, 0, 0, 0, 0, 1.5001, 1.5001, 1.5001, 255, 165, 0,165, 0, 0, 0,0, "", "", false)
							}
						}

						if (freeze == false) {
							freeze = true;
							console.log("radar shown 1");

							const player = GetPlayerPed(-1);
							const [t, y, u] = GetOffsetFromEntityInWorldCoords(player, 0.0, 1.0, 1.0);
							const [f, g, h] = GetOffsetFromEntityInWorldCoords(player, 0.0, 105.0, 0.0);
							const frontcar = StartShapeTestCapsule(t, y, u, f, g, h, 3.0, 10, player, 7);
							const [a, b, c, d, e] = GetShapeTestResult(frontcar);
							const playerId = PlayerId();

							if (IsEntityAVehicle(e)) {
								if (IsPlayerFreeAiming(playerId)) {
									const fmodel = GetDisplayNameFromVehicleModel(GetEntityModel(e));
									PlaySoundFrontend(-1, "5_Second_Timer", "DLC_HEISTS_GENERAL_FRONTEND_SOUNDS", false);

									const pos = GetEntityCoords(e, false);
									const fvspeed = GetEntitySpeed(e) * 3.6;
									const fplate = GetVehicleNumberPlateText(e);

									console.log("fvspeed", fvspeed);

									radar.info = "~y~Plate: " + fplate + " ~y~Model: " + fmodel + " y~Speed: " + fvspeed + " km/h"
								}
							}
						}
					}
				});
			*/

			isLspd &&
				InteractionPoints.createPoint({
					position: Vector3.create({ x: 451.58880615234375, y: -992.10498046875, z: 30.68960189819336 - 1 }),
					action: () => {
						this.openMenuClothes();
					},
					helpText: "Appuyez sur ~INPUT_CONTEXT~ pour ~b~vous changer",
					marker: true,
				});

			isLspd &&
				InteractionPoints.createPoint({
					position: Vector3.create({ x: 455.0209045410156, y: -1015.3680419921875, z: 28.42424201965332 - 1 }),
					action: () => {
						this.openMenuVehicles();
					},
					helpText: "Appuyez sur ~INPUT_CONTEXT~ pour ~b~vous sortir un vehicule",
					marker: true,
				});

			isLspd &&
				InteractionPoints.createPoint({
					position: Vector3.create({ x: 451.9513854980469, y: -979.8453369140625, z: 30.689603805541992 - 1 }),
					action: () => {
						CoraUI.openMenu({
							name: "Armurie",
							subtitle: "Menu metier",
							glare: true,
							buttons: [
								{
									name: "Equiper",
									onClick: () => {
										JobsList[JobId.LSPD].weapons[rank - 1].map((v: string, k: number) => {
											const weaponHash = GetHashKey(v);
											const ammoType = GetPedAmmoTypeFromWeapon(PlayerPedId(), weaponHash);

											GiveWeaponToPed(PlayerPedId(), weaponHash, 0, false, false);

											if (ammoType !== 0) {
												AddAmmoToPed(PlayerPedId(), weaponHash, 300);
											}

											CoraUI.closeMenu();
										});
									},
								},
								//{
								//	name: "Deposer armes de service",
								//	onClick: () => {
								//	},
								//}
							],
						});
					},
					helpText: "Appuyez sur ~INPUT_CONTEXT~ pour ~b~vous sortir un vehicule",
					marker: true,
				});
		});
	}

	public static fireNotif(pos: number[]) {
		Notifications.Show("Un coup de feu a été détectée, la position est sur votre gps");
		const blip: number = AddBlipForCoord(pos[0], pos[1], pos[2]);

		setTimeout(() => {
			RemoveBlip(blip);
		}, 60000);
	}

	public static roberryNotif(pos: number[]) {
		Notifications.Show("Un braquage a été lancée, la position est sur votre gps");
		const blip: number = AddBlipForCoord(pos[0], pos[1], pos[2]);

		setTimeout(() => {
			RemoveBlip(blip);
		}, 100000);
	}

	public static notifStatus(name: string, status: StatusAgent) {
		Notifications.Show("[LSPD - INFO] L'agent " + name + " est sur le status [" + StatusName[status] + "]");
	}

	public static receiveRenfortRequest(level: DemandeRenfort, coords: number[]) {
		if (level == DemandeRenfort.petite) {
			Notifications.Show("[CODE - 2] Une demande de refort à été reçu");

			const blip: number = AddBlipForCoord(coords[0], coords[1], coords[2]);

			setTimeout(() => {
				RemoveBlip(blip);
			}, 40000);
		} else if (level == DemandeRenfort.importante) {
			Notifications.Show("[CODE - 3] Une demande de refort à été reçu");

			const blip: number = AddBlipForCoord(coords[0], coords[1], coords[2]);

			setTimeout(() => {
				RemoveBlip(blip);
			}, 80000);
		} else if (level == DemandeRenfort.all) {
			Notifications.Show("[CODE - 99] Une demande de refort à été reçu");

			const blip: number = AddBlipForCoord(coords[0], coords[1], coords[2]);

			setTimeout(() => {
				RemoveBlip(blip);
			}, 200000);
		}
	}

	public static setStatus(status: StatusAgent) {
		this.Status = status;
		console.log("status", status);
		emitNet("gm:jobs:police:updateAgentStatus", status);
		Notifications.Show("Vous êtes sur le status [" + StatusName[status] + "]");
	}

	public static requestRenfort(level: DemandeRenfort) {
		const coords: number[] = GetEntityCoords(PlayerPedId(), false);

		emitNet("gm:jobs:police:requestRenfort", level, coords);
	}

	public static openMenu() {
		CoraUI.openMenu({
			name: "Police",
			subtitle: "Menu Metier",
			glare: true,
			buttons: [
				{
					name: "Status Agent",
					onClick: () => CoraUI.openSubmenu("state"),
				},
				{
					name: "Renforts",
					onClick: () => CoraUI.openSubmenu("renforts"),
				},
				{
					name: "Objets",
					onClick: () => CoraUI.openSubmenu("objets"),
				},
				{
					name: "Interaction vehicule",
					onClick: () => CoraUI.openSubmenu("veh"),
				},
				{
					name: "Interaction citoyen",
					onClick: () => CoraUI.openSubmenu("citizen"),
				},
			],

			submenus: {
				citizen: {
					name: "Police",
					subtitle: "Menu Metier",
					glare: true,
					buttons: [
						{
							name: "Carte d'identité",
							onClick: async () => {
								const [closest, distance] = GetClosestPlayer();
								if (distance > 1) return;
								const d: {
									name: string;
									dateOfBirth: string;
									height: string;
									sex: string;
								} = await TriggerServerCallbackAsync("gm:jobs:police:citizen:getIdentity", closest);

								await Documents.ShowIdCard(d.name, PlayerPedId(), "idcard");
							},
						},
						{
							name: "Licenses",
							onClick: async () => {
								const [closest, distance] = GetClosestPlayer();
								if (distance >= 2) return;
								const d = await TriggerServerCallbackAsync("gm:jobs:police:citizen:getLicencies", closest);

								await Documents.showDriving(d.name, PlayerPedId(), d.licenses);
							},
						},
						{
							name: "Gestion licenses",
							onClick: async () => {
								CoraUI.openMenu({
									name: "Gestion licenses",
									subtitle: "Menu Metier",
									glare: true,
									buttons: [
										{
											name: "Retirer permis voiture",
											onClick: () => {
												const [closest, distance] = GetClosestPlayer();
												if (distance >= 2)
													return Notifications.ShowError(
														"Vous devez être à moins de 2m du joueur pour retirer un permis"
													);
												let licensies: ILicenses = {};
												licensies.car = false;

												emitNet("gm:character:removeLicense", licensies, closest);
											},
										},
										{
											name: "Retirer permis camion",
											onClick: () => {
												const [closest, distance] = GetClosestPlayer();
												if (distance >= 2)
													return Notifications.ShowError(
														"Vous devez être à moins de 2m du joueur pour retirer un permis"
													);

												let licensies: ILicenses = {};
												licensies.truck = false;

												emitNet("gm:character:removeLicense", licensies, closest);
											},
										},
										{
											name: "Retirer permis bus",
											onClick: () => {
												const [closest, distance] = GetClosestPlayer();
												if (distance >= 2)
													return Notifications.ShowError(
														"Vous devez être à moins de 2m du joueur pour retirer un permis"
													);

												let licensies: ILicenses = {};
												licensies.bus = false;

												emitNet("gm:character:removeLicense", licensies, closest);
											},
										},
										{
											name: "Retirer permis chasse",
											onClick: () => {
												const [closest, distance] = GetClosestPlayer();
												if (distance >= 2)
													return Notifications.ShowError(
														"Vous devez être à moins de 2m du joueur pour retirer un permis"
													);

												let licensies: ILicenses = {};
												licensies.hunting = false;

												emitNet("gm:character:removeLicense", licensies, closest);
											},
										},
										{
											name: "Retirer permis armes",
											onClick: () => {
												const [closest, distance] = GetClosestPlayer();
												if (distance >= 2)
													return Notifications.ShowError(
														"Vous devez être à moins de 2m du joueur pour retirer un permis"
													);

												let licensies: ILicenses = {};
												licensies.fireArms = false;

												emitNet("gm:character:removeLicense", licensies, closest);
											},
										},
										{
											name: "Envoyer en TIG",
											onClick: async () => {
												const [closest, distance] = GetClosestPlayer();
												const n = await KeyboardInput("Nombre d'action (en nombre)", 25);

												if (distance >= 2)
													return Notifications.ShowError(
														"Vous devez être à moins de 2m du joueur pour retirer un permis"
													);

												emitNet("gm:jobs:police:tig:start", closest, parseInt(n));
											},
										},
										{
											name: "Envoyer en prison",
											onClick: async () => {
												const [closest, distance] = GetClosestPlayer();
												const n = await KeyboardInput("Nombre de minute (en nombre)", 25);

												if (distance >= 2)
													return Notifications.ShowError(
														"Vous devez être à moins de 2m du joueur pour retirer un permis"
													);

												emitNet("gm:jobs:police:sendJail", closest, parseInt(n));
											},
										},
										{
											name: "Mettre une amande",
											onClick: () => {
												const cfg = CfgBillings;
												let buttons: any = [];

												cfg.map((v, k) => {
													buttons.push({
														name: v[0],
														rightText: v[1],
														onClick: () => {
															const [closest, distance] = GetClosestPlayer();
															if (distance >= 2)
																return Notifications.ShowError(
																	"Vous devez être à moins de 2m du joueur pour retirer un permis"
																);

															emitNet("gm:billings:addBilling", closest, v[1], v[0]);
														},
													});
												});

												CoraUI.openMenu({
													name: "Amandes",
													subtitle: "Menu metier",
													glare: true,
													buttons: buttons,
												});
											},
										},
										{
											name: "Voir amandes",
											onClick: async () => {
												const [closest, distance] = GetClosestPlayer();

												if (distance >= 2)
													return Notifications.ShowError(
														"Vous devez être à moins de 2m du joueur pour retirer un permis"
													);

												const billings = await TriggerServerCallbackAsync("gm:character:getBillings", closest);
												let buttons: any = [];

												billings.map((v: any[], k: any) => {
													buttons.push({
														name: `${v[0]} - ${v[1]}`,
														rightText: `${v[2]}€`,
													});
												});

												CoraUI.openMenu({
													name: "Amandes",
													subtitle: "Menu metier",
													glare: true,
													buttons: buttons,
												});
											},
										},
									],
								});
							},
						},
					],
				},
				veh: {
					name: "Police",
					subtitle: "Menu Metier",
					glare: true,
					buttons: [
						{
							name: "Infos vehicule",
							onClick: async () => {
								const [x, y, z] = GetEntityCoords(PlayerPedId(), false);
								if (!IsAnyVehicleNearPoint(x, y, z, 3.0)) return Notifications.ShowError("Aucun véhicule à proximité");

								const cF = GetEntityCoords(PlayerPedId(), false);
								const cT = GetOffsetFromEntityInWorldCoords(PlayerPedId(), 0.0, 20.0, 0.0);
								const vehicle = getVehicleInDirection(cF, cT);

								if (!vehicle) {
									Notifications.ShowError("Aucun véhicule à proximité");
									return;
								}

								const plate = Vehicules.getCustoms(vehicle).plate;
								const owner = await TriggerServerCallbackAsync("gm:jobs:police:citizen:getVehicleOwner", plate);

								if (!plate) {
									Notifications.ShowError("Aucun véhicule à proximité");
									return;
								}
								if (!owner) {
									Notifications.Show("Ce véhicule n'est pas enregistré");
									return;
								}

								Notifications.Show("Ce vehicule appartient a " + owner + ", Plaque: " + plate);
							},
						},
						{
							name: "Crocheter",
							onClick: async () => {
								const [x, y, z] = GetEntityCoords(PlayerPedId(), false);
								if (IsAnyVehicleNearPoint(x, y, z, 3.0)) {
									const cF = GetEntityCoords(PlayerPedId(), false);
									const cT = GetOffsetFromEntityInWorldCoords(PlayerPedId(), 0.0, 20.0, 0.0);
									const vehicle = getVehicleInDirection(cF, cT);

									TaskStartScenarioInPlace(PlayerPedId(), "WORLD_HUMAN_WELDING", 0, true);
									await Delay(20000);
									ClearPedTasksImmediately(PlayerPedId());

									SetVehicleDoorsLocked(vehicle, 1);
									SetVehicleDoorsLockedForAllPlayers(vehicle, false);
									Notifications.ShowSuccess("Vehicule deverouillée");
								}
							},
						},
					],
				},
				state: {
					name: "Police",
					subtitle: "Menu Metier",
					glare: true,
					buttons: [
						{
							name: "Prise de service",
							onClick: () => this.setStatus(StatusAgent.enService),
						},
						{
							name: "Fin de service",
							onClick: () => this.setStatus(StatusAgent.finService),
						},
						{
							name: "Hors Service",
							onClick: () => this.setStatus(StatusAgent.off),
						},
						{
							name: "------------------",
						},
						{
							name: "Pause",
							onClick: () => this.setStatus(StatusAgent.finService),
						},
						{
							name: "Standby",
							onClick: () => this.setStatus(StatusAgent.standby),
						},
						{
							name: "------------------",
						},
						{
							name: "Controle Routier",
							onClick: () => this.setStatus(StatusAgent.controleRoutier),
						},
						{
							name: "Refus d'obtempérer",
							onClick: () => this.setStatus(StatusAgent.refusObtemperer),
						},
						{
							name: "Crime en cours",
							onClick: () => this.setStatus(StatusAgent.crime),
						},
					],
				},

				renforts: {
					name: "Police",
					subtitle: "Menu Metier",
					glare: true,
					buttons: [
						{
							name: "CODE - 2",
							description: "Petite demande",
							onClick: () => this.requestRenfort(DemandeRenfort.petite),
						},
						{
							name: "CODE - 3",
							description: "Demande importante",
							onClick: () => this.requestRenfort(DemandeRenfort.importante),
						},
						{
							name: "CODE - 99",
							description: "Toutes les unités demandées",
							onClick: () => this.requestRenfort(DemandeRenfort.all),
						},
					],
				},
				objets: {
					name: "Police",
					subtitle: "Menu Metier",
					glare: true,
					buttons: [
						{
							name: "Plot",
							onClick: () => Props.SpawnProp(PropType.RoadCon),
						},
						{
							name: "Barriere",
							onClick: () => Props.SpawnProp(PropType.Barrier),
						},
						{
							name: "Herse",
							onClick: () => Props.SpawnProp(PropType.Herse),
						},
					],
				},
			},
		});
	}

	public static openMenuClothes() {
		const outfit = [
			{
				variations: {
					"1": [0, 0],
					"3": [0, 0],
					"4": [4, 0],
					"5": [0, 0],
					"6": [8, 0],
					"7": [0, 0],
					"8": [1, 0],
					"9": [0, 0],
					"10": [0, 0],
					"11": [1, 0],
				},
				props: {},
			},
			{
				variations: {
					"1": [0, 0],
					"3": [0, 0],
					"4": [43, 1],
					"5": [0, 0],
					"6": [48, 0],
					"7": [0, 0],
					"8": [5, 0],
					"9": [0, 0],
					"10": [0, 0],
					"11": [75, 0],
				},
				props: {},
			},
			{
				variations: {
					"1": [0, 0],
					"3": [1, 0],
					"4": [45, 0],
					"5": [0, 0],
					"6": [21, 0],
					"7": [0, 0],
					"8": [36, 0],
					"9": [0, 0],
					"10": [0, 0],
					"11": [32, 0],
				},
				props: {},
			},
		];

		CoraUI.openMenu({
			name: "Tenues de service",
			subtitle: "Menu Metier",
			glare: true,

			buttons: [
				{
					name: "Tenue de service",
					onClick: () => {
						Clothes.addVariations(outfit[0].variations);
						Clothes.setProps(outfit[0].props);
					},
				},
			],
		});
	}

	public static openMenuVehicles() {
		const rank = Jobs.getJob()?.rank || 0;
		const vehicles = Config["police"]["vehicles"][rank];
		let buttons: any = [];

		console.log("vehicles", rank, vehicles);

		vehicles.map((v, k) => {
			buttons.push({
				name: v[0],
				onClick: async () => {
					await Vehicules.spawnVehicle(v[1]);
					const plate = GetVehicleNumberPlateText(GetVehiclePedIsIn(PlayerPedId(), false))?.trim();
					Keys.giveKey(plate);
					CoraUI.closeMenu();
				},
			});
		});

		CoraUI.openMenu({
			name: "Vehicules de service",
			subtitle: "Menu Metier",
			glare: true,
			buttons: buttons,
		});
	}
}
