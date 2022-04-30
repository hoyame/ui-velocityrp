import * as Cfx from '@nativewrappers/client';
import { Vector3 } from '@nativewrappers/client';
import { privateEncrypt } from 'crypto';

interface IEntity {
    id: any;
    networkId: any;
    svId: any;

    type: any;
    model: any;
}

interface IContext {
    focus: boolean;
    open: boolean;

    pos: Vector3;
    offset: Vector3;

    entity: IEntity;
}

export abstract class Context {
    private static Data: IContext = {
        focus: false,
        open: false,
        pos: new Vector3(0, 0, 0),
        offset: new Vector3(0, 0, 0),
        entity: {
            id: null,
            networkId: 0,
            svId: 0,
            type: null,
            model: null
        }
    }

    public static async initialize() {
        console.log("[Context] Initialized");

        RegisterCommand("contexts", () => {
            this.Data.focus = !this.Data.focus;
        }, false)

        RegisterKeyMapping('contexts', 'Context', 'keyboard', 'K');

        setTick(() => {
            if (this.Data.focus) {
                DisableAllControlActions(2)
                SetMouseCursorActiveThisFrame()

                if (!this.Data.open) {
                    const [isFound, entityCoords, surfaceNormal, entityHit, entityType, cameraDirection, mouse] = this.getScreenToWorld(35.0, 31);
    
                    if (entityType != 0) {                       
                        SetMouseCursorSprite(5);
                        
                        if (this.Data.entity.id != entityHit) {
                            ResetEntityAlpha(this.Data.entity.id);
                            this.Data.entity.id = entityHit;
                            SetEntityAlpha(this.Data.entity.id, 200, 0);
                        }
    
                        if (IsControlJustPressed(0, 24) || IsDisabledControlJustPressed(0, 24)) {
                            if (true) {     // si menu deja ouvert
                                // @ts-ignore
                                const [posX, posY] = this.convertToPixel(mouse.x, mouse.y);
                            }
                        }
                    } else {
                        if (this.Data.entity.id != null) {
                            ResetEntityAlpha(this.Data.entity.id);
                            this.Data.entity.id = null;
                        }
                        SetMouseCursorSprite(1);
                    }
                } else {
                    // ananasikim
                }
            } else {
                // console.log("[Context] Close")
            }
        })
    }

    private static visible() {
        SetMouseCursorSprite(1);
        // va voir
        const x = 1920;
        const y = 1080;
        const lastX = this.Data.offset.x;
        const lastY = this.Data.offset.y;

        // open menu function
    }

    private static isMouseInBounds(x: number, y: number, w: number, h: number) {
        const mx = Math.round(GetControlNormal(2, 239) * 1920) / 1920;
        const my = Math.round(GetControlNormal(2, 240) * 1080) / 1080;

        const nx = x / 1920;
        const ny = y / 1080;
        const nw = w / 1920;
        const nh = h / 1080;

        return [(mx >= nx && mx <= nx + nw) && (my > ny && my < ny + nh)];
    }

    private static convertToPixel(x: number, y: number) {
        return [(x * 1920), (y * 1080)];
    }

    private static getCursorScreenPosition() {
        EnableControlAction(0, 239, true);
        EnableControlAction(0, 240, true);

        return [GetControlNormal(0, 239), GetControlNormal(0, 240)];
    }

    public static getScreenToWorld(d: any, f: any) {
        const cRot = new Vector3(GetGameplayCamRot(0)[0], GetGameplayCamRot(0)[1], GetGameplayCamRot(0)[2]);
        const cPos = new Vector3(GetGameplayCamCoord()[0], GetGameplayCamCoord()[1], GetGameplayCamCoord()[2])
        const mouse = {
            x: this.getCursorScreenPosition()[0], 
            y: this.getCursorScreenPosition()[1]
        };

        const [cam3DPosition, forwardDirection] = this.getScreenRelToWorld(cPos, cRot, mouse);
        const direction = cPos.add(forwardDirection.multiply(d));
        const rayHandle = StartExpensiveSynchronousShapeTestLosProbe(cam3DPosition.x, cam3DPosition.y, cam3DPosition.z, direction.x, direction.y, direction.z, f, 0, 0);
        const [_, hit, endCoords, surfaceNormal, entityHit] = GetShapeTestResult(rayHandle);

        return [(hit == 1 && true || false), endCoords, surfaceNormal, entityHit, (entityHit >= 1 && GetEntityType(entityHit) || 0), direction, mouse];
    }

    private static getWorld3DToScreen(pos: Vector3) {
        const [_, sX, sY] = GetScreenCoordFromWorldCoord(pos.x, pos.y, pos.z);
        return new Vector3(sX, sY, 0.0);
    }

    private static getRotationADirection(cRot: any) {
        const x = (cRot.x * Math.PI / 180)
        const z = (cRot.z * Math.PI / 180)
        const abs = Math.abs(Math.cos(x))

        return new Vector3(-(Math.sin(z) * abs), (Math.cos(z) * abs), Math.sin(x));
    }

    private static getScreenRelToWorld(cPos: Vector3, cRot: Vector3, cursor: {x: number, y: number}) {
        const cForward = this.getRotationADirection(cRot);
        const rUp = new Vector3(cRot.x + 1.0, cRot.y, cRot.z);
        const rDown = new Vector3(cRot.x - 1.0, cRot.y, cRot.z);
        const rLeft = new Vector3(cRot.x, cRot.y, cRot.z - 1.0);
        const rRight = new Vector3(cRot.x, cRot.y, cRot.z + 1.0);

        const cRight = this.getRotationADirection(rRight).subtract(this.getRotationADirection(rLeft));
        const cUp = this.getRotationADirection(rUp).subtract(this.getRotationADirection(rDown));

        const rRad = -(cRot.y * Math.PI / 180.0);
        const cRighRoll = cRight.multiply(Math.cos(rRad)).subtract(cUp.multiply(Math.sin(rRad)));
        const cUpRoll = cUp.multiply(Math.sin(rRad)).add(cUp.multiply(Math.cos(rRad)));

        const pt3DZero = cPos.add(cForward.multiply(1.0));
        const pt3D = pt3DZero.add(cRighRoll.add(cUpRoll));
        
        const pt2D = this.getWorld3DToScreen(pt3D);
        const pt2DZero = this.getWorld3DToScreen(pt3DZero);

        const scaleX = (cursor.x - pt2DZero.x) / (pt2D.x - pt2DZero.x);
        const scaleY = (cursor.y - pt2DZero.y) / (pt2D.y - pt2DZero.y);

        const pt3DRet = pt3DZero.add(cRighRoll.multiply(scaleX).add(cUpRoll.multiply(scaleY)));
        const forwardDirection = cForward.add(cRighRoll.multiply(scaleX).add(cUpRoll.multiply(scaleY)));

        return [pt3DRet, forwardDirection];
    }

}