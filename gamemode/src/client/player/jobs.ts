import { Game, Ped } from "@wdesgardin/fivem-js";
import { JobId, JobsList } from "../../shared/config/jobs/jobs";
import { ICharacterJob } from "../../shared/player/character";
import { LocalEvents } from "../../shared/utils/localEvents";
import { CoraUI, IButton } from "../core/coraui";
import { GetClosestPlayer, KeyboardInput, RegisterClientCallback, TriggerServerCallbackAsync } from "../core/utils";
import { EMS } from "../modules/game/jobs/ems";
import { Ltd } from "../modules/game/jobs/ltd";
import { Mecano } from "../modules/game/jobs/mecano";
import { Police } from "../modules/game/jobs/police";
import { Taxi } from "../modules/game/jobs/taxi";
import { Unicorn } from "../modules/game/jobs/unicorn";
import { Clothes } from "./clothes";
import { Notifications } from "./notifications";

export class Jobs {
	public static currentJob?: ICharacterJob;
	private static onDuty = false;

	public static getJob() {
		return this.currentJob;
	}

	public static get isOnDuty() {
		return this.onDuty;
	}

	public static async initialize() {
		LocalEvents.on("gm:character:spawned", this.loadJob.bind(this));

		RegisterKeyMapping("+openjobmenu", "Ouvrir le menu métier", "keyboard", "F6");
		RegisterCommand("+openjobmenu", this.openJobMenu.bind(this), false);
		onNet("gm:jobs:changed", (job: ICharacterJob) => (this.currentJob = job));
		RegisterClientCallback("gm:jobs:billingAnswer", this.answerBilling.bind(this));
	}

	public static async billing() {
		if (!Jobs.isOnDuty) {
			Notifications.ShowError("~r~Action impossible~w~~n~Vous n'êtes pas en service");
			return;
		}

		let [target, dist] = GetClosestPlayer();
		const targetPed = new Ped(GetPlayerPed(GetPlayerFromServerId(target)));

		if (!targetPed?.exists() || targetPed.Handle == Game.PlayerPed.Handle || dist > 2) {
			Notifications.ShowError("~r~Action impossible~w~~w~Aucun joueur à proximité");
			return;
		}

		const amount = await KeyboardInput("Montant de la facture", 5);
		if (!Number(amount) || Number(amount) <= 0) {
			Notifications.ShowError("~r~Montant incorrect");
			return;
		}
		emitNet("gm:jobs:billing", target, amount);
	}

	private static answerBilling(cb: any, amount: number) {
		const timeout = GetGameTimer() + 10 * 1000;
		const notification = Notifications.ShowSuccess(
			"Appuyez sur ~g~Y~w~ pour payer la facture de ~g~" + amount + "$",
			"money",
			10 * 1000
		);

		const tick = setTick(() => {
			if (GetGameTimer() > timeout) {
				cb(false);
				clearTick(tick);
				Notifications.Hide(notification);
				Notifications.ShowError("Vous n'avez ~r~pas payé~w~ la facture", "money");
			} else if (Game.isControlJustPressed(0, 246)) {
				cb(true);
				clearTick(tick);
			}
		});
	}

	public static openOffDutyMenu() {
		const job = this.currentJob?.id && JobsList[this.currentJob?.id];
		if (!job) return;

		CoraUI.openMenu({
			name: job.name,
			subtitle: "Menu métier",
			buttons: [this.getOnDutyButton()],
		});
	}

	public static getOnDutyButton(): IButton {
		return {
			name: "En service",
			statusCheckbox: this.onDuty,
			checkbox: () => {
				CoraUI.closeMenu();
				this.onDuty = !this.onDuty;
				emitNet("gm:jobs:setOnDuty", this.onDuty);
				if (this.onDuty) {
					Clothes.putJobClothes();
					Notifications.Show("Vous êtes maintenant en service");
				} else {
					Clothes.putClothes();
					Notifications.Show("Vous n'êtes plus en service");
				}
				setTimeout(() => this.openJobMenu(), 0);
			},
		};
	}

	public static async loadJob() {
		this.currentJob = await TriggerServerCallbackAsync("gm:character:getJob");
	}

	private static openJobMenu() {
		if (this.currentJob?.id == JobId.EMS) {
			if (this.onDuty) {
				EMS.openMenu();
			} else {
				this.openOffDutyMenu();
			}
		} else if (this.currentJob?.id == JobId.LTD) {
			if (this.onDuty) {
				Ltd.openJobMenu();
			} else {
				this.openOffDutyMenu();
			}
		} else if (this.currentJob?.id == JobId.LSPD) {
			Police.openMenu();
		} else if (this.currentJob?.id == JobId.Taxi) {
			if (this.onDuty) {
				Taxi.openMenu();
			} else {
				this.openOffDutyMenu();
			}
		} else if (this.currentJob?.id == JobId.Unicorn) {
			Unicorn.openJobMenu();
		} else if (this.currentJob?.id == JobId.Mecano) {
			Mecano.openJobMenu();
		}
	}
}
