import { Color, Game, MarkerType, Ped, Screen, Vector3, World } from "@nativewrappers/client";
import { Vec3 } from "@nativewrappers/client/lib/utils/Vector3";
import { ItemsConfig } from "../../../../shared/config/items";
import { JobId } from "../../../../shared/config/jobs/jobs";
import { CoraUI } from "../../../core/coraui";
import { GetClosestPlayer, KeyboardInput, ShowHelpNotification, TriggerServerCallbackAsync } from "../../../core/utils";
import { BlipsController } from "../../../misc/blips";
import { InteractionPoints } from "../../../misc/interaction-points";
import { Jobs } from "../../../player/jobs";
import { Properties } from "../properties/properties";
import Config from "../../../../shared/config/jobs/unicorn.json";
import { Notifications } from "../../../player/notifications";
import { Clothes } from "../../../player/clothes";
import { BlipColor } from "../../../core/enums/blips";

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

export abstract class Unicorn {
	public static async initialize() {
		const currentJob = await TriggerServerCallbackAsync("gm:character:getJob");
		const isUnicorn = currentJob.id == JobId.Unicorn;

		const coordsDance = [
			[118.15214538574219, -1301.0361328125, 29.26938819885254, 204.15077209472656],
			[116.08220672607422, -1302.2457275390625, 29.269453048706055, 204.64479064941406],
			[116.08220672607422, -1302.2457275390625, 29.269453048706055, 204.64479064941406],
			[113.86565399169922, -1303.4857177734375, 29.26950454711914, 204.3202362060547],
			[112.40206146240234, -1305.1064453125, 29.269527435302734, 207.312255859375],
		];

		if (isUnicorn) {
			coordsDance.map((v, k) => {
				InteractionPoints.createPoint({
					position: Vector3.create({ x: v[0], y: v[1], z: v[2] - 1 }),
					action: () => {
						if (!isUnicorn) return;
						this.dance(v);
					},
					helpText: () =>
						Jobs.getJob()?.id == JobId.Unicorn && !CoraUI.CurrentMenu
							? "Appuyez sur ~INPUT_PICKUP~ pour proposer une dance au joueur le plus proche"
							: "",
					marker: true,
				});
			});
		}

		InteractionPoints.createPoint({
			position: Vector3.create({ x: 129.35980224609375, y: -1283.351318359375, z: 29.27235984802246 - 1 }),
			action: () => {
				if (!isUnicorn) return;
				this.openSellpointMenu();
			},
			helpText: () =>
				Jobs.getJob()?.id == JobId.Unicorn && !CoraUI.CurrentMenu ? "Appuyez sur ~INPUT_PICKUP~ pour ouvrir le menu" : "",
			marker: true,
		});

		BlipsController.CreateBlip({
			name: "Unicorn - Changer sa tenue",
			coords: Vector3.create({ x: 134.3297882080078, y: -1289.7630615234375, z: 29.269527435302734 }),
			sprite: 121,
			color: BlipColor.Pink,
		});

		InteractionPoints.createPoint({
			position: Vector3.create({ x: 134.3297882080078, y: -1289.7630615234375, z: 29.269527435302734 - 1 }),
			action: () =>
				CoraUI.openMenu({
					name: "Unicorn",
					subtitle: "Menu métier",
					glare: false,
					buttons: [
						{
							name: "Tenue danseur",
							onClick: () => {
								Clothes.addVariations(outfit[0].variations);
								Clothes.setProps(outfit[0].props);
							},
						},
					],
				}),
			helpText: () =>
				Jobs.getJob()?.id == JobId.Unicorn && !CoraUI.CurrentMenu ? "Appuyez sur ~INPUT_PICKUP~ pour ouvrir le menu" : "",
			marker: true,
		});

		BlipsController.CreateBlip({
			name: "Unicorn",
			coords: Vector3.create({ x: 119.96601867675781, y: -1288.6622314453125, z: 28.266494750976562 }),
			sprite: 121,
			color: BlipColor.Pink,
		});
	}

	public static openJobMenu() {
		CoraUI.openMenu({
			name: "Unicorn",
			subtitle: "Menu métier",
			glare: false,
			buttons: [
				Jobs.getOnDutyButton(),
				...[
					{
						name: "Faire une facture",
						onClick: () => Jobs.billing(),
					},
				],
			],
		});
	}

	private static dance(v: number[]) {
		//FreezeEntityPosition(PlayerPedId(), true)

		SetEntityCoords(PlayerPedId(), v[0], v[1], v[2] - 1, false, false, false, false);
		SetEntityHeading(PlayerPedId(), v[3]);

		const dict = "mini@strip_club@lap_dance_2g@ld_2g_reach";
		RequestAnimDict(dict);
		const anim = "ld_2g_sit_idle";
		RequestAnimSet(anim);

		TaskPlayAnim(PlayerPedId(), dict, anim, 8.0, -8.0, -1, 1, 0, false, false, false);

		const tick = setTick(() => {
			ShowHelpNotification("Appuyez sur ~INPUT_VEH_DUCK~ pour arreter de danser");
			if (IsControlJustReleased(0, 73) || IsDisabledControlJustReleased(0, 73)) {
				ClearPedTasksImmediately(PlayerPedId());
				FreezeEntityPosition(PlayerPedId(), false);
				clearTick(tick);
			}
		});
	}

	private static openSellpointMenu() {
		if (!Jobs.isOnDuty || Jobs.getJob()?.id != JobId.Unicorn) {
			Notifications.ShowError("~r~Action impossible~w~~n~Vous n'êtes pas en service");
			return;
		}

		let [target, dist] = GetClosestPlayer();
		const targetPed = new Ped(GetPlayerPed(GetPlayerFromServerId(target)));

		if (!targetPed?.exists() || targetPed.Handle == Game.PlayerPed.Handle || dist > 4) {
			Notifications.ShowError("~r~Action impossible~w~~w~Aucun joueur à proximité", "cart");
			return;
		}

		// const target = GetPlayerServerId(Game.Player.Handle);
		// const targetPed = Game.PlayerPed;

		CoraUI.openMenu({
			name: "Unicorn",
			subtitle: "Caisse",
			glare: false,
			buttons: [
				{
					name: "Nouvelle vente",
					onClick: () => {
						CoraUI.closeMenu();
						setTimeout(() => this.newOrder(target, targetPed), 0);
					},
				},
			],
		});
	}

	private static newOrder(target: number, targetPed: Ped) {
		const pos = Vector3.create({ x: 129.2609405517578, y: -1283.6707763671875, z: 29.27347755432129 });
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
			name: "Unicorn",
			subtitle: "Nouvelle vente",
			glare: true,
			buttons: [...itemsButtons, { name: "Valider", backgroundColor: [0, 100, 0], rightText: orderTotal, onClick: confirmOrder }],
		});

		const tick = setTick(() => {
			if (!CoraUI.CurrentMenu) {
				clearTick(tick);
			} else if (Game.PlayerPed.Position.distance(pos) > 5) {
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
}
