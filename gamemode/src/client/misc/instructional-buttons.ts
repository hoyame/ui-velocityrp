import { Control } from "@nativewrappers/client";
import { Streaming } from "../utils/streaming";

export abstract class InstructionalButtons {
	public static currentScaleForm: number;
	public static entries: { name: string; control: Control | Control[] }[] = [];

	public static async initialize() {
		setTick(() => {
			if (this.currentScaleForm) DrawScaleformMovieFullscreen(this.currentScaleForm, 255, 255, 255, 255, 0);
		});
	}

	public static setButton(name: string, control: Control | Control[], enabled: boolean) {
		const entry = this.entries.find(e => e.name == name && this.isSameControls(e.control, control));

		if (!!entry && !enabled) {
			this.entries = this.entries.filter(e => e.name != name || !this.isSameControls(e.control, control));
			this.setInstructions();
		} else if (!entry && enabled) {
			this.entries.push({ name, control });
			this.setInstructions();
		}
	}

	public static removeAllButtons() {
		this.entries = [];
		this.currentScaleForm = 0;
	}

	private static async setInstructions() {
		let scaleform = await Streaming.RequestScaleFormAsync("INSTRUCTIONAL_BUTTONS");

		DrawScaleformMovieFullscreen(scaleform, 255, 255, 255, 0, 0);

		PushScaleformMovieFunction(scaleform, "CLEAR_ALL");
		PopScaleformMovieFunctionVoid();

		PushScaleformMovieFunction(scaleform, "SET_CLEAR_SPACE");
		PushScaleformMovieFunctionParameterInt(200);
		PopScaleformMovieFunctionVoid();

		for (let i = 0; i < this.entries.length; i++) {
			const btn = this.entries[i];
			PushScaleformMovieFunction(scaleform, "SET_DATA_SLOT");
			PushScaleformMovieFunctionParameterInt(i);
			for (const control of Array.isArray(btn.control) ? btn.control : [btn.control]) {
				ScaleformMovieMethodAddParamPlayerNameString(GetControlInstructionalButton(2, control, 1));
			}
			PushScaleformMovieMethodParameterString(btn.name);
			PopScaleformMovieFunctionVoid();
		}

		PushScaleformMovieFunction(scaleform, "DRAW_INSTRUCTIONAL_BUTTONS");
		PopScaleformMovieFunctionVoid();

		PushScaleformMovieFunction(scaleform, "SET_BACKGROUND_COLOUR");
		PushScaleformMovieFunctionParameterInt(0);
		PushScaleformMovieFunctionParameterInt(0);
		PushScaleformMovieFunctionParameterInt(0);
		PushScaleformMovieFunctionParameterInt(80);
		PopScaleformMovieFunctionVoid();

		this.currentScaleForm = scaleform;
	}

	private static isSameControls(a: Control | Control[], b: Control | Control[]) {
		if (Array.isArray(a) && !Array.isArray(b)) return a.length == 1 && a[0] == b;
		if (!Array.isArray(a) && Array.isArray(b)) return b.length == 1 && a == b[0];
		if (!Array.isArray(a) && !Array.isArray(b)) return a == b;
		//@ts-ignore
		if (a.length != b.length) return false;
		//@ts-ignore
		return !a.find(a => !b.includes(a)) && !b.find(b => !a.includes(b));
	}
}
