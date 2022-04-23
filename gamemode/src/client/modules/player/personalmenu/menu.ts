import { GetClosestPlayer, TriggerServerCallbackAsync } from "../../../core/utils";
import { Character } from "../../../player/character";
import { Inventory } from "../../../player/inventory";
import { CoraUI, IButton } from "../../../core/coraui";
import { Documents } from "../../../player/documents";
import { Money } from "../../../player/money";
import { Jobs } from "../../../player/jobs";
import { JobId, JobsList } from "../../../../shared/config/jobs/jobs";
import { Orgs } from "../../../player/orgs";
import { Lodaout, WeaponsName } from "../../../player/lodaout";
import { IProperty } from "../../../../shared/types/property";

export abstract class PersonnalMenu {
	public static async Open() {
		const certif = (await Inventory.getInventory()).find(i => i.itemId == "certif_medic" && i.quantity > 0);
		const dataBoutique = await TriggerServerCallbackAsync("gm:character:getCoinsData");
		console.log(dataBoutique);

		const documentButtons = [
			{ name: "Regarder ma ~b~carte d'identité", onClick: () => Documents.DisplayDocumentForMe("idcard") },
			{ name: "Montrer ma ~r~carte d'identité", onClick: () => Documents.ShowToNearbyPlayers("idcard") },
			{ name: "Regarder son ~b~permis de conduire", onClick: () => Documents.DisplayDocumentForMe("driving") },
			{ name: "Montrer son ~r~permis de conduire", onClick: () => Documents.ShowToNearbyPlayers("driving") },
		];

		if (!!certif) {
			documentButtons.push({
				name: "Regarder son ~b~certificat médical",
				onClick: () => Documents.DisplayDocumentForMe("certificat", certif.metadatas?.["medicName"] || "Dr. X"),
			});
			documentButtons.push({
				name: "Montrer son ~r~certificat médical",
				onClick: () => Documents.ShowToNearbyPlayers("certificat", certif.metadatas?.["medicName"] || "Dr. X"),
			});
		}
		if (Jobs.getJob()?.id == JobId.EMS) {
			documentButtons.push({ name: "Regarder sa ~b~carte de médecin", onClick: () => Documents.DisplayDocumentForMe("hospital") });
			documentButtons.push({ name: "Montrer sa ~r~carte de médecin", onClick: () => Documents.ShowToNearbyPlayers("hospital") });
		} else if (Jobs.getJob()?.id == JobId.LSPD) {
			documentButtons.push({ name: "Regarder sa ~b~carte de police", onClick: () => Documents.DisplayDocumentForMe("police") });
			documentButtons.push({ name: "Montrer sa ~r~carte de police", onClick: () => Documents.ShowToNearbyPlayers("police") });
		}

		if (!!Character.getCurrent()?.licenses?.hunting) {
			documentButtons.push({ name: "Regarder son ~b~permis de chasse", onClick: () => Documents.DisplayDocumentForMe("hunting") });
			documentButtons.push({ name: "Montrer son ~r~permis de chasse", onClick: () => Documents.ShowToNearbyPlayers("hunting") });
		}
		if (!!Character.getCurrent()?.licenses?.fireArms) {
			documentButtons.push({ name: "Regarder son ~b~permis d'armes", onClick: () => Documents.DisplayDocumentForMe("firearms") });
			documentButtons.push({ name: "Montrer son ~r~permis d'armes", onClick: () => Documents.ShowToNearbyPlayers("firearms") });
		}

		const jobRank = Jobs.getJob()?.rank || 0;
		const orgRank = Orgs.getOrg()?.rank || 0;
		const org = Orgs.getOrg();

		let patronButton: any[] = [];
		let orgaButton: any[] = [];

		if (jobRank > 3) {
			patronButton.push({
				name: "Recruter",
				onClick: () => {
					let [pCloset, pClosetDst] = GetClosestPlayer();
					console.log(pCloset);
					emitNet("gm:character:job:recruit", pCloset);
				},
			});

			patronButton.push({
				name: "Retrograder",
				onClick: () => {
					let [pCloset, pClosetDst] = GetClosestPlayer();
					emitNet("gm:character:job:derank", pCloset);
				},
			});

			patronButton.push({
				name: "Virer",
				onClick: () => {
					let [pCloset, pClosetDst] = GetClosestPlayer();
					emitNet("gm:character:job:kick", pCloset);
				},
			});

			patronButton.push({
				name: "Promouvoir",
				onClick: () => {
					let [pCloset, pClosetDst] = GetClosestPlayer();
					emitNet("gm:character:job:promote", pCloset);
				},
			});
		}

		if (orgRank > 3) {
			orgaButton.push({
				name: "Recruter",
				onClick: () => {
					let [pCloset, pClosetDst] = GetClosestPlayer();
					console.log(pCloset);
					emitNet("gm:character:org:recruit", pCloset);
				},
			});

			orgaButton.push({
				name: "Retrograder",
				onClick: () => {
					let [pCloset, pClosetDst] = GetClosestPlayer();
					emitNet("gm:character:org:derank", pCloset);
				},
			});

			orgaButton.push({
				name: "Virer",
				onClick: () => {
					let [pCloset, pClosetDst] = GetClosestPlayer();
					emitNet("gm:character:org:kick", pCloset);
				},
			});

			orgaButton.push({
				name: "Promouvoir",
				onClick: () => {
					let [pCloset, pClosetDst] = GetClosestPlayer();
					emitNet("gm:character:org:promote", pCloset);
				},
			});
		}

		const allWeapons = await Lodaout.getLodaout();
		const weaponButtons: IButton[] = allWeapons.map((v: any) => {
			const name: any = v[0]?.toLowerCase() || "";
			return {
				// @ts-ignore
				name: WeaponsName[name] || "",
				rightText: v[1]?.toString() || "",
				onClick: () => {
					CoraUI.openMenu({
						name: Character.getCurrent()?.name || "Menu Personnel",
						subtitle: "Menu Personnel",
						glare: true,
						buttons: [
							{
								name: "Donner",
								onClick: () => {
									const [closest, distance] = GetClosestPlayer();
									if (distance > 1) return;

									emitNet("gm:character:giveWeapon", closest, v[0], v[1]);
									CoraUI.closeMenu();
								},
							},
							{
								name: "Jeter",
								onClick: () => {
									Lodaout.removeWeapon(v[0]);
									CoraUI.closeMenu();
								},
							},
						],
					});
				},
			};
		});

		CoraUI.openMenu({
			name: Character.getCurrent()?.name || "Menu Personnel",
			subtitle: "Menu Personnel",
			glare: true,
			buttons: [
				{
					name: "Portefeuille",
					onClick: () => CoraUI.openSubmenu("portefeuille"),
				},
				{
					name: "Armes",
					onClick: () => CoraUI.openSubmenu("armes"),
				},
				{
					name: "Documents officiels",
					onClick: () => CoraUI.openSubmenu("documents"),
				},
				{
					name: "Entreprise",
					onClick: () => {
						CoraUI.openMenu({
							name: Character.getCurrent()?.name || "Menu Personnel",
							subtitle: "Menu Personnel",
							glare: true,
							buttons: patronButton,
						});
					},
				},
				{
					name: "Organisation",
					onClick: () => {
						CoraUI.openMenu({
							name: Character.getCurrent()?.name || "Menu Personnel",
							subtitle: "Menu Personnel",
							glare: true,
							buttons: orgaButton,
						});
					},
				},
				{
					name: "Informations",
					onClick: () => {
						const jobId = Jobs.getJob()?.id || 0;

						CoraUI.openMenu({
							name: Character.getCurrent()?.name || "Menu Personnel",
							subtitle: "Menu Personnel",
							glare: true,
							buttons: [
								{
									name: "Vos informations",
									backgroundColor: [3, 132, 252],
								},
								{
									name: "Votre metier",
									rightText: JobsList[jobId].name + " - " + Jobs.getJob()?.rank || "Aucun",
								},
								{
									name: "Votre organisation",
									rightText: Orgs.getOrg()?.name || "Aucun" + " - " + Orgs.getOrg()?.rank || "0",
								},
							],
						});
					},
				},
				{
					name: "Boutique",
					onClick: () => CoraUI.openSubmenu("boutique"),
				},
				{
					name: "Actions",
					onClick: async () => {
						const OwnedProperties = (await TriggerServerCallbackAsync("gm:property:getPropertiesWithId")) as IProperty[];
						let locationProperty: any = [];

						OwnedProperties.forEach(property => {
							if (property.bought == false) {
								locationProperty.push({
									name: property.name,
									onClick: () => {
										emitNet("gm:property:rentProperty", property.id, property.propertyType);
									},
								});
							}
						});

						CoraUI.openMenu({
							name: Character.getCurrent()?.name || "Menu Personnel",
							subtitle: "Menu Personnel",
							glare: true,
							buttons: [
								{
									name: "Prolonger la location",
									onClick: () => {
										CoraUI.openMenu({
											name: Character.getCurrent()?.name || "Menu Personnel",
											subtitle: "Menu Personnel",
											glare: true,
											buttons: locationProperty,
										});
									},
								},
								{
									name: "Demissionner de votre metier",
									backgroundColor: [187, 11, 11],
									onClick: () => {
										emitNet("gm:character:setJob", {});
										CoraUI.closeMenu();
									},
								},
								{
									name: "Quitter votre organisatino",
									backgroundColor: [187, 11, 11],
									onClick: () => {
										emitNet("gm:character:setOrg", {});
										CoraUI.closeMenu();
									},
								},
							],
						});
					},
				},
			],
			submenus: {
				armes: {
					name: Character.getCurrent()?.name || "Menu Personnel",
					subtitle: "Armes",
					glare: true,
					buttons: weaponButtons,
				},

				portefeuille: {
					name: Character.getCurrent()?.name || "Menu Personnel",
					subtitle: "Portefeuille",
					glare: true,
					onOpen: this.onMoneyOpen.bind(this),
					buttons: [],
				},
				documents: {
					name: Character.getCurrent()?.name || "Menu Personnel",
					subtitle: "Documents",
					glare: true,
					buttons: documentButtons,
				},
				boutique: {
					name: Character.getCurrent()?.name || "Menu Personnel",
					subtitle: "Menu Personnel",
					glare: true,
					buttons: [
						{
							name: "ID - ~b~" + dataBoutique["id"],
						},
						{
							name: "Adverconis - ~b~" + dataBoutique["coins"],
						},
						{
							name: "Grade VIP - ~b~" + dataBoutique["vip"],
						},
					],
				},
			},
		});
	}

	private static async onMoneyOpen() {
		CoraUI.CurrentMenu.buttons = [];
		const money = await Money.getMoney();
		CoraUI.CurrentMenu.buttons = [{ name: `Banque : ~g~${money || 0}$` }];
	}
}
