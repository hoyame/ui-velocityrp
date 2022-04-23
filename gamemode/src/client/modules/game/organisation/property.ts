import { BlipColor } from "@wdesgardin/fivem-js";
import { Delay } from "../../../../shared/utils/utils";
import { ShowHelpNotification, TriggerServerCallbackAsync } from "../../../core/utils";
import { BlipsController } from "../../../misc/blips";
import { Character } from "../../../player/character";
import { Orgs } from "../../../player/orgs";
import Config from "../../../../shared/config/client.json";
import { LocalEvents } from "../../../../shared/utils/localEvents";
import { IProperty } from "../../../../shared/types/property";

const CheckPropertyType = (zd: any, zdx: any) => {
	let b = false;

	zd.map((v: any, k: any) => {
		console.log("132456", v["propertyType"][1], zdx);
		if (v["propertyType"][1] == zdx) {
			b = true;
			return true;
		}
	});

	return b;
};

export abstract class OrganisationProperty {
	private static inProperty = [false, ""]; // [[si il est dedans], [complexe, qg, etc]]
	private static oldPosition: number[] = [];
	public static OwnedProperties: any = [];

	public static bunkerOwned: any = [];
	public static complexeOwned: any = [];
	public static qgOwned: any = [];

	public static Types = {
		complexe: {
			positions: [
				[-2229.2265625, 2399.317626953125, 11.727995872497559],
				[-11.22120189666748, 3307.741943359375, 41.53969955444336],
				[20.03550910949707, 6825.2490234375, 15.446247100830078],
				[3389.375, 5509.26708984375, 25.932470321655273],
				[2754.4013671875, 3905.64453125, 44.81979751586914],
				[1.3155556917190552, 2599.915771484375, 85.4219970703125],
				[2088.124755859375, 1763.532470703125, 103.12733459472656],
				[1864.103515625, 267.92803955078125, 163.34556579589844],
			],

			interior: [471.2276306152344, 4801.0205078125, -53.99388885498047],

			coffre: [422.9258728027344, 4826.09814453125, -58.99967956542969],
			actions: [418.0719299316406, 4813.9345703125, -58.99794006347656],

			vehicules: {
				plane: [482.1949157714844, 4814.97412109375, -58.91283416748047, 192.68148803710938],
			},
		},

		bunker: {
			positions: [
				[-3032.108642578125, 3334.257080078125, 10.231512069702148],
				[-755.0157470703125, 5943.7490234375, 19.870054244995117],
				[-388.8938903808594, 4340.43994140625, 56.179080963134766],
				[39.7662467956543, 2930.360107421875, 55.7901611328125],
				[493.1409912109375, 3014.35693359375, 41.00879669189453],
				[2110.078125, 3325.709228515625, 45.35371017456055],
				[2489.1904296875, 3162.131103515625, 48.9937629699707],
				[1572.4459228515625, 2225.9482421875, 78.28021240234375],
				[1801.0906982421875, 4705.34814453125, 39.84516906738281],
			],

			interior: [892.4156494140625, -3246.142822265625, -98.26649475097656],

			coffre: [901.6734008789062, -3182.4873046875, -97.06060028076172],
			actions: [892.1148681640625, -3203.627685546875, -98.19622802734375],
			exitVehicle: [888.2828979492188, -3246.706298828125, -98.28018951416016],
		},

		qg: {
			positions: [
				[189.89634704589844, 308.6787109375, 105.39099884033203],
				[3.963423490524292, -201.08790588378906, 52.74190902709961],
				[-1471.59423828125, -920.4022216796875, 10.025029182434082],
				[-1148.03564453125, -1562.4542236328125, 4.387660026550293],
				[92.66194152832031, -819.6701049804688, 31.290302276611328],
				[203.61436462402344, -1669.6004638671875, 29.803199768066406],
				[960.4940795898438, -1585.8349609375, 30.388439178466797],
			],

			interior: [1121.0350341796875, -3152.21240234375, -37.06272888183594],
			coffre: [1118.7061767578125, -3143.461669921875, -37.062744140625],
			actions: [1116.3236083984375, -3160.809326171875, -36.87049102783203],
		},
	};

	public static async initialize() {
		LocalEvents.on("gm:character:spawned", async () => {
			const orgId = Orgs.getOrg()?.name;

			if (orgId) {
				this.OwnedProperties = (await TriggerServerCallbackAsync("gm:property:getPropertiesWithId", orgId)) as IProperty[];
				this.bunkerOwned = this.OwnedProperties.filter((x: { propertyType: string[] }) => x.propertyType[0] == "bunker");
				this.complexeOwned = this.OwnedProperties.filter((x: { propertyType: string[] }) => x.propertyType[0] == "complexe");
				this.qgOwned = this.OwnedProperties.filter((x: { propertyType: string[] }) => x.propertyType[0] == "qgOwned");

				await Delay(600);
			}

			this.Types.complexe.positions.map((v, k) => {
				if (CheckPropertyType(this.complexeOwned, k) == true) {
					BlipsController.CreateBlip({
						name: "Complexes de l'organisation",
						coords: { x: v[0], y: v[1], z: v[2] },
						sprite: 476,
						color: BlipColor.Red,
						scale: 0.8,
					});
				} else {
					BlipsController.CreateBlip({
						name: "Complexes à vendre",
						coords: { x: v[0], y: v[1], z: v[2] },
						sprite: 476,
						color: BlipColor.Red,
						scale: 0.8,
					});
				}
			});

			this.Types.bunker.positions.map((v, k) => {
				if (CheckPropertyType(this.bunkerOwned, k) == true) {
					BlipsController.CreateBlip({
						name: "Bunker de l'organisation",
						coords: { x: v[0], y: v[1], z: v[2] },
						sprite: 474,
						color: BlipColor.Red,
						scale: 0.8,
					});
				} else {
					BlipsController.CreateBlip({
						name: "Bunker à vendre",
						coords: { x: v[0], y: v[1], z: v[2] },
						sprite: 474,
						color: BlipColor.Red,
						scale: 0.8,
					});
				}
			});

			this.Types.qg.positions.map((v, k) => {
				if (CheckPropertyType(this.qgOwned, k) == true) {
					BlipsController.CreateBlip({
						name: "QG de l'organisation",
						coords: { x: v[0], y: v[1], z: v[2] },
						sprite: 476,
						color: BlipColor.Red,
						scale: 0.8,
					});
				} else {
					BlipsController.CreateBlip({
						name: "QG à vendre",
						coords: { x: v[0], y: v[1], z: v[2] },
						sprite: 476,
						color: BlipColor.Red,
						scale: 0.8,
					});
				}
			});

			setTick(() => {
				this.Types["complexe"]["positions"].map((v, k) => {
					const [px, py, pz] = GetEntityCoords(PlayerPedId(), false);

					//temp
					const bool = true;

					if (GetDistanceBetweenCoords(px, py, pz, v[0], v[1], v[2], true) < 2.5) {
						if (bool) {
							if (CheckPropertyType(this.complexeOwned, k)) {
								ShowHelpNotification("Appuyez sur ~INPUT_PICKUP~ pour entrer dans le complexe");

								if (IsControlJustPressed(0, 38)) {
									this.oldPosition = v;
									this.enter(this.Types["complexe"]["interior"], "complexe");

									const complexeTick = setTick(async () => {
										const [px, py, pz] = GetEntityCoords(PlayerPedId(), false);

										if (!this.inProperty[0]) {
											await Delay(10000);
										} else {
											if (
												GetDistanceBetweenCoords(
													this.Types["complexe"]["coffre"][0],
													this.Types["complexe"]["coffre"][1],
													this.Types["complexe"]["coffre"][2],
													px,
													py,
													pz,
													true
												) < 2.5
											) {
												ShowHelpNotification("Appuyez sur ~INPUT_PICKUP~ pour regarder le coffre");

												if (IsControlJustPressed(0, 38)) {
													// open coffre menu
												}
											}

											if (
												GetDistanceBetweenCoords(
													this.Types["complexe"]["actions"][0],
													this.Types["complexe"]["actions"][1],
													this.Types["complexe"]["actions"][2],
													px,
													py,
													pz,
													true
												) < 2.5
											) {
												ShowHelpNotification("Appuyez sur ~INPUT_PICKUP~ pour regarder les actions");

												if (IsControlJustPressed(0, 38)) {
													// open action menu
												}
											}

											if (
												GetDistanceBetweenCoords(
													this.Types["complexe"]["interior"][0],
													this.Types["complexe"]["interior"][1],
													this.Types["complexe"]["interior"][2],
													px,
													py,
													pz,
													true
												) < 2.5
											) {
												ShowHelpNotification("Appuyez sur ~INPUT_PICKUP~ pour sortir du complexe");

												if (IsControlJustPressed(0, 38)) {
													// open action menu
													this.exit();
													clearTick(complexeTick);
												}
											}
										}
									});
								} else {
									ShowHelpNotification(
										"Appuyez sur ~INPUT_DETONATE~ pour acheter le complexe a " + Config.organisation.complexe + "$"
									);

									if (IsControlJustPressed(0, 47)) {
										const name = Orgs.getOrg()?.name || "";
										const rank = Orgs.getOrg()?.rank || 0;

										if (rank >= 4) {
											emitNet("gm:property:buyPropertyOrg", "complexe", k, name);
										} else {
											ShowHelpNotification("Vous n'avez pas les permissions suffisantes");
										}
									}
								}
							}
						}
					}
				});
			});

			setTick(() => {
				this.Types["bunker"]["positions"].map((v, k) => {
					const [px, py, pz] = GetEntityCoords(PlayerPedId(), false);

					//temp
					const bool = true;

					if (GetDistanceBetweenCoords(px, py, pz, v[0], v[1], v[2], true) < 2.5) {
						if (bool) {
							if (CheckPropertyType(this.bunkerOwned, k)) {
								ShowHelpNotification("Appuyez sur ~INPUT_PICKUP~ pour entrer dans le bunker");

								if (IsControlJustPressed(0, 38)) {
									this.oldPosition = v;
									this.enter(this.Types["bunker"]["interior"], "bunker");

									const bunkerTick = setTick(async () => {
										const [px, py, pz] = GetEntityCoords(PlayerPedId(), false);

										if (!this.inProperty[0]) {
											await Delay(10000);
										} else {
											if (
												GetDistanceBetweenCoords(
													this.Types["bunker"]["coffre"][0],
													this.Types["bunker"]["coffre"][1],
													this.Types["bunker"]["coffre"][2],
													px,
													py,
													pz,
													true
												) < 2.5
											) {
												ShowHelpNotification("Appuyez sur ~INPUT_PICKUP~ pour regarder le coffre");

												if (IsControlJustPressed(0, 38)) {
													// open coffre menu
												}
											}

											if (
												GetDistanceBetweenCoords(
													this.Types["bunker"]["actions"][0],
													this.Types["bunker"]["actions"][1],
													this.Types["bunker"]["actions"][2],
													px,
													py,
													pz,
													true
												) < 2.5
											) {
												ShowHelpNotification("Appuyez sur ~INPUT_PICKUP~ pour regarder les actions");

												if (IsControlJustPressed(0, 38)) {
													// open action menu
												}
											}

											if (
												GetDistanceBetweenCoords(
													this.Types["bunker"]["interior"][0],
													this.Types["bunker"]["interior"][1],
													this.Types["bunker"]["interior"][2],
													px,
													py,
													pz,
													true
												) < 2.5
											) {
												ShowHelpNotification("Appuyez sur ~INPUT_PICKUP~ pour sortir du bunker");

												if (IsControlJustPressed(0, 38)) {
													// open action menu
													this.exit();
													clearTick(bunkerTick);
												}
											}
										}
									});
								}
							} else {
								ShowHelpNotification(
									"Appuyez sur ~INPUT_DETONATE~ pour acheter le bunker a " + Config.organisation.bunker + "$"
								);

								if (IsControlJustPressed(0, 47)) {
									const name = Orgs.getOrg()?.name || "";
									const rank = Orgs.getOrg()?.rank || 0;

									if (rank >= 4) {
										emitNet("gm:property:buyPropertyOrg", "bunker", k, name);
									} else {
										ShowHelpNotification("Vous n'avez pas les permissions suffisantes");
									}
								}
							}
						}
					}
				});
			});

			setTick(() => {
				this.Types["qg"]["positions"].map((v, k) => {
					const [px, py, pz] = GetEntityCoords(PlayerPedId(), false);

					//temp
					const bool = true;

					if (GetDistanceBetweenCoords(px, py, pz, v[0], v[1], v[2], true) < 2.5) {
						if (bool) {
							if (CheckPropertyType(this.qgOwned, k)) {
								ShowHelpNotification("Appuyez sur ~INPUT_PICKUP~ pour entrer dans le QG");

								if (IsControlJustPressed(0, 38)) {
									this.oldPosition = v;
									this.enter(this.Types["qg"]["interior"], "qg");

									const qgTick = setTick(async () => {
										const [px, py, pz] = GetEntityCoords(PlayerPedId(), false);

										if (!this.inProperty[0]) {
											await Delay(10000);
										} else {
											if (
												GetDistanceBetweenCoords(
													this.Types["qg"]["coffre"][0],
													this.Types["qg"]["coffre"][1],
													this.Types["qg"]["coffre"][2],
													px,
													py,
													pz,
													true
												) < 2.5
											) {
												ShowHelpNotification("Appuyez sur ~INPUT_PICKUP~ pour regarder le coffre");

												if (IsControlJustPressed(0, 38)) {
													// open coffre menu
												}
											}

											if (
												GetDistanceBetweenCoords(
													this.Types["qg"]["actions"][0],
													this.Types["qg"]["actions"][1],
													this.Types["qg"]["actions"][2],
													px,
													py,
													pz,
													true
												) < 2.5
											) {
												ShowHelpNotification("Appuyez sur ~INPUT_PICKUP~ pour regarder les actions");

												if (IsControlJustPressed(0, 38)) {
													// open action menu
												}
											}

											if (
												GetDistanceBetweenCoords(
													this.Types["qg"]["interior"][0],
													this.Types["qg"]["interior"][1],
													this.Types["qg"]["interior"][2],
													px,
													py,
													pz,
													true
												) < 2.5
											) {
												ShowHelpNotification("Appuyez sur ~INPUT_PICKUP~ pour sortir du QG");

												if (IsControlJustPressed(0, 38)) {
													// open action menu
													this.exit();
													clearTick(qgTick);
												}
											}
										}
									});
								} else {
									ShowHelpNotification(
										"Appuyez sur ~INPUT_DETONATE~ pour acheter le qg a " + Config.organisation.qg + "$"
									);

									if (IsControlJustPressed(0, 47)) {
										const name = Orgs.getOrg()?.name || "";
										const rank = Orgs.getOrg()?.rank || 0;

										if (rank >= 4) {
											emitNet("gm:property:buyPropertyOrg", "qg", k, name);
										} else {
											ShowHelpNotification("Vous n'avez pas les permissions suffisantes");
										}
									}
								}
							}
						}
					}
				});
			});
		});
	}

	public static async enter(pos: number[], type: string) {
		DoScreenFadeOut(2000);
		await Delay(4000);
		SetEntityCoords(PlayerPedId(), pos[0], pos[1], pos[2], false, false, false, false);
		this.inProperty = [true, type];
		Character.toggleBusy();
		DoScreenFadeIn(5000);
	}

	public static async exit() {
		const pos = this.oldPosition;
		DoScreenFadeOut(2000);
		await Delay(4000);
		SetEntityCoords(PlayerPedId(), pos[0], pos[1], pos[2], false, false, false, false);
		this.inProperty = [false, ""];
		Character.toggleBusy();
		DoScreenFadeIn(5000);
	}
}
