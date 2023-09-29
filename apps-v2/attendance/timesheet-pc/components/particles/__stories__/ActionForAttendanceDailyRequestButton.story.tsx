import React from 'react';

import { action } from '@storybook/addon-actions';
import styled from 'styled-components';

import { ACTIONS_FOR_FIX } from '@attendance/domain/models/AttFixSummaryRequest';

import Component from '../ActionForAttendanceDailyRequestButton';

export default {
  title:
    'attendance/timesheet-pc/particles/ActionForAttendanceDailyRequestButton',
};

const Row = styled.div`
  margin: 4px 0px;
`;

export const Default = (): React.ReactNode => (
  <div>
    <Row>
      <Component type={ACTIONS_FOR_FIX.Submit} onClick={action('onClick')} />
    </Row>
    <Row>
      <Component
        type={ACTIONS_FOR_FIX.CancelApproval}
        onClick={action('onClick')}
      />
    </Row>
    <Row>
      <Component
        type={ACTIONS_FOR_FIX.CancelRequest}
        onClick={action('onClick')}
      />
    </Row>
  </div>
);
