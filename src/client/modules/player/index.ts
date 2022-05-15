// import { ContextMenus } from "../../../shared/data/context";
import { Nui } from "../../core/nui";
import { Context } from "../misc/context";
import { Notification } from "../misc/notifications";

export enum ContextMenus {
    None = 0,
    MyPlayer,
}

export abstract class Player {
    public static initialize() {
        // Nui.SendMessage({ path: "shop/case" });
        // Nui.SetFocus(true, true, false);
        // DisplayRadar(false);

        Context.registerMenu({
            name: ContextMenus.MyPlayer,
            condition: (data: { id: number | boolean | number[] | { x: number; y: number; }; type: number | boolean | number[] | { x: number; y: number; }; model: number; networkId: number; svId: number; ifMyplayer: boolean; }) => { 
                return data.svId === GetPlayerServerId(PlayerId()) 
            },
            menu: [
                {
                    id: 1,
                    emoji: "🔐",
                    text: "Mon ID",
                    onClick: () => {
                        Notification.show({
                            title: "Mon ID",
                            message: "Mon ID: " + GetPlayerServerId(PlayerId())
                        });
                        Context.close();
                    }
                },
                {
                    id: 2,
                    emoji: "❤️",
                    text: "Ma vie",
                    onClick: () => {
                        Notification.show({
                            title: "Ma vie",
                            message: "HP: " + GetEntityHealth(PlayerPedId())
                        });
                        Context.close();
                    }
                },
                {
                    id: 3,
                    emoji: "🔐",
                    text: "Mon ID",
                    onClick: () => {
                        Notification.show({
                            title: "Mon ID",
                            message: "Mon ID: " + GetPlayerServerId(PlayerId())
                        });
                        Context.close();
                    }
                },
                {
                    id: 4,
                    emoji: "❤️",
                    text: "Ma vie",
                    onClick: () => {
                        Notification.show({
                            title: "Ma vie",
                            message: "HP: " + GetEntityHealth(PlayerPedId())
                        });
                        Context.close();
                    }
                },
                {
                    id: 5,
                    emoji: "🔐",
                    text: "Mon ID",
                    onClick: () => {
                        Notification.show({
                            title: "Mon ID",
                            message: "Mon ID: " + GetPlayerServerId(PlayerId())
                        });
                        Context.close();
                    }
                },
                {
                    id: 6,
                    emoji: "❤️",
                    text: "Ma vie",
                    onClick: () => {
                        Notification.show({
                            title: "Ma vie",
                            message: "HP: " + GetEntityHealth(PlayerPedId())
                        });
                        Context.close();
                    }
                },
            ]
        })
    }
}
