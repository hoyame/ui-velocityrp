import { Nui } from "./nui";

interface INotification {
    id: number;
    title: string;
    message: string;
    timeout: number;
    advanced?: boolean;
    url?: string;
}

export const notif = () => {
    SendNuiMessage(JSON.stringify({ type: "notification", data: {
        id: 1,
        title: "Notification 1",
        message: "This is a notification",
        advanced: true,
        timeout: 5000
    }}));
}