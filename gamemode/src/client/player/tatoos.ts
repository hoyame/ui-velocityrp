import { Character } from "./character";

export class Tatoos {
	public static Stage = [false, false];

	public static async set() {
		const tatoos = Character.getCurrent()?.tatoos;
		ClearPedDecorations(PlayerPedId());

		tatoos?.map((v: any, k: any) => {
			const collection = v[0];
			const hashName = v[1];

			SetPedDecoration(PlayerPedId(), collection, hashName);
		});

		console.log("set tatoos");

		this.Stage[0] = true;
	}

	public static async setCustom(taa: any) {
		const tatoos = taa;
		ClearPedDecorations(PlayerPedId());

		tatoos?.map((v: any, k: any) => {
			const collection = v[0];
			const hashName = v[1];

			SetPedDecoration(PlayerPedId(), collection, hashName);
		});

		console.log("set tatoos");

		this.Stage[0] = true;
	}

	public static get() {
		return Character.getCurrent()?.tatoos;
	}

	public static add(collection: any, hashName: any) {
		let tatoos: any = Character.getCurrent()?.tatoos || [];

		tatoos?.push([collection, hashName]);

		Character.update({
			tatoos: tatoos,
		});
	}

	public static clear(collection: any, hashName: any) {
		Character.update({
			tatoos: [],
		});
	}
}
