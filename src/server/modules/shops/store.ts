import { MySQL } from "../../core/mysql";
import BoutiqueConfig from "../../../shared/data/boutique.json"
import { RegisterServerCallback } from "../../core/utils";

export abstract class Store {
    public static async initialize() {
        onNet('hoyame:store:buyMecano',this.buyMecano.bind(this));
        onNet('hoyame:store:buyFarmCompany', this.buyFarmCompany.bind(this));
        onNet('hoyame:store:buyOrganisation', this.buyOrganisation.bind(this));
        onNet('hoyame:store:reclameVip', this.reclameVip.bind(this));
        onNet('hoyame:store:exclusiveVehicle', this.exclusiveVehicle.bind(this));
        onNet('hoyame:store:buyWeapon', this.buyWeapon.bind(this));

        RegisterServerCallback("hoyame:store:grabCaisse", this.generateCase.bind(this));
        RegisterServerCallback("hoyame:store:getCoins", this.getCoins.bind(this));
    }

    private static async generateCase(source: number, selectedCase: string) {   
        // @ts-ignore
        const Items = BoutiqueConfig.cases[selectedCase].content
        // @ts-ignore
        const price = BoutiqueConfig.cases[selectedCase].price
    
        const algo = () => {
            let l5 = []; let l4 = []; let l3 = []; let l2 = []; let l1 = [];
    
            const tLegendary = Items.filter((e: { tier: number; }) => e.tier === 4); 
            const tUnique = Items.filter((u: { tier: number; }) => u.tier === 0); 
            const tEpique = Items.filter((e: { tier: number; }) => e.tier === 3); 
            const tRare = Items.filter((r: { tier: number; }) => r.tier === 2); 
            const tCommon = Items.filter((c: { tier: number; }) => c.tier === 1);
            
            l5.push(tLegendary[Math.randomRange(0, tLegendary.length - 1)]);
            l4.push(tEpique[Math.randomRange(0, (tEpique.length - 1) / 2)]); l4.push(tEpique[Math.randomRange(0, tEpique.length - 1)]);
            l3.push(tUnique[Math.randomRange(0, tRare.length - 1)]); l3.push(tUnique[Math.randomRange(0, tRare.length - 1)]); l3.push(tUnique[Math.randomRange(0, tRare.length - 1)]);
            l2.push(tRare[Math.randomRange(0, tRare.length - 1)]); l2.push(tRare[Math.randomRange(0, tRare.length - 1)]); l2.push(tRare[Math.randomRange(0, tRare.length - 1)]); l2.push(tRare[Math.randomRange(0, tRare.length - 1)]); l2.push(tRare[Math.randomRange(0, tRare.length - 1)]);
            l1.push(tCommon[Math.randomRange(0, tCommon.length - 1)]); l1.push(tCommon[Math.randomRange(0, tCommon.length - 1)]); l1.push(tCommon[Math.randomRange(0, tCommon.length - 1)]); l1.push(tCommon[Math.randomRange(0, tCommon.length - 1)]); l1.push(tCommon[Math.randomRange(0, tCommon.length - 1)]); l1.push(tCommon[Math.randomRange(0, tCommon.length - 1)]); l1.push(tCommon[Math.randomRange(0, tCommon.length - 1)]); l1.push(tCommon[Math.randomRange(0, tCommon.length - 1)]); l1.push(tCommon[Math.randomRange(0, tCommon.length - 1)]); l1.push(tCommon[Math.randomRange(0, tCommon.length - 1)]);
    
            let r: any[] = []
    
            l5.map((e: any) => r.push(e))
            l4.map((e: any) => r.push(e))
            l3.map((e: any) => r.push(e))
            l2.map((e: any) => r.push(e))
            l1.map((e: any) => r.push(e))
    
            return r;
        }

        const randomItems = algo()
        const items: { tier: any; description: string | false; img: any; args: { type: any; reward: any; } | { type: any; reward: any; }; }[] = [];
        
        for (let i = 0; i < 150; i++) {
            const lootIndex = Math.randomRange(0, randomItems.length - 1);
            const c = randomItems[lootIndex]

            if (!c) continue;
            
            items.push({
                tier: c["tier"],
                description: !!c["description"] && `${c["description"]}`,
                img: c.img,
                args: {
                    type: c.args.type,
                    reward: c.args.reward,
                }
            });
        }

        items.map((v, k) => {
            if (k == 70) {
                emit("hoyame:case:checkoutCase", source, v["args"]["type"], v["args"]["reward"], price)
            }
        })

        return items;
    }

    private static async getCoins() {
        const identifier = getPlayerIdentifiers(source)[0];
        const coins = await MySQL.QueryAsync("SELECT coins FROM users WHERE identifier = ?", [identifier])
        return coins[0].coins;
    }

    private static async buyMecano() {
        // remove money & send notification
        // const identifier = getPlayerIdentifiers(source)[0];
        // const coins = await MySQL.QueryAsync("SELECT coins FROM users WHERE identifier = ?", [identifier])
        // const mecanoPrice = BoutiqueConfig["packs"]["mecano"];        

        // if (coins < mecanoPrice) return emitNet("hoyame:showNotification", "Vous n'avez pas assez d'argent pour acheter ce pack");

        // let fCoins = coins - mecanoPrice;

        // await MySQL.QueryAsync('UPDATE users SET coins = ? WHERE identifier = ?', [fCoins, identifier]);
        // emitNet("hoyame:showNotification", "Vous avez acheté un pack de mecano, veuillez ouvrir un ticket sur discord pour porsuivre votre demande");
    }
    
    private static async buyFarmCompany() {
        // remove money & send notification
        // const identifier = getPlayerIdentifiers(source)[0];
        // const coins = await MySQL.QueryAsync("SELECT coins FROM users WHERE identifier = ?", [identifier])
        // const entreprisePrice = BoutiqueConfig["packs"]["entreprise"];        

        // if (coins < entreprisePrice) return emitNet("hoyame:showNotification", "Vous n'avez pas assez d'argent pour acheter ce pack");

        // let fCoins = coins - entreprisePrice;

        // await MySQL.QueryAsync('UPDATE users SET coins = ? WHERE identifier = ?', [fCoins, identifier]);
        // emitNet("hoyame:showNotification", "Vous avez acheté un pack entreprise, veuillez ouvrir un ticket sur discord pour porsuivre votre demande");
    }

    private static async buyOrganisation() {
        // remove money & send notification
        // const identifier = getPlayerIdentifiers(source)[0];
        // const coins = await MySQL.QueryAsync("SELECT coins FROM users WHERE identifier = ?", [identifier])
        // const orgaPrice = BoutiqueConfig["packs"]["orga"];        

        // if (coins < orgaPrice) return emitNet("hoyame:showNotification", "Vous n'avez pas assez d'argent pour acheter ce pack");

        // let fCoins = coins - orgaPrice;

        // await MySQL.QueryAsync('UPDATE users SET coins = ? WHERE identifier = ?', [fCoins, identifier]);
        // emitNet("hoyame:showNotification", "Vous avez acheté un pack orga, veuillez ouvrir un ticket sur discord pour porsuivre votre demande");
    }

    private static reclameVip() {
        // const identifier = getPlayerIdentifiers(source)[0];
        // const vip: any = MySQL.QueryAsync("SELECT vip FROM users WHERE identifier = ?", [identifier])

        // if (vip == 0) return emitNet("hoyame:showNotification", "Vous n'avez pas de credit VIP");
        // if (vip == 1) {
        //     emit('gm:reclame_vip', source)
        // }
    }

    private static exclusiveVehicle() {
        emit('gm:store:buyLimitedVehicle')
    }

    private static buyWeapon(weapon: string, price: number, label: string) {
        emit('hoyame_d:buyweapon', weapon, price, label)
    }
}