import { RequestWaitModel } from "../core/utils";

export class Skin {
	public static Skin = [];

	public static saveSkin() {}

	public static async setPed(sex: any) {
		await RequestWaitModel(sex, 60000);

		const modelHash = GetHashKey(sex);

		SetPlayerModel(PlayerId(), modelHash);
		SetPedDefaultComponentVariation(PlayerPedId());

		if (sex == "mp_m_freemode_01") {
			SetPedComponentVariation(PlayerPedId(), 8, 15, 0, 2);
			SetPedComponentVariation(PlayerPedId(), 4, 21, 0, 2);
			SetPedComponentVariation(PlayerPedId(), 6, 34, 0, 2);
		} else {
			SetPedComponentVariation(PlayerPedId(), 8, 2, 0, 2);
			SetPedComponentVariation(PlayerPedId(), 4, 15, 0, 2);
			SetPedComponentVariation(PlayerPedId(), 6, 35, 0, 2);
		}

		SetPedComponentVariation(PlayerPedId(), 11, 15, 0, 2);
		SetPedComponentVariation(PlayerPedId(), 3, 15, 0, 2);
	}

	public static setSkin(ped: any, array: any) {
		SetPedHeadBlendData(ped, array[1], array[2], 0, array[1], array[2], 0, array[3], array[4], 0, false);
		SetPedFaceFeature(ped, 0, array[5]);
		SetPedFaceFeature(ped, 1, array[6]);
		SetPedFaceFeature(ped, 2, array[7]);
		SetPedFaceFeature(ped, 3, array[8]);
		SetPedFaceFeature(ped, 4, array[9]);
		SetPedFaceFeature(ped, 5, array[10]);
		SetPedFaceFeature(ped, 6, array[11]);
		SetPedFaceFeature(ped, 7, array[12]);
		SetPedFaceFeature(ped, 8, array[13]);
		SetPedFaceFeature(ped, 9, array[14]);
		SetPedFaceFeature(ped, 11, array[15]);
		SetPedFaceFeature(ped, 12, array[16]);
		SetPedFaceFeature(ped, 13, array[17]);
		SetPedFaceFeature(ped, 14, array[18]);
		SetPedFaceFeature(ped, 15, array[19]);
		SetPedFaceFeature(ped, 16, array[20]);
		SetPedFaceFeature(ped, 17, array[21]);
		SetPedFaceFeature(ped, 18, array[22]);
		SetPedComponentVariation(ped, 2, array[23], 0, 0);
		SetPedHairColor(ped, array[24], array[25]);
		SetPedHeadOverlay(ped, 1, array[26], array[27]);
		SetPedHeadOverlayColor(ped, 1, 1, array[28], array[29]);
		SetPedHeadOverlay(ped, 3, array[30], array[31]);
		SetPedHeadOverlay(ped, 8, array[32], array[33]);
		SetPedHeadOverlayColor(ped, 8, 1, array[34], array[35]);
		SetPedHeadOverlay(ped, 4, array[36], array[37]);
		SetPedHeadOverlayColor(ped, 4, 1, array[38], array[39]);
		SetPedEyeColor(ped, array[40]);
		SetPedHeadOverlay(ped, 0, array[41], array[42]);
		SetPedHeadOverlay(ped, 6, array[43], array[43]);
		SetPedHeadOverlay(ped, 7, array[44], array[45]);
		SetPedHeadOverlay(ped, 9, array[46], array[47]);
	}
}
