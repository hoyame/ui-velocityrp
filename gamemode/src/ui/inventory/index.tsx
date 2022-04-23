import React, { useState } from "react";
import Controls from "./controls";
import ItemList from "./item-list";
import { IInventoryItem } from "../../shared/player/inventory";
import { Item } from "./item";
import "./index.scss";
import { useReduxState } from "../store";

export const DndContext = React.createContext<{
	draggingItem?: IInventoryItem;
	draggingFrom?: string;
	draggingOver?: string;
	quantity?: string;
	setDraggingItem: (item: IInventoryItem) => void;
	setDraggingOver: (container: string) => void;
	setDraggingFrom: (container: string) => void;
	setQuantity: (qty: string) => void;
	canThrow: boolean;
}>(undefined);

const Inventory: React.FC = () => {
	const [draggingItem, setDraggingItem] = useState<IInventoryItem>();
	const [draggingFrom, setDraggingFrom] = useState<string>();
	const [draggingOver, setDraggingOver] = useState<string>();
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
	const [quantity, setQuantity] = useState("1");
	const [lastThrows, setLastThrows] = useState((JSON.parse(localStorage.getItem("lastThrows")) as [number, number]) || [0, 0]);
	const canThrow = Date.now() - lastThrows[0] > 30000;

	const mouseMove = (e: MouseEvent) => setMousePos({ x: e.x, y: e.y });
	const mouseUp = () => {
		if (!!draggingItem && !!draggingOver && draggingOver != draggingFrom) {
			if (draggingOver == "throw") {
				if (!canThrow) return;
				const last = [lastThrows[1], Date.now()];
				setLastThrows(last);
				localStorage.setItem("lastThrows", JSON.stringify(last));
			}

			fetch(`https://${location.hostname.replace("cfx-nui-", "")}/inventory-${draggingOver}`, {
				method: "POST",
				body: JSON.stringify({ itemId: draggingItem.itemId, quantity: Number(quantity) || 1, metadatas: draggingItem.metadatas }),
			});
		}
		setDraggingItem(undefined);
		setDraggingFrom(undefined);
	};

	React.useEffect(() => {
		window.addEventListener("mousemove", mouseMove);
		window.addEventListener("mouseup", mouseUp);
		return () => {
			window.removeEventListener("mousemove", mouseMove);
			window.removeEventListener("mouseup", mouseUp);
		};
	});

	const inventoryState = useReduxState(state => state.inventory);

	return (
		<DndContext.Provider
			value={{
				draggingItem: draggingItem,
				draggingFrom,
				draggingOver,
				quantity,
				setDraggingItem,
				setDraggingOver,
				setDraggingFrom,
				setQuantity,
				canThrow,
			}}>
			<div id="inventory">
				<div id="inventory-container">
					<ItemList dragName="take-item" title="Inventaire" items={inventoryState.items} maxWeight={inventoryState.maxWeight} />
					<Controls />
					<ItemList
						dragName="put-item"
						title={inventoryState.target?.name || ""}
						items={inventoryState.target?.items}
						maxWeight={inventoryState?.target?.maxWeight || 50}
					/>
					{!!draggingItem && (
						<div
							style={{
								position: "absolute",
								top: mousePos.y - window.innerHeight * 0.06625 + "px",
								left: mousePos.x - window.innerHeight * 0.06 + "px",
								pointerEvents: "none",
							}}>
							<Item item={draggingItem}></Item>
						</div>
					)}
				</div>
				<div className="blur-background"></div>
			</div>
		</DndContext.Provider>
	);
};

export default Inventory;
