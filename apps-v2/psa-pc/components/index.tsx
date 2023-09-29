import React from 'react';

import GlobalContainer from '@apps/commons/containers/GlobalContainer';
import ToastContainer from '@apps/commons/containers/ToastContainer';

import { Project } from '@apps/domain/models/psa/Project';

import { SITE_ROUTE_TYPES } from '@psa/modules/ui/siteRoute';

import FinanceContractTnMContainer from '@apps/psa-pc/containers/FinanceContractTnMContainer';
import FinanceDetailOtherExpenseContainer from '@apps/psa-pc/containers/FinanceDetailOtherExpenseContainer';
import FinanceDetailOthersContainer from '@apps/psa-pc/containers/FinanceDetailOthersContainer';
import FinanceContractFixedContainer from '@psa/containers/FinanceContractFixedContainer';
import HeaderContainer from '@psa/containers/ProjectListHeaderContainer';
import ProjectListScreen from '@psa/containers/ProjectListScreenContainer';
import ProjectScreenContainer from '@psa/containers/ProjectScreenContainer';
import RescheduleContainer from '@psa/containers/RescheduleContainer';
import ResourcePlannerContainer from '@psa/containers/ResourcePlannerContainer';
// 3rd Screen
import RoleDetailsContainer from '@psa/containers/RoleDetailsContainer';
import ScheduleDetailsContainer from '@psa/containers/ScheduleDetailsContainer';
import ViewAllResourcesContainer from '@psa/containers/ViewAllResourcesContainer';

import './index.scss';

export type Props = {
  activeDialog: Array<string>;
  activeRoute: string;
  onClickBackToProjectList: () => void;
  openNewProjectDialog: () => void;
  openViewAllResources: () => void;
  overlapProject: () => void;
  selectedProject: Project;
  permission: string;
};

const App = (props: Props) => {
  const renderComponent = () => {
    const component = (
      <div>
        <HeaderContainer
          isOverlapProject={props.activeRoute === SITE_ROUTE_TYPES.VIEW_PROJECT}
          onClickBackToProjectList={props.onClickBackToProjectList}
          openNewProjectDialog={props.openNewProjectDialog}
          openViewAllResources={props.openViewAllResources}
          selectedProject={props.selectedProject}
        />
        <ProjectListScreen
          activeDialog={props.activeDialog}
          overlapProject={props.overlapProject}
        />
      </div>
    );

    switch (props.activeRoute) {
      case SITE_ROUTE_TYPES.ROLE_DETAILS:
        return <RoleDetailsContainer />;
      case SITE_ROUTE_TYPES.SCHEDULE_DETAILS:
        return <ScheduleDetailsContainer />;
      case SITE_ROUTE_TYPES.VIEW_PROJECT:
        return <ProjectScreenContainer permission={props.permission} />;
      case SITE_ROUTE_TYPES.VIEW_ALL_RESOURCES:
        return <ViewAllResourcesContainer />;
      case SITE_ROUTE_TYPES.RESOURCE_PLANNER:
        return <ResourcePlannerContainer />;
      case SITE_ROUTE_TYPES.RESCHEDULE:
        return <RescheduleContainer />;
      case SITE_ROUTE_TYPES.FINANCE_DETAIL_CONTRACT_FIXED:
        return <FinanceContractFixedContainer />;
      case SITE_ROUTE_TYPES.FINANCE_DETAIL_CONTRACT_TNM:
        return <FinanceContractTnMContainer />;
      case SITE_ROUTE_TYPES.FINANCE_DETAIL_OTHER_CATEGORY:
        return <FinanceDetailOthersContainer />;
      case SITE_ROUTE_TYPES.FINANCE_DETAIL_OTHER_EXPENSE:
        return <FinanceDetailOtherExpenseContainer />;
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
