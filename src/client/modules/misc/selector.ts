import { Delay } from "../../../shared/utils/utils";
import { Nui } from "../../core/nui";

interface ISelectorButtons {
    name?: string;
	icon?: string;
	content?: any;
}

interface ISelector {
    buttons: ISelectorButtons[];
    onClick: any;
}

export abstract class Selector {
    private static cacheCb: any = null;

    public static async initialize() {
		Nui.RegisterCallback("closeselector", () => this.close());
		Nui.RegisterCallback("pushSelectorselector", (e: string) => this.push(e));
    }

    public static async open(menu: ISelector) {
		console.log('inSelector component')
		console.log(menu)
        this.cacheCb = menu.onClick;
		console.log(true)

		Nui.SendMessage({ path: "selector" });
		await Delay(500);
		Nui.SendMessage({ type: "selector", selector: menu.buttons });
		Nui.SetFocus(true, true, false);
		SetMouseCursorSprite(0);
	}

	public static push(e: string) {
		this.cacheCb && this.cacheCb(e);
        this.close();
	}

	public static close() {
		Nui.SetFocus(false, false, false);
		Nui.SendMessage({ path: "" });
	}
}