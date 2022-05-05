import { Environnment } from "../../shared/utils/environnment";
import { WorldGrid } from "./world";

export type Callback = ((source: number, args: any) => Promise<any>) | ((source: number, args: any) => any);
const ServerCallbacks: { [key: string]: Callback } = {};

onNet("trigger_server_callback", (name: string, requestId: number, a?: any) => {
	const _source = (global as any).source;
	TriggerServerCallback(
		name,
		requestId,
		_source,
		(a: string) => {
			emitNet("server_callback", _source, requestId, a); // to client side
		},
		a
	);
});

export const onMeCommand = (source: string, args: any) => {
	let text = "* l'individu " + args.join(" ") + " *";
	BroadcastAbovePedText(text, source);
};

const lastBroadcasts: { [id: number]: number } = {};
export const BroadcastAbovePedText = (text: string, source: string | number) => {
	if (!!lastBroadcasts[+source] && lastBroadcasts[+source] + 10000 > GetGameTimer()) return;
	lastBroadcasts[+source] = GetGameTimer();

	for (const player of WorldGrid.getNearbyPlayers(+source)) {
		emitNet("gm:character:abovePedText", player, text, source);
	}
};

export const RegisterServerCallback = (name: string, cb: Callback) => {
	if (Environnment.IsDev) console.log(`DEV: callback ${name} registered`);
	ServerCallbacks[name] = cb;
};

function TriggerServerCallback(name: typeof cb, requestId: any, source: number, cb: any, a?: any) {
	if (Environnment.IsDev) console.log(`DEV: callback ${name} triggered`);
	if (ServerCallbacks[name] != null) {
		Promise.resolve(ServerCallbacks[name](source, a)).then(result => cb(result));
	}
}

let clientCallbacks: any[] = [];
let currentRequestId = 0;

export const TiggerClientCallback = (name: string, target: string, cb: any, a?: any) => {
	clientCallbacks[currentRequestId] = cb;
	TriggerClientEvent("trigger_client_callback", target, name, currentRequestId, a);
	if (currentRequestId < 65535) {
		currentRequestId = currentRequestId + 1;
	} else {
		currentRequestId = 0;
	}
};

export const TriggerClientCallbackAsync = (name: string, target: string, a?: any) => {
	return new Promise<any>(res => TiggerClientCallback(name, target, res, a));
};

onNet("client_callback", (requestId: any, a?: any) => {
	if (clientCallbacks[requestId]) {
		clientCallbacks[requestId](a);
	}
	clientCallbacks[requestId] = null;
});
