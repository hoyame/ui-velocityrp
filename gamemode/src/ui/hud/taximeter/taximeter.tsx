import React from "react";
import "./taximeter.scss";

const Taximeter: React.FC = () => {
	const [state, setState] = React.useState<number | undefined>(undefined);

	const onMessage = (event: any) => {
		if (event.data.type == "taximeter") {
			setState(event.data.data);
		}
	};

	React.useEffect(() => {
		window.addEventListener("message", onMessage);
		return () => window.removeEventListener("message", onMessage);
	});

	if (state == undefined) return <React.Fragment />;

	return (
		<div id="meter">
			<div id="fare">
				<div className="container">
					<div id="fare-amount" className="meter-field fare">
						{Math.roundTo(state, 2)} $
					</div>
					<div className="label">Prix</div>
				</div>
				<div className="container">
					<div id="rate" className="meter-field rate">
						2$/km
					</div>
					<div className="label">Tarif</div>
				</div>
			</div>
		</div>
	);
};

export default Taximeter;
