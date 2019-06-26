import React from "react";
import { Route } from "react-router-dom";
import { routes } from "../routes";

const Client = () => (
  <>
    {/* {Object.keys(routes)
      .filter(k => routes[k].router)
			.map(k => routes[k].router())} */}

    {Object.keys(routes)
      .filter(k => routes[k].path !== "")
      .map(k => {
        const route = routes[k];

				console.log("adding routes", route)
        return <Route key={k} exact={route.isExact} path={route.path} component={route.component} />;
      })}
  </>
);

export default Client;
