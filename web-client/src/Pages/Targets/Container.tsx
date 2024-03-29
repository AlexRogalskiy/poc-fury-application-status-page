/*
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React, { useContext, useState } from "react";
import TargetStatusComponent from "./Component";
import ApplicationContext from "../../ExportedComponents/ApplicationStatus/Context";
import withErrorWrapper from "../../Components/ErrorWrapper";
import TargetsStore from "../../Stores/Targets";

function TargetsContainer() {
  const appContextData = useContext(ApplicationContext);
  const [targetsStore] = useState<TargetsStore>(
    new TargetsStore(
      appContextData.apiUrl,
      appContextData.groupLabel,
      appContextData.cascadeFailure
    )
  );

  return (
    <>{targetsStore && <TargetStatusComponent targetsStore={targetsStore} />}</>
  );
}

export default withErrorWrapper(TargetsContainer);
