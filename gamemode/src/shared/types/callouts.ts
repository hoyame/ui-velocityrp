import { Vec3 } from "@wdesgardin/fivem-js/lib/utils/Vector3";

export interface Callout {
	id: string;
	position: Vec3;
	senderName: string;
	sender?: string | number;
	infos: string;
	title: string;
}
