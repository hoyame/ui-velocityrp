import React from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import Hud from "./apps/hud";
import Main from "./main/main";

import { useDispatch } from "react-redux";
import "./app.scss";
import CarDealer from "./apps/cardealer";
import Context from "./apps/context";
import Shop from "./apps/store";
import Menu from "./apps/menu";

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
			<Switch>
				<Route path="/main" component={Main} />
				<Route path="/cardealer" component={CarDealer} />
				<Route path="/context" component={Context} />
				<Route path="/shop" component={Shop} />			
				<Route path="/menu" component={Menu} />			
			</Switch>
			{/* <Hud /> */}
		</React.Fragment>
	);
};

export default App;
