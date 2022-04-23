import React, { useContext } from "react";
import { DndContext } from ".";
import { ItemsConfig } from "../../shared/config/items";
import { IInventoryItem } from "../../shared/player/inventory";
import { Item } from "./item";

interface ItemListProps {
	dragName: string;
	title: string;
	items?: IInventoryItem[];
	maxWeight: number;
}

const ItemList: React.FC<ItemListProps> = props => {
	const dnd = useContext(DndContext);

	const scrollbarWidth = 8;
	const controlsWidth = Math.ceil(window.innerHeight * 0.22);
	const itemWidthWithMargin = window.innerHeight * 0.124;
	const maxWidth = (window.innerWidth - controlsWidth - scrollbarWidth) / 2 - scrollbarWidth;
	const cols = Math.min(5, Math.floor(maxWidth / itemWidthWithMargin));
	const width = cols * itemWidthWithMargin;

	const itemHeightWithMargin = window.innerHeight * 0.1365;
	const maxHeight = window.innerHeight * 0.8;
	const rows = Math.floor(maxHeight / itemHeightWithMargin);
	const height = rows * itemHeightWithMargin;

	if (!props.items)
		return (
			<div
				style={{
					width: Math.ceil(width) + scrollbarWidth + "px",
				}}></div>
		);

	const items = props.items
		.sort((i1, i2) => {
			if (i2.itemId == "money") return 1;
			if (i2.itemId == "saleMoney" && i1.itemId != "money") return 1;
			if (i1.itemId == "money") return -1;
			if (i1.itemId == "saleMoney" && i2.itemId != "money") return -1;
			return i1.itemId.toString().localeCompare(i2.itemId.toString());
		})
		.map((item, index) => <Item key={index} item={item} container={props.dragName} />);

	const placeholders = items.length < rows * cols ? rows * cols - items.length : cols - (items.length % cols);
	for (let i = 0; i < placeholders; i++) {
		items.push(<div key={1000 + i} className="item placeholder"></div>);
	}

	const totalWeight = props.items.reduce((totalWeight, item) => totalWeight + (ItemsConfig[item.itemId]?.weight || 0) * item.quantity, 0);

	return (
		<div onMouseLeave={() => dnd.setDraggingOver(undefined)} onMouseEnter={() => dnd.setDraggingOver(props.dragName)}>
			<div className="title">
				<h1>{props.title}</h1>
				<h2>
					{Math.roundTo(totalWeight, 2)}/{props.maxWeight}kg
				</h2>
			</div>
			<div
				className="item-grid"
				style={{
					width: Math.ceil(width) + scrollbarWidth + "px",
					height: Math.ceil(height) + "px",
					opacity: !!dnd.draggingItem && dnd.draggingFrom != dnd.draggingOver && dnd.draggingOver == props.dragName ? 0.8 : 1,
				}}>
				{items}
			</div>
		</div>
	);
};

export default ItemList;
