import React from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import Hud from "./apps/hud";
import Main from "./main/main";

import { useDispatch } from "react-redux";
import "./app.scss";
import CarDealer from "./apps/cardealer";
import Context from "./apps/context";
import Store from "./apps/store";
import Menu from "./apps/menu";
import Separator from "./apps/separator";
import InteractionMenu from "./apps/interaction";

const App: React.FC = () => {
	const history = useHistory();
	const dispatch = useDispatch();

	const onMessage = (event: any) => {
		if (event.data.path != undefined) history.push(event.data.path);
		if (event.data.action != undefined) dispatch(event.data.action);
	};

	React.useEffect(() => {
		window.addEventListener("message", onMessage);
		return () => window.removeEventListener("message", onMessage);
	});

	return (
		<React.Fragment>	
			<div style={{position: "absolute", height: '100%', width: '100%', zIndex: 99}}>	
				<Switch>
					<Route path="/main" component={Main} />
					<Route path="/cardealer" component={CarDealer} />
					<Route path="/context" component={Context} />
					<Route path="/store" component={Store} />			
					<Route path="/menu" component={Menu} />			
					<Route path="/separator" component={Separator} />			
					<Route path="/interaction" component={InteractionMenu} />			
				</Switch>
			</div>

			<Hud />
		</React.Fragment>
	);
};

export default App;
