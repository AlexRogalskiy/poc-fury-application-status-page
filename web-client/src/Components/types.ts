/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Moment } from "moment";

export interface IStateHandler {
  apiurl: string;
  cascadefailure: number;
  grouplabel: string;
  grouptitle?: string;
  targetlabel?: string;
  targettitle?: string;
}

export type HealthCheckStatus = "Complete" | "Failed";

export interface IHealthCheck {
  status: HealthCheckStatus;
  group: string;
  target: string;
  startTime: string;
  completedAt: string;
  duration: string;
  namespace: string;
  podName: string;
  owner: string;
  checkName: string;
  error: string;
}

export interface IErrorHealthCheckCountByDay {
  dayDate: string;
  count: number;
}

export interface ServerResponse<T> {
  data: T;
  errorMessage: string;
}

export type HealthCheckResponse = ServerResponse<IHealthCheck[]>;
export type ErrorHealthCheckCountByDayResponse = ServerResponse<
  IErrorHealthCheckCountByDay[]
>;

export interface Target {
  status: HealthCheckStatus;
  target: string;
  failedChecks: number;
  totalChecks: number;
}

export interface TargetHealthCheck {
  completedAt?: string;
  checkName: string;
  status: HealthCheckStatus;
  target: string;
  lastCheck: Moment;
  lastIssue?: Moment;
  error?: string;
}

export interface ErrorHealthCheckCountByDay
  extends Omit<IErrorHealthCheckCountByDay, "dayDate"> {
  dayDate: Moment;
}

export interface Config {
  apiUrl: string;
  cascadeFailure: number;
  groupLabel: string;
  groupTitle?: string;
  targetLabel?: string;
  targetTitle?: string;
}

export interface ErrorsReportCheck {
  completedAt: Moment;
  checkName: string;
  target: string;
}
