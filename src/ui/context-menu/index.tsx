import React from "react";
import { useReduxState } from "../store";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import "./index.scss";

const ContextMenu: React.FC = () => {
	const state = useReduxState(state => state.contextMenu);
	const dispatch = useDispatch();
	const history = useHistory();

	const hideMenu = () => {
		history.push("");
		dispatch({ type: "SET_CONTEXT_MENU", payload: {} });
		fetch(`https://${location.hostname.replace("cfx-nui-", "")}/disableFocus`, {
			method: "POST",
		});
	};

	const onClick = (action: string, target: number) => {
		hideMenu();
		fetch(`https://${location.hostname.replace("cfx-nui-", "")}/menuClick`, {
			method: "POST",
			body: JSON.stringify({ actionId: action, targetId: target }),
			headers: {
				"Content-Type": "application/json",
			},
		});
	};

	return (
		<div id="context-menu-container" style={{ opacity: !!state ? 1 : 0 }}>
			<ul className="menu menu-user">
				{state.items?.map((item, index) => (
					<li key={index} id={item.actionId} onClick={() => onClick(item.actionId, item.overrideTarget || state.target)}>
						<div>
							<img src={`menu/${item.overrideIcon || item.actionId}.png`} height="20" />
							{item.title}
						</div>
					</li>
				))}
			</ul>
			<span className="crosshair" onClick={hideMenu} />
		</div>
	);
};

export default ContextMenu;
