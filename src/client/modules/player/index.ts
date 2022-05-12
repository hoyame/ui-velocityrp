// import { ContextMenus } from "../../../shared/data/context";
import { Context } from "../misc/context";

export enum ContextMenus {
    None = 0,
    MyPlayer,
}

export abstract class Player {
    public static initialize() {
        Context.registerMenu({
            name: ContextMenus.MyPlayer,
            condition: (data: { id: number | boolean | number[] | { x: number; y: number; }; type: number | boolean | number[] | { x: number; y: number; }; model: number; networkId: number; svId: number; ifMyplayer: boolean; }) => { 
                return data.svId === GetPlayerServerId(PlayerId()) 
            },
            menu: [
                {
                    id: 1,
                    emoji: "🔐",
                    text: "Mon ID"
                },
                {
                    id: 2,
                    emoji: "🙌",
                    text: "Me Suicider",
                    onClick: () => console.log("suicide")
                }
            ]
        })
    }
}
