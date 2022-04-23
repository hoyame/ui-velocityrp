import { Environnment } from "../../shared/utils/environnment";
import { LocalEvents } from "../../shared/utils/localEvents";
import { WeaponsConfig } from "../../shared/config/weapons";
import { TriggerServerCallbackAsync } from "../core/utils";

export const WeaponsName = {
	weapon_knife: "couteau",
	weapon_nightstick: "matraque",
	weapon_hammer: "marteau",
	weapon_bat: "batte",
	weapon_golfclub: "club de golf",
	weapon_crowbar: "pied de biche",
	weapon_pistol: "pistolet",
	weapon_combatpistol: "pistolet de combat",
	weapon_appistol: "pistolet automatique",
	weapon_pistol50: "pistolet calibre 50",
	weapon_microsmg: "micro smg",
	weapon_smg: "smg",
	weapon_assaultsmg: "smg d'assaut",
	weapon_assaultrifle: "fusil d'assaut",
	weapon_carbinerifle: "carabine d'assaut",
	weapon_advancedrifle: "fusil avancé",
	weapon_mg: "mitrailleuse",
	weapon_combatmg: "mitrailleuse de combat",
	weapon_pumpshotgun: "fusil à pompe",
	weapon_sawnoffshotgun: "carabine à canon scié",
	weapon_assaultshotgun: "carabine d'assaut",
	weapon_bullpupshotgun: "carabine bullpup",
	weapon_stungun: "tazer",
	weapon_sniperrifle: "fusil de sniper",
	weapon_heavysniper: "fusil de sniper lourd",
	weapon_grenadelauncher: "lance-grenade",
	weapon_rpg: "lance-rocket",
	weapon_minigun: "minigun",
	weapon_grenade: "grenade",
	weapon_stickybomb: "bombe collante",
	weapon_smokegrenade: "grenade fumigène",
	weapon_bzgas: "grenade à gaz bz",
	weapon_molotov: "cocktail molotov",
	weapon_fireextinguisher: "extincteur",
	weapon_petrolcan: "jerrican d'essence",
	weapon_ball: "balle",
	weapon_snspistol: "pistolet sns",
	weapon_bottle: "bouteille",
	weapon_gusenberg: "balayeuse gusenberg",
	weapon_specialcarbine: "carabine spéciale",
	weapon_heavypistol: "pistolet lourd",
	weapon_bullpuprifle: "fusil bullpup",
	weapon_dagger: "poignard",
	weapon_vintagepistol: "pistolet vintage",
	weapon_firework: "feu d'artifice",
	weapon_musket: "mousquet",
	weapon_heavyshotgun: "fusil à pompe lourd",
	weapon_marksmanrifle: "fusil marksman",
	weapon_hominglauncher: "lance tête-chercheuse",
	weapon_proxmine: "mine de proximité",
	weapon_snowball: "boule de neige",
	weapon_flaregun: "lance fusée de détresse",
	weapon_combatpdw: "arme de défense personnelle",
	weapon_marksmanpistol: "pistolet marksman",
	weapon_knuckle: "poing américain",
	weapon_hatchet: "hachette",
	weapon_railgun: "canon éléctrique",
	weapon_machete: "machette",
	weapon_machinepistol: "pistolet mitrailleur",
	weapon_switchblade: "couteau à cran d'arrêt",
	weapon_revolver: "revolver",
	weapon_dbshotgun: "fusil à pompe double canon",
	weapon_compactrifle: "fusil compact",
	weapon_autoshotgun: "fusil à pompe automatique",
	weapon_battleaxe: "hache de combat",
	weapon_compactlauncher: "lanceur compact",
	weapon_minismg: "mini smg",
	weapon_pipebomb: "bombe tuyau",
	weapon_poolcue: "queue de billard",
	weapon_wrench: "clé",
	weapon_flashlight: "lampe torche",
	gadget_parachute: "parachute",
	weapon_flare: "fusée de détresse",
	weapon_doubleaction: "revolver double action",
};

export class Lodaout {
	public static async initialize() {
		if (Environnment.IsDev) {
			RegisterCommand(
				"updateLodaout",
				() => {
					Lodaout.updateLodaout();
				},
				false
			);
		}

		LocalEvents.on("gm:character:spawned", this.onSpawned.bind(this));

		onNet("gm:character:weapon:addWeapon", this.addWeapon.bind(this));
		onNet("gm:character:weapon:removeWeapon", this.removeWeapon.bind(this));
	}

	public static async getLodaout() {
		return await TriggerServerCallbackAsync("gm:character:getLodaout");
	}

	public static async addWeapon(v: string, ammo: number) {
		const weaponHash = GetHashKey(v);
		const ammoType = GetPedAmmoTypeFromWeapon(PlayerPedId(), weaponHash);

		GiveWeaponToPed(PlayerPedId(), weaponHash, 0, false, false);

		if (ammoType !== 0) {
			AddAmmoToPed(PlayerPedId(), weaponHash, 300);
		}

		this.updateLodaout();
	}

	public static async removeWeapon(weapon: string) {
		let lodaout = await TriggerServerCallbackAsync("gm:character:getLodaout");
		const index = lodaout.findIndex((e: any) => e[0] == weapon);
		lodaout = lodaout.splice(index, 1);

		RemoveAllPedWeapons(PlayerPedId(), true);

		WeaponsConfig.forEach((v: any) => {
			if (lodaout?.find((e: any) => e[0] == v)) {
				const ammo = lodaout?.findIndex((e: any) => e[0] == v) || 0;
				const weaponHash = GetHashKey(v);
				const ammoType = GetPedAmmoTypeFromWeapon(PlayerPedId(), weaponHash);
				GiveWeaponToPed(PlayerPedId(), weaponHash, 0, false, false);
				if (ammoType !== 0) {
					AddAmmoToPed(PlayerPedId(), weaponHash, lodaout[ammo][1]);
				}
			}
		});
	}

	public static updateLodaout() {
		let Weapons: any = [];

		WeaponsConfig.forEach((v: any) => {
			const weaponHash = GetHashKey(v);

			if (HasPedGotWeapon(PlayerPedId(), weaponHash, false)) {
				const ammo = GetAmmoInPedWeapon(PlayerPedId(), weaponHash);
				Weapons.push([v, ammo]);
			}
		});

		emitNet("gm:character:updateLodaout", Weapons);
	}

	public static async onSpawned() {
		const Lodaout = await TriggerServerCallbackAsync("gm:character:getLodaout");

		RemoveAllPedWeapons(PlayerPedId(), true);

		WeaponsConfig.forEach((v: any) => {
			if (Lodaout?.find((e: any) => e[0] == v)) {
				const ammo = Lodaout?.findIndex((e: any) => e[0] == v) || 0;
				const weaponHash = GetHashKey(v);
				const ammoType = GetPedAmmoTypeFromWeapon(PlayerPedId(), weaponHash);
				GiveWeaponToPed(PlayerPedId(), weaponHash, 0, false, false);
				if (ammoType !== 0) {
					AddAmmoToPed(PlayerPedId(), weaponHash, Lodaout[ammo][1]);
				}
			}
		});
	}
}
