import { CoraUI } from "../../../core/coraui";
import { KeyboardInput, TriggerServerCallbackAsync } from "../../../core/utils";
import { Game, Vehicle } from "@wdesgardin/fivem-js";
import { Admin, NoClip, Spectate } from "../../../core/admin";
import { ItemsConfig } from "../../../../shared/config/items";
import { ISanction } from "../../../../shared/player/sanction";
import { IReport } from "../../../../shared/player/report";
import { Delay } from "../../../../shared/utils/utils";
import { Health } from "../../../player/health";
import { ICharacter, ICharacterInfos, ICharacterJob, ICharacterOrg } from "../../../../shared/player/character";
import { JobsList } from "../../../../shared/config/jobs/jobs";
import { Notifications } from "../../../player/notifications";

export abstract class AdminMenuController {
	private static players: { id: number; charname?: string; name: string }[] = [];
	private static characters: {
		[id: number]: {
			infos?: ICharacterInfos;
			money?: number;
			saleMoney?: number;
			bank?: number;
			job?: ICharacterJob;
			org?: ICharacterOrg;
		};
	} = {};
	private static inventories: { [id: number]: ICharacter["inventory"] } = {};
	private static selectedPlayer?: number;
	private static selectedReport?: IReport;
	private static menuHeader = {
		glare: true,
		name: "Administration",
	};

	public static async OpenMenu() {
		if (!(await TriggerServerCallbackAsync("gm:admin:canOpenMenu"))) return;

		if (Admin.isAdminModeEnable) {
			this.OpenAdminMenu();
		} else {
			this.OpenAdminActivationMenu();
		}
	}

	private static async ToggleAdminModeAndOpenMenu() {
		Admin.ToggleAdminMode();

		CoraUI.closeMenu();
		await Delay(100);
		this.OpenMenu();
	}

	private static OpenAdminActivationMenu() {
		CoraUI.openMenu({
			name: "Administration",
			subtitle: "Menu Administration",
			glare: true,
			buttons: [{ name: "Activer le mode admin", checkbox: () => this.ToggleAdminModeAndOpenMenu(), statusCheckbox: false }],
		});
	}

	private static OpenAdminMenu() {
		this.players = [];
		this.characters = {};
		this.inventories = {};
		this.selectedPlayer = undefined;

		CoraUI.openMenu({
			...this.menuHeader,
			subtitle: "Menu Administration",
			buttons: [
				{ name: "Désactiver le mode admin", checkbox: () => this.ToggleAdminModeAndOpenMenu(), statusCheckbox: true },
				{ name: "Mon joueur", onClick: () => CoraUI.openSubmenu("myplayer") },
				{ name: "Véhicules", onClick: () => CoraUI.openSubmenu("vehicles") },
				{
					name: "Listes des joueurs",
					onClick: () => CoraUI.openSubmenu("players"),
				},
				{
					name: "Reports",
					onClick: () => CoraUI.openSubmenu("reports"),
				},
				{
					name: "Afficher le nom des joueurs",
					checkbox: () => (Admin.showGamerTags = !Admin.showGamerTags),
					statusCheckbox: Admin.showGamerTags,
				},
				{
					name: "Afficher les blips",
					checkbox: () => (Admin.areBlipsEnable ? Admin.DisableBlips() : Admin.EnableBlips()),
					statusCheckbox: Admin.areBlipsEnable,
				},
			],
			submenus: {
				myplayer: {
					...this.menuHeader,
					subtitle: "Mon joueur",
					buttons: [
						{
							name: "TP Waypoint",
							onClick: () => Admin.TpWaypoint(),
						},
						{
							name: "NoClip",
							onClick: () => {
								CoraUI.closeMenu();
								NoClip.Start();
							},
						},
						{
							name: "Invisible",
							statusCheckbox: !Game.PlayerPed.IsVisible,
							checkbox: () => (Game.PlayerPed.IsVisible = !Game.PlayerPed.IsVisible),
						},
						{
							name: "God mode",
							statusCheckbox: Game.PlayerPed.IsInvincible,
							checkbox: () => (Game.PlayerPed.IsInvincible = !Game.PlayerPed.IsInvincible),
						},
						{
							name: "Heal",
							onClick: () => (Game.PlayerPed.Health = Game.PlayerPed.MaxHealth),
						},
						{
							name: "Blindage",
							onClick: () => SetPedArmour(Game.PlayerPed.Handle, 100),
						},
						{
							name: "Revive",
							onClick: () => Health.Resurect(),
						},
					],
				},
				vehicles: {
					...this.menuHeader,
					subtitle: "Véhicules",
					buttons: [
						{
							name: "Spawn un véhicule",
							onClick: () => Admin.SpawnVehicle(),
						},
						{
							name: "Réparer le véhicule",
							onClick: () => Admin.FixCurrentVehicle(),
						},
						{
							name: "Retourner le véhicule",
							onClick: () => Admin.FixClosestVehiclePosition(),
						},
						{
							name: "Full custom",
							onClick: () => Admin.CustomCurrentVehicle(),
						},
						{
							name: "Supprimer les véhicules",
							onClick: async () => {
								const radius = await KeyboardInput("Radius (mètres)", 3, "");
								if (Number(radius)) ExecuteCommand("dv " + radius);
							},
						},
						{
							name: "Recherche proprietaire véhicule",
							onClick: async () => {
								const [x, y, z] = GetEntityCoords(PlayerPedId(), false);
								const closestVeh = new Vehicle(GetClosestVehicle(x, y, z, 5, 0, 70));
								console.log(closestVeh.Handle);
								if (!closestVeh?.exists()) {
									Notifications.ShowError("Aucun véhicule à proximité");
									return;
								}

								const name = await TriggerServerCallbackAsync("gm:vehicle:returnVehicleProprio", closestVeh.NumberPlate);
								Notifications.Show("Propriétaire du véhicule : ~b~" + (!!name ? name : "Inconnu"));
							},
						},
						{
							name: "Supprimer les véhicules proches (5m)",
							onClick: () => ExecuteCommand("dv 5"),
						},
					],
				},
				players: {
					...this.menuHeader,
					subtitle: "Liste des joueurs",
					onOpen: async () => await this.AddPlayersButtons(),
					buttons: [
						{
							name: "Filtre",
							rightText: "Aucun",
							onClick: () => this.FilterPlayers(),
						},
					],
					submenus: {
						playerDetails: {
							...this.menuHeader,
							subtitle: "Détails du joueur",
							buttons: [
								{ name: "Joueur", rightText: "" },
								{
									name: "Informations",
									onClick: () => CoraUI.openSubmenu("playerCharacter"),
									backgroundColor: [3, 132, 252],
								},
								{
									name: "Historique des sanctions",
									onClick: () => CoraUI.openSubmenu("playerSanctions"),
								},
								{
									name: "Spectate",
									onClick: () => this.selectedPlayer && Spectate.Start(this.selectedPlayer) && CoraUI.closeMenu(),
								},
								{
									name: "Message",
									onClick: () => !!this.selectedPlayer && Admin.SendPrivateMessage(this.selectedPlayer),
								},
								{
									name: "Avertissement",
									onClick: () => !!this.selectedPlayer && Admin.SendWarning(this.selectedPlayer),
								},
								{
									name: "Wipe",
									onClick: () => !!this.selectedPlayer && ExecuteCommand("wipe " + this.selectedPlayer),
									backgroundColor: [189, 43, 38],
								},
								{
									name: "Envoyer avec les tollers",
									onClick: () => !!this.selectedPlayer && Admin.SetTrollerBucket(this.selectedPlayer),
									backgroundColor: [238, 130, 238],
								},
								{
									name: "Ban",
									onClick: () => this.selectedPlayer && Admin.Ban(this.selectedPlayer),
								},
								{
									name: "Kick",
									onClick: () => emitNet("gm:admin:kick", this.selectedPlayer, ""),
								},
								{
									name: "Inventaire",
									onClick: () => CoraUI.openSubmenu("playerInventory"),
								},
								{
									name: "Goto",
									onClick: () => emitNet("gm:admin:goto", this.selectedPlayer),
								},
								{
									name: "Bring",
									onClick: () => ExecuteCommand("bring " + this.selectedPlayer),
								},
								{
									name: "BringBack",
									onClick: () => ExecuteCommand("bringBack " + this.selectedPlayer),
								},
								{
									name: "Freeze",
									onClick: () => emitNet("gm:admin:freeze", this.selectedPlayer),
								},
								{
									name: "Unfreeze",
									onClick: () => emitNet("gm:admin:unfreeze", this.selectedPlayer),
								},
								{
									name: "Heal",
									onClick: () => emitNet("gm:admin:heal", this.selectedPlayer),
								},
								{ name: "Revive", onClick: () => ExecuteCommand("revive " + this.selectedPlayer) },
								{ name: "Give Arme", onClick: () => {} },
								{ name: "Give Item", onClick: () => {} },
								{
									name: "Screenshot",
									onClick: () => ExecuteCommand("screenshot " + this.selectedPlayer),
								},
								{ name: "Reset identité", onClick: () => emitNet("gm:admin:resetIdentity", this.selectedPlayer) },
							],
							submenus: {
								playerInventory: {
									name: "Administration",
									subtitle: "Inventaire du joueur",
									glare: true,
									buttons: [],
									onOpen: async () => await this.LoadPlayerInventory(),
								},
								playerCharacter: {
									name: "Administration",
									subtitle: "Informations du personnage",
									glare: true,
									buttons: [],
									onOpen: async () => await this.LoadCharacterInfos(),
								},
								playerSanctions: {
									name: "Administration",
									subtitle: "Historique des sanctions",
									glare: true,
									buttons: [],
									onOpen: async () => await this.LoadPlayerSanctions(),
								},
								playerBan: {
									name: "Administration",
									subtitle: "Bannir le joueur",
									buttons: [
										{
											name: "Racisme",
											rightText: "perm",
											onClick: async () => {
												if (!this.selectedPlayer) return;
												await Admin.BanFor(this.selectedPlayer, "2h", "Conduite HRP");
												CoraUI.closeSubMenu();
											},
										},
										{
											name: "Conduite HRP",
											rightText: "2H",
											onClick: async () => {
												if (!this.selectedPlayer) return;
												await Admin.BanFor(this.selectedPlayer, "2h", "Conduite HRP"), CoraUI.closeSubMenu();
											},
										},
										{
											name: "Autre",
											onClick: async () => {
												if (!this.selectedPlayer) return;
												await Admin.Ban(this.selectedPlayer);
												CoraUI.closeSubMenu();
											},
										},
									],
								},
							},
						},
					},
				},
				reports: {
					...this.menuHeader,
					subtitle: "Reports",
					buttons: [],
					onOpen: async () => await this.LoadReports(),
					submenus: {
						reportDetails: {
							...this.menuHeader,
							subtitle: "Détails du report",
							buttons: [
								{
									name: "Se téléporter au joueur",
									onClick: () => {
										emitNet("gm:admin:goto", this.selectedReport?.serverId);
									},
								},
								{
									name: "Se téléporter au joueur en NoClip",
									onClick: () => {
										CoraUI.closeMenu();
										NoClip.Start();
										emitNet("gm:admin:goto", this.selectedReport?.serverId);
									},
								},
								{ name: "Téléporter le joueur sur vous", onClick: () => ExecuteCommand("bring " + this.selectedPlayer) },
								{
									name: "Envoyer un message au joueur",
									onClick: () =>
										this.selectedReport?.serverId && Admin.SendPrivateMessage(Number(this.selectedReport.serverId)),
								},
								{
									name: "S'occuper de ce report",
									onClick: () => emitNet("gm:admin:takeReport", this.selectedReport?.id),
								},
								{
									name: "Supprimer ce report",
									onClick: () => {
										emitNet("gm:admin:deleteReport", this.selectedReport?.id);
										CoraUI.closeSubMenu();
									},
								},
							],
						},
					},
				},
			},
		});
	}

	private static async AddPlayersButtons(filter = "") {
		//remove all buttons except filter (index 0)
		CoraUI.CurrentMenu.buttons.length = 1;

		this.selectedPlayer = undefined;

		if (this.players.length == 0) {
			this.players = await TriggerServerCallbackAsync("gm:admin:getPlayers");
		}

		let displayedPlayers = this.players;
		if (filter) {
			const lowerFilter = filter.toLocaleLowerCase();
			displayedPlayers = this.players.filter(
				p => p.name.toLocaleLowerCase().includes(lowerFilter) || p.id.toString().includes(lowerFilter)
			);
		}
		displayedPlayers = displayedPlayers.sort((p1, p2) => (p1.name > p2.name ? 1 : -1));

		const playerButtons = displayedPlayers.map(p => ({
			name: p.name,
			rightText: p.id.toString(),
			onClick: () => {
				this.selectedPlayer = p.id;
				CoraUI.openSubmenu("playerDetails");
			},
		}));

		CoraUI.CurrentMenu.buttons.push(...playerButtons);
	}

	private static async FilterPlayers() {
		const filter = await KeyboardInput("Nom ou id du joueur", 25, "");
		CoraUI.CurrentMenu.buttons[0].rightText = !!filter ? filter : "Aucun";
		this.AddPlayersButtons(filter);
	}

	private static async LoadPlayerInventory() {
		CoraUI.CurrentMenu.buttons = [];
		if (!this.selectedPlayer) return;

		if (!this.inventories[this.selectedPlayer])
			this.inventories[this.selectedPlayer] = await TriggerServerCallbackAsync("gm:inventory:get", this.selectedPlayer);

		const inventory = this.inventories[this.selectedPlayer];
		CoraUI.CurrentMenu.buttons = inventory.map(item => ({
			name: item.renamed || ItemsConfig[item.itemId].name,
			rightText: item.quantity.toString(),
		}));
	}

	private static async LoadCharacterInfos() {
		if (!this.selectedPlayer) return;

		if (!this.characters[this.selectedPlayer])
			this.characters[this.selectedPlayer] = await TriggerServerCallbackAsync("gm:admin:characterInfos", this.selectedPlayer);

		const character = this.characters[this.selectedPlayer];
		if (!character) return;

		CoraUI.CurrentMenu.buttons = [
			{ name: "Nom", rightText: character.infos?.name || "" },
			{
				name: "Job",
				rightText: (!!character.job?.id && JobsList[character.job.id].name) || "X",
			},
			{
				name: "Rank job",
				rightText: (!!character.job?.id && !!character.job?.rank && JobsList[character.job.id].ranks?.[character.job.id]) || "X",
			},
			{
				name: "Org",
				rightText: character.org?.name || "X",
			},
			{
				name: "Rank org",
				rightText: character.org?.rank?.toString() || "X",
			},
			{
				name: "Argent",
				rightText: `~g~${character.money || 0} $`,
			},
			{
				name: "Banque",
				rightText: `~g~${character.bank || 0} $`,
			},
			{
				name: "Sale",
				rightText: `~g~${character.saleMoney || 0} $`,
			},
		];
	}

	private static async LoadPlayerSanctions() {
		CoraUI.CurrentMenu.buttons = [];
		if (!this.selectedPlayer) return;

		const sanctions = await TriggerServerCallbackAsync("gm:admin:getSanctions", this.selectedPlayer);
		if (!sanctions) return;

		CoraUI.CurrentMenu.buttons = sanctions.map((s: ISanction) => ({
			name: (s.isBan ? "Ban" : "Avertissement") + ": " + (s.reason.length < 20 ? s.reason : s.reason.substring(0, 17) + "..."),
			rightText: s.createdByName || "Inconnu",
			description:
				new Date(s.dt).toLocaleString(undefined, {
					day: "2-digit",
					month: "2-digit",
					year: "2-digit",
					hour: "2-digit",
					minute: "2-digit",
				}) +
				" | " +
				s.reason,
		}));
	}

	private static async LoadReports() {
		CoraUI.CurrentMenu.buttons = [];
		const reports: IReport[] = await TriggerServerCallbackAsync("gm:admin:getReports");
		if (!reports) return;

		CoraUI.CurrentMenu.buttons = reports.map(r => ({
			name: `Id ${r.id} - ${!!r.takenById ? "en cours de traitement" : "non traité"}`,
			rightText: new Date(r.dt).toLocaleString(undefined, {
				day: "2-digit",
				month: "2-digit",
				year: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
			}),
			description: r.message,
			onClick: () => {
				this.selectedReport = r;
				CoraUI.openSubmenu("reportDetails");
			},
		}));
	}
}
