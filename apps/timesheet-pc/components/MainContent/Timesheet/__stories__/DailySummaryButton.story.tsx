import * as React from 'react';

import DailySummaryButton from '../DailySummaryButton';

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  width: '73px',
  height: '32px',
};

const Container = (props: { children: React.ReactNode }) => (
  <div style={containerStyle}>{props.children}</div>
);

export default {
  title: 'timesheet-pc/MainContent/Timesheet/DailySummaryButton',
  decorators: [(storyFn: Function) => <Container>{storyFn()}</Container>],
};

export const ShowsButtonForNoAlert = () => (
  <DailySummaryButton
    isLoading={false}
    date="2020-04-16"
    showAlert={false}
    totalTaskTime={null}
  />
);

ShowsButtonForNoAlert.storyName = 'shows a button for no alert';

export const ShowsTotalTaskTimeForNoAlert = () => (
  <DailySummaryButton
    isLoading={false}
    date="2020-04-16"
    showAlert={false}
    totalTaskTime={300}
  />
);

ShowsTotalTaskTimeForNoAlert.storyName = 'shows a total task time for no alert';

export const ShowsTotalTaskTimeWithAlert = () => (
  <DailySummaryButton
    isLoading={false}
    date="2020-04-16"
    showAlert
    totalTaskTime={500}
  />
);

ShowsTotalTaskTimeWithAlert.storyName = 'shows a total task time with alert';

export const ShowsButtonWithAlert = () => (
  <DailySummaryButton
    isLoading={false}
    date="2020-04-16"
    showAlert
    totalTaskTime={undefined}
  />
);

ShowsButtonWithAlert.storyName = 'shows a button with alert';

export const ShowsDisabledButtonWhileLoading = () => (
  <DailySummaryButton
    isLoading
    date="2020-04-16"
    showAlert={false}
    totalTaskTime={undefined}
  />
);

ShowsDisabledButtonWhileLoading.storyName =
  'shows a disabled button while loading';
