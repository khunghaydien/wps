import React from 'react';

import styled from 'styled-components';

import { TIME_TRACK_REQUEST_COMPACT } from '@commons/constants/customEventSource';

import HistoryDialog from '../../../containers/HistoryDialogContainer';
import RequestDialog from '../../../containers/RequestDialogContainer';
import Chart from '../../../containers/TrackSummary/ChartContainer';
import ApprovalHistoryButton from '../../../containers/TrackSummary/RequestCompact/ApprovavlHistoryButtonContainer';
import CardHeader from '../../../containers/TrackSummary/RequestCompact/CardHeaderContainer';
import SubmitButton from '../../../containers/TrackSummary/SubmitButtonContainer';
import SummaryTable, {
  Column as SummaryColumn,
} from '../../../containers/TrackSummary/SummaryTableContainer';

import { Body, Divider } from '../Card';
import { Card, Row } from '../Layout';

type Props = {
  /**
   * Indicates request feature is enabled or not.
   */
  useRequest: boolean;
  /**
   * A Flag for testing.
   */
  isOpenByDefault?: boolean;
};

const Column = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  min-height: 138px;
`;

const Spacer = styled.div`
  content: ' ';
  height: 12px;
`;

const Block = styled.div`
  margin: 0 20px 0 0;
`;

const S = {
  Card: styled(Card as React.ComponentType)`
    padding: 0 20px;
  ` as typeof Card,

  Body: styled(Body as React.ComponentType)`
    padding: 20px 0 20px 0 !important;
  ` as typeof Body,

  Divider: styled(Divider as React.ComponentType)`
    margin: 0 !important;
  ` as typeof Divider,
};

const RequestCompact = ({ useRequest, isOpenByDefault = false }: Props) => {
  return (
    <>
      <S.Card header={CardHeader} defaultOpen={isOpenByDefault}>
        <S.Divider />
        <S.Body>
          <Row noMargin align="start">
            <Chart />
            <Column>
              <SummaryTable column={SummaryColumn.Request} />
              {useRequest && (
                <React.Fragment key="request">
                  <Spacer />
                  <Row noMargin>
                    <Block>
                      <ApprovalHistoryButton />
                    </Block>
                    <SubmitButton />
                  </Row>
                </React.Fragment>
              )}
            </Column>
          </Row>
        </S.Body>
      </S.Card>
      <RequestDialog source={TIME_TRACK_REQUEST_COMPACT} />
      <HistoryDialog />
    </>
  );
};

export default RequestCompact;
