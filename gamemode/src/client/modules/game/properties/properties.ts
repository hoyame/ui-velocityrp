import { ShowHelpNotification, TriggerServerCallbackAsync } from "../../../core/utils";
import { Delay } from "../../../../shared/utils/utils";
import { BlipsController } from "../../../misc/blips";
import { Apparts } from "../../../../shared/config/world/properties";
import { BlipColor, Vector3 } from "@nativewrappers/client";
import { LocalEvents } from "../../../../shared/utils/localEvents";
import { CoraUI } from "../../../core/coraui";
import { JobId } from "../../../../shared/config/jobs/jobs";
import { RealEstateAgent } from "../jobs/realestateagent";
import { IProperty } from "../../../../shared/types/property";
import { InteractionPoints } from "../../../misc/interaction-points";
import { Inventory } from "../../../player/inventory";

export class Properties {
	public static Cache: { buildingId?: number; pos?: number[]; id?: number; price?: number; propertyId?: number } = {};
	public static InProperty = false;
	public static InVisit = false;
	public static OwnedProperties: IProperty[] = [];

	public static async createBlips() {
		this.OwnedProperties = (await TriggerServerCallbackAsync("gm:property:getPropertiesWithId")) as IProperty[];

		Apparts.map((appart, k) => {
			if (this.CheckBuilding(this.OwnedProperties, k)) {
				BlipsController.CreateBlip({
					name: "Propriétés",
					coords: { x: appart.pos[0], y: appart.pos[1], z: appart.pos[2] },
					sprite: 40,
					color: 0,
					scale: 0.8,
				});
			} else {
				BlipsController.CreateBlip({
					name: "Propriétés a vendre",
					coords: { x: appart.pos[0], y: appart.pos[1], z: appart.pos[2] },
					sprite: 350,
					color: BlipColor.Green,
					scale: 0.8,
				});
			}

			for (const v of appart.home) {
				InteractionPoints.createPoint({
					helpText: "Appuyez sur ~INPUT_CONTEXT~ pour ouvrir le coffre",
					action: () => !!this.Cache?.propertyId && Inventory.openUiChest(this.Cache.propertyId.toString()),
					marker: true,
					position: Vector3.create(v.chestPos),
					enabled: () => this.InProperty && !Inventory.isOpen,
				});
			}
		});
	}

	public static exitProperty() {
		const [x, y, z] = GetEntityCoords(PlayerPedId(), false);

		if (GetClosestObjectOfType(x, y, z, 2.0, GetHashKey("v_ilev_garageliftdoor"), false, false, false)) {
			ShowHelpNotification("Appuyez sur ~INPUT_ARREST~ pour sortir");

			if (IsControlJustPressed(0, 49) && this.Cache.pos) {
				SetEntityCoords(PlayerPedId(), this.Cache.pos[0], this.Cache.pos[1], this.Cache.pos[2], true, false, false, true);
				this.InProperty = false;
				emitNet("gm:inst:leave");
			}
		}
	}

	public static async initialize() {
		console.log("[GM] | [Module] - Properties Initialized");
		let job: boolean;

		LocalEvents.on("gm:character:spawned", async () => {
			this.createBlips();

			const currentJob = await TriggerServerCallbackAsync("gm:character:getJob");
			job = currentJob.id == JobId.RealEstateAgent;
		});

		setTick(async () => {
			this.exitProperty();

			if (this.InVisit && this.Cache.price) {
				ShowHelpNotification(
					"Prix de l'appart " +
						this.Cache.price +
						" $\nPrix location " +
						this.Cache.price / 50 +
						" $ par semaine\nAppuyez sur ~INPUT_ARREST~ pour sortir"
				);

				if (IsControlJustPressed(0, 49) && this.Cache.pos) {
					DoScreenFadeOut(250);
					await Delay(1000);
					SetEntityCoords(PlayerPedId(), this.Cache.pos[0], this.Cache.pos[1], this.Cache.pos[2], true, false, false, true);
					this.InVisit = false;
					DoScreenFadeIn(250);
				}
			}

			Apparts.map(async (v1: any, k1: any) => {
				const pos = v1.pos;
				const [px, py, pz] = GetEntityCoords(PlayerPedId(), false);

				DrawMarker(
					27,
					pos[0],
					pos[1],
					pos[2] - 1,
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
					100,
					100,
					100,
					false,
					true,
					2,
					false,
					// @ts-ignore
					false,
					false,
					false
				);

				if (GetDistanceBetweenCoords(px, py, pz, pos[0], pos[1], pos[2], true) < 2.5) {
					job
						? ShowHelpNotification(
								"~INPUT_PICKUP~ pour interagir avec les maisons \n~INPUT_DETONATE~ pour ouvrir le menu agent immobilier"
						  )
						: ShowHelpNotification("Appuyez sur ~INPUT_PICKUP~ pour interagir avec les maisons");

					if (IsControlJustPressed(0, 38)) {
						this.OwnedProperties = (await TriggerServerCallbackAsync("gm:property:getPropertiesWithId")) as IProperty[];
						console.log(this.OwnedProperties);
						this.PropertiesMenu(v1, this.OwnedProperties);
					}

					if (IsControlJustPressed(0, 47)) {
						console.log("uoifbeziubbg");
						if (!job) return;
						RealEstateAgent.openJobMenu(v1);
					}
				}
			});
		});
	}

	// check si il a l'appart (pour menu)
	public static CheckPropertyType(zd: any, zdx: any) {
		let b = false;

		zd.map((v: any, k: any) => {
			if (v["propertyType"][1] == zdx) {
				b = true;
				return true;
			}
		});

		return b;
	}

	// check si il a l'appart dans le batiment (pour blips)
	public static CheckBuilding(zd: any, zdx: any) {
		let b = false;

		zd.map((v: any, k: any) => {
			if (v["propertyType"][0] == zdx) {
				b = true;
				return true;
			}
		});

		return b;
	}

	public static PropertiesMenu(d: any, ownedProperties: IProperty[]) {
		let buttons: any = [];

		d["home"].map(async (v1: any, k1: any) => {
			buttons.push({
				name: d.name + " " + v1.id,
				rightText: this.CheckPropertyType(ownedProperties, v1.id) == true ? "Entrer" : v1.price + " $",
				description: "Cet appart n'attend plus que vous ! Appuyez pour visiter, vous pouvez le louer ou l'acheter",
				onClick: async () => {
					console.log(this.CheckPropertyType(ownedProperties, v1.id));

					if (this.CheckPropertyType(ownedProperties, v1.id) == true) {
						console.log("enter");
						emitNet("gm:inst:create");

						const [x, y, z] = GetEntityCoords(PlayerPedId(), false);
						DoScreenFadeOut(250);
						await Delay(1000);

						Properties.Cache = {
							pos: [x, y, z],
							propertyId: ownedProperties.find(p => p.propertyType[1] == v1.id)?.id,
						};

						Properties.InProperty = true;
						SetEntityCoords(PlayerPedId(), v1.pos[0], v1.pos[1], v1.pos[2], true, false, false, true);
						CoraUI.closeMenu();
						DoScreenFadeIn(250);
					} else {
						console.log("visit");

						const [x, y, z] = GetEntityCoords(PlayerPedId(), false);
						DoScreenFadeOut(250);
						await Delay(1000);

						Properties.Cache = {
							buildingId: d.id,
							pos: [x, y, z],
							id: v1.id,
							price: v1.price,
						};

						console.log("trdc du mondo", Properties.Cache);

						Properties.InVisit = true;
						SetEntityCoords(PlayerPedId(), v1.pos[0], v1.pos[1], v1.pos[2], true, false, false, true);
						CoraUI.closeMenu();
						DoScreenFadeIn(250);
					}
				},
			});
		});

		CoraUI.openMenu({
			name: "Appartements",
			subtitle: d.name,
			glare: true,
			buttons: buttons,
			hideHeader: true,
			onOpen: () => FreezeEntityPosition(PlayerPedId(), true),
			onClose: () => FreezeEntityPosition(PlayerPedId(), false),
			position: {
				x: 0.1271,
				y: 0.05,
			},
		});
	}
}
