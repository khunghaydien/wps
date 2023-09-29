import React from 'react';

import styled from 'styled-components';

import msg from '../../../../commons/languages';

import Navigation from '../../containers/TrackSummary/NavigationContainer';

import {
  Body,
  Card,
  Divider,
  Header,
  HeaderGroup,
  HeaderItem,
  Title,
} from './Card';
import { Row } from './Layout';
import { TransferProps } from './Props';
import StatusLabel from './StatusLabel';
import { Column } from './Summary';
import DataTable from './Transfer/DataTable';
import WorkHours from './WorkHours';

const DataBlock = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  min-height: 140px;
`;

const WorkingHoursPadding = styled.div`
  padding: 0 32px 0 0;
`;

const Transfer: React.FC<TransferProps> = (props: TransferProps) => {
  return (
    <Card>
      <Header>
        <Title>{msg().Time_Lbl_TrackSummaryTitle}</Title>
        <HeaderGroup>
          <HeaderItem>
            {props.useRequest && <StatusLabel status={props.status} />}
          </HeaderItem>
        </HeaderGroup>
      </Header>
      <Divider />
      <Body>
        <Row height="auto">
          <Row noMargin>
            <Navigation />
          </Row>
        </Row>
        <Row noMargin align="start" height="auto">
          <DataBlock>
            <DataTable
              data={props.data}
              column={Column.Transfer()}
              status={props.status}
              onSelect={props.onSelect}
            />
            <WorkingHoursPadding>
              <WorkHours data={props.data} />
            </WorkingHoursPadding>
          </DataBlock>
        </Row>
      </Body>
    </Card>
  );
};

export default Transfer;
