import React, {useContext} from "react";
import {ApplicationContext} from "./Container";
import {BrowserRouter as Router, Route, RouteComponentProps, Switch} from "react-router-dom";
import {TargetHealthChecks} from "../TargetHealthChecks";
import {Targets} from "../Targets";
import {ApplicationStatusRouteParams} from "./types";
import {logger} from "../../Services/Logger";

export default function ApplicationStatusRouterFactory() {
  const appContextData = useContext(ApplicationContext);

  logger.info(JSON.stringify(appContextData));

  if (appContextData.targetLabel) {
    const targetLabel = appContextData.targetLabel ?? "";

    return (
      <Router>
        <Switch>
          <Route
            path={`${appContextData.basePath}`}
            component={() =>
              <TargetHealthChecks
                target={targetLabel}
                targetTitle={appContextData.targetTitle}
                standalone
              />
            }
          />
        </Switch>
      </Router>
    )
  }

  return (
    <Router>
      <Switch>
        <Route
          path={`${appContextData.basePath}/:target`}
          component={(propsRoute: RouteComponentProps<ApplicationStatusRouteParams>) =>
            <TargetHealthChecks target={propsRoute.match.params.target} />
          }
        />
        <Route
          path={`${appContextData.basePath}/`}
          component={() => <Targets />}
        />
      </Switch>
    </Router>
  )
}
