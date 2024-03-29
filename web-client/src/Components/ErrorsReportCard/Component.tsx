/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React, { useEffect, useState } from "react";
import {
  EuiText,
  EuiFlexItem,
  EuiAccordion,
  EuiFlexGroup,
  EuiBasicTable,
  EuiLoadingSpinner,
} from "fury-design-system";
// eslint-disable-next-line import/no-extraneous-dependencies
import moment from "moment";
import { observer } from "mobx-react";
import useErrorHandler from "../../Hooks/UseErrorHandler";
import LocalizedText from "./LocalizedText";
import { ErrorsReportCardComponentProps } from "./types";

import "./Style.scss";

function getTimeString(time: moment.Moment) {
  const currentServerTime = moment().utc();
  switch (currentServerTime.diff(time.utc(), "days")) {
    case 0:
      if (currentServerTime.date() !== time.utc().date()) {
        return "Yesterday";
      }

      return "Today";
    case 1:
      if (currentServerTime.subtract(1, "days").date() === time.utc().date()) {
        return "Yesterday";
      }

      return time.format("Do MMMM");
    default:
      return time.format("Do MMMM");
  }
}

function getRelativeTime(healthCheckTime: moment.Moment) {
  const currentServerTime = moment().utc();
  const isToday =
    currentServerTime.diff(healthCheckTime.utc(), "days") === 0 &&
    currentServerTime.utc().date() === healthCheckTime.utc().date();

  if (isToday) {
    // Returning diff times in hours and minutes because
    // the momentjs .from() method does not support it together
    const diffInMinutes = moment().utc().diff(healthCheckTime.utc(), "minutes");
    if (diffInMinutes > 60) {
      const diff = moment().utc().diff(healthCheckTime.utc());
      if (moment(diff).utc().minutes() === 0) {
        return LocalizedText.singleton.timeInHours(moment(diff).utc().hours());
      }
      return LocalizedText.singleton.timeInHoursAndMinutes(
        moment(diff).utc().hours(),
        moment(diff).utc().minutes()
      );
    }
    return LocalizedText.singleton.timeInMinutes(diffInMinutes);
  }
  return `${healthCheckTime.format("HH:mm")} UTC`;
}

function ErrorsReportCardComponent(props: ErrorsReportCardComponentProps) {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { accordionOpen, errorHealthCheckCountByDay, errorsReportChecksStore } =
    props;

  useErrorHandler(error);

  function loadList() {
    errorsReportChecksStore
      .errorsReportChecksListGetAll()
      .then(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
      });
  }

  useEffect(() => {
    if (accordionOpen) {
      loadList();
    }
  }, [accordionOpen]);

  return (
    <>
      <div className="error-card">
        <EuiFlexGroup direction="column" gutterSize="none">
          <EuiFlexGroup
            direction="row"
            responsive={false}
            className="error-card__header"
            gutterSize="none"
          >
            <EuiFlexItem grow={1}>
              <EuiText
                size="s"
                className="error-card__date"
                textAlign="left"
                color="subdued"
              >
                <strong>
                  {getTimeString(errorHealthCheckCountByDay.dayDate)}
                </strong>
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem grow={1}>
              <EuiText
                size="xs"
                className="error-card__issues-qt"
                textAlign="right"
              >
                <strong>
                  {LocalizedText.singleton.issuesNumber(
                    errorHealthCheckCountByDay.count
                  )}
                </strong>
              </EuiText>
            </EuiFlexItem>
          </EuiFlexGroup>
          <EuiFlexItem className="error-card__accordion-container">
            <EuiAccordion
              id={`${errorsReportChecksStore.id}-accordion`}
              arrowDisplay="right"
              initialIsOpen={accordionOpen}
              buttonContent={
                accordionOpen
                  ? LocalizedText.singleton.close
                  : LocalizedText.singleton.open
              }
              className="error-card__accordion"
              buttonClassName="error-card__accordion-button"
              onToggle={(isOpen) => {
                if (
                  isOpen &&
                  typeof props.errorsReportChecksStore
                    .errorsReportChecksList === "undefined"
                ) {
                  loadList();
                }
              }}
            >
              {isLoading ? (
                <>
                  <EuiText textAlign="center">
                    {" "}
                    {LocalizedText.singleton.loading}{" "}
                  </EuiText>
                  <EuiText textAlign="center">
                    <EuiLoadingSpinner size="l" />
                  </EuiText>
                </>
              ) : (
                <>
                  <EuiBasicTable
                    className="error-card__table"
                    tableLayout="auto"
                    responsive={false}
                    // textOnly={true}
                    columns={[
                      {
                        field: "target",
                        name: LocalizedText.singleton.service,
                      },
                      {
                        field: "checkName",
                        name: LocalizedText.singleton.checkType,
                      },
                      { field: "date", name: LocalizedText.singleton.when },
                    ]}
                    items={
                      errorsReportChecksStore.errorsReportChecksList
                        ? errorsReportChecksStore.errorsReportChecksList.map(
                            (issueElem) => {
                              return {
                                target: issueElem.target,
                                checkName: issueElem.checkName,
                                date: getRelativeTime(issueElem.completedAt),
                              };
                            }
                          )
                        : []
                    }
                  />
                </>
              )}
            </EuiAccordion>
          </EuiFlexItem>
        </EuiFlexGroup>
      </div>
    </>
  );
}

export default observer(ErrorsReportCardComponent);
