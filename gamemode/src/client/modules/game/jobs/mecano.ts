import { BlipSprite, Game, Vector3, VehicleWheelType } from "@wdesgardin/fivem-js";
import { JobId } from "../../../../shared/config/jobs/jobs";
import { Delay } from "../../../../shared/utils/utils";
import { CoraUI } from "../../../core/coraui";
import { GetClosestPlayer, getVehicleInDirection, TriggerServerCallbackAsync } from "../../../core/utils";
import { BlipsController } from "../../../misc/blips";
import { InteractionPoints } from "../../../misc/interaction-points";
import { Jobs } from "../../../player/jobs";
import { Money } from "../../../player/money";
import { Notifications } from "../../../player/notifications";
import { Vehicules } from "../../../player/vehicules";
import { Keys } from "../vehicles/keys";

export abstract class Mecano {
	public static async initialize() {
		const isMecano = Jobs.currentJob?.id == JobId.Mecano;

		BlipsController.CreateBlip({
			name: "Reparer son vehicule",
			coords: { x: -327.0067138671875, y: -144.86643981933594, z: 38.63605499267578 },
			sprite: BlipSprite.Repair,
			color: 0,
			scale: 0.5,
		});

		InteractionPoints.createPoint({
			position: Vector3.create({ x: -327.0067138671875, y: -144.86643981933594, z: 38.63605499267578 - 1 }),
			action: () => {
				if (!Money.pay(100)) return;

				const vehicle = Game.PlayerPed.CurrentVehicle;
				if (vehicle?.exists()) {
					SetVehicleFixed(vehicle.Handle);
					SetVehicleDeformationFixed(vehicle.Handle);
					SetVehicleUndriveable(vehicle.Handle, false);
					Notifications.ShowSuccess(`Vous avez réparé votre véhicule`);
				} else {
					Notifications.ShowError("Vous n'êtes pas dans un véhicule");
				}
			},
			helpText: "Appuyez sur ~INPUT_CONTEXT~ pour ~b~reparer le vehicule pour 100 $",
			marker: true,
		});

		InteractionPoints.createPoint({
			position: Vector3.create({ x: -337.8077392578125, y: -135.6348876953125, z: 39.0096435546875 - 1 }),
			action: () => {
				this.openMenu();
			},
			helpText: () =>
				Jobs.getJob()?.id == JobId.Mecano && !CoraUI.CurrentMenu
					? "Appuyez sur ~INPUT_CONTEXT~ pour ~b~customiser le vehicule"
					: "",
			marker: true,
		});

		InteractionPoints.createPoint({
			position: Vector3.create({ x: -351.020263671875, y: -117.2314453125, z: 38.891971588134766 - 1 }),
			action: () => {
				if (!isMecano) return;

				CoraUI.openMenu({
					name: "Mecano",
					subtitle: "Menu metier",
					glare: true,
					buttons: [
						{
							name: "Sortir remorqueuse",
							onClick: async () => {
								await Vehicules.spawnVehicle(
									"towtruck",
									undefined,
									[-356.7889709472656, -114.65052032470703, 38.66392517089844, 66.33938598632812],
									true
								);
								const plate = GetVehicleNumberPlateText(GetVehiclePedIsIn(PlayerPedId(), false))?.trim();
								Keys.giveKey(plate);
								CoraUI.closeMenu();
							},
						},
					],
				});
			},
			helpText: () =>
				Jobs.getJob()?.id == JobId.Mecano && !CoraUI.CurrentMenu ? "Appuyez sur ~INPUT_CONTEXT~ pour ~b~sortir un vehicule" : "",
			marker: true,
		});

		BlipsController.CreateBlip({
			name: "Mecano",
			coords: { x: -337.86810302734375, y: -136.77687072753906, z: 38.58538818359375 },
			sprite: BlipSprite.Repair,
			color: 0,
			scale: 0.8,
		});
	}

	public static openJobMenu() {
		CoraUI.openMenu({
			name: "Mecano",
			subtitle: "Menu metier",
			glare: true,
			buttons: [
				{
					name: "Reparer",
					onClick: () => {
						const vehicle = Game.PlayerPed.CurrentVehicle;
						if (vehicle?.exists()) {
							SetVehicleFixed(vehicle.Handle);
							SetVehicleDeformationFixed(vehicle.Handle);
							SetVehicleUndriveable(vehicle.Handle, false);
							Notifications.ShowSuccess(`Vous avez réparé votre véhicule`);
						} else {
							Notifications.ShowError("Vous n'êtes pas dans un véhicule");
						}
					},
				},
				{
					name: "Envoyer en furriere",
					onClick: () => {
						const vehicle = Game.PlayerPed.CurrentVehicle;

						if (vehicle?.exists()) {
							DeleteVehicle(vehicle.Handle);
							Notifications.ShowSuccess(`Véhicule renvoyée en fourriere`);
						} else {
							Notifications.ShowError("Vous n'êtes pas dans un véhicule");
						}
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
							Notifications.Show("Vehicule deverouillée");
						}
					},
				},
			],
		});
	}

	public static openMenu() {
		console.log("eoig");
		let valuePanier = 0;
		let customs: any = [];
		let veh: any;
		if (Game.PlayerPed.CurrentVehicle) {
			let veh = Game.PlayerPed.CurrentVehicle.Handle;
		}
		const isMecano = Jobs.currentJob?.id == JobId.Mecano;
		if (!isMecano) return;
		if (!veh) return Notifications.ShowError("Vous n'êtes pas dans un véhicule");
		let buttonsCustom: any = [];

		CoraUI.openMenu({
			name: "Mecano",
			subtitle: "Menu metier",
			glare: true,
			onClose: async () => {
				const v = await TriggerServerCallbackAsync("gm:vehicle:getVehicle", GetVehicleNumberPlateText(veh)?.trim());
				Vehicules.setCustoms(veh, v.customs);
			},
			buttons: [
				{
					name: "Panier",
					onClick: () => CoraUI.openSubmenu("panier"),
				},
				{
					name: "Payer & Sauvegarder",
					onClick: async () => {
						Notifications.ShowSuccess("~g~Sauvegarde en cours");
						emitNet("gm:companies:ctrl:pay", JobId.Mecano, valuePanier);
						Notifications.ShowSuccess("~g~Votre entreprise a payée " + valuePanier + "$");

						const [closest, distance] = GetClosestPlayer();
						if (distance > 1) return CoraUI.closeMenu();

						emitNet("gm:vehicle:update", Vehicules.getCustoms(veh), closest);
						await Delay(1000);
						CoraUI.closeMenu();
					},
				},
				{
					name: "Reparer",
					onClick: () => {
						const vehicle = Game.PlayerPed.CurrentVehicle;
						if (vehicle?.exists()) {
							SetVehicleFixed(vehicle.Handle);
							SetVehicleDeformationFixed(vehicle.Handle);
							Notifications.ShowSuccess(`Vous avez réparé votre véhicule`);
						} else {
							Notifications.ShowError("Vous n'êtes pas dans un véhicule");
						}
					},
				},
				{
					name: "Customiser le vehicule",
					onClick: () => CoraUI.openSubmenu("customisation"),
				},
			],
			submenus: {
				panier: {
					name: "Panier",
					subtitle: "Menu metier",
					glare: true,
					onOpen: () => {
						customs.map((v: string, k: number) => {
							const c = buttonsCustom.find((b: any) => b.name === v);
							if (c) return;

							valuePanier = valuePanier + 50;
							CoraUI.CurrentMenu.buttons[0].rightText = valuePanier.toString();

							buttonsCustom.push({
								name: v,
							});
						});

						CoraUI.CurrentMenu.buttons.push(...buttonsCustom);
					},
					buttons: [
						{
							name: "Valeur du panier",
							rightText: valuePanier.toString(),
							backgroundColor: [109, 185, 102],
						},
					],
				},

				customisation: {
					name: "Customiser le vehicule",
					subtitle: "Menu metier",
					glare: true,
					buttons: [
						{
							name: "Peintures",
							onClick: () =>
								CoraUI.openMenu({
									name: "Peinture",
									subtitle: "Menu metier",
									glare: true,
									buttons: [
										{
											name: "Couleur principale",
											slideNum: 159,
											onSlide: (b: number) => {
												console.log(b);
												const [_, s] = GetVehicleColours(veh);
												const color = (b || 1) - 1;
												SetVehicleColours(veh, color, s);
												customs.push(CoraUI.CurrentMenu.buttons[0].name);
											},
										},
										{
											name: "Couleur secondaire",
											slideNum: 159,
											onSlide: (b: number) => {
												const [s, _] = GetVehicleColours(veh);
												const color = (b || 1) - 1;
												ClearVehicleCustomPrimaryColour(veh);
												SetVehicleColours(veh, color, s);
												customs.push(CoraUI.CurrentMenu.buttons[1].name);
											},
										},
									],
								}),
						},
						{
							name: "Roues",
							onClick: () =>
								CoraUI.openMenu({
									name: "Roue",
									subtitle: "Menu metier",
									glare: true,
									buttons: [
										{
											name: "Type de roue",
											slider: [
												"Sport",
												"Muscle",
												"Lowrider",
												"SUV",
												"Offroad",
												"Tuner",
												"Moto",
												"High end",
												"Bespokes Originals",
												"Bespokes Smokes",
											],
											onSlide: (b: number) => {
												SetVehicleWheelType(veh, Number(b));
												SetVehicleMod(veh, 23, 0, GetVehicleModVariation(veh, 23));
												CoraUI.CurrentMenu.buttons[1].indexSlider = 0;
												CoraUI.CurrentMenu.buttons[1].slideNum = GetNumVehicleMods(veh, 23) - 1;
												customs.push(CoraUI.CurrentMenu.buttons[0].name);
											},
										},
										{
											name: "Modèle des roues",
											slideNum: GetNumVehicleMods(veh, 23) - 1,
											onSlide: (b: number) => {
												SetVehicleMod(veh, 23, b, GetVehicleModVariation(veh, 23));
												customs.push(CoraUI.CurrentMenu.buttons[1].name);
											},
										},
										{
											name: "Couleur roue",
											slideNum: 160,
											onSlide: (b: number) => {
												console.log(b);

												const [a, _] = GetVehicleExtraColours(veh);
												SetVehicleExtraColours(veh, a, b);
												customs.push(CoraUI.CurrentMenu.buttons[2].name);
											},
										},
									],
								}),
						},
						{
							name: "Performances",
							onClick: () =>
								CoraUI.openMenu({
									name: "Performance",
									subtitle: "Menu metier",
									glare: true,
									buttons: [
										{
											name: "Moteur",
											slideNum: GetVehicleMod(veh, 11),
											onSlide: (e: number) => {
												SetVehicleMod(veh, 11, e, GetVehicleModVariation(veh, 11));
												customs.push(CoraUI.CurrentMenu.buttons[0].name);
											},
										},
										{
											name: "Freins",
											slideNum: GetVehicleMod(veh, 12),
											onSlide: (e: number) => {
												SetVehicleMod(veh, 12, e, GetVehicleModVariation(veh, 12));
												customs.push(CoraUI.CurrentMenu.buttons[1].name);
											},
										},
										{
											name: "Transmission",
											slideNum: GetVehicleMod(veh, 13),
											onSlide: (e: number) => {
												SetVehicleMod(veh, 13, e, GetVehicleModVariation(veh, 13));
												customs.push(CoraUI.CurrentMenu.buttons[2].name);
											},
										},
										{
											name: "Suspensions",
											slideNum: GetVehicleMod(veh, 15),
											onSlide: (e: number) => {
												SetVehicleMod(veh, 15, e, GetVehicleModVariation(veh, 15));
												customs.push(CoraUI.CurrentMenu.buttons[3].name);
											},
										},
										{
											name: "Blindage",
											slideNum: GetVehicleMod(veh, 16),
											onSlide: (e: number) => {
												SetVehicleMod(veh, 16, e, GetVehicleModVariation(veh, 16));
												customs.push(CoraUI.CurrentMenu.buttons[4].name);
											},
										},
										{
											name: "Turbo",
											slideNum: GetVehicleMod(veh, 17),
											onSlide: (e: number) => {
												SetVehicleMod(veh, 17, e, GetVehicleModVariation(veh, 17));
												customs.push(CoraUI.CurrentMenu.buttons[5].name);
											},
										},
									],
								}),
						},
						{
							name: "Accessoires",
							onClick: () =>
								CoraUI.openMenu({
									name: "Accessoires",
									subtitle: "Menu metier",
									glare: true,
									buttons: [
										{
											name: "Klaxon",
										},
										{
											name: "Interieurs",
											slideNum: GetVehicleMod(veh, 17),
											onSlide: (e: number) => {
												SetVehicleMod(veh, 17, e, GetVehicleModVariation(veh, 17));
												customs.push(CoraUI.CurrentMenu.buttons[0].name);
											},
										},
										{
											name: "Tableau de bord",
											slideNum: GetVehicleMod(veh, 29),
											onSlide: (e: number) => {
												SetVehicleMod(veh, 29, e, GetVehicleModVariation(veh, 29));
												customs.push(CoraUI.CurrentMenu.buttons[1].name);
											},
										},
										{
											name: "Ceintures",
											slideNum: GetVehicleMod(veh, 32),
											onSlide: (e: number) => {
												SetVehicleMod(veh, 32, e, GetVehicleModVariation(veh, 32));
												customs.push(CoraUI.CurrentMenu.buttons[2].name);
											},
										},
										{
											name: "Volant",
											slideNum: GetVehicleMod(veh, 33),
											onSlide: (e: number) => {
												SetVehicleMod(veh, 33, e, GetVehicleModVariation(veh, 33));
												customs.push(CoraUI.CurrentMenu.buttons[3].name);
											},
										},
										{
											name: "Levier de vitesse",
											slideNum: GetVehicleMod(veh, 34),
											onSlide: (e: number) => {
												SetVehicleMod(veh, 34, e, GetVehicleModVariation(veh, 34));
												customs.push(CoraUI.CurrentMenu.buttons[4].name);
											},
										},
										{
											name: "Suspension hydraulique",
											slideNum: GetVehicleMod(veh, 38),
											onSlide: (e: number) => {
												SetVehicleMod(veh, 38, e, GetVehicleModVariation(veh, 38));
												customs.push(CoraUI.CurrentMenu.buttons[5].name);
											},
										},
										{
											name: "Bloc moteur",
											slideNum: GetVehicleMod(veh, 39),
											onSlide: (e: number) => {
												SetVehicleMod(veh, 39, e, GetVehicleModVariation(veh, 39));
												customs.push(CoraUI.CurrentMenu.buttons[6].name);
											},
										},
										{
											name: "Filtre à air",
											slideNum: GetVehicleMod(veh, 40),
											onSlide: (e: number) => {
												SetVehicleMod(veh, 40, e, GetVehicleModVariation(veh, 40));
												customs.push(CoraUI.CurrentMenu.buttons[7].name);
											},
										},
										{
											name: "Phares",
											slideNum: GetVehicleMod(veh, 22),
											onSlide: (e: number) => {
												SetVehicleMod(veh, 22, e, GetVehicleModVariation(veh, 22));
												customs.push(CoraUI.CurrentMenu.buttons[8].name);
											},
										},
										{
											name: "Pare-boue des ailes",
											slideNum: GetVehicleMod(veh, 42),
											onSlide: (e: number) => {
												SetVehicleMod(veh, 42, e, GetVehicleModVariation(veh, 42));
												customs.push(CoraUI.CurrentMenu.buttons[9].name);
											},
										},
										{
											name: "Antennes",
											slideNum: GetVehicleMod(veh, 43),
											onSlide: (e: number) => {
												SetVehicleMod(veh, 43, e, GetVehicleModVariation(veh, 43));
												customs.push(CoraUI.CurrentMenu.buttons[10].name);
											},
										},
										{
											name: "Ailes",
											slideNum: GetVehicleMod(veh, 44),
											onSlide: (e: number) => {
												SetVehicleMod(veh, 44, e, GetVehicleModVariation(veh, 44));
												customs.push(CoraUI.CurrentMenu.buttons[11].name);
											},
										},
										{
											name: "Buchon de réservoir",
											slideNum: GetVehicleMod(veh, 45),
											onSlide: (e: number) => {
												SetVehicleMod(veh, 45, e, GetVehicleModVariation(veh, 45));
												customs.push(CoraUI.CurrentMenu.buttons[12].name);
											},
										},
										{
											name: "Fenêtres",
											slideNum: GetVehicleMod(veh, 46),
											onSlide: (e: number) => {
												SetVehicleMod(veh, 46, e, GetVehicleModVariation(veh, 46));
												customs.push(CoraUI.CurrentMenu.buttons[13].name);
											},
										},
										{
											name: "Autocollants",
											slideNum: GetVehicleMod(veh, 48),
											onSlide: (e: number) => {
												SetVehicleMod(veh, 48, e, GetVehicleModVariation(veh, 48));
												customs.push(CoraUI.CurrentMenu.buttons[14].name);
											},
										},
									],
								}),
						},
						{
							name: "Carroserie",
							onClick: () =>
								CoraUI.openMenu({
									name: "Carroserie",
									subtitle: "Menu metier",
									glare: true,
									buttons: [
										{
											name: "Aileron",
											slideNum: GetVehicleMod(veh, 0),
											onSlide: (e: number) => {
												SetVehicleMod(veh, 0, e, GetVehicleModVariation(veh, 0));
												customs.push(CoraUI.CurrentMenu.buttons[0].name);
											},
										},
										{
											name: "Pare-choc avant",
											slideNum: GetVehicleMod(veh, 1),
											onSlide: (e: number) => {
												SetVehicleMod(veh, 1, e, GetVehicleModVariation(veh, 1));
												customs.push(CoraUI.CurrentMenu.buttons[1].name);
											},
										},
										{
											name: "Pare-choc arrière",
											slideNum: GetVehicleMod(veh, 2),
											onSlide: (e: number) => {
												SetVehicleMod(veh, 2, e, GetVehicleModVariation(veh, 2));
												customs.push(CoraUI.CurrentMenu.buttons[2].name);
											},
										},
										{
											name: "Bas de caisse",
											slideNum: GetVehicleMod(veh, 3),
											onSlide: (e: number) => {
												SetVehicleMod(veh, 3, e, GetVehicleModVariation(veh, 3));
												customs.push(CoraUI.CurrentMenu.buttons[3].name);
											},
										},
										{
											name: "Pot d'échappement",
											slideNum: GetVehicleMod(veh, 4),
											onSlide: (e: number) => {
												SetVehicleMod(veh, 4, e, GetVehicleModVariation(veh, 4));
												customs.push(CoraUI.CurrentMenu.buttons[4].name);
											},
										},
										{
											name: "Cage",
											slideNum: GetVehicleMod(veh, 5),
											onSlide: (e: number) => {
												SetVehicleMod(veh, 5, e, GetVehicleModVariation(veh, 5));
												customs.push(CoraUI.CurrentMenu.buttons[5].name);
											},
										},
										{
											name: "Grille",
											slideNum: GetVehicleMod(veh, 6),
											onSlide: (e: number) => {
												SetVehicleMod(veh, 6, e, GetVehicleModVariation(veh, 6));
												customs.push(CoraUI.CurrentMenu.buttons[6].name);
											},
										},
										{
											name: "Capot",
											slideNum: GetVehicleMod(veh, 7),
											onSlide: (e: number) => {
												SetVehicleMod(veh, 7, e, GetVehicleModVariation(veh, 7));
												customs.push(CoraUI.CurrentMenu.buttons[7].name);
											},
										},
										{
											name: "Aile gauche",
											slideNum: GetVehicleMod(veh, 8),
											onSlide: (e: number) => {
												SetVehicleMod(veh, 8, e, GetVehicleModVariation(veh, 8));
												customs.push(CoraUI.CurrentMenu.buttons[8].name);
											},
										},
										{
											name: "Aile droite",
											slideNum: GetVehicleMod(veh, 9),
											onSlide: (e: number) => {
												SetVehicleMod(veh, 9, e, GetVehicleModVariation(veh, 9));
												customs.push(CoraUI.CurrentMenu.buttons[9].name);
											},
										},
										{
											name: "Toit",
											slideNum: GetVehicleMod(veh, 10),
											onSlide: (e: number) => {
												SetVehicleMod(veh, 10, e, GetVehicleModVariation(veh, 10));
												customs.push(CoraUI.CurrentMenu.buttons[10].name);
											},
										},
									],
								}),
						},
					],
				},
			},
		});
	}
}
