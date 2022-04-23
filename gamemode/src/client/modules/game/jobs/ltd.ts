import { BlipColor, BlipSprite, Color, Game, MarkerType, Ped, Prop, Vector3, World } from "@wdesgardin/fivem-js";
import { JobId } from "../../../../shared/config/jobs/jobs";
import { CoraUI } from "../../../core/coraui";
import { InteractionPoints } from "../../../misc/interaction-points";
import { Jobs } from "../../../player/jobs";
import Config from "../../../../shared/config/jobs/ltd.json";
import { ItemsConfig } from "../../../../shared/config/items";
import { GetClosestPlayer, KeyboardInput } from "../../../core/utils";
import { Vec3 } from "@wdesgardin/fivem-js/lib/utils/Vector3";
import { Streaming } from "../../../utils/streaming";
import { Animations } from "../../../utils/animations";
import { Delay } from "../../../../shared/utils/utils";
import { BlipsController } from "../../../misc/blips";
import { Notifications } from "../../../player/notifications";
import { NotificationType } from "../../../../shared/types/notifications";

export abstract class Ltd {
	private static bagPickups: Prop[] = [];

	public static async initialize() {
		for (let i = 0; i < Config.positions.length; i++) {
			const pos = Config.positions[i];

			InteractionPoints.createPoint({
				action: () => this.openSellpointMenu(pos, i),
				helpText: () =>
					Jobs.getJob()?.id == JobId.LTD && !CoraUI.CurrentMenu ? "Appuyez sur ~INPUT_PICKUP~ pour ouvrir le menu" : "",
				position: Vector3.create(pos),
				marker: true,
			});

			BlipsController.CreateBlip({
				name: "LTD",
				coords: pos,
				sprite: BlipSprite.Store,
				color: BlipColor.Red,
			});
		}

		onNet("gm:ltd:announcement", this.displayAnnouncement.bind(this));
		onNet("gm:ltd:startRob", this.startRobbery.bind(this));
		onNet("gm:ltd:registerBag", this.registerBag.bind(this));
		setTick(this.pickupTick.bind(this));
	}

	public static openJobMenu() {
		CoraUI.openMenu({
			name: "LTD",
			subtitle: "Menu métier",
			glare: false,
			buttons: [
				Jobs.getOnDutyButton(),
				{
					name: "Annonce LTD ~g~ouvert",
					onClick: () => emitNet("gm:ltd:announcement", true),
				},
				{
					name: "Annonce LTD ~r~fermé",
					onClick: () => emitNet("gm:ltd:announcement", false),
				},
			],
		});
	}

	private static displayAnnouncement(status: boolean) {
		Notifications.Show(
			`Le LTD est ${status ? "~g~ouvert" : "~r~fermé"}`,
			"cart",
			status ? NotificationType.Success : NotificationType.Error
		);
	}

	private static openSellpointMenu(pos: Vec3, index: number) {
		if (!Jobs.isOnDuty || Jobs.getJob()?.id != JobId.LTD) {
			Notifications.ShowError("~r~Action impossible~w~~n~Vous n'êtes pas en service");
			return;
		}

		let [target, dist] = GetClosestPlayer();
		const targetPed = new Ped(GetPlayerPed(GetPlayerFromServerId(target)));

		if (!targetPed?.exists() || targetPed.Handle == Game.PlayerPed.Handle || dist > 2) {
			Notifications.ShowError("~r~Action impossible~w~~w~Aucun joueur à proximité");
			return;
		}

		// const target = GetPlayerServerId(Game.Player.Handle);
		// const targetPed = Game.PlayerPed;

		CoraUI.openMenu({
			name: "LTD",
			subtitle: "Caisse",
			glare: false,
			buttons: [
				{
					name: "Nouvelle vente",
					onClick: () => {
						CoraUI.closeMenu();
						setTimeout(() => this.newOrder(pos, target, targetPed), 0);
					},
				},
				{
					name: "~r~Vider la caisse",
					onClick: () => {
						CoraUI.closeMenu();
						emitNet("gm:ltd:rob", index, target);
					},
				},
			],
		});
	}

	private static newOrder(pos: Vec3, target: number, targetPed: Ped) {
		const order: { [itemId: string]: number } = {};

		const addToOrder = async (itemId: string) => {
			const input = await KeyboardInput("Quantité", 3);
			if (input == "") return;

			const quantity = Number(input) || 0;
			if (quantity < 0 || quantity > 999) {
				Notifications.ShowError("La quantité saisie est ~r~invalide");
			} else {
				order[itemId] = quantity;
			}
		};

		const itemsButtons = Config.items.map(i => ({
			name: `${ItemsConfig[i.id].name} (${i.sellPrice}$)`,
			onClick: () => addToOrder(i.id),
			rightText: () => (order[i.id] || 0).toString(),
		}));

		const orderTotal = () => {
			const total = Object.entries(order).reduce(
				(total, [itemId, quantity]) => total + (Config.items.find(i => i.id == itemId)?.sellPrice || 0) * quantity,
				0
			);

			return `Total: ${total}$`;
		};

		const confirmOrder = () => {
			emitNet("gm:ltd:order", target, order);
			CoraUI.closeMenu();
		};

		CoraUI.openMenu({
			name: "LTD",
			subtitle: "Nouvelle vente",
			glare: true,
			buttons: [...itemsButtons, { name: "Valider", backgroundColor: [0, 100, 0], rightText: orderTotal, onClick: confirmOrder }],
		});

		const tick = setTick(() => {
			if (!CoraUI.CurrentMenu) {
				clearTick(tick);
			} else if (Game.PlayerPed.Position.distance(pos) > 2) {
				CoraUI.closeMenu();
				Notifications.ShowError("Vente ~r~annulée~w~, vous êtes trop loin de la caisse", "cart");
				clearTick(tick);
			} else if (!targetPed?.exists() || Game.PlayerPed.Position.distance(targetPed.Position) > 5) {
				CoraUI.closeMenu();
				Notifications.ShowError("Vente ~r~annulée~w~, la cible est trop loin de la caisse", "cart");
				clearTick(tick);
			} else {
				World.drawMarker(
					MarkerType.ChevronUpx1,
					Vector3.add(targetPed.Position, new Vector3(0, 0, 0.9)),
					new Vector3(0, 0, 0),
					new Vector3(0, -180, targetPed.Rotation.z),
					Vector3.create(0.15),
					Color.fromArgb(100, 100, 0, 0)
				);
			}
		});
	}

	private static async startRobbery(index: number) {
		const config = Config.positions[index];
		if (!config) return;

		Game.PlayerPed.Position = Vector3.create(config);
		Game.PlayerPed.Heading = config.h;

		await Streaming.RequestAnimDictionnaryAsync("mp_am_hold_up");
		Animations.PlaySimple("mp_am_hold_up", "holdup_victim_20s", -1, 2);
		await Delay(10800);

		const cashRegister = GetClosestObjectOfType(config.x, config.y, config.z, 3, GetHashKey("prop_till_01"), false, false, false);
		if (DoesEntityExist(cashRegister)) {
			const registerPos = GetEntityCoords(cashRegister, false);
			CreateModelSwap(
				registerPos[0],
				registerPos[1],
				registerPos[2],
				0.5,
				GetHashKey("prop_till_01"),
				GetHashKey("prop_till_01_dam"),
				false
			);
		}
		await Delay(1200);

		await Streaming.RequestModelAsync(GetHashKey("prop_poly_bag_01"));

		const bag = new Prop(
			CreateObject(
				GetHashKey("prop_poly_bag_01"),
				Game.PlayerPed.Position.x,
				Game.PlayerPed.Position.y,
				Game.PlayerPed.Position.z,
				true,
				false,
				false
			)
		);
		AttachEntityToEntity(
			bag.Handle,
			Game.PlayerPed.Handle,
			GetPedBoneIndex(Game.PlayerPed.Handle, 60309),
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
		await Delay(9000);

		ClearPedTasks(Game.PlayerPed.Handle);

		bag.detach();
		bag.applyForce(new Vector3(0, 0, 3), Vector3.create(0));
		await Delay(200);
		bag.applyForce(new Vector3(-4, 0, 6), Vector3.create(0));

		Notifications.ShowError(`~r~Vous avez vidé la caisse`, "money");

		if (DoesEntityExist(cashRegister)) {
			const registerPos = GetEntityCoords(cashRegister, false);
			CreateModelSwap(
				registerPos[0],
				registerPos[1],
				registerPos[2],
				0.5,
				GetHashKey("prop_till_01_dam"),
				GetHashKey("prop_till_01"),
				false
			);
		}

		await Delay(1500);
		emitNet("gm:ltd:robberyBag", index, bag.NetworkId);
	}

	private static pickupTick() {
		for (let i = 0; i < this.bagPickups.length; i++) {
			const element = this.bagPickups[i];

			if (!element?.exists()) {
				delete this.bagPickups[i];
				return;
			}

			if (Game.PlayerPed.Position.distance2d(element.Position) < 0.4) {
				emitNet("gm:ltd:pickupBag", element.NetworkId);
			}
		}
	}

	private static registerBag(id: number) {
		this.bagPickups.push(new Prop(NetworkGetEntityFromNetworkId(id)));
	}
}
