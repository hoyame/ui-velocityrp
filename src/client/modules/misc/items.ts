import { Delay } from "../../../shared/utils/utils";
import { Nui } from "../../core/nui";
import { Store } from "../shops/store";


export abstract class Items {
	private static cache: any[] = [];

	public static async initialize() {
		Nui.RegisterCallback("leaveitems", () => this.close());
		Nui.RegisterCallback("backitems", () => this.back());
		Nui.RegisterCallback("onClickitems", (e: string) => this.push(e));
		
		onNet("hoyame:createItemsMenu", (data: any) => this.open(data));

		RegisterCommand(
			"createItemsMenu",
			() => {
				this.open({
					subdata: {
						coins: 100
					},
					items: [
						{
							count: 1,
							name: 'Voiture Range',
							img: 'https://cdn.discordapp.com/attachments/988139730203983915/1033066516440154212/unknown.png',
							onClick: () => console.log('f')
						},
						{
							count: 1,
							name: 'Voiture Rangen',
							img: 'https://cdn.discordapp.com/attachments/988139730203983915/1033066516440154212/unknown.png',
							onClick: () => console.log('g')
						},
					]
				});
			},
			false
		);
	}

	public static async open(menu: any) {
		this.cache = menu.items;
		Nui.SendMessage({ path: "items" });
		await Delay(500);
		Nui.SendMessage({ type: "items", items: menu.items, coins: 100 });
		Nui.SetFocus(true, true, false);
		SetMouseCursorSprite(0);
	}

	public static back() {
		Store.open()
	}

	public static push(name: string) {
		const d = this.cache.find(b => b.name == name);
		d.onClick();
		this.close();
	}

	public static close() {
		Nui.SetFocus(false, false, false);
		Nui.SendMessage({ path: "" });
		TriggerScreenblurFadeOut(500);
	}
}
