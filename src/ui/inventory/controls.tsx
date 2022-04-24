import React, { useEffect } from "react";
import { useContext } from "react";
import { DndContext } from ".";

const Controls: React.FC = () => {
	const dnd = useContext(DndContext);

	useEffect(() => {
		let previous = dnd.quantity;

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key == "Control" && +dnd.quantity < Number.MAX_SAFE_INTEGER) {
				previous = dnd.quantity;
				dnd.setQuantity(Number.MAX_SAFE_INTEGER.toString());
			}
		};
		window.addEventListener("keydown", onKeyDown);

		const onKeyUp = (e: KeyboardEvent) => {
			if (e.key == "Control") {
				dnd.setQuantity(previous);
			}
		};
		window.addEventListener("keyup", onKeyUp);

		return () => {
			window.removeEventListener("keydown", onKeyDown);
			window.removeEventListener("keyup", onKeyUp);
		};
	}, []);

	return (
		<div id="controls">
			{+dnd.quantity >= Number.MAX_SAFE_INTEGER ? (
				<div className="all">Tout</div>
			) : (
				<input type="number" name="quantity" id="quantity" value={dnd.quantity} onChange={e => dnd.setQuantity(e.target.value)} />
			)}

			<button
				onMouseLeave={() => dnd.setDraggingOver(undefined)}
				onMouseEnter={() => dnd.setDraggingOver("use")}
				style={{ backgroundColor: !!dnd.draggingItem && dnd.draggingOver == "use" ? "#17191d88" : "#17191dc2" }}>
				Utiliser
			</button>
			<button
				onMouseLeave={() => dnd.setDraggingOver(undefined)}
				onMouseEnter={() => dnd.setDraggingOver("give")}
				style={{ backgroundColor: !!dnd.draggingItem && dnd.draggingOver == "give" ? "#17191d88" : "#17191dc2" }}>
				Donner
			</button>
			<button
				onMouseLeave={() => dnd.setDraggingOver(undefined)}
				onMouseEnter={() => dnd.setDraggingOver("throw")}
				disabled={!dnd.canThrow}
				style={{ backgroundColor: !!dnd.draggingItem && dnd.draggingOver == "throw" ? "#17191d88" : "#17191dc2" }}>
				{dnd.canThrow ? (
					<span>Détruire</span>
				) : (
					<svg height="32%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
						<circle cx="50" cy="50" r="40" fill="none" strokeWidth="10" />
						<circle className="progress" cx="50" cy="50" r="40" fill="none" strokeWidth="10" />
					</svg>
				)}
			</button>
		</div>
	);
};

export default Controls;
