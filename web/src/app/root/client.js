import React from "react";
import { routes } from "../routes";

const Client = () => (
  <>
    {Object.keys(routes)
      .filter(k => routes[k].router)
      .map(k => routes[k].router())}
  </>
);

export default Client;
