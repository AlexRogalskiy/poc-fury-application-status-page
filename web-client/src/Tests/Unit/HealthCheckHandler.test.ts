/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import makeServer from "../../Services/Mocks/MakeServer";
import {
  MockedServerBaseFactories,
  MockedServerBaseModels,
  MocksScenario,
} from "../../Services/Mocks/types";
import { Server } from "miragejs/server";
import { Registry } from "miragejs/-types";
import seedsGenerator from "../../Services/Mocks/Seeds/Generator";
import { Target, TargetHealthCheck } from "../../Components/types";
import {
  getAllHealthChecksByGroup,
  getAllHealthChecksByGroupAndTarget,
} from "../../Services/Mocks/IO";
import HealthCheckHandler from "../../Services/HealthCheckHandler";
// @ts-ignore
import moment from "moment";

const url = "https://dummy.local";

describe("HealthCheckHandler - scenario 1", () => {
  let server: Server<
    Registry<MockedServerBaseModels, MockedServerBaseFactories>
  >;

  beforeEach(() => {
    server = makeServer(
      { environment: "test" },
      url,
      MocksScenario.scenario1,
      "/"
    );

    seedsGenerator(MocksScenario.scenario1)(server);
  });

  afterEach(() => {
    server.shutdown();
  });

  it("groupByTarget", () => {
    const cascadeFailure = 1;
    const requestDataFromMocks = getAllHealthChecksByGroup(server.schema);
    const healthCheckHandler = new HealthCheckHandler(
      requestDataFromMocks,
      cascadeFailure
    );

    const expectedValue: Target[] = [
      {
        failedChecks: 1,
        status: "Failed",
        target: "Ratings",
        totalChecks: 2,
      },
      {
        failedChecks: 0,
        status: "Complete",
        target: "Details",
        totalChecks: 2,
      },
      {
        failedChecks: 0,
        status: "Complete",
        target: "Product",
        totalChecks: 2,
      },
    ];

    const receivedValue = healthCheckHandler.groupByTarget();

    expect(receivedValue).toEqual(expectedValue);
  });

  it("groupByCheckName - Ratings", () => {
    const targetLabel = "Ratings";
    const requestDataFromMocks = getAllHealthChecksByGroupAndTarget(
      server.schema,
      targetLabel
    );
    const healthCheckHandler = new HealthCheckHandler(requestDataFromMocks);

    const expectedValue: TargetHealthCheck[] = [
      {
        checkName: "http-status-check",
        status: "Failed",
        target: "Ratings",
        lastCheck: moment("2021-07-13T18:06:03Z"),
        lastIssue: moment("2021-07-13T18:06:03Z"),
      },
      {
        checkName: "service-endpoints-check",
        status: "Complete",
        target: "Ratings",
        lastCheck: moment("2021-07-13T18:08:07Z"),
        lastIssue: undefined,
      },
    ];

    const receivedValue = healthCheckHandler.groupByCheckName();

    expect(receivedValue).toEqual(expectedValue);
  });
});

describe("HealthCheckHandler - scenario 2", () => {
  let server: Server<
    Registry<MockedServerBaseModels, MockedServerBaseFactories>
  >;

  beforeEach(() => {
    server = makeServer(
      { environment: "test" },
      url,
      MocksScenario.scenario2,
      "/"
    );

    seedsGenerator(MocksScenario.scenario2)(server);
  });

  afterEach(() => {
    server.shutdown();
  });

  it("groupByTarget", () => {
    const cascadeFailure = 1;
    const requestDataFromMocks = getAllHealthChecksByGroup(server.schema);
    const healthCheckHandler = new HealthCheckHandler(
      requestDataFromMocks,
      cascadeFailure
    );

    const expectedValue: Target[] = [
      {
        failedChecks: 0,
        status: "Complete",
        target: "Details",
        totalChecks: 2,
      },
      {
        failedChecks: 0,
        status: "Complete",
        target: "Product",
        totalChecks: 2,
      },
      {
        failedChecks: 0,
        status: "Complete",
        target: "Ratings",
        totalChecks: 2,
      },
    ];

    const receivedValue = healthCheckHandler.groupByTarget();

    expect(receivedValue).toEqual(expectedValue);
  });

  it("groupByCheckName - Details", () => {
    const targetLabel = "Details";
    const requestDataFromMocks = getAllHealthChecksByGroupAndTarget(
      server.schema,
      targetLabel
    );
    const healthCheckHandler = new HealthCheckHandler(requestDataFromMocks);

    const expectedValue: TargetHealthCheck[] = [
      {
        checkName: "http-status-check",
        status: "Complete",
        target: "Details",
        lastCheck: moment("2021-07-13T18:05:08Z"),
        lastIssue: undefined,
      },
      {
        checkName: "service-endpoints-check",
        status: "Complete",
        target: "Details",
        lastCheck: moment("2021-07-13T18:08:07Z"),
        lastIssue: undefined,
      },
    ];

    const receivedValue = healthCheckHandler.groupByCheckName();

    expect(receivedValue).toEqual(expectedValue);
  });
});
