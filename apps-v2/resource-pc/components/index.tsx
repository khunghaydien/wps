import React from 'react';

// import msg from '@apps/commons/languages';
import GlobalContainer from '@apps/commons/containers/GlobalContainer';
import ToastContainer from '@apps/commons/containers/ToastContainer';

import { SITE_ROUTE_TYPES } from '@resource/modules/ui/siteRoute';

import ResourcePlannerContainer from '@resource/containers/ResourcePlannerContainer';
import RoleDetailsContainer from '@resource/containers/RoleDetailsContainer';
import RoleRequestHeaderContainer from '@resource/containers/RoleRequestHeaderContainer';
import RoleRequestListContainer from '@resource/containers/RoleRequestListContainer';
import ScheduleDetailsContainer from '@resource/containers/ScheduleDetailsContainer';
import ViewAllResourcesContainer from '@resource/containers/ViewAllResourcesContainer';

import './index.scss';

export type Props = {
  activeRoute: string;
};

const App = (props: Props) => {
  const renderActiveRoute = () => {
    switch (props.activeRoute) {
      case SITE_ROUTE_TYPES.ROLE_DETAILS:
        return <RoleDetailsContainer />;
      case SITE_ROUTE_TYPES.RESOURCE_PLANNER:
        return <ResourcePlannerContainer />;
      case SITE_ROUTE_TYPES.SCHEDULE_DETAILS:
        return <ScheduleDetailsContainer />;
      case SITE_ROUTE_TYPES.VIEW_ALL_RESOURCES:
        return <ViewAllResourcesContainer />;
      default:
        return <RoleRequestListContainer />;
    }
  };

  return (
    <GlobalContainer>
      <div>
        {props.activeRoute === SITE_ROUTE_TYPES.REQUEST_LIST && (
          <RoleRequestHeaderContainer />
        )}
        {renderActiveRoute()}
      </div>
      <ToastContainer />
    </GlobalContainer>
  );
};

export default App;
