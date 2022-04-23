import { Delay } from "../../../../shared/utils/utils";

let CCam, CreatorCam: number;

interface ICamOffset {
	item: string;
	cam: number[];
	lookAt: number[];
	fov: number;
}

let CamOffset: ICam[] = [
	{ item: "default", cam: [0.0, 3.0, 0.0], lookAt: [0.0, 0.0, 0.0], fov: 40.0 },
	{
		item: "default_face",
		cam: [0.0, 1.0, 0.7],
		lookAt: [0.0, 0.0, 0.65],
		fov: 35.0,
	},
	{ item: "face", cam: [0.0, 1.0, 0.7], lookAt: [0.0, 0.0, 0.65], fov: 20.0 },
	{ item: "skin", cam: [0.0, 2.0, 0.7], lookAt: [0.0, 0.0, 0.65], fov: 30.0 },
	{
		item: "tshirt_1",
		cam: [0.0, 2.0, 0.35],
		lookAt: [0.0, 0.0, 0.35],
		fov: 30.0,
	},
	{
		item: "tshirt_2",
		cam: [0.0, 2.0, 0.35],
		lookAt: [0.0, 0.0, 0.35],
		fov: 30.0,
	},
	{
		item: "torso_1",
		cam: [0.0, 2.0, 0.35],
		lookAt: [0.0, 0.0, 0.35],
		fov: 30.0,
	},
	{
		item: "torso_2",
		cam: [0.0, 2.0, 0.35],
		lookAt: [0.0, 0.0, 0.35],
		fov: 30.0,
	},
	{
		item: "decals_1",
		cam: [0.0, 2.0, 0.0],
		lookAt: [0.0, 0.0, 0.0],
		fov: 40.0,
	},
	{
		item: "decals_2",
		cam: [0.0, 2.0, 0.0],
		lookAt: [0.0, 0.0, 0.0],
		fov: 40.0,
	},
	{ item: "arms", cam: [0.0, 2.0, 0.0], lookAt: [0.0, 0.0, 0.0], fov: 40.0 },
	{ item: "arms_2", cam: [0.0, 2.0, 0.0], lookAt: [0.0, 0.0, 0.0], fov: 40.0 },
	{
		item: "pants_1",
		cam: [0.0, 2.0, -0.35],
		lookAt: [0.0, 0.0, -0.4],
		fov: 35.0,
	},
	{
		item: "pants_2",
		cam: [0.0, 2.0, -0.35],
		lookAt: [0.0, 0.0, -0.4],
		fov: 35.0,
	},
	{
		item: "shoes_1",
		cam: [0.0, 2.0, -0.5],
		lookAt: [0.0, 0.0, -0.6],
		fov: 40.0,
	},
	{
		item: "shoes_2",
		cam: [0.0, 2.0, -0.5],
		lookAt: [0.0, 0.0, -0.6],
		fov: 25.0,
	},
	{ item: "age_1", cam: [0.0, 1.0, 0.7], lookAt: [0.0, 0.0, 0.65], fov: 25.0 },
	{ item: "age_2", cam: [0.0, 1.0, 0.7], lookAt: [0.0, 0.0, 0.65], fov: 25.0 },
	{
		item: "beard_1",
		cam: [0.0, 1.0, 0.7],
		lookAt: [0.0, 0.0, 0.65],
		fov: 25.0,
	},
	{
		item: "beard_2",
		cam: [0.0, 1.0, 0.7],
		lookAt: [0.0, 0.0, 0.65],
		fov: 25.0,
	},
	{
		item: "beard_3",
		cam: [0.0, 1.0, 0.7],
		lookAt: [0.0, 0.0, 0.65],
		fov: 25.0,
	},
	{
		item: "beard_4",
		cam: [0.0, 1.0, 0.7],
		lookAt: [0.0, 0.0, 0.65],
		fov: 25.0,
	},
	{ item: "hair_1", cam: [0.0, 1.0, 0.7], lookAt: [0.0, 0.0, 0.65], fov: 25.0 },
	{ item: "hair_2", cam: [0.0, 1.0, 0.7], lookAt: [0.0, 0.0, 0.65], fov: 25.0 },
	{
		item: "hair_color_1",
		cam: [0.0, 1.0, 0.7],
		lookAt: [0.0, 0.0, 0.65],
		fov: 25.0,
	},
	{
		item: "hair_color_2",
		cam: [0.0, 1.0, 0.7],
		lookAt: [0.0, 0.0, 0.65],
		fov: 25.0,
	},
	{
		item: "eye_color",
		cam: [0.0, 1.0, 0.7],
		lookAt: [0.0, 0.0, 0.65],
		fov: 25.0,
	},
	{
		item: "eyebrows_1",
		cam: [0.0, 1.0, 0.7],
		lookAt: [0.0, 0.0, 0.65],
		fov: 25.0,
	},
	{
		item: "eyebrows_2",
		cam: [0.0, 1.0, 0.7],
		lookAt: [0.0, 0.0, 0.65],
		fov: 25.0,
	},
	{
		item: "eyebrows_3",
		cam: [0.0, 1.0, 0.7],
		lookAt: [0.0, 0.0, 0.65],
		fov: 25.0,
	},
	{
		item: "eyebrows_4",
		cam: [0.0, 1.0, 0.7],
		lookAt: [0.0, 0.0, 0.65],
		fov: 25.0,
	},
	{
		item: "makeup_1",
		cam: [0.0, 1.0, 0.7],
		lookAt: [0.0, 0.0, 0.65],
		fov: 25.0,
	},
	{
		item: "makeup_2",
		cam: [0.0, 1.0, 0.7],
		lookAt: [0.0, 0.0, 0.65],
		fov: 25.0,
	},
	{
		item: "makeup_3",
		cam: [0.0, 1.0, 0.7],
		lookAt: [0.0, 0.0, 0.65],
		fov: 25.0,
	},
	{
		item: "makeup_4",
		cam: [0.0, 1.0, 0.7],
		lookAt: [0.0, 0.0, 0.65],
		fov: 25.0,
	},
	{
		item: "lipstick_1",
		cam: [0.0, 1.0, 0.7],
		lookAt: [0.0, 0.0, 0.65],
		fov: 25.0,
	},
	{
		item: "lipstick_2",
		cam: [0.0, 1.0, 0.7],
		lookAt: [0.0, 0.0, 0.65],
		fov: 25.0,
	},
	{
		item: "lipstick_3",
		cam: [0.0, 1.0, 0.7],
		lookAt: [0.0, 0.0, 0.65],
		fov: 25.0,
	},
	{
		item: "lipstick_4",
		cam: [0.0, 1.0, 0.7],
		lookAt: [0.0, 0.0, 0.65],
		fov: 25.0,
	},
	{
		item: "blemishes_1",
		cam: [0.0, 1.0, 0.7],
		lookAt: [0.0, 0.0, 0.65],
		fov: 25.0,
	},
	{
		item: "blemishes_2",
		cam: [0.0, 1.0, 0.7],
		lookAt: [0.0, 0.0, 0.65],
		fov: 25.0,
	},
	{
		item: "blush_1",
		cam: [0.0, 1.0, 0.7],
		lookAt: [0.0, 0.0, 0.65],
		fov: 25.0,
	},
	{
		item: "blush_2",
		cam: [0.0, 1.0, 0.7],
		lookAt: [0.0, 0.0, 0.65],
		fov: 25.0,
	},
	{
		item: "blush_3",
		cam: [0.0, 1.0, 0.7],
		lookAt: [0.0, 0.0, 0.65],
		fov: 25.0,
	},
	{
		item: "complexion_1",
		cam: [0.0, 1.0, 0.7],
		lookAt: [0.0, 0.0, 0.65],
		fov: 25.0,
	},
	{
		item: "complexion_2",
		cam: [0.0, 1.0, 0.7],
		lookAt: [0.0, 0.0, 0.65],
		fov: 25.0,
	},
	{ item: "sun_1", cam: [0.0, 1.0, 0.7], lookAt: [0.0, 0.0, 0.65], fov: 25.0 },
	{ item: "sun_2", cam: [0.0, 1.0, 0.7], lookAt: [0.0, 0.0, 0.65], fov: 25.0 },
	{
		item: "moles_1",
		cam: [0.0, 1.0, 0.7],
		lookAt: [0.0, 0.0, 0.65],
		fov: 25.0,
	},
	{ item: "moles_2", cam: [0.0, 2.0, 0.0], lookAt: [0.0, 0.0, 0.0], fov: 40.0 },
	{ item: "chest_1", cam: [0.0, 2.0, 0.0], lookAt: [0.0, 0.0, 0.0], fov: 40.0 },
	{ item: "chest_2", cam: [0.0, 2.0, 0.0], lookAt: [0.0, 0.0, 0.0], fov: 40.0 },
	{ item: "chest_3", cam: [0.0, 2.0, 0.0], lookAt: [0.0, 0.0, 0.0], fov: 40.0 },
	{ item: "bodyb_1", cam: [0.0, 2.0, 0.0], lookAt: [0.0, 0.0, 0.0], fov: 40.0 },
	{ item: "bodyb_2", cam: [0.0, 2.0, 0.0], lookAt: [0.0, 0.0, 0.0], fov: 40.0 },
	{ item: "ears_1", cam: [0.0, 1.0, 0.7], lookAt: [0.0, 0.0, 0.65], fov: 35.0 },
	{ item: "ears_2", cam: [0.0, 1.0, 0.7], lookAt: [0.0, 0.0, 0.65], fov: 35.0 },
	{ item: "mask_1", cam: [0.0, 1.0, 0.7], lookAt: [0.0, 0.0, 0.65], fov: 20.0 },
	{ item: "mask_2", cam: [0.0, 1.0, 0.7], lookAt: [0.0, 0.0, 0.65], fov: 20.0 },
	{
		item: "bproof_1",
		cam: [0.0, 2.0, 0.0],
		lookAt: [0.0, 0.0, 0.0],
		fov: 40.0,
	},
	{
		item: "bproof_2",
		cam: [0.0, 2.0, 0.0],
		lookAt: [0.0, 0.0, 0.0],
		fov: 40.0,
	},
	{ item: "chain_1", cam: [0.0, 2.0, 0.0], lookAt: [0.0, 0.0, 0.0], fov: 40.0 },
	{ item: "chain_2", cam: [0.0, 2.0, 0.0], lookAt: [0.0, 0.0, 0.0], fov: 40.0 },
	{
		item: "bags_1",
		cam: [0.0, -2.0, 0.35],
		lookAt: [0.0, 0.0, 0.35],
		fov: 30.0,
	},
	{
		item: "bags_2",
		cam: [0.0, -2.0, 0.35],
		lookAt: [0.0, 0.0, 0.35],
		fov: 30.0,
	},
	{
		item: "helmet_1",
		cam: [0.0, 1.0, 0.73],
		lookAt: [0.0, 0.0, 0.68],
		fov: 20.0,
	},
	{
		item: "helmet_2",
		cam: [0.0, 1.0, 0.73],
		lookAt: [0.0, 0.0, 0.68],
		fov: 20.0,
	},
	{
		item: "glasses_1",
		cam: [0.0, 1.0, 0.7],
		lookAt: [0.0, 0.0, 0.65],
		fov: 25.0,
	},
	{
		item: "glasses_2",
		cam: [0.0, 1.0, 0.7],
		lookAt: [0.0, 0.0, 0.65],
		fov: 25.0,
	},
	{
		item: "watches_1",
		cam: [0.0, 2.0, 0.0],
		lookAt: [0.0, 0.0, 0.0],
		fov: 40.0,
	},
	{
		item: "watches_2",
		cam: [0.0, 2.0, 0.0],
		lookAt: [0.0, 0.0, 0.0],
		fov: 40.0,
	},
	{
		item: "bracelets_1",
		cam: [0.0, 2.0, 0.0],
		lookAt: [0.0, 0.0, 0.0],
		fov: 40.0,
	},
	{
		item: "bracelets_2",
		cam: [0.0, 2.0, 0.0],
		lookAt: [0.0, 0.0, 0.0],
		fov: 40.0,
	},
];

interface ICam {
	item: string;
	cam: number[];
	lookAt: number[];
	fov: number;
}

function GetCamOffset(type: string): ICam | boolean {
	let s: ICam | boolean = false;

	CamOffset.map((v: ICam, k: any) => {
		if (v["item"] == type) {
			console.log("v: ", v);
			s = v;
		}
	});

	return s;
}

export async function CamCreate(cam: string) {
	let offset: ICam | any = GetCamOffset(cam);

	let [x, y, z]: any = GetOffsetFromEntityInWorldCoords(PlayerPedId(), offset.cam[0], offset.cam[1], offset.cam[2]);
	let [plX, plY, plZ]: any = GetOffsetFromEntityInWorldCoords(PlayerPedId(), offset.lookAt[0], offset.lookAt[1], offset.lookAt[2]);

	CreatorCam = CreateCam("DEFAULT_SCRIPTED_CAMERA", false);

	RenderScriptCams(false, false, 1, true, true);
	await Delay(5);

	FreezeEntityPosition(PlayerPedId(), true);
	SetCamActive(CreatorCam, true);
	SetCamCoord(CreatorCam, x, y, z);
	SetCamFov(CreatorCam, offset["fov"]);
	PointCamAtCoord(CreatorCam, plX, plY, plZ);

	RenderScriptCams(true, true, 1000, false, false);
}

export function CamDestroy() {
	DestroyCam(CreatorCam, true);
	RenderScriptCams(false, false, 1, true, true);
	FreezeEntityPosition(PlayerPedId(), false);
}

function CreateBack() {
	let pPed = PlayerPedId();
	let offset: any = GetCamOffset("bags_1");
	let pos: any = GetOffsetFromEntityInWorldCoords(pPed, offset.cam[1], offset.cam[2], offset.cam[3]);
	let posLook: any = GetOffsetFromEntityInWorldCoords(pPed, offset.lookAt[1], offset.lookAt[2], offset.lookAt[3]);

	CreatorCam = CreateCam("DEFAULT_SCRIPTED_CAMERA", false);

	SetCamActive(CreatorCam, true);
	SetCamCoord(CreatorCam, pos.x, pos.y, pos.z);
	SetCamFov(CreatorCam, offset.fov);
	PointCamAtCoord(CreatorCam, posLook.x, posLook.y, posLook.z);

	RenderScriptCams(true, true, 1000, false, false);
}
