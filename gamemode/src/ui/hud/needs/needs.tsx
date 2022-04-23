import React from "react";
import ThirstIcon from "./assets/thirst.png";
import HungerIcon from "./assets/hunger.png";
import "./needs.scss";

const Needs: React.FC = () => {
	const [state, setState] = React.useState<{ thirst: number; hunger: number } | undefined>();

	const onMessage = (event: any) => {
		if (event.data.type == "needs") {
			setState(event.data.data);
		}
	};

	React.useEffect(() => {
		window.addEventListener("message", onMessage);
		return () => window.removeEventListener("message", onMessage);
	});

	if (!state) return <React.Fragment />;

	return (
		<div id="needs">
			<div className="hunger">
				<div className="progress" style={{ width: state.hunger + "%" }}></div>
				<div className="icon">
					<img src={HungerIcon} />
				</div>
			</div>
			<div className="thirst">
				<div className="progress" style={{ width: state.thirst + "%" }}></div>
				<div className="icon">
					<img src={ThirstIcon} />
				</div>
			</div>
		</div>
	);
};

export default Needs;
