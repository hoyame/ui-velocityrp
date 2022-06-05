import AnticheatConfig from '../../../shared/data/anticheat.json'
import { Logs, LogsKeys } from '../misc/logs';
import { Player } from '../player';

export abstract class Anticheat {
    public static Wanted: number[] = [];

    public static async intialize() {
        onNet('hoyame:anticheat:wanted', (level: number) => this.wanted(parseInt(source), level));
        onNet('hoyame:anticheat:banTrigger', (level: number) => {
            console.log(`[hAnticheat] - ${GetPlayerName(source)} a créer un trigger blacklist`);
            Player.banAnticheat(source, 'Vous avez trigger un event blacklist');
            Logs.sendLogs(LogsKeys.Anticheat, `${GetPlayerName(source)} a été ban pour avoir trigger un event blacklist`);
        });
    }

    private static wanted(player: number, level: number) {
        if (this.Wanted[player] > 0) this.Wanted[player] += level;

        if (this.Wanted[player] >= AnticheatConfig['wantedLimit']) {
            console.log(`[hAnticheat] - ${GetPlayerName(source)} est beaucoup trop suspect`);
            Player.banAnticheat(player.toString(), 'Vous avez été ban pour etre beaucoup trop suspect');
            Logs.sendLogs(LogsKeys.Anticheat, `${GetPlayerName(player.toString())} a été ban car il est beaucoup trop suspect`);
        }
    }

    private static tick() {
        let explosions: any = [];
        let fire: any = [];
        let vehicles: any = [];
        
        onNet('startProjectileEvent', () => CancelEvent())

        onNet('giveWeaponEvent', (e: any, f: any) => {
            if (f.givenAsPickup == false) {
                CancelEvent();
                console.log(`[hAnticheat] - ${GetPlayerName(e)} s'est give une arme`);
                Player.banAnticheat(e, 'Vous vous etez give une arme');
                Logs.sendLogs(LogsKeys.Anticheat, `${GetPlayerName(e)} a été ban pour avoir give des armes`);
            }
        })

        onNet('RemoveWeaponEvent', (e: any, f: any) => {
            CancelEvent();
            console.log(`[hAnticheat] - ${GetPlayerName(e)} s'est retirer une arme`);
            Player.banAnticheat(e, 'Vous avez retirer une arme');
            Logs.sendLogs(LogsKeys.Anticheat, `${GetPlayerName(e)} a été ban pour avoir retirer une arme`);
        })

        onNet('removeAllWeaponsEvent', (e: any, f: any) => {
            CancelEvent();
            console.log(`[hAnticheat] - ${GetPlayerName(e)} s'est retirer toutes les armes`);
            Player.banAnticheat(e, 'Vous avez retirer toutes vos armes');
            Logs.sendLogs(LogsKeys.Anticheat, `${GetPlayerName(e)} a été ban pour avoir retirer toutes les armes`);
        })

        onNet('clearPedTasksEvent', (e: any, f: any) => {
            if (f.immediately == false) {
                CancelEvent();
                console.log(`[hAnticheat] - ${GetPlayerName(e)} a clear les task des peds`);
                Player.banAnticheat(e, 'Vous avez clear les task des peds');
                Logs.sendLogs(LogsKeys.Anticheat, `${GetPlayerName(e)} a été ban pour clear les task des peds`);
            }
        })

        onNet('entityCreating', (e: any) => {
            if (DoesEntityExist(e)) {
                if (NetworkGetEntityOwner(e) == null) {
                    CancelEvent()
                }

                if (GetEntityType(e) == 1 || GetEntityType(e) == 1) {
                    const sender = NetworkGetEntityOwner(e);
                    const model = GetEntityModel(e);
                    
                    return CancelEvent();
                }

                if (GetEntityPopulationType(e) == 0) {
                    CancelEvent()
                }

                if (GetEntityType(e) == 2) {
                    if (GetEntityPopulationType(e) == 7) {
                        console.log(`[hAnticheat] - [${NetworkGetEntityOwner(e)} - ${GetPlayerName(NetworkGetEntityOwner(e).toString())} a créer un vehicule`);
                    
                        AnticheatConfig.blacklistVehicles.map((v, k) => {
                            if (GetHashKey(v) == GetEntityModel(e)) {
                                DeleteEntity(e)
    
                                console.log(`[hAnticheat] - ${GetPlayerName(e)} a spawn un vehicule blacklist`);
                                Player.banAnticheat(e, 'Vous avez spawn un vehicule blacklist');
                                CancelEvent();
                            }
                        })

                        vehicles.push({
                            src: NetworkGetEntityOwner(e),
                            vehicle: e
                        })
                    }
                }
            }
        })

        onNet('explosionEvent', (e: any) => {
            console.log(`[hAnticheat] - ${GetPlayerName(e)} a créer une explosion`);
            CancelEvent();

            if (!explosions[e]) {
                explosions[e] = 1;
            } else {
                explosions[e]++;
            }

            if (explosions[e] > AnticheatConfig['limitExplosions']) {
                console.log(`[hAnticheat] - ${GetPlayerName(e)} a créer une explosion trop de fois`);
                Player.banAnticheat(e, 'Vous avez créer une explosion trop de fois');
                Logs.sendLogs(LogsKeys.Anticheat, `${GetPlayerName(e)} a été ban pour avoir créer une explosion trop de fois`);
            }
        })

        onNet('startProjectileEvent', (sender: any, data: any) => {
            CancelEvent()
        })
        
        onNet('fireEvent', (e: any) => {
            console.log(`[hAnticheat] - ${GetPlayerName(e)} a créer un feu`);
            CancelEvent();

            if (!fire[e]) {
                fire[e] = 1;
            } else {
                fire[e]++;
            }

            if (fire[e] > AnticheatConfig['limitFire']) {
                console.log(`[hAnticheat] - ${GetPlayerName(e)} a créer un feu trop de fois`);
                Player.banAnticheat(e, 'Vous avez créer un feu trop de fois');
                Logs.sendLogs(LogsKeys.Anticheat, `${GetPlayerName(e)} a été ban pour avoir créer un feu trop de fois`);
            }
        })

        onNet('ptFxEvent', (e: any) => {
            console.log(`[hAnticheat] - ${GetPlayerName(e)} a créer un ptfx`);

            if (AnticheatConfig['whitelistedParticles']['active'] && !AnticheatConfig['whitelistedParticles']['list'].includes(e.name)) {
                console.log(`[hAnticheat] - ${GetPlayerName(e)} a créer un particules blacklist`);
                Player.banAnticheat(e, 'Vous avez créer une particule blaclist');
                Logs.sendLogs(LogsKeys.Anticheat, `${GetPlayerName(e)} a été ban pour avoir créer une particules blacklist`);
            }
        })

        AnticheatConfig.eventsBlacklist.map((v, k) => {
            onNet(v, (e: any) => {
                console.log(`[hAnticheat] - ${GetPlayerName(e)} a créer un trigger blacklist`);
                Player.banAnticheat(e, 'Vous avez trigger un event blacklist');
                Logs.sendLogs(LogsKeys.Anticheat, `${GetPlayerName(e)} a été ban pour avoir trigger un event blacklist`);
            })
        })

        AnticheatConfig.blacklistedWords.map((v, k) => {
            RegisterCommand(v, (e: any, args: any) => {
                console.log(`[hAnticheat] - ${GetPlayerName(e)} a utiliser un mot blacklist`);
                Player.banAnticheat(e, 'Vous avez utiliser un mot blacklist');
                Logs.sendLogs(LogsKeys.Anticheat, `${GetPlayerName(e)} a été ban pour avoir utiliser un mot blacklist`);
            }, false)
        })

        setTick(() => {
            setTimeout(() => {
                explosions = [];
                fire = [];
            }, AnticheatConfig['limitDelay'] * 10000)
        })
    }
}