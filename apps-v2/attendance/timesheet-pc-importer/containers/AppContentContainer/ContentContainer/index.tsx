import * as React from 'react';

import Component from '@attendance/timesheet-pc-importer/components/AppContent/Content';

import TimesheetContainer from './TimesheetContainer';

const ContentContainer: React.FC = () => {
  return (
    <Component
      {...{
        TimesheetContainer,
      }}
    />
  );
};

export default ContentContainer;
