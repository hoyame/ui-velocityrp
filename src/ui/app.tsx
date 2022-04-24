import React from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import Hud from "./hud";
import Main from "./main/main";

import { useDispatch } from "react-redux";
import "./app.scss";

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
			</Switch>
			<Hud />
		</React.Fragment>
	);
};

export default App;
