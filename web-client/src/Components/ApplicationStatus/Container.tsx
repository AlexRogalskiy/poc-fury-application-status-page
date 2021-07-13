/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React, {useState} from "react";
import {releaseNumber} from "../../constants";
import {createStateHandler} from "../../Services/createStateHandler";
import ApplicationStatusComponent from "./Component";
import {logger} from "../../Services/Logger";
import {makeServer} from "../../Services/Mocks/MakeServer";
import {StateManager} from "fury-component/dist/State/types";
import {IStateHandler} from "../types";
import {MocksScenario} from "../../Services/Mocks/types";

interface ApplicationStatusContainerProps {
  apiUrl?: string;
  groupLabel: string;
  groupTitle?: string;
}

function getBasePath(stateHandler: StateManager<IStateHandler>) {
  if (stateHandler.getBasePath) {
    return stateHandler.getBasePath();
  }

  return "";
}

function getIsMocked(stateHandler: StateManager<IStateHandler>): boolean {
  if (stateHandler.getMocked) {
    return stateHandler.getMocked();
  }

  return process.env.APP_ENV === "development";
}

const ApplicationStatusContainer = (props: ApplicationStatusContainerProps) => {
  const stateHandler = createStateHandler();

  if(props.apiUrl) {
    stateHandler.setState({
      apiurl: props.apiUrl,
      grouplabel: props.groupLabel,
      grouptitle: props.groupTitle
    })

  }

  logger.info(JSON.stringify(stateHandler.getState()));

  const [currentLanguage] = useState<string>(stateHandler.getLanguage());
  const [basePath] = useState<string>(getBasePath(stateHandler));
  const [apiUrl] = useState<string>(stateHandler.getState().apiurl);
  const [groupLabel] = useState<string>(stateHandler.getState().grouplabel);
  const [groupTitle] = useState<string | undefined>(stateHandler.getState()?.grouptitle);
  const isMocked = getIsMocked(stateHandler);

  if (isMocked) {
    logger.info(stateHandler.getState().apiurl);
    makeServer({ environment: "development" }, stateHandler.getState().apiurl, MocksScenario.scenario1)
  }

  return (
    <>
      <ApplicationStatusComponent
        language={currentLanguage}
        releaseNumber={releaseNumber}
        basePath={basePath}
        apiUrl={apiUrl}
        groupLabel={groupLabel}
        groupTitle={groupTitle}
      />
    </>
  );
};

export default ApplicationStatusContainer;
