import { MutableRefObject, useEffect, useRef } from "react";

const noop = () => {};

interface NuiMessageData<T = unknown> {
	action: string;
	data: T;
}

type NuiHandlerSignature<T> = (data: T) => void;

/**
 * A hook that manage events listeners for receiving data from the client scripts
 * @param action The specific `action` that should be listened for.
 * @param handler The callback function that will handle data relayed by this hook
 *
 * @example
 * useNuiEvent<{visibility: true, wasVisible: 'something'}>('setVisible', (data) => {
 *   // whatever logic you want
 * })
 *
 **/

export const useNuiEvent = <T = any>(action: string, handler: (data: T) => void) => {
	const savedHandler: MutableRefObject<NuiHandlerSignature<T>> = useRef(noop);

	// Make sure we handle for a reactive handler
	useEffect(() => {
		savedHandler.current = handler;
	}, [handler]);

	useEffect(() => {
		const eventListener = (event: any) => {
			const { action: eventAction, data } = event.data;

			if (savedHandler.current) {
				if (eventAction === action) {
					savedHandler.current(data);
				}
			}
		};

		window.addEventListener("message", eventListener);
		// Remove Event Listener on component cleanup
		return () => window.removeEventListener("message", eventListener);
	}, [action]);
};

//

/**
 * Simple wrapper around fetch API tailored for CEF/NUI use. This abstraction
 * can be extended to include AbortController if needed or if the response isn't
 * JSON. Tailor it to your needs.
 *
 * @param eventName - The endpoint eventname to target
 * @param data - Data you wish to send in the NUI Callback
 *
 * @return returnData - A promise for the data sent back by the NuiCallbacks CB argument
 */

export async function fetchNui<T = any>(eventName: string, data?: any): Promise<T> {
	const options = {
		method: "post",
		headers: {
			"Content-Type": "application/json; charset=UTF-8",
		},
		body: JSON.stringify(data),
	};

	const resourceName = (window as any).GetParentResourceName ? (window as any).GetParentResourceName() : "nui-frame-app";

	const resp = await fetch(`https://${resourceName}/${eventName}`, options);

	const respFormatted = await resp.json();

	return respFormatted;
}
