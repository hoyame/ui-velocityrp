export abstract class Nui {
	public static SendMessage(data: any) {
		SendNuiMessage(JSON.stringify(data));
	}

	public static RegisterCallback(callbackType: string, callback: (data: any, cb: any) => void) {
		RegisterNuiCallbackType(callbackType);
		on(`__cfx_nui:${callbackType}`, callback);
	}

	public static SetFocus(focus: boolean, cursor: boolean, keepInput: boolean) {
		SetNuiFocus(focus, cursor);
		SetNuiFocusKeepInput(keepInput);
	}
}
