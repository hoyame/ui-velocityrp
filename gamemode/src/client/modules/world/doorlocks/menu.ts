import { JobId } from "../../../../shared/config/jobs/jobs";
import { DoorOptions } from "../../../../shared/types/doors";
import { CoraUI } from "../../../core/coraui";

export const OpenDoorOptionsMenu = () => {
	return new Promise<DoorOptions | undefined>(resolve => {
		const options: DoorOptions = {
			locked: false,
			interactInVeh: false,
			interactDist: 5,
			drawDist: 10,
			jobId: JobId.LSPD,
		};

		const drawDistSlider = new Array<string>();
		let min = 2.5;
		do {
			drawDistSlider.push(min.toFixed(1));
			min += 0.5;
		} while (min <= 20);

		const interactDistSlider = new Array<string>();
		min = 2.5;
		do {
			interactDistSlider.push(min.toFixed(1));
			min += 0.5;
		} while (min <= 10);

		//get the name of all enum members. ["LSPD", "Ems", ...]
		const jobsSlider = Object.values(JobId)
			.filter(v => typeof v == "string")
			.map(v => v.toString());

		CoraUI.openMenu({
			name: "Nouvelle porte",
			glare: true,
			subtitle: "",
			onClose: () => resolve(undefined),
			buttons: [
				{
					name: "Fermée par défaut",
					checkbox: () => (options.locked = !options.locked),
					statusCheckbox: options.locked,
				},
				{
					name: "Interaction depuis un véhicule",
					checkbox: () => (options.interactInVeh = !options.interactInVeh),
					statusCheckbox: options.interactInVeh,
				},
				{
					name: "Distance pour interragir",
					slider: interactDistSlider,
					onSlide: (e: any) => (options.interactDist = Number(interactDistSlider[e])),
					indexSlider: interactDistSlider.indexOf("2.5"),
				},
				{
					name: "Distance de rendu",
					slider: drawDistSlider,
					onSlide: (e: any) => (options.drawDist = Number(drawDistSlider[e])),
					indexSlider: drawDistSlider.indexOf("5.0"),
				},
				{
					name: "Job",
					slider: jobsSlider,
					onSlide: (e: any) => (options.jobId = e + 1),
					indexSlider: 0,
				},
				{
					name: "Valider",
					onClick: () => {
						resolve(options);
						CoraUI.closeMenu();
					},
				},
			],
		});
	});
};
