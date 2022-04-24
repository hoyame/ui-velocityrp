import React, { createRef, useState } from "react";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import { ItemsConfig } from "../../shared/config/items";
import { Loots, Tiers } from "../../shared/config/lootboxes";
import Sound from "./assets/case.mp3";
import "./index.scss";

const winningIndex = 45;

const Lootboxes: React.FC = () => {
	const [margin, setMargin] = useState(0);
	const audio = createRef<HTMLAudioElement>();
	const winningLoot = (useParams() as any).idx;
	const history = useHistory();

	const getRandomItems = () => {
		const items = [];
		for (let i = 0; i < 50; i++) {
			const lootIndex = i == winningIndex ? winningLoot : Math.randomRange(0, Loots.length - 1);

			items.push({
				tier: Loots[lootIndex].tier,
				description: !!Loots[lootIndex].money ? `${Loots[lootIndex].money}$` : ItemsConfig[Loots[lootIndex]?.item || ""].name,
				img: `items/${!!Loots[lootIndex].money ? "money" : Loots[lootIndex].item}.png`,
			});
		}
		return items;
	};
	const [state] = useState<{ items: any[] }>({ items: getRandomItems() });

	React.useEffect(() => {
		setTimeout(() => {
			audio.current?.play?.();
			setMargin(-6770);
			setTimeout(() => history.push("/"), 8000);
		}, 2500);
	}, []);

	const cases = React.useMemo(
		() =>
			state.items?.map((item, index) => (
				<div key={index} className="item-case">
					<div className={`bottom-skin bottom-skin${item.tier}`}>
						<b>{Tiers[item.tier].name}</b>
						{item.description}
					</div>
					<img src={item.img} className="item-case-image" />
				</div>
			)),
		state.items
	);

	return (
		<div className="raffle-roller">
			<div id="round-draw-pointer">
				<div id="round-draw-pointer-top"></div>
				<div id="round-draw-pointer-bot"></div>
				<div id="round-draw-pointer-mid"></div>
			</div>
			<div className="raffle-roller-holder">
				<div className="raffle-roller-container" style={{ marginLeft: `${margin}px` }}>
					{cases}
				</div>
			</div>
			<audio src={Sound} ref={audio} />
		</div>
	);
};

export default Lootboxes;
