import { MySQL } from "../../core/mysql";
import ConfigBougique from "../../../shared/data/boutique.json"

export abstract class Store {
    public static async initialize() {
        onNet('hoyame:store:buyMecano',this.buyMecano.bind(this));
        onNet('hoyame:store:buyFarmCompany', this.buyFarmCompany.bind(this));
        onNet('hoyame:store:buyOrganisation', this.buyOrganisation.bind(this));
        onNet('hoyame:store:reclameVip', this.reclameVip.bind(this));
        onNet('hoyame:store:exclusiveVehicle', this.exclusiveVehicle.bind(this));
        onNet('hoyame:store:buyWeapon', this.buyWeapon.bind(this));
    }

    private static async buyMecano() {
        // remove money & send notification
        const identifier = getPlayerIdentifiers(source)[0];
        const coins = await MySQL.QueryAsync("SELECT coins FROM users WHERE identifier = ?", [identifier])
        const mecanoPrice = ConfigBougique["packs"]["mecano"];        

        if (coins < mecanoPrice) return emitNet("hoyame:main:notification", "Vous n'avez pas assez d'argent pour acheter ce pack");

        let fCoins = coins - mecanoPrice;

        await MySQL.QueryAsync('UPDATE users SET coins = ? WHERE identifier = ?', [fCoins, identifier]);
        emitNet("hoyame:main:notification", "Vous avez acheté un pack de mecano, veuillez ouvrir un ticket sur discord pour porsuivre votre demande");
    }
    
    private static async buyFarmCompany() {
        // remove money & send notification
        const identifier = getPlayerIdentifiers(source)[0];
        const coins = await MySQL.QueryAsync("SELECT coins FROM users WHERE identifier = ?", [identifier])
        const entreprisePrice = ConfigBougique["packs"]["entreprise"];        

        if (coins < entreprisePrice) return emitNet("hoyame:main:notification", "Vous n'avez pas assez d'argent pour acheter ce pack");

        let fCoins = coins - entreprisePrice;

        await MySQL.QueryAsync('UPDATE users SET coins = ? WHERE identifier = ?', [fCoins, identifier]);
        emitNet("hoyame:main:notification", "Vous avez acheté un pack entreprise, veuillez ouvrir un ticket sur discord pour porsuivre votre demande");
    }

    private static async buyOrganisation() {
        // remove money & send notification
        const identifier = getPlayerIdentifiers(source)[0];
        const coins = await MySQL.QueryAsync("SELECT coins FROM users WHERE identifier = ?", [identifier])
        const orgaPrice = ConfigBougique["packs"]["orga"];        

        if (coins < orgaPrice) return emitNet("hoyame:main:notification", "Vous n'avez pas assez d'argent pour acheter ce pack");

        let fCoins = coins - orgaPrice;

        await MySQL.QueryAsync('UPDATE users SET coins = ? WHERE identifier = ?', [fCoins, identifier]);
        emitNet("hoyame:main:notification", "Vous avez acheté un pack orga, veuillez ouvrir un ticket sur discord pour porsuivre votre demande");
    }

    private static reclameVip() {
        const identifier = getPlayerIdentifiers(source)[0];
        const vip: any = MySQL.QueryAsync("SELECT vip FROM users WHERE identifier = ?", [identifier])

        if (vip == 0) return emitNet("hoyame:main:notification", "Vous n'avez pas de credit VIP");
        if (vip == 1) {
            emit('gm:reclame_vip', source)
        }
    }

    private static exclusiveVehicle() {
        emit('gm:store:buyLimitedVehicle')
    }

    private static buyWeapon(weapon: string, price: number, label: string) {
        emit('hoyame_d:buyweapon', weapon, price, label)
    }
}