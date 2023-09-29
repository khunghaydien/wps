import React from 'react';

import GlobalContainer from '@apps/commons/containers/GlobalContainer';
import ToastContainer from '@apps/commons/containers/ToastContainer';

import { SITE_ROUTE_TYPES } from '@apps/resource-pc-schedule/modules/ui/siteRoute';

import SelfRescheduleContainer from '../containers/SelfRescheduleContainer';
import ViewScheduleContainer from '../containers/ViewScheduleContainer';

import './index.scss';

export type Props = {
  activeRoute: string;
};

const App = (props: Props) => {
  const renderComponent = () => {
    const component = <div></div>;

    switch (props.activeRoute) {
      case SITE_ROUTE_TYPES.SCHEDULE_DETAILS:
        return <ViewScheduleContainer />;
      case SITE_ROUTE_TYPES.SELF_RESCHEDULE:
        return <SelfRescheduleContainer />;
      default:
        return component;
    }
  };

  return (
    <GlobalContainer>
      <ToastContainer />
      {renderComponent()}
    </GlobalContainer>
  );
};

export default App;
