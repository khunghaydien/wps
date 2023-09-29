import React from 'react';

import styled from 'styled-components';

import STATUS from '@apps/domain/models/approval/request/Status';

import Component from '../RequestStatusChip';

export default {
  title: 'attendance/pc/particles/RequestStatusChip',
};

const Row = styled.div`
  margin: 4px 0px;
`;

export const Default = (): React.ReactNode => (
  <div>
    <Row>
      <Component status={STATUS.NotRequested} />
    </Row>
    <Row>
      <Component status={STATUS.Pending} />
    </Row>
    <Row>
      <Component status={STATUS.Approved} />
    </Row>
    <Row>
      <Component status={STATUS.Rejected} />
    </Row>
    <Row>
      <Component status={STATUS.Recalled} />
    </Row>
    <Row>
      <Component status={STATUS.Canceled} />
    </Row>
  </div>
);
