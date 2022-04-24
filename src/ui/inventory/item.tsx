import React, { useContext } from "react";
import { IInventoryItem } from "../../shared/player/inventory";
import { ItemsConfig } from "../../shared/config/items";
import { DndContext } from ".";

export interface ItemProps {
	item?: IInventoryItem;
	container?: string;
}

export const Item: React.FC<ItemProps> = props => {
	const dnd = useContext(DndContext);

	if (!props.item) return <div className="item placeholder"></div>;

	const onMouseDown = () => {
		dnd.setDraggingFrom(props.container);
		dnd.setDraggingItem(props.item);
	};

	return (
		<div
			className={`item ${dnd.draggingItem?.itemId == props.item.itemId && dnd.draggingFrom == props.container ? "dragging" : ""}`}
			onMouseDown={onMouseDown}
		>
			<div>{props.item.quantity}</div>
			<img src={`items/${props.item.itemId}.png`} />
			<div>{props.item?.metadatas?.renamed || ItemsConfig[props.item.itemId]?.name}</div>
		</div>
	);
};
