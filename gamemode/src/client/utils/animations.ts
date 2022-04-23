import { Delay } from "../../shared/utils/utils";
import { Streaming } from "./streaming";

export abstract class Animations {
	public static async PlaySimple(animDictionnary: string, animName: string, duration: number = -1, flag: number): Promise<boolean> {
		if (!(await Streaming.RequestAnimDictionnaryAsync(animDictionnary))) return false;

		const playerPed = PlayerPedId();
		TaskPlayAnim(playerPed, animDictionnary, animName, 8.0, -8, duration, flag, 0, false, false, false);

		if (duration >= 0) {
			await Delay(duration);
			ClearPedTasks(PlayerPedId());
			ClearPedSecondaryTask(PlayerPedId());
		}

		RemoveAnimDict(animDictionnary);
		return true;
	}
}
