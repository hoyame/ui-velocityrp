import { Utils } from "../../utils/utils";
import Config from "../../../shared/config/anticheat.json";
import { kill } from "process";
import { Admin } from "../../core/admin";
import { Environnment } from "../../../shared/utils/environnment";

export default abstract class Anticheat {
	public static Killers: number[] = [];

	public static Props: any = [];
	public static Particules: any = [];
	public static Vehicules: any = [];
	public static Peds: any = [];
	public static Weapons: any = [];
	public static Words: any = [];

	public static VehCreator: any = [];
	public static ObjectCreator: any = [];
	public static PedCreator: any = [];
	public static ParticulesCreator: any = [];

	public static async initialize() {
		console.log("[GM] | [Module] - Anticheat Initialized");

		this.whitelistProps();

		onNet("chatMessage", (sender: any, n: any, message: string) => {
			if (Utils.CheckTbl(this.Words, message.toLowerCase())) {
				if (!IsPlayerAceAllowed(sender, "bypass-anticheat")) {
					console.log("[GM] | [Anticheat] - Player [" + sender + "'] a essayer de give une arme a un joueur");
					CancelEvent();
				}
			}
		});

		onNet("giveWeaponEvent", (sender: any, data: any) => {
			if (data.giveWeaponEvent == false) {
				if (!IsPlayerAceAllowed(sender, "bypass-anticheat")) {
					console.log("[GM] | [Anticheat] - Player [" + sender + "'] a essayer de give une arme a un joueur");
					CancelEvent();
				}
			}
		});

		onNet("weaponDamageEvent", (sender: any, data: any) => {
			if (Utils.CheckTbl(this.Weapons, data.weaponType)) {
				if (!IsPlayerAceAllowed(sender, "bypass-anticheat")) {
					console.log("[GM] | [Anticheat] - Player [" + sender + "'] a essayer de give une arme a un joueur");
					CancelEvent();
				}
			}
		});

		onNet("removeWeaponEvent", (sender: any, data: any) => {
			if (!IsPlayerAceAllowed(sender, "bypass-anticheat")) {
				console.log("[GM] | [Anticheat] - Player [" + sender + "'] a essayer de retirer une arme d'un joueur");
				CancelEvent();
			}
		});

		onNet("removeAllWeaponsEvent", (sender: any, data: any) => {
			if (!IsPlayerAceAllowed(sender, "bypass-anticheat")) {
				console.log("[GM] | [Anticheat] - Player [" + sender + "'] a essayer de retirer les armes d'un joueur");
				CancelEvent();
			}
		});

		onNet("explosionEvent", (sender: any, ev: any) => {
			if (ev.damageScale != 0.0) {
				if (!IsPlayerAceAllowed(sender, "bypass-anticheat")) {
					console.log("[GM] | [Anticheat] - Player [" + sender + "] a tenté d'exploser le serv");
					CancelEvent();
				}
			}
		});

		onNet("startProjectileEvent", () => {
			if (!IsPlayerAceAllowed(source, "bypass-anticheat")) {
				console.log("[GM] | [Anticheat] - Player [" + source + "] a tenté de demarée un projectile");
				CancelEvent();
			}
		});

		onNet("ptFxEvent", (sender: any, data: any) => {
			if (!Utils.CheckTbl(this.Particules, data.effectHash)) {
				if (data.isOnEntity) {
					CancelEvent();
					if (!IsPlayerAceAllowed(source, "bypass-anticheat")) {
						this.ParticulesCreator[source] = (this.ParticulesCreator[source] || 0) + 1;

						if (this.ParticulesCreator[sender] > Config["limits"]["objects"]) {
							if (!IsPlayerAceAllowed(source, "bypass-anticheat")) {
								console.log(
									"[GM] | [Anticheat] - Player [" +
										sender +
										"] a tenté de spawn " +
										this.ParticulesCreator[sender] +
										" Particules sur un joueur"
								);
							}
						}
					}
				}

				if (data.effectHash != null && data.assetHash != null && data.effectHash != GetHashKey("veh_backfire")) {
					CancelEvent();
					if (!IsPlayerAceAllowed(source, "bypass-anticheat")) {
						this.ParticulesCreator[source] = (this.ParticulesCreator[source] || 0) + 1;

						if (this.ParticulesCreator[sender] > Config["limits"]["objects"]) {
							if (!IsPlayerAceAllowed(source, "bypass-anticheat")) {
								console.log(
									"[GM] | [Anticheat] - Player [" +
										sender +
										"] a tenté de spawn " +
										this.ParticulesCreator[sender] +
										" Particules"
								);
							}
						}
					}
				}
			}
		});

		onNet("entityCreating", (entity: any) => {
			if (DoesEntityExist(entity)) {
				let src = NetworkGetEntityOwner(entity);
				let model = GetEntityModel(entity);
				let type = GetEntityPopulationType(entity);

				if (src == null) {
					CancelEvent();
				}

				if (GetEntityType(entity) == 3) {
					// object

					if (!Utils.CheckTbl(this.Props, model)) {
						if (model !== 0) {
							if (Environnment.IsDev) console.log("DEV - Anticheat: annulation de la création d'une entité (" + model + ")");
							CancelEvent();
							if (!IsPlayerAceAllowed(source, "bypass-anticheat")) {
								this.ObjectCreator[src] = (this.ObjectCreator[src] || 0) + 1;

								if (this.ObjectCreator[src] > Config["limits"]["objects"]) {
									if (!IsPlayerAceAllowed(source, "bypass-anticheat")) {
										console.log(
											"[GM] | [Anticheat] - Player [" +
												source +
												"] a tenté de spawn " +
												this.ObjectCreator[src] +
												" Objets"
										);
									}
								}
							}
						}
					}
				}

				if (GetEntityType(entity) == 2) {
					// vehicules

					if (type == 6 || type == 7) {
						if (!Utils.CheckTbl(this.Vehicules, model)) {
							if (model !== 0) {
								if (Environnment.IsDev)
									console.log("DEV - Anticheat: annulation de la création d'un véhicule (" + model + ")");
								CancelEvent();
								if (!IsPlayerAceAllowed(source, "bypass-anticheat")) {
									this.VehCreator[src] = (this.VehCreator[src] || 0) + 1;

									if (this.VehCreator[src] > Config["limits"]["vehicles"]) {
										if (!IsPlayerAceAllowed(source, "bypass-anticheat")) {
											console.log(
												"[GM] | [Anticheat] - Player [" +
													source +
													"] a tenté de spawn " +
													this.VehCreator[src] +
													" Vehicules"
											);
										}
									}
								}
							}
						}
					}
				}

				if (GetEntityType(entity) == 1) {
					// peds

					if (type == 6 || type == 7) {
						if (!Utils.CheckTbl(this.Peds, model)) {
							if (model !== 0) {
								CancelEvent();
								if (!IsPlayerAceAllowed(source, "bypass-anticheat")) {
									this.PedCreator[src] = (this.PedCreator[src] || 0) + 1;

									if (this.PedCreator[src] > Config["limits"]["vehicles"]) {
										if (!IsPlayerAceAllowed(source, "bypass-anticheat")) {
											console.log(
												"[GM] | [Anticheat] - Player [" +
													source +
													"] a tenté de spawn " +
													this.PedCreator[src] +
													" Peds"
											);
										}
									}
								}
							}
						}
					}
				}
			}
		});

		Config["events"].map((v, k) => {
			onNet(v, () => {
				if (!IsPlayerAceAllowed(source, "bypass-anticheat")) {
					console.log("[GM] | [Anticheat] - Player [" + source + "] a tenté d'executer " + v);
				}
				CancelEvent();
			});
		});

		onNet("baseevents:onPlayerKilled", (killerId: string, data: { killerType: number; killerInVeh: boolean }) => {
			const source = parseInt(killerId);

			if (data.killerType == 4 || data.killerType == 5) {
				if (data.killerInVeh) {
					if (this.Killers[source] >= 2) {
						Admin.kick(source, "Anti carkill, vous avez carkill plus de 3 personnes");
					} else {
						this.Killers[source] = this.Killers[source] + 1;
					}
				}
			}
		});
	}

	public static whitelistProps() {
		Config["props"].map((v, k) => {
			if (typeof v == "string") {
				this.Props.push(GetHashKey(v));
			} else {
				this.Props.push(v);
			}
		});

		Config["particles"].map((v, k) => {
			if (typeof v == "string") {
				this.Particules.push(GetHashKey(v));
			} else {
				this.Particules.push(v);
			}
		});

		Config["vehicules"].map((v, k) => {
			if (typeof v == "string") {
				this.Vehicules.push(GetHashKey(v));
			} else {
				this.Vehicules.push(v);
			}
		});

		Config["ped"].map((v, k) => {
			if (typeof v == "string") {
				this.Peds.push(GetHashKey(v));
			} else {
				this.Peds.push(v);
			}
		});

		Config["weapons"].map((v, k) => {
			if (typeof v == "string") {
				this.Weapons.push(GetHashKey(v));
			} else {
				this.Weapons.push(v);
			}
		});

		Config["blacklist-words"].map((v, k) => {
			if (typeof v == "string") {
				this.Words.push(GetHashKey(v));
			} else {
				this.Words.push(v);
			}
		});
	}
}
