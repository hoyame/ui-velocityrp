import Config from "../../../../shared/config/anticheat.json";
import { Delay } from "../../../../shared/utils/utils";

export default abstract class Anticheat {
	public static async initialize() {
		console.log("[GM] | [Module] - Anticheat Initialized");

		const tickk = setTick(async () => {
			RemoveAllPickupsOfType(0xdf711959);
			RemoveAllPickupsOfType(0xf9afb48f);
			RemoveAllPickupsOfType(0xa9355dcd);

			if (IsPedArmed(PlayerPedId(), 6)) {
				SetPlayerLockon(PlayerId(), false);
			} else {
				SetPlayerLockon(PlayerId(), true);
			}
		});

		const tickVeh = setTick(() => {
			const ped = PlayerPedId();

			if (DoesEntityExist(ped) && !IsEntityDead(ped)) {
				if (IsPedSittingInAnyVehicle(ped)) {
					const vehicle = GetVehiclePedIsIn(ped, false);

					if (GetPedInVehicleSeat(vehicle, -1) == ped) {
						SetVehicleEngineTorqueMultiplier(vehicle, 1.0);
						SetVehicleEnginePowerMultiplier(vehicle, 1.0);
					}
				}
			}
		});

		const tick = setTick(async () => {
			await Delay(2500);

			if (IsPedInAnyVehicle(PlayerPedId(), false)) {
				if (GetVehicleTopSpeedModifier(GetVehiclePedIsIn(PlayerPedId(), false)) > Config.SpeedMultiplier) {
					TriggerServerEvent(
						"fuhjizofzf4z5fza",
						"vehicle_speed",
						"Change veh top speed (" + GetVehicleTopSpeedModifier(GetVehiclePedIsIn(PlayerPedId(), false)) + ")"
					);
				}

				if (GetVehicleCheatPowerIncrease(GetVehiclePedIsIn(PlayerPedId(), false)) > Config.SpeedMultiplier) {
					TriggerServerEvent("fuhjizofzf4z5fza", "vehicle_speed", "Change veh top speed");
				}
			}

			if (
				HasStreamedTextureDictLoaded("rampage_tr_main") ||
				HasStreamedTextureDictLoaded("rampage_tr_animated") ||
				IsStreamingFileReady("rampage_tr_main.ytd") ||
				IsStreamingFileReady("rampage_tr_animated.ytd")
			) {
				TriggerServerEvent("fuhjizofzf4z5fza", "asi", "RAMPAGE ASI detected");
			}

			GetRegisteredCommands().map((v: any, k: any) => {
				Config["commands"].map(async (v1: any, k1: any) => {
					if (v.name == v1) {
						TriggerServerEvent("fuhjizofzf4z5fza", "injection", v1);
					}

					await Delay(50);
				});
			});

			const nBlips = GetNumberOfActiveBlips();
			const activePlayers = GetActivePlayers();
			let activeblips = 0;

			if (nBlips == GetActivePlayers().lenght) {
				TriggerServerEvent("fuhjizofzf4z5fza", "antiblips", "^^");
			}

			activePlayers.map((v: any, k: any) => {
				if (DoesBlipExist(GetBlipFromEntity(GetPlayerPed(v)))) {
					activeblips = (activeblips || 0) + 1;
				}

				if (activeblips > Config["MaxBlips"]) {
					TriggerServerEvent("fuhjizofzf4z5fza", "antiblips", "^^");
				}
			});

			if (NetworkIsInSpectatorMode()) {
				TriggerServerEvent("fuhjizofzf4z5fza", "spec", "Spectator mode detection");
			}

			const [_, a, b, c, d, e] = GetEntityProofs(PlayerPedId());

			if ((a && b && c && d && e) == 1) {
				TriggerServerEvent("fuhjizofzf4z5fza", "spec", "Spectator mode detection #2");
			}
		});
	}
}
