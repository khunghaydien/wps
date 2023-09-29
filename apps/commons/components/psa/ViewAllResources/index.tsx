import React, { useEffect, useState } from 'react';

import last from 'lodash/last';
import moment from 'moment';

import {
  MAX_PAGE_NUM,
  MAX_RECORD_NUM,
  PAGE_SIZE_OPTIONS,
} from '@apps/commons/constants/psa/page';

import Button from '@apps/commons/components/buttons/Button';
import Pagination from '@apps/commons/components/Pagination';
import AssignmentItem from '@apps/commons/components/psa/AssignmentItem';
import AvailabilityItem from '@apps/commons/components/psa/AvailabilityItem';
import ResourcePlannerFilterInfo from '@apps/commons/components/psa/FilterInfo';
import PSACommonHeader from '@apps/commons/components/psa/Header/index';
import Legend from '@apps/commons/components/psa/Legend/index';
import ViewSelector from '@apps/commons/components/psa/ViewSelector';
import CapabilityInfoContainer from '@apps/commons/containers/psa/CapabilityInfoContainer';
import EmptyScreenContainer from '@apps/commons/containers/psa/EmptyScreenContainer';
import RefreshIcon from '@apps/commons/images/icons/refresh.svg';
import msg from '@apps/commons/languages/index';
import DateUtil from '@apps/commons/utils/DateUtil';
import {
  generateOutOfRangeArray,
  getDynamicScheduleColumnHeader,
  sortByCode,
} from '@apps/commons/utils/psa/resourcePlannerUtil';
import TextUtil from '@apps/commons/utils/TextUtil';

import { LegendToolTip } from '@apps/domain/models/psa/LegendToolTip';
import { PSAGroup } from '@apps/domain/models/psa/PSAGroup';
import {
  initialResourceSelectionFilterState,
  ResourceSelectionFilterState,
} from '@apps/domain/models/psa/Request';
import {
  AssignmentDetail,
  AssignmentDetailList,
  ResourceListItem,
  ViewTypes,
} from '@apps/domain/models/psa/Resource';
import {
  RMResourceGroup,
  RMResourceGroupArray,
} from '@apps/domain/models/psa/ResourceGroup';

import { dialogTypes } from '@apps/psa-pc/modules/ui/dialog/activeDialog';
import { ResourceAssignmentDetailUIState } from '@resource/modules/ui/resourceAssignmentDetail';
import { ResourceAvailabilityUIState } from '@resource/modules/ui/resourceAvailability';
import { ResourceSelectionState } from '@resource/modules/ui/resourceSelection';

import './index.scss';

const ROOT = 'ts-psa__view-all-resources';

export function getFilterResultsLabel() {
  return {
    departmentName: msg().Admin_Lbl_DepartmentName,
    code: msg().Com_Lbl_EmployeeCode,
    name: msg().Com_Lbl_EmployeeName,
    position: msg().Psa_Lbl_JobTitle,
    requiredTime: msg().Psa_Lbl_RequiredEffort,
    skills: msg().Psa_Lbl_Skills,
    jobGradeIds: msg().Admin_Lbl_JobGrade,
    resourceGroups: msg().Admin_Lbl_ResourceGroup,
    startDate: msg().Psa_Lbl_StartDate,
    endDate: msg().Psa_Lbl_EndDate,
  };
}

type Props = {
  activeDialog: Array<string>;
  applyFilter: (nextState: ResourceSelectionFilterState) => void;
  assignmentDetail: ResourceAssignmentDetailUIState;
  assignmentDetailList: Array<AssignmentDetail>;
  companyId: string;
  currencyCode?: string;
  employeeId: string;
  fetchAssignmentDetailList: (
    employeeBaseId: string,
    resourceName: string,
    psaGroupId: string,
    startDate?: string,
    endDate?: string
  ) => void;
  getGroupList: (arg0: string, arg1: string, arg2?: string) => void;
  getGroupMembers: (arg0: string) => void;
  groupDetail: RMResourceGroup;
  groupList: RMResourceGroupArray;
  jobGrades: Array<any>;
  onClickPagerLink: (arg0: number) => void;
  openEmployeeCapabilityInfo: (empId: string) => void;
  openRoleDetails: (roleId: string) => void;
  pageNum: number;
  pageSize: number;
  resourceAvailability: ResourceAvailabilityUIState;
  resourceList: Array<ResourceListItem>;
  selectedEmployeeId: string;
  selectView: (page: number, view: string, date: string) => void;
  setAssignmentDetailList: (assignmentDetailList: AssignmentDetailList) => void;
  siteRoute: string;
  skillCategories: Array<any>;
  startDate?: string;
  totalRecords: number;
  updateAssignmentBookedTimePerDay: (view: string) => void;
  updateResourceSelectionState?: (
    current: string,
    index: number,
    selectedResource?: ResourceListItem
  ) => void;
  viewAllResourcesFilterState: ResourceSelectionFilterState;
  deptSuggestList: Array<any>;
  isLoading: boolean;
  onChangeListSize: (arg0: number) => void;
  isFetching?: boolean;
  isFetchingOthers?: boolean;
  selectedGroup: PSAGroup;
  requireOwnerIdForGetGroupList: boolean;
};

const ViewAllResources = (props: Props) => {
  const isCapabilityInfoDialogActive =
    last(props.activeDialog) === dialogTypes.EMPLOYEE_CAPABILITY_INFO;
  const [reduxFilterState, setReduxFilterState] = useState({
    ...initialResourceSelectionFilterState,
  });

  const updatedJobGradeOptions = (jobGrades) =>
    jobGrades
      ?.map((jobGrade) => {
        if (jobGrade.costRate > 0) {
          jobGrade.label = `${jobGrade.label} / ${
            props.currencyCode ? props.currencyCode : ''
          } ${jobGrade.costRate}`;
        }
        return jobGrade;
      })
      .sort(sortByCode);

  const [expandedIndex, setExpandedIndex] = useState(-1);
  const { resourceAvailability } = props;
  const { page, viewType, availableHours } = resourceAvailability;
  const [jobGradeOptions, setJobGradeOptions] = useState([]);
  const [employeeBaseId, setEmployeeBaseId] = useState(null);
  const [resourceName, setResourceName] = useState(null);

  // @ts-ignore
  const isJapanLocale = window.empInfo.language === 'ja';

  useEffect(() => {
    if (props.resourceList.length > 0) {
      // When resource list has updates, retain the view type and view window
      props.selectView(page, viewType, resourceAvailability.startDate);
    }
  }, [props.resourceList]);
  useEffect(() => {
    // To make sure we have correct data at another page load from pagination
    props.selectView(page, viewType, resourceAvailability.startDate);
  }, [props.pageNum, props.pageSize]);

  useEffect(() => {
    setReduxFilterState(props.viewAllResourcesFilterState);
  }, [props.viewAllResourcesFilterState]);
  useEffect(() => {
    if (props.assignmentDetailList) {
      props.updateAssignmentBookedTimePerDay(
        props.resourceAvailability.viewType
      );
    }
  }, [props.assignmentDetailList]);

  useEffect(() => {
    setJobGradeOptions(updatedJobGradeOptions(props.jobGrades));
  }, [props.jobGrades]);

  // -- Start Processing for Day/Week/Month View -- //
  const today = moment();

  const MAX_END_DATE = today.clone().add(12, 'months').endOf('month');
  let currentStartDate: any = resourceAvailability.startDate
    ? moment(resourceAvailability.startDate)
    : moment().startOf('month');
  let currentEndDate: any = currentStartDate
    .clone()
    .add(11, `${resourceAvailability.viewType}s`)
    .format('YYYY-MM-DD');

  const dynamicDateHeader = getDynamicScheduleColumnHeader(
    resourceAvailability.viewType,
    currentStartDate,
    isJapanLocale
  );

  // No out of range for this screen since there is no selected role
  let outOfRangeArray = new Array(12).fill(false);
  let currentDateIndicatorArray = new Array(12).fill(false);

  currentDateIndicatorArray = dynamicDateHeader.map((dateString) => {
    const formattedDateString = dateString.split(' ');
    const lastArrayValue = formattedDateString.pop();
    if (lastArrayValue === 'today') {
      return true;
    }
    return false;
  });

  // To display the duration, need to reassign the endDate for week view and month view
  if (resourceAvailability.viewType === ViewTypes.WEEK) {
    currentEndDate = moment(currentEndDate).add(6, 'days');
  } else if (resourceAvailability.viewType === ViewTypes.MONTH) {
    // Only update for month because month view always start from the first day.
    currentStartDate = moment(currentStartDate).startOf('month');
    currentEndDate = moment(currentEndDate).endOf('month');
  }

  // -- End Processing for Day/Week/Month View -- //
  const customDateFormat = isJapanLocale ? 'YYYY/MM/DD' : 'LL';
  const viewDuration = `${DateUtil.customFormat(
    currentStartDate,
    customDateFormat
  )}
  - ${DateUtil.customFormat(currentEndDate, customDateFormat)}`;

  const filteredStartDate = moment(reduxFilterState.startDate).isValid()
    ? moment(reduxFilterState.startDate)
    : today.startOf('month');
  const filteredEndDate = moment(reduxFilterState.endDate).isValid()
    ? moment(reduxFilterState.endDate)
    : MAX_END_DATE;

  outOfRangeArray = generateOutOfRangeArray(
    viewType,
    currentStartDate,
    currentEndDate,
    filteredStartDate,
    filteredEndDate
  );

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
  const onFetchAssignmentDetailList = (employeeBaseId, resourceName) => {
    setEmployeeBaseId(employeeBaseId);
    setResourceName(resourceName);
    if (!reduxFilterState.isDateFilterNotApplied) {
      props.fetchAssignmentDetailList(
        employeeBaseId,
        resourceName,
        props.selectedGroup.id,
        reduxFilterState.startDate,
        reduxFilterState.endDate
      );
    } else
      props.fetchAssignmentDetailList(
        employeeBaseId,
        resourceName,
        props.selectedGroup.id
      );
  };
  const onRefreshButtonClick = () => {
    if (
      expandedIndex !== -1 &&
      !props.resourceList[expandedIndex].hasAssignment
    ) {
      setExpandedIndex(-1);
      clearAssignmentDetailList();
    }
    if (!reduxFilterState.isDateFilterNotApplied) {
      props.applyFilter(reduxFilterState);
    } else {
      props.applyFilter(props.viewAllResourcesFilterState);
    }
    if (props.requireOwnerIdForGetGroupList) {
      props.getGroupList(
        props.companyId,
        props.selectedGroup.id,
        props.employeeId
      );
    } else {
      props.getGroupList(props.companyId, props.selectedGroup.id);
    }
    if (employeeBaseId && resourceName) {
      if (props.resourceList[expandedIndex].hasAssignment)
        onFetchAssignmentDetailList(employeeBaseId, resourceName);
    }
  };

  const applyFilterAndCloseExpandedItems = (nextFilterState) => {
    props.applyFilter(nextFilterState);
    setExpandedIndex(-1);
  };

  const hasAssignmentDetails =
    props.assignmentDetailList &&
    props.assignmentDetail &&
    props.assignmentDetail.bookedTimePerDay &&
    props.assignmentDetail.bookedTimePerDay.length > 0;

  let viewAllResources;
  if (props.resourceList && props.resourceList.length > 0) {
    viewAllResources = props.resourceList.map((resource, i) => {
      const isCollapsed = expandedIndex !== -1;
      const isSelectedEmployee = props.selectedEmployeeId === resource.id;
      const isExpanded = isCollapsed && isSelectedEmployee;
      const isSelectable = !!props.updateResourceSelectionState;
      const resourceRow = (
        <AvailabilityItem
          availableHours={
            availableHours &&
            availableHours.filter((hours, index) => index === i)
          }
          currentDateIndicator={currentDateIndicatorArray}
          fetchAssignmentDetailList={(employeeBaseId) => {
            const resourceName = props.resourceList.filter(
              (e) => employeeBaseId === e.id
            )[0].name;
            onFetchAssignmentDetailList(employeeBaseId, resourceName);
          }}
          hideTotalHours
          index={i}
          isExpandable
          isExpanded={isExpanded}
          isFetching={props.isFetching && expandedIndex === i}
          isFetchingOthers={props.isFetchingOthers}
          isSelectable={isSelectable}
          isSelected={props.selectedEmployeeId === resource.id}
          onClickResourceItem={props.updateResourceSelectionState}
          openEmployeeCapabilityInfo={props.openEmployeeCapabilityInfo}
          outOfRangeArray={outOfRangeArray}
          resource={resource}
          testId={`${ROOT}__resource-list-item--${i}`}
          toggleExpand={() => toggleExpandedState(i)}
          totalAvailableHours={+resource.availableTime}
          isExpandableDisabled={!resource.hasAssignment}
        />
      );
      let resourceAssignmentDetail;
      if (
        expandedIndex !== -1 &&
        hasAssignmentDetails &&
        props.selectedEmployeeId === resource.id
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
                currentDateIndicator={currentDateIndicatorArray}
                hideTotalHours
                openRoleDetails={props.openRoleDetails}
                outOfRangeArray={assignmentOutOfRangeArray}
                testId={`${ROOT}__resource-assignment-detail--${i}`}
                totalAvailableHours={0}
              />
            );
          }
        );
      }

      return (
        <div className={`${ROOT}__resource-list-item-container`}>
          {resourceRow}
          {resourceAssignmentDetail}
        </div>
      );
    });
  } else {
    viewAllResources = (
      <EmptyScreenContainer
        headerMessage={msg().Psa_Lbl_EmptyResourceSelectionHeader}
        bodyMessage={msg().Psa_Lbl_EmptyResourceSelectionBody}
      />
    );
  }

  const enabledFilters = {
    startDate: true,
    endDate: true,
    requiredHours: false,
  };
  return (
    <div className={`${ROOT}`}>
      {isCapabilityInfoDialogActive && <CapabilityInfoContainer />}
      <div className="ts-psa-fixed-header">
        <PSACommonHeader title={viewDuration}>
          <Button
            className={`${ROOT}__refresh-btn`}
            data-testid={`${ROOT}__refresh-btn`}
            onClick={onRefreshButtonClick}
          >
            <RefreshIcon />
          </Button>
          <ViewSelector
            startDate={currentStartDate}
            isDateFilterNotApplied={!reduxFilterState.isDateFilterNotApplied}
            endDate={reduxFilterState.endDate || MAX_END_DATE.format()}
            page={page}
            viewType={viewType}
            selectView={props.selectView}
            resourceSelectionState={ResourceSelectionState.SEARCH_RESOURCE}
            isMoveToTargetDateEnabled
            reduxFilterState={reduxFilterState}
          />
        </PSACommonHeader>
        <ResourcePlannerFilterInfo
          applyFilter={applyFilterAndCloseExpandedItems}
          deptSuggestList={props.deptSuggestList}
          enabledFilters={enabledFilters}
          filterResultsLabel={getFilterResultsLabel()}
          getGroupMembers={props.getGroupMembers}
          groupDetail={props.groupDetail}
          groupList={props.groupList}
          initialFilterState={initialResourceSelectionFilterState}
          minDate={moment().format('MM/01/YYYY')}
          maxDate={MAX_END_DATE.format()}
          jobGradeOptions={jobGradeOptions}
          resourceSelectionFilterState={reduxFilterState}
          selectedRole={null}
          showFilter
          siteRoute={props.siteRoute}
          skillCategories={props.skillCategories}
        />
        <div className={`${ROOT}__resource-list-header`}>
          {props.resourceList && props.resourceList.length > 0 && (
            <div className={`${ROOT}__resource-list-header__resources`}>
              <Legend
                toolTipGroupList={LegendToolTip}
                testId={`${ROOT}__legend-testId`}
              />
              {TextUtil.template(
                msg().Psa_Lbl_ShowResources,
                props.resourceList && props.resourceList.length
              )}
            </div>
          )}
          {props.resourceList && props.resourceList.length > 0 && (
            <div className={`${ROOT}__resource-list-header__values`}>
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
                    className={`${ROOT}__resource-list-header__value ${customClass}`}
                  >
                    <span className={`${ROOT}__schedule-dayname`}>
                      {dayName}
                    </span>
                    <span className={`${ROOT}__schedule-daynum`}>{dayNum}</span>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className={`${ROOT}__content-container`}>
        <div className={`${ROOT}__resource-container`}>
          <div className={`${ROOT}__resource-list-content`}>
            {!props.isLoading && viewAllResources}
          </div>
          {!props.isLoading &&
            props.pageNum === MAX_PAGE_NUM &&
            props.totalRecords > MAX_RECORD_NUM && (
              <div className={`${ROOT}-too-many-results`}>
                {msg().Com_Lbl_TooManySearchResults}
              </div>
            )}

          {props.resourceList && props.resourceList.length > 0 && (
            <Pagination
              className={`${ROOT}__list-pager ${props.isLoading && 'hidden'}`}
              totalNum={props.totalRecords}
              currentPage={props.pageNum}
              displayNum={5}
              pageSize={PAGE_SIZE_OPTIONS}
              onChangePageSize={(pageSize) => props.onChangeListSize(pageSize)}
              onClickPagerLink={(num) => props.onClickPagerLink(num)}
              maxPageNum={MAX_PAGE_NUM}
              havePagerInfo
              allowLargerPageSize
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAllResources;
