import * as React from 'react';

import { storiesOf } from '@storybook/react';

import DailySummaryButton from '../../../components/MainContent/Timesheet/DailySummaryButton';

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  width: '73px',
  height: '32px',
};

const Container = (props: { children: React.ReactNode }) => (
  <div style={containerStyle}>{props.children}</div>
);

storiesOf('timesheet-pc/Timesheet/DailySummaryButton', module)
  .add('shows a button for no alert', () => (
    <Container>
      <DailySummaryButton
        isLoading={false}
        date="2020-04-16"
        showAlert={false}
        totalTaskTime={null}
      />
    </Container>
  ))
  .add('shows a total task time for no alert', () => (
    <Container>
      <DailySummaryButton
        isLoading={false}
        date="2020-04-16"
        showAlert={false}
        totalTaskTime={300}
      />
    </Container>
  ))
  .add('shows a total task time with alert', () => (
    <Container>
      <DailySummaryButton
        isLoading={false}
        date="2020-04-16"
        showAlert
        totalTaskTime={500}
      />
    </Container>
  ))
  .add('shows a button with alert', () => (
    <Container>
      <DailySummaryButton
        isLoading={false}
        date="2020-04-16"
        showAlert
        totalTaskTime={undefined}
      />
    </Container>
  ))
  .add('shows a disabled button while loading', () => (
    <Container>
      <DailySummaryButton
        isLoading
        date="2020-04-16"
        showAlert={false}
        totalTaskTime={undefined}
      />
    </Container>
  ));
