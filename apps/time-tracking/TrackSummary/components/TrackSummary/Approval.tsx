import React from 'react';

import msg from '../../../../commons/languages';

import { Body, Card, Divider, Header, Title } from './Card';
import { Row } from './Layout';
import Period from './Period';
import { ApprovalProps } from './Props';
import Summary, { Column } from './Summary';

const Approval = (props: ApprovalProps) => {
  return (
    <Card>
      <Header>
        <Title>{msg().Time_Lbl_TrackSummaryTitle}</Title>
      </Header>
      <Divider />
      <Body>
        <Row>
          <Row noMargin>
            <Period startDate={props.startDate} endDate={props.endDate} />
          </Row>
        </Row>
        <Row noMargin align="start">
          <Summary data={props.data} column={Column.Approval} />
        </Row>
      </Body>
    </Card>
  );
};

export default Approval;
