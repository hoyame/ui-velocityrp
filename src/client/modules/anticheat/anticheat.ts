import { Player, Vector3 } from "@wdesgardin/fivem-js";

export abstract class Anticheat {
    private static isAdmin = false
    private static oldPosition = new Vector3(0, 0, 0)

    public static async initialize() {
        this.tick();
    }

    private static wanted(level: number) {
        emitNet('hoyame:anticheat:wanted', level);
    }

    private static tick() {
        const [posX, posY, posZ] = GetEntityCoords(PlayerPedId(), false)

        onNet("esx:getSharedObject", () => {
            emitNet('hoyame:anticheat:banTrigger')
        })

        setTick(() => {
            setTimeout(() => {
                if (!this.isAdmin) {
                    NetworkIsInSpectatorMode() && this.wanted(10)
                }
            }, 5000)

            setTimeout(() => {
                const [x, y, z] = GetEntityCoords(PlayerPedId(), false);
                this.oldPosition = new Vector3(x, y, z)
            }, 1000)

            if (!this.isAdmin && this.oldPosition.distance(new Vector3(posX, posY, posZ)) > 1000 && !IsPedInParachuteFreeFall(PlayerPedId())) {
                this.wanted(5)                
                SetEntityCoords(PlayerPedId(), this.oldPosition.x, this.oldPosition.y, this.oldPosition.z, false, false, false, false)
            }
        })
    }
}