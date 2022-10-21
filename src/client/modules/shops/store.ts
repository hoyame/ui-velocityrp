import { Delay } from "../../../shared/utils/utils";
import { Nui } from "../../core/nui";
import { TriggerServerCallbackAsync } from "../../core/utils";
import { Notification } from "../misc/notifications";
import { Selector } from "../misc/selector";
import { Cardealer } from "./cardealer";

export abstract class Store {
	public static data = {};

	public static async initialize() {
		Nui.RegisterCallback("leavestore", () => this.close());
		Nui.RegisterCallback("interactstore", (action: string) => this.interact(action));
		Nui.RegisterCallback("buystoreveh", (action: any) => this.buystoreveh(action));
		Nui.RegisterCallback("trystoreveh", (action: any) => this.trystoreveh(action));
		
		onNet("hoyame:store:open", (coins: number, code: number) => this.open(coins, code))
		onNet("hoyame:store:close", () => this.close());

		// RegisterCommand(
		// 	"boutique",
		// 	async () => {

		// 		Nui.SendMessage({ path: "shop/case" });
		// 		await Delay(30);
		// 		Nui.SendMessage({ type: "store", coins: coins, code: code });
		// 		Nui.SetFocus(true, true, false);
		// 		DisplayRadar(false);
		// 	},
		// 	false
		// );

		RegisterCommand(
			"getSafeZone",
			() => {
				console.log(exports.VelocityRP.GetSafeZone());
			},
			false
		);
	}

	public static buystoreveh(veh: any) {
		console.log('buy')
		console.log(veh)

		emitNet('hoyame:store:t9', veh.model, veh.price, veh.name)
		this.close();
	}

	public static trystoreveh(veh: any) {
		console.log('try')
		console.log(veh)
	}

	public static interact(action: string) {
		console.log(action)

		if (action == "starterpack") {
			
		} else if (action == "backpack") {
			Selector.open({
				buttons: [
					{
						name: "Sac â dos niveau 1",
						icon: "https://cdn.discordapp.com/attachments/749017234743099423/1029030512372756490/unknown.png",
						content: {
							title: "COUT",
							subtitle: "2500 COINS",
							badges: ['50 KG', 'Niveau 1', 'Inventaire'],
						}
					},
					{
						name: "Sac â dos niveau 2",
						icon: "https://cdn.discordapp.com/attachments/749017234743099423/1029030512372756490/unknown.png",
						content: {
							title: "COUT",
							subtitle: "5000 COINS",
							badges: ['100 KG', 'Niveau 2', 'Inventaire']
						}
					},
					{
						name: "Sac â dos niveau 3",
						icon: "https://cdn.discordapp.com/attachments/749017234743099423/1029030512372756490/unknown.png",
						content: {
							title: "COUT",
							subtitle: "7500 COINS",
							badges: ['150 KG', 'Niveau 3', 'Inventaire']
						}
					},
				],
				onClick: (e: any) => {
					console.log('eiubgeigbeigub00')
					console.log(e)
					Selector.close();
				}
			})
		} else if (action == "cash") {
			Selector.open({
				buttons: [
					{
						name: "Petite liasse de billets",
						icon: "https://cdn.discordapp.com/attachments/749017234743099423/1029109185859821690/unknown.png",
						content: {
							title: "COUT",
							subtitle: "5000 COINS",
							badges: ['5.000 $', 'Argent'],
						}
					},
					{
						name: "Carton de billets",
						icon: "https://cdn.discordapp.com/attachments/749017234743099423/1029109212279754823/unknown.png",
						content: {
							title: "COUT",
							subtitle: "7500 COINS",
							badges: ['7.500 $', 'Argent'],
						}
					},
					{
						name: "Palette de billets",
						icon: "https://cdn.discordapp.com/attachments/749017234743099423/1029109231435129033/unknown.png",
						content: {
							title: "COUT",
							subtitle: "10000 COINS",
							badges: ['10.000 $', 'Argent'],
						}
					},
					{
						name: "Coffre de billets",
						icon: "https://cdn.discordapp.com/attachments/749017234743099423/1029109254310854769/unknown.png",
						content: {
							title: "COUT",
							subtitle: "10000 COINS",
							badges: ['10.000 $', 'Argent'],
						}
					},
				],
				onClick: (e: any) => {
					console.log('eiubgeigbeigub00')
					console.log(e)
					Selector.close();
				}
			})
		}
	}

 	public static async open(coins: number, code: number) {
		Nui.SendMessage({ path: "store" });
		await Delay(30);
		Nui.SendMessage({ type: "store", coins: coins, code: code });
		Nui.SetFocus(true, true, false);
		DisplayRadar(false);
	}	

	public static close() {
		Nui.SendMessage({ path: "" });
		Nui.SetFocus(false, false, false);
		Cardealer.returnTp();
		// TriggerScreenblurFadeOut(500)
	}
}
