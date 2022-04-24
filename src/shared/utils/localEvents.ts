export abstract class LocalEvents {
	private static handlers: { [eventName: string]: ((...args: unknown[]) => void)[] } = {};

	public static on(eventName: string, handler: { (...args: unknown[]): any }): void {
		if (!this.handlers[eventName]) {
			this.handlers[eventName] = [handler];
		} else {
			this.handlers[eventName].push(handler);
		}
	}

	public static off(eventName: string, handler: { (...args: unknown[]): any }): void {
		this.handlers[eventName] = this.handlers[eventName]?.filter(h => h !== handler) || [];
	}

	public static emit(eventName: string, ...args: unknown[]): void {
		for (const handler of this.handlers[eventName]) {
			handler(...args);
		}
	}
}
