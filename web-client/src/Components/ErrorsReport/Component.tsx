/**
 * Copyright (c) 2021 SIGHUP s.r.l All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

import React, {useContext, useEffect, useState} from "react";
import {ErrorsReportComponentProps} from "./types";
import {ApplicationContext} from "../ApplicationStatus/Container";
import useErrorHandler from "../../Hooks/UseErrorHandler";
import {LocalizedText} from "./LocalizedText";
import {
  EuiEmptyPrompt,
  EuiLoadingSpinner,
  EuiPage,
  EuiSpacer,
  EuiPageBody,
  EuiText, EuiIcon
} from "fury-design-system";
import {ResponsiveHeader} from "../ResponsiveHeader";
import {observer} from "mobx-react";
import {ErrorsReportCard} from "../ErrorsReportCard";

export default observer(ErrorsReportComponent);

function ErrorsReportComponent(props: ErrorsReportComponentProps) {
  const appContextData = useContext(ApplicationContext);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  let reportDays: number = props.errorsReportStore.errorsReportChecksCountList.length;

  useErrorHandler(error);

  useEffect(() => {
    props.errorsReportStore.errorsReportChecksCountListGetAll()
      .then(() => {
        setIsLoading(false);
      })
      .catch(err => {
        setError(err);
      })
  }, [])


  return (
    <>
      {
        isLoading
          ? <EuiEmptyPrompt
            title={<h4> {LocalizedText.singleton.loading} </h4>}
            body={<EuiLoadingSpinner size="xl"/>}
          />
          : <EuiPage paddingSize="none" restrictWidth={true}>
            <EuiPageBody>
              <ResponsiveHeader context={appContextData} pageName={props.pageName}/>
              <EuiSpacer size="xxl"/>
              <div style={{width: '100%', maxWidth: 600, margin: '0 auto'}}>
                {
                  props.errorsReportStore.errorsReportChecksCountList.length > 0 ?
                    <>
                      <div style={{padding: '0 16px'}}>
                        <EuiText size="m" color="subdued" textAlign="left">
                          <i>{
                            reportDays > 1
                              ? LocalizedText.singleton.errorsReportSubtitleMultiple(reportDays)
                              : LocalizedText.singleton.errorsReportSubtitleSingle
                          }</i>
                        </EuiText>
                        <EuiSpacer size="l"/>
                      </div>
                      {
                        props.errorsReportStore.errorsReportChecksCountList.map((errorReportChecksElem, index) => {
                          return (
                            <React.Fragment key={`errorCheckList-${index}`}>
                              <ErrorsReportCard
                                accordionOpen={index === 0}
                                errorHealthCheckCountByDay={errorReportChecksElem}
                              />
                            </React.Fragment>
                          );
                        })
                      }
                      <EuiSpacer size="m"/>
                      <EuiText size="s" color="subdued" textAlign="center">
                        <i>{LocalizedText.singleton.endOfReport}</i>
                      </EuiText>
                      <EuiSpacer size="m"/>
                    </>
                    :
                    <div style={{margin: 'auto auto'}}>
                      <EuiEmptyPrompt
                        title={
                          <EuiIcon size="xl" type="faceHappy"/>
                        }
                        body={<><h3>{LocalizedText.singleton.noOutagesTitle}</h3><p>{LocalizedText.singleton.noOutagesSubTitle}</p></>}/>
                    </div>
                }
              </div>
            </EuiPageBody>
          </EuiPage>
      }
    </>
  )
}