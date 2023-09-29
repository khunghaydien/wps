import React from 'react';

import msg from '@commons/languages';
import TextUtil from '@commons/utils/TextUtil';

import { CurrentRoute } from '@apps/domain/models/psa/CurrentRoute';
import { ProjectFinanceType } from '@apps/domain/models/psa/ProjectFinance';

import { modes as PsaModes } from '@psa/modules/ui/mode';
import { SITE_ROUTE_TYPES as PsaRouteTypes } from '@psa/modules/ui/siteRoute';
import { modes as ResourceModes } from '@resource/modules/ui/mode';
import { SITE_ROUTE_TYPES as ResourceRouteTypes } from '@resource/modules/ui/siteRoute';

type Props = {
  backToRequestSelection?: () => void;
  backToViewAllResources?: () => void;
  currentRoute: string;
  mode: string;
  onClickBackToProjectList?: () => void;
  onClickBackToProjectListConfirmation?: () => void;
  onClickBackToRoleRequestList?: () => void;
  onClickBackToSelectedRole?: () => void;
  overlapProject?: () => void;
  selectedProjectName?: string;
  selectedResourceName?: string;
  selectedRoleTitle?: string;
  siteRoute: string;
  labourFinanceType?: string;
  financeDetailTitle?: string;
  backToFinanceDetail?: () => void;
  financeCategoryName?: string;
};

const ROOT = 'ts-psa__common-header';
const breadcrumbSeparator = '>';

const PsaBreadcrumb = (props: Props) => {
  // Text only
  const projectName = {
    title: props.selectedProjectName,
    onClick: null,
  };
  const viewAllResources = {
    title: msg().Psa_Lbl_AllResources,
    onClick: null,
  };
  const roleTitle = {
    title: props.selectedRoleTitle,
    onClick: null,
  };
  const scheduleDetails = {
    title: msg().Psa_Lbl_ScheduledDetails,
    onClick: null,
  };
  const resourceSelection = {
    title: msg().Psa_Lbl_ResourceSelection,
    onClick: null,
  };
  const scheduling = {
    title: msg().Psa_Lbl_Scheduling,
    onClick: null,
  };
  const reschedule = {
    title: msg().Psa_Lbl_Reschedule,
    onClick: null,
  };
  const resourceRequests = {
    title: msg().Psa_Lbl_ResourceRequests,
    onClick: null,
  };

  let labourPageTitle = '';
  if (props.labourFinanceType === ProjectFinanceType.Revenue) {
    labourPageTitle = msg().Psa_Lbl_FinanceProjectRevenue;
  } else if (props.labourFinanceType === ProjectFinanceType.Cost) {
    labourPageTitle = msg().Psa_Lbl_FinanceLabourCost;
  }
  const labourCost = {
    title: labourPageTitle,
    onClick: null,
  };

  const financeCategory = {
    title: props.financeDetailTitle,
    onClick: null,
  };

  const financeCategoryName = {
    title: props.financeCategoryName,
    onClick: null,
  };

  const backToFinanceDetail = {
    title: props.financeCategoryName,
    onClick: props.backToFinanceDetail,
  };

  // Onclick
  const backToProjectList = {
    title: msg().Psa_Lbl_Projects,
    onClick:
      props.mode !== PsaModes.PROJECT_EDIT
        ? props.onClickBackToProjectList
        : props.onClickBackToProjectListConfirmation,
  };
  const backToViewAllResources = {
    title: msg().Psa_Lbl_AllResources,
    onClick: props.backToViewAllResources,
  };
  const backToSelectedProject = {
    title: props.selectedProjectName,
    onClick: props.overlapProject,
  };
  const backToSelectedRole = {
    title: props.selectedRoleTitle,
    onClick: props.onClickBackToSelectedRole,
  };
  const backToRoleRequestListForSelectedResource = {
    title: TextUtil.template(
      msg().Psa_Lbl_SelectRequest,
      props.selectedResourceName
    ),
    onClick: props.backToRequestSelection,
  };
  const backToRoleRequestList = {
    title: msg().Psa_Lbl_ResourceRequests,
    onClick: props.onClickBackToRoleRequestList,
  };

  // Some routes are shared between Projects and Resource.
  // Those are VIEW_ALL_RESOURCES, ROLE_DETAILS, RESOURCE_PLANNER, SCHEDULE_DETAILS
  // Therefore implementing with only switch case statements is not ideal
  let breadcrumbs;

  if (props.currentRoute === CurrentRoute.Projects) {
    switch (props.siteRoute) {
      case PsaRouteTypes.VIEW_PROJECT:
        breadcrumbs = [backToProjectList, projectName];
        break;
      case PsaRouteTypes.FINANCE_DETAIL_CONTRACT_FIXED:
      case PsaRouteTypes.FINANCE_DETAIL_CONTRACT_TNM:
      case PsaRouteTypes.FINANCE_DETAIL_OTHER_CATEGORY:
      case PsaRouteTypes.FINANCE_DETAIL_OTHER_EXPENSE:
        breadcrumbs = [
          backToProjectList,
          backToSelectedProject,
          financeCategoryName,
        ];
        break;
      case PsaRouteTypes.VIEW_ALL_RESOURCES:
        breadcrumbs = [backToProjectList, viewAllResources];
        break;
      case PsaRouteTypes.ROLE_DETAILS:
        if (
          props.mode === PsaModes.INITIALIZE ||
          props.mode === PsaModes.DIRECT_ASSIGNMENT
        ) {
          breadcrumbs = [backToProjectList, backToSelectedProject, roleTitle];
        } else if (props.mode === PsaModes.ROLE_DETAILS_FROM_ALL_RESOURCES) {
          breadcrumbs = [backToProjectList, backToViewAllResources, roleTitle];
        } else if (props.mode === PsaModes.ROLE_DETAILS_FROM_FINANCE) {
          breadcrumbs = [
            backToProjectList,
            backToSelectedProject,
            backToFinanceDetail,
            roleTitle,
          ];
        }
        break;
      case PsaRouteTypes.RESCHEDULE:
        breadcrumbs = [
          backToProjectList,
          backToSelectedProject,
          backToSelectedRole,
          reschedule,
        ];
        break;
      case PsaRouteTypes.RESOURCE_PLANNER:
        breadcrumbs = [
          backToProjectList,
          backToSelectedProject,
          backToSelectedRole,
          scheduling,
        ];
        break;
      case PsaRouteTypes.SCHEDULE_DETAILS:
        if (
          props.mode === PsaModes.INITIALIZE ||
          props.mode === PsaModes.DIRECT_ASSIGNMENT
        ) {
          breadcrumbs = [
            backToProjectList,
            backToSelectedProject,
            backToSelectedRole,
            scheduleDetails,
          ];
        } else if (props.mode === PsaModes.ROLE_DETAILS_FROM_ALL_RESOURCES) {
          breadcrumbs = [
            backToProjectList,
            backToViewAllResources,
            backToSelectedRole,
            scheduleDetails,
          ];
        } else if (props.mode === PsaModes.ROLE_DETAILS_FROM_FINANCE) {
          breadcrumbs = [
            backToProjectList,
            backToSelectedProject,
            backToFinanceDetail,
            backToSelectedRole,
            scheduleDetails,
          ];
        }
        break;
      case PsaRouteTypes.FINANCE_LABOUR_COST:
        breadcrumbs = [backToProjectList, backToSelectedProject, labourCost];
        break;
      case PsaRouteTypes.FINANCE_DETAIL_INPUT:
        breadcrumbs = [
          backToProjectList,
          backToSelectedProject,
          financeCategory,
        ];
        break;
      default:
        return breadcrumbs;
    }
  } else if (props.currentRoute === CurrentRoute.Resource) {
    switch (props.siteRoute) {
      case ResourceRouteTypes.VIEW_ALL_RESOURCES:
        breadcrumbs = [backToRoleRequestList, viewAllResources];
        break;
      case ResourceRouteTypes.ROLE_DETAILS:
        if (
          props.mode === ResourceModes.INITIALIZE ||
          props.mode === ResourceModes.REQUEST_SELECT
        ) {
          breadcrumbs = [backToRoleRequestList, roleTitle];
        } else if (
          props.mode === ResourceModes.ROLE_DETAILS_FROM_ALL_RESOURCES ||
          props.mode === ResourceModes.RESOURCE_ASSIGNMENT
        ) {
          breadcrumbs = [
            backToRoleRequestList,
            backToViewAllResources,
            roleTitle,
          ];
        }
        break;
      case ResourceRouteTypes.REQUEST_LIST:
        if (props.mode === ResourceModes.RESOURCE_ASSIGNMENT) {
          breadcrumbs = [
            backToRoleRequestList,
            backToViewAllResources,
            resourceRequests,
          ];
        }
        break;
      case ResourceRouteTypes.RESOURCE_PLANNER:
        if (
          props.mode === ResourceModes.INITIALIZE ||
          props.mode === ResourceModes.REQUEST_SELECT
        ) {
          breadcrumbs = [
            backToRoleRequestList,
            backToSelectedRole,
            resourceSelection,
          ];
        } else if (props.mode === ResourceModes.RESOURCE_ASSIGNMENT) {
          breadcrumbs = [
            backToRoleRequestList,
            backToViewAllResources,
            backToRoleRequestListForSelectedResource,
            scheduling,
          ];
        } else if (
          props.mode === ResourceModes.ROLE_DETAILS_FROM_ALL_RESOURCES
        ) {
          breadcrumbs = [
            backToRoleRequestList,
            backToViewAllResources,
            backToSelectedRole,
            scheduling,
          ];
        }
        break;
      case ResourceRouteTypes.SCHEDULE_DETAILS:
        if (props.mode === ResourceModes.ROLE_DETAILS_FROM_ALL_RESOURCES) {
          breadcrumbs = [
            backToRoleRequestList,
            backToViewAllResources,
            backToSelectedRole,
            scheduleDetails,
          ];
        } else {
          breadcrumbs = [
            backToRoleRequestList,
            backToSelectedRole,
            scheduleDetails,
          ];
        }
        break;
      default:
        return breadcrumbs;
    }
  }

  return (
    <span className={`${ROOT}-breadcrumb`}>
      {breadcrumbs &&
        breadcrumbs.map((breadcrumb, i, { length }) => {
          const { title, onClick } = breadcrumb;
          const isLast = length === i + 1;
          const separator = isLast ? (
            ''
          ) : (
            <span className={`${ROOT}-breadcrumb-separator`}>
              {breadcrumbSeparator}
            </span>
          );
          const classes = onClick ? `${ROOT}-breadcrumb-link` : 'value';

          return (
            <React.Fragment>
              <span
                className={classes}
                data-testid={`${ROOT}-breadcrumb--${i}`}
                onClick={onClick}
              >
                {title}
              </span>
              {separator}
            </React.Fragment>
          );
        })}
    </span>
  );
};

export default PsaBreadcrumb;
