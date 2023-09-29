import React, { useEffect, useState } from 'react';

import get from 'lodash/get';
import has from 'lodash/has';
import last from 'lodash/last';
import moment from 'moment';

import AssignmentItem from '@apps/commons/components/psa/AssignmentItem';
import { getFilterResultsLabel } from '@apps/commons/components/psa/ViewAllResources';
import CapabilityInfoContainer from '@apps/commons/containers/psa/CapabilityInfoContainer';
import EmptyScreenContainer from '@apps/commons/containers/psa/EmptyScreenContainer';
import DownloadIcon from '@apps/commons/images/icons/download.svg';
import RefreshIcon from '@apps/commons/images/icons/refresh.svg';
import msg from '@apps/commons/languages/index';
import DateUtil from '@apps/commons/utils/DateUtil';
import {
  downloadCurrentViewAsCSV,
  generateOutOfRangeArray,
  getDynamicScheduleColumnHeader,
  sortByCode,
} from '@apps/commons/utils/psa/resourcePlannerUtil';
import TextUtil from '@apps/commons/utils/TextUtil';

import { Activity } from '@apps/domain/models/psa/Activity';
import { LegendToolTip } from '@apps/domain/models/psa/LegendToolTip';
import { Project } from '@apps/domain/models/psa/Project';
import { ScheduleStrategyConst } from '@apps/domain/models/psa/PsaResourceSchedule';
import {
  initialResourceSelectionFilterState,
  ResourceSelectionFilterState,
} from '@apps/domain/models/psa/Request';
import {
  AssignmentDetail,
  AssignmentDetailList,
  ResourceList,
  ResourceListItem,
  ViewTypes,
} from '@apps/domain/models/psa/Resource';
import {
  RMResourceGroup,
  RMResourceGroupArray,
} from '@apps/domain/models/psa/ResourceGroup';
import {
  Role,
  RoleAssignParam,
  RoleScheduleParam,
  RoleScheduleResult,
} from '@apps/domain/models/psa/Role';

import { modes as ProjectMode } from '@apps/psa-pc/modules/ui/mode';
import { SITE_ROUTE_TYPES } from '@apps/psa-pc/modules/ui/siteRoute';
import { modes as ResourceMode } from '@apps/resource-pc/modules/ui/mode';
import { dialogTypes } from '@psa/modules/ui/dialog/activeDialog';
import { ResourceAssignmentDetailUIState } from '@resource/modules/ui/resourceAssignmentDetail';
import { ResourceAvailabilityUIState } from '@resource/modules/ui/resourceAvailability';
import {
  ResourceSelectionState,
  ResourceSelectionUIState,
} from '@resource/modules/ui/resourceSelection';

import Button from '../../buttons/Button';
import AvailabilityItem from '../AvailabilityItem';
import ResourcePlannerFilterInfo from '../FilterInfo';
import PSACommonHeader from '../Header';
import Legend from '../Legend';
import ResourceScheduler from '../ResourceScheduler';
import ViewSelector from '../ViewSelector';

import './index.scss';

const ROOT = 'ts-psa__resource-planner';
export const RESOURCE_PLANNER_HEADER_VALUE = `${ROOT}__resource-list-header__value`;

type Props = {
  activeDialog: Array<string>;
  activityTitle: string;
  applyFilter: (nextState: ResourceSelectionFilterState) => void;
  assignmentDetail: ResourceAssignmentDetailUIState;
  assignmentDetailList: Array<AssignmentDetail>;
  assignRole: (roleAssignParam: RoleAssignParam) => void;
  backToProjectList?: () => void;
  backToRequestList?: () => void;
  backToRequestSelection: () => void;
  companyId: string;
  currencyCode: string;
  fetchAssignmentDetailList: (
    employeeBaseId: string,
    resourceName: string,
    startDate: string,
    endDate?: string
  ) => void;
  getGroupList: (arg0: string, arg1: string) => void;
  getGroupMembers: (arg0: string) => void;
  groupDetail: RMResourceGroup;
  groupList: RMResourceGroupArray;
  initializeResourceSelection: () => void;
  jobGrades: Array<any>;
  mode: string;
  openEmployeeCapabilityInfo: (empId: string) => void;
  overlapProject?: () => void;
  projectTitle: string;
  resetStrategy: (hours: Array<number>) => void;
  resourceAvailability: ResourceAvailabilityUIState;
  resourceList: ResourceList;
  resourceSelection: ResourceSelectionUIState;
  resourceSelectionFilterState: ResourceSelectionFilterState;
  resourceSelectionSchedulePreview: (
    roleScheduleParam: RoleScheduleParam,
    startDate: string,
    selectedResourceAvailability: Array<number>
  ) => void;
  roleScheduleResult: RoleScheduleResult;
  schedulePreview: (
    roleScheduleParam: RoleScheduleParam,
    selectedResourceAvailability: Array<number>
  ) => void;
  selectedActivity: Activity;
  selectedEmployeeId: string;
  selectedProject: Project;
  selectedRole: Role;
  selectRole: (roleId: string) => void;
  selectScheduledView: (page: number, view: string, date: string) => void;
  selectView: (page: number, view: string, date: string) => void;
  setAssignmentDetailList: (assignmentDetailList: AssignmentDetailList) => void;
  setCurrentStrategy: (strategy: string) => void;
  setCurrentWorkHoursPercentPerDay: (workHoursPerDay: number) => void;
  setCurrentWorkHoursPerDay: (workHoursPerDay: number) => void;
  setCustomHours: (customHours: Array<number>) => void;
  setResourceSelection: (resourceSelection: ResourceSelectionUIState) => void;
  setResourceSelectionState: (resourceSelectionState: string) => void;
  showDownloadToast: () => void;
  siteRoute: string;
  skillCategories: Array<any>;
  updateAssignmentBookedTimePerDay: (view: string) => void;
  updateScheduledViewType: (view: string, pageNum?: number) => void;
  viewAllResources?: () => void;
  deptSuggestList: Array<any>;
  isLoading: boolean;
  openResourcePlannerCommentDialog?: () => void;
  isFetching?: boolean;
  isFetchingOthers?: boolean;
};

const ResourcePlanner = (props: Props) => {
  const isCapabilityInfoDialogActive =
    last(props.activeDialog) === dialogTypes.EMPLOYEE_CAPABILITY_INFO;
  const [reduxFilterState, setReduxFilterState] = useState({
    ...initialResourceSelectionFilterState,
    requiredTime: +props.selectedRole.requiredTime,
    skills: props.selectedRole.skills
      ? props.selectedRole.skills.map((skill) => ({
          ...skill,
          rating: [skill.min, skill.max],
        }))
      : [],
    jobGradeIds: props.selectedRole.jobGrades
      ? props.selectedRole.jobGrades.map((jobGrade) => ({
          id: jobGrade.id,
          label: jobGrade.name,
          value: jobGrade.name,
        }))
      : [],
    resourceGroups: [],
  });
  const [jobGradeOptions, setJobGradeOptions] = useState(props.jobGrades);
  let scheduledEndDate = props.selectedActivity.plannedEndDate;
  if (
    props.resourceSelection &&
    props.roleScheduleResult &&
    props.roleScheduleResult.endDate &&
    moment(props.roleScheduleResult.endDate).isAfter(
      props.selectedActivity.plannedEndDate,
      'day'
    )
  ) {
    scheduledEndDate = props.roleScheduleResult.endDate;
  }
  const { resourceAvailability } = props;
  const { page, viewType, availableHours } = resourceAvailability;

  // @ts-ignore
  const isJapanLocale = window.empInfo.language === 'ja';

  useEffect(() => {
    const updatedJobGradeOptions = props.jobGrades?.map((jobGrade) => {
      if (jobGrade.costRate > 0) {
        jobGrade.label = `${jobGrade.label} / ${props.currencyCode} ${jobGrade.costRate}`;
      }
      return jobGrade;
    });

    setJobGradeOptions(updatedJobGradeOptions?.sort(sortByCode));
  }, []);

  useEffect(() => {
    if (props.resourceList.length > 0) {
      // always reset to day view type when re-render the parent component
      props.selectView(0, ViewTypes.DAY, resourceAvailability.startDate);
    }
    if (props.siteRoute === SITE_ROUTE_TYPES.RESOURCE_PLANNER) {
      props.selectView(0, ViewTypes.DAY, props.selectedRole.startDate);
    }
  }, [props.resourceList]);

  useEffect(() => {
    const { resourceSelection } = props;
    const hasAvailableHours =
      get(resourceSelection, 'scheduleResult.availableTime', []).length > 0;
    const hasBookedHours =
      get(resourceSelection, 'scheduleResult.bookedTime', []).length > 0;
    const hasRemainingHours =
      get(resourceSelection, 'scheduleResult.remainingHours', []).length > 0;
    if (
      hasAvailableHours &&
      hasBookedHours &&
      hasRemainingHours &&
      props.resourceSelection.currentState !==
        ResourceSelectionState.CUSTOM_SCHEDULE
    ) {
      props.updateScheduledViewType(ViewTypes.DAY);
      props.selectView(0, ViewTypes.DAY, '');
    }
    if (
      props.resourceSelection.currentState ===
      ResourceSelectionState.CUSTOM_SCHEDULE
    ) {
      props.updateScheduledViewType(
        ViewTypes.DAY,
        props.resourceAvailability.page
      );
      props.selectView(
        props.resourceAvailability.page,
        ViewTypes.DAY,
        currentStartDate
      );
    }
  }, [props.roleScheduleResult]);

  useEffect(() => {
    // @ts-ignore
    setReduxFilterState(props.resourceSelectionFilterState);
  }, [props.resourceSelectionFilterState]);

  useEffect(() => {
    if (props.assignmentDetailList) {
      props.updateAssignmentBookedTimePerDay(
        props.resourceAvailability.viewType
      );
    }
  }, [props.assignmentDetailList]);

  const isAssignmentScreen =
    props.mode === ProjectMode.DIRECT_ASSIGNMENT ||
    props.mode === ResourceMode.REQUEST_SELECT;

  // -- Start Expanded State Processing -- //
  const hasAssignmentDetails =
    props.assignmentDetailList &&
    props.assignmentDetail &&
    props.assignmentDetail.bookedTimePerDay &&
    props.assignmentDetail.bookedTimePerDay.length > 0;

  const [expandedIndex, setExpandedIndex] = useState(-1);
  const clearAssignmentDetailList = () => {
    props.setAssignmentDetailList({
      assignments: [],
      employeeBaseId: props.selectedEmployeeId,
    });
  };
  const toggleExpandedState = (i) => {
    const index = expandedIndex === i ? -1 : i;
    setExpandedIndex(index);
    clearAssignmentDetailList();
  };

  // -- End Expanded State Processing -- //

  // -- Start Processing for Day/Week/Month View -- //
  const currentStartDate: any = resourceAvailability.startDate
    ? moment(resourceAvailability.startDate)
    : moment(props.selectedRole.startDate);

  let currentEndDate: any = currentStartDate
    .clone()
    .add(11, `${resourceAvailability.viewType}s`)
    .format('YYYY-MM-DD');
  const dynamicDateHeader = getDynamicScheduleColumnHeader(
    resourceAvailability.viewType,
    currentStartDate,
    isJapanLocale
  );
  let outOfRangeArray = generateOutOfRangeArray(
    resourceAvailability.viewType,
    currentStartDate,
    currentEndDate,
    moment(props.selectedRole.startDate),
    moment(props.selectedActivity.plannedEndDate)
  );

  if (!reduxFilterState.isDateFilterNotApplied) {
    const filteredStartDate = moment(reduxFilterState.startDate).isValid()
      ? moment(reduxFilterState.startDate)
      : moment(props.selectedRole.startDate);
    const filteredEndDate = moment(reduxFilterState.endDate).isValid()
      ? moment(reduxFilterState.endDate)
      : moment(props.selectedActivity.plannedEndDate);
    outOfRangeArray = generateOutOfRangeArray(
      resourceAvailability.viewType,
      currentStartDate,
      currentEndDate,
      filteredStartDate,
      filteredEndDate
    );
  }
  const onFetchAssignmentDetailList = (
    employeeBaseId: string,
    resourceName: string
  ) => {
    if (!reduxFilterState.isDateFilterNotApplied) {
      props.fetchAssignmentDetailList(
        employeeBaseId,
        resourceName,
        reduxFilterState.startDate,
        reduxFilterState.endDate
      );
    } else {
      props.fetchAssignmentDetailList(
        employeeBaseId,
        resourceName,
        props.selectedRole.startDate,
        props.selectedRole.endDate
      );
    }
  };

  // To display the duration, need to reassign the endDate for week view and month view
  if (resourceAvailability.viewType === ViewTypes.WEEK) {
    currentEndDate = moment(currentEndDate).add(6, 'days');
  }

  // -- End Processing for Day/Week/Month View -- //
  const customDateFormat = isJapanLocale ? 'YYYY/MM/DD' : 'LL';
  const viewDuration = `${DateUtil.customFormat(
    currentStartDate,
    customDateFormat
  )}
  - ${DateUtil.customFormat(currentEndDate, customDateFormat)}`;
  const updateResourceSelectionState = (
    current: string,
    index: number,
    selectedResource?: ResourceListItem
  ) => {
    props.setResourceSelection({
      currentState: current,
      currentIndex: index,
      currentStrategy: ScheduleStrategyConst.AdjustConsiderAvailability,
      currentWorkHoursPerDay: +(
        (props.selectedProject.workTimePerDay *
          (props.selectedRole.requiredTimePercentage / 100)) /
        60
      ).toFixed(1),
      currentWorkHoursPercentPerDay: props.selectedRole.requiredTimePercentage,
      resource: selectedResource,
    });
  };

  // Dynamic constants based on props change
  const isCustomScheduleState =
    props.resourceSelection.currentState ===
    ResourceSelectionState.CUSTOM_SCHEDULE;
  const showSearchResource =
    props.resourceSelection.currentState ===
    ResourceSelectionState.SEARCH_RESOURCE;

  const renderListHeader = () => {
    return (
      <div className={`${ROOT}__resource-list-header`}>
        {props.resourceList && props.resourceList.length > 0 && (
          <div className={`${ROOT}__resource-list-header__resources`}>
            <Legend
              toolTipGroupList={LegendToolTip}
              testId={`${ROOT}__legend-testId`}
            />
            {has(props.resourceSelection, 'currentState') &&
            props.resourceSelection.currentState ===
              ResourceSelectionState.SEARCH_RESOURCE
              ? TextUtil.template(
                  msg().Psa_Lbl_ShowResources,
                  props.resourceList && props.resourceList.length
                )
              : msg().Psa_Lbl_SelectedResource}
          </div>
        )}
        {props.resourceList && props.resourceList.length > 0 && (
          <div className={`${ROOT}__resource-list-header__values`}>
            <div className={`${ROOT}__resource-list-header__total-hours`}>
              {showSearchResource
                ? msg().Psa_Lbl_BookableHours
                : msg().Psa_Lbl_TotalHours}
            </div>
            {dynamicDateHeader.map((dateString) => {
              const formattedDateString = dateString.split(' ');
              const [dayName, dayNum] = formattedDateString;
              const lastArrayValue = formattedDateString.pop();

              let customClass = ``;

              if (lastArrayValue === 'today') {
                customClass = 'js-is-today';
              } else if (lastArrayValue === 'sat') {
                customClass = 'js-is-sat';
              } else if (lastArrayValue === 'sun') {
                customClass = 'js-is-sun';
              }

              return (
                <span
                  className={`${RESOURCE_PLANNER_HEADER_VALUE} ${customClass}`}
                >
                  <span className={`${ROOT}__schedule-dayname`}>{dayName}</span>
                  <span className={`${ROOT}__schedule-daynum`}>{dayNum}</span>
                </span>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const hasMatchingResources =
    props.resourceList && props.resourceList.length > 0;
  const renderResource = () => {
    if (showSearchResource && hasMatchingResources) {
      return props.resourceList.map((resource, i) => {
        const isCollapsed = expandedIndex !== -1;
        const isSelectedEmployee = props.selectedEmployeeId === resource.id;
        const isExpanded = isCollapsed && isSelectedEmployee;

        let resourceAssignmentDetail;
        if (
          expandedIndex !== -1 &&
          hasAssignmentDetails &&
          isSelectedEmployee
        ) {
          resourceAssignmentDetail = props.assignmentDetailList.map(
            (assignmentDetail, i) => {
              const bookedTimeArray = [];
              props.assignmentDetail.bookedTimePerDay
                .filter((hours, index) => index === i)
                .forEach((x) => bookedTimeArray.push(x));
              let assignmentOutOfRangeArray = new Array(12).fill(false);
              if (assignmentDetail.status !== '-') {
                assignmentOutOfRangeArray = generateOutOfRangeArray(
                  resourceAvailability.viewType,
                  currentStartDate,
                  currentEndDate,
                  moment(assignmentDetail.startDate),
                  moment(assignmentDetail.endDate)
                );
              }
              return (
                <AssignmentItem
                  assignmentDetail={assignmentDetail}
                  availableHours={bookedTimeArray}
                  outOfRangeArray={assignmentOutOfRangeArray}
                  testId={`${ROOT}__resource-assignment-detail--${i}`}
                  totalAvailableHours={
                    assignmentDetail.bookedTimePerDay &&
                    assignmentDetail.bookedTimePerDay.reduce(
                      (accumulator, currentValue) =>
                        (accumulator === -1 ? 0 : accumulator) +
                        (currentValue === -1 ? 0 : currentValue)
                    )
                  }
                />
              );
            }
          );
        }

        return (
          <div className={`${ROOT}__resource-list-item-container`}>
            <AvailabilityItem
              availableHours={
                availableHours &&
                availableHours.filter((hours, index) => index === i)
              }
              isFetching={props.isFetching && expandedIndex === i}
              isFetchingOthers={props.isFetchingOthers}
              fetchAssignmentDetailList={(employeeBaseId) => {
                const resourceName = props.resourceList.filter(
                  (e) => employeeBaseId === e.id
                )[0].name;
                onFetchAssignmentDetailList(employeeBaseId, resourceName);
              }}
              index={i}
              isExpandable
              isExpanded={isExpanded}
              isSelectable
              isSelected={props.selectedEmployeeId === resource.id}
              onClickResourceItem={updateResourceSelectionState}
              openEmployeeCapabilityInfo={props.openEmployeeCapabilityInfo}
              outOfRangeArray={outOfRangeArray}
              resource={resource}
              testId={`${ROOT}__resource-list-item--${i}`}
              toggleExpand={() => toggleExpandedState(i)}
              totalAvailableHours={+resource.availableTime}
              isExpandableDisabled={!resource.hasAssignment}
            />
            {resourceAssignmentDetail}
          </div>
        );
      });
    } else {
      return (
        <EmptyScreenContainer
          headerMessage={msg().Psa_Lbl_EmptyResourceSelectionHeader}
          bodyMessage={msg().Psa_Lbl_EmptyResourceSelectionBody}
        />
      );
    }
  };

  const applyFilterAndCloseExpandedItems = (nextFilterState) => {
    props.applyFilter(nextFilterState);
    setExpandedIndex(-1);
  };

  const enabledFilters = {
    endDate: true,
    requiredHours: true,
    startDate: true,
  };

  return (
    <div className={`${ROOT}`}>
      {isCapabilityInfoDialogActive && <CapabilityInfoContainer />}
      <div className="ts-psa-fixed-header">
        <PSACommonHeader title={viewDuration}>
          {isAssignmentScreen && (
            <Button
              disabled={!hasMatchingResources || !showSearchResource}
              className={`${ROOT}__download-btn`}
              data-testid={`${ROOT}__download-btn`}
              onClick={() => {
                downloadCurrentViewAsCSV(resourceAvailability.viewType);
                props.showDownloadToast();
              }}
            >
              <DownloadIcon className={`${ROOT}__download-icon`} />
            </Button>
          )}
          <Button
            disabled={!showSearchResource}
            className={`${ROOT}__refresh-btn`}
            data-testid={`${ROOT}__refresh-btn`}
            onClick={() => {
              props.applyFilter(props.resourceSelectionFilterState);
              props.getGroupList(props.companyId, props.selectedRole.rmId);
            }}
          >
            <RefreshIcon />
          </Button>
          <ViewSelector
            endDate={reduxFilterState.endDate || scheduledEndDate}
            isMonthViewDisabled={isCustomScheduleState}
            isWeekViewDisabled={isCustomScheduleState}
            page={page}
            resourceSelectionState={props.resourceSelection.currentState}
            scheduledEndDate={scheduledEndDate}
            reduxFilterState={reduxFilterState}
            selectScheduledView={props.selectScheduledView}
            selectView={props.selectView}
            startDate={
              resourceAvailability.startDate
                ? resourceAvailability.startDate
                : props.selectedRole.startDate
            }
            updateScheduledViewType={props.updateScheduledViewType}
            viewType={viewType}
          />
        </PSACommonHeader>
        <ResourcePlannerFilterInfo
          applyFilter={applyFilterAndCloseExpandedItems}
          currencyCode={props.currencyCode}
          deptSuggestList={props.deptSuggestList}
          disableDateRangeError
          enabledFilters={enabledFilters}
          filterResultsLabel={getFilterResultsLabel()}
          getGroupMembers={props.getGroupMembers}
          groupDetail={props.groupDetail}
          groupList={props.groupList}
          jobGradeOptions={jobGradeOptions}
          minDate={props.selectedActivity.plannedStartDate}
          maxDate={props.selectedActivity.plannedEndDate}
          resourceSelectionFilterState={reduxFilterState}
          selectedRole={props.selectedRole}
          siteRoute={props.siteRoute}
          showFilter={showSearchResource}
          skillCategories={props.skillCategories}
          initialFilterState={{
            ...initialResourceSelectionFilterState,
            requiredTime: +props.selectedRole.requiredTime,
            skills: props.selectedRole.skills
              ? props.selectedRole.skills.map((skill) => ({
                  ...skill,
                  rating: [skill.min, skill.max],
                }))
              : [],
            jobGradeIds: props.selectedRole.jobGrades
              ? props.selectedRole.jobGrades.map((jobGrade) => ({
                  id: jobGrade.id,
                  label: jobGrade.name,
                  value: jobGrade.name,
                }))
              : [],
            resourceGroups: [
              {
                id: props.selectedRole.groupId,
                name: props.selectedRole.groupName,
              },
            ],
            startDate: props.selectedRole.startDate,
            endDate: props.selectedActivity.plannedEndDate,
          }}
        />
        {renderListHeader()}
      </div>
      <div className={`${ROOT}__content-container`}>
        {!props.isLoading && (
          <div className={`${ROOT}__resource-container`}>
            <div className={`${ROOT}__resource-list-content`}>
              {showSearchResource ? (
                renderResource()
              ) : (
                <React.Fragment key={`${ROOT}_resourceScheduler_fragment`}>
                  <ResourceScheduler {...props} />
                </React.Fragment>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcePlanner;
