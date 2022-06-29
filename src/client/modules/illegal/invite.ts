export abstract class IllegalInviteManager {
    public static async initialize() {
        RegisterCommand('enterzebi', () => {
            SetFrontendActive(true)
            ActivateFrontendMenu(GetHashKey("FE_MENU_VERSION_JOINING_SCREEN"), true, -1)

            ReplaceHudColourWithRgba(117, 0, 0, 0, 0)
        }, false)

        RegisterCommand('exitzebi', () => {
            SetFrontendActive(false)
            SetMouseCursorVisibleInMenus(false)

        }, false)
    }
}