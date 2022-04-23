import { Delay } from "../../../../shared/utils/utils";
import Config from "../../../../shared/config/client.json";
import { CoraUI } from "../../../core/coraui";
import { RequestWaitModel } from "../../../core/utils";
import { Lodaout } from "../../../player/lodaout";
import { Money } from "../../../player/money";
import WeaponShopConfig from "../../../../shared/config/world/weaponshops.json";
import { BlipsController } from "../../../misc/blips";
import { BlipColor, BlipSprite, Vector3 } from "@wdesgardin/fivem-js";
import { InteractionPoints } from "../../../misc/interaction-points";

export abstract class WeaponShop {
	public static Prop = 0;

	public static async initialize() {
		RegisterCommand("openMenuArm", this.openMenu, false);

		WeaponShopConfig.map((v, k) => {
			BlipsController.CreateBlip({
				name: "Armurie",
				sprite: 110,
				scale: 0.8,
				color: BlipColor.Red,
				coords: {
					x: v.x,
					y: v.y,
					z: v.z,
				},
			});

			InteractionPoints.createPoint({
				position: Vector3.create({
					x: v.ped.x,
					y: v.ped.y,
					z: v.ped.z - 0.9,
				}),
				action: () => {
					SetEntityCoords(PlayerPedId(), v.x, v.y, v.z - 0.9, false, false, false, false);
					SetEntityHeading(PlayerPedId(), v.heading);
					this.openMenu();
				},
				helpText: "Appuyez sur ~INPUT_CONTEXT~ pour ~b~vous interagir avec l'armurier",
				marker: false,
				ped: {
					model: "s_f_m_fembarber",
					heading: v.ped.heading,
				},
			});
		});
	}

	public static async ShowWeaponAnim(props: string) {
		console.log("fiuzbfibzfbizfbizbifbzuifb");

		RenderScriptCams(false, false, 1, true, true);
		DeleteEntity(this.Prop);

		const oCoords = GetOffsetFromEntityInWorldCoords(PlayerPedId(), 0.0, 1.0, 0.0);
		const CoordToPoint = GetOffsetFromEntityInWorldCoords(PlayerPedId(), 0.8, 0.0, 0.3);
		let ArmoryCam = CreateCam("DEFAULT_SCRIPTED_CAMERA", false);

		SetCamActive(ArmoryCam, true);
		SetCamCoord(ArmoryCam, CoordToPoint[0], CoordToPoint[1], CoordToPoint[2]);
		SetCamFov(ArmoryCam, 65.0);

		await RequestWaitModel(GetHashKey(props));
		this.Prop = CreateObject(GetHashKey(props), oCoords[0], oCoords[1], oCoords[2], false, true, false);
		FreezeEntityPosition(this.Prop, true);
		let created_prop = this.Prop;

		PointCamAtEntity(ArmoryCam, this.Prop, 0, 0, 0, true);
		RenderScriptCams(true, true, 1000, false, false);
	}

	public static InitCamera() {}

	public static playAnimation(ped: number, dict: string, anim: string, settings: any) {
		FreezeEntityPosition(PlayerPedId(), false);
		SetEntityInvincible(PlayerPedId(), false);
	}

	public static destroyCamera() {
		RenderScriptCams(false, false, 1, true, true);
		DeleteEntity(this.Prop);
		SetEntityInvincible(PlayerPedId(), false);
		FreezeEntityPosition(PlayerPedId(), false);
	}

	public static async BuyWeapon(d: any, price: any) {
		const weaponHash = GetHashKey(d);
		const ammoType = GetPedAmmoTypeFromWeapon(PlayerPedId(), weaponHash);

		GiveWeaponToPed(PlayerPedId(), weaponHash, 0, false, false);

		if (!Money.pay(price)) return false;

		if (ammoType !== 0) {
			AddAmmoToPed(PlayerPedId(), weaponHash, 300);
		}

		await Delay(1000);
		Lodaout.updateLodaout();
		this.destroyCamera();

		CoraUI.closeMenu();
	}

	public static openMenu() {
		let btn: any = [];
		let ArmesDeMelee: any = [];

		Config["weapons"]["Armes de melée & gadget"].map((v: any, k: any) => {
			ArmesDeMelee.push({
				name: v["name"],
				onHover: () => WeaponShop.ShowWeaponAnim(v["prop"]),
				onClick: () => WeaponShop.BuyWeapon(v["hash"], v["price"]),
			});
		});

		CoraUI.openMenu({
			name: "Armes",
			subtitle: "Menu Personnel",
			glare: true,
			onOpen: () => {
				SetEntityInvincible(PlayerPedId(), true);
				FreezeEntityPosition(PlayerPedId(), true);
			},
			onClose: () => {
				WeaponShop.destroyCamera();
				SetEntityInvincible(PlayerPedId(), false);
				FreezeEntityPosition(PlayerPedId(), false);
			},
			buttons: [
				{
					name: "Armes de melée & gadget",
					onClick: () => {
						CoraUI.openSubmenu("armesdemelee");
					},
				},
			],
			submenus: {
				armesdemelee: {
					name: "Armes de melée & gadget",
					subtitle: "Menu Personnel",
					glare: true,
					buttons: ArmesDeMelee,
				},
			},
		});
	}
}
