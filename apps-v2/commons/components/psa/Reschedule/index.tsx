import React, { useEffect, useState } from 'react';

import get from 'lodash/get';
import has from 'lodash/has';
import isEqual from 'lodash/isEqual';
import last from 'lodash/last';
import moment from 'moment';

import Button from '@apps/commons/components/buttons/Button';
import DropDown from '@apps/commons/components/fields/Dropdown';
import TextField from '@apps/commons/components/fields/TextField';
import AvailabilityItem from '@apps/commons/components/psa/AvailabilityItem';
import BookedHourItem from '@apps/commons/components/psa/BookedHourItem';
import PsaDateField from '@apps/commons/components/psa/Fields/DateField';
import ResourcePlannerFilterInfo from '@apps/commons/components/psa/FilterInfo';
import FormField from '@apps/commons/components/psa/FormField';
import PSACommonHeader from '@apps/commons/components/psa/Header';
import Legend from '@apps/commons/components/psa/Legend';
import ViewSelector from '@apps/commons/components/psa/ViewSelector';
import CapabilityInfoContainer from '@apps/commons/containers/psa/CapabilityInfoContainer';
import msg from '@apps/commons/languages/index';
import DateUtil from '@apps/commons/utils/DateUtil';
import {
  generateOutOfRangeArray,
  getAdjustedDate,
  getDynamicScheduleColumnHeader,
  sortByCode,
} from '@apps/commons/utils/psa/resourcePlannerUtil';

import { Activity } from '@apps/domain/models/psa/Activity';
import { LegendToolTip } from '@apps/domain/models/psa/LegendToolTip';
import { Project } from '@apps/domain/models/psa/Project';
import {
  initialResourceSelectionFilterState,
  ResourceSelectionFilterState,
} from '@apps/domain/models/psa/Request';
import { ViewTypes } from '@apps/domain/models/psa/Resource';
import {
  RMResourceGroup,
  RMResourceGroupArray,
} from '@apps/domain/models/psa/ResourceGroup';
import {
  Role,
  ROLE_ACTIONS,
  RoleRescheduleParam,
  RoleScheduleResult,
} from '@apps/domain/models/psa/Role';

import { dialogTypes } from '@psa/modules/ui/dialog/activeDialog';
import { ResourceAvailabilityUIState } from '@resource/modules/ui/resourceAvailability';
import {
  ResourceSelectionState,
  ResourceSelectionUIState,
} from '@resource/modules/ui/resourceSelection';

import ProjectRoleCommentContainer from '@psa/containers/RoleCommentContainer';

import './index.scss';

const ROOT = 'ts-psa__resource-reschedule';

type Props = {
  activeDialog: Array<string>;
  activityTitle: string;
  applyFilter: (nextState: ResourceSelectionFilterState) => void;
  currencyCode: string;
  getGroupMembers: (arg0: string) => void;
  groupDetail: RMResourceGroup;
  groupList: RMResourceGroupArray;
  jobGrades: Array<any>;
  openEmployeeCapabilityInfo: (empId: string) => void;
  openRoleCommentDialog: () => void;
  projectTitle: string;
  rescheduleRole: (roleRescheduleParam: RoleRescheduleParam) => void;
  resetSchedule: (hours: Array<number>) => void;
  resourceAvailability: ResourceAvailabilityUIState;
  resourceSelection: ResourceSelectionUIState;
  resourceSelectionFilterState: ResourceSelectionFilterState;
  roleScheduleResult: RoleScheduleResult;
  scheduleBulkUpdate: (
    fromDate: string,
    toDate: string,
    workinghours: number
  ) => void;
  selectedActivity: Activity;
  selectedProject: Project;
  selectedRole: Role;
  selectRole: (roleId: string) => void;
  selectScheduledView: (page: number, view: string, date: string) => void;
  selectView: (page: number, view: string, date: string) => void;
  setCustomHours: (customHours: Array<number>) => void;
  setResourceSelectionState: (resourceSelectionState: string) => void;
  siteRoute: string;
  skillCategories: Array<any>;
  updateScheduledViewType: (view: string, pageNum?: number) => void;
  updateViewType: (view: string, pageNum?: number) => void;
  isLoading: boolean;
};

const getFilterResultsLabel = () => ({
  departmentName: msg().Admin_Lbl_DepartmentName,
  name: msg().Psa_Lbl_ResourceName,
  position: msg().Psa_Lbl_JobTitle,
  requiredTime: msg().Psa_Lbl_RequiredEffort,
  skills: msg().Psa_Lbl_Skills,
  jobGradeIds: msg().Admin_Lbl_JobGrade,
  resourceGroups: msg().Admin_Lbl_ResourceGroup,
});

enum EffortOption {
  HOURS,
  PERCENTAGE,
}

const Reschedule = (props: Props) => {
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
  const [startBulkUpdate, setStartBulkUpdate] = useState();
  const [endBulkUpdate, setEndBulkUpdate] = useState();
  const [startDateError, setStartDateError] = useState('');
  const [endDateError, setEndDateError] = useState('');
  const [requiredEffortUnit, setRequiredEffortUnit] = useState(
    EffortOption.PERCENTAGE
  );
  const [allocatedWorkHoursPercent, setAllocatedWorkHoursPercent] = useState(
    props.resourceSelection.currentWorkHoursPercentPerDay || ''
  );
  const [allocatedWorkHoursPerDay, setAllocatedWorkHoursPerDay] = useState(
    props.resourceSelection.currentWorkHoursPerDay || ''
  );

  const effortOptions = [
    {
      label: msg().Psa_Lbl_Hours,
      value: EffortOption.HOURS,
    },
    {
      label: '%',
      value: EffortOption.PERCENTAGE,
    },
  ];

  const calculatedHoursPerDay = `${
    msg().Psa_Lbl_WorkHoursPerDaySettings
  } (${allocatedWorkHoursPercent}% = ${allocatedWorkHoursPerDay} ${
    msg().Psa_Lbl_Hours
  }) `;

  const { resourceAvailability } = props;
  const { page, viewType } = resourceAvailability;

  // @ts-ignore
  const isJapanLocale = window.empInfo.language === 'ja';

  useEffect(() => {
    const updatedJobGradeOptions = props.jobGrades.map((jobGrade) => {
      if (jobGrade.costRate > 0) {
        jobGrade.label = `${jobGrade.label} / ${props.currencyCode} ${jobGrade.costRate}`;
      }
      return jobGrade;
    });

    setJobGradeOptions(updatedJobGradeOptions.sort(sortByCode));
  }, []);

  useEffect(() => {
    const hasAvailableHours =
      get(props.roleScheduleResult, 'availableTime', []).length > 0;
    const hasBookedHours =
      get(props.roleScheduleResult, 'bookedTime', []).length > 0;
    const hasRemainingHours =
      get(props.roleScheduleResult, 'remainingHours', []).length > 0;
    if (hasAvailableHours && hasBookedHours && hasRemainingHours) {
      props.updateScheduledViewType(
        ViewTypes.DAY,
        get(props.resourceAvailability, 'page', 0)
      );
      props.updateViewType(
        ViewTypes.DAY,
        get(props.resourceAvailability, 'page', 0)
      );
    }
  }, [props.roleScheduleResult]);

  useEffect(() => {
    // @ts-ignore
    setReduxFilterState(props.resourceSelectionFilterState);
  }, [props.resourceSelectionFilterState]);

  // -- Start Processing for Day/Week/Month View -- //
  let currentStartDate: any = resourceAvailability.startDate
    ? moment(resourceAvailability.startDate)
    : moment(props.selectedActivity.plannedStartDate);
  let currentEndDate: any = currentStartDate
    .clone()
    .add(11, `${resourceAvailability.viewType}s`)
    .format('YYYY-MM-DD');
  const dynamicDateHeader = getDynamicScheduleColumnHeader(
    resourceAvailability.viewType,
    currentStartDate,
    isJapanLocale
  );

  // To display the duration, need to reassign the endDate for week view and month view
  if (resourceAvailability.viewType === ViewTypes.WEEK) {
    currentEndDate = moment(currentEndDate).add(6, 'days');
  } else if (resourceAvailability.viewType === ViewTypes.MONTH) {
    // Only update for month because month view always start from the first day.
    currentStartDate = moment(currentStartDate).startOf('month');
    currentEndDate = moment(currentEndDate).endOf('month');
  }

  const outOfRangeArray = generateOutOfRangeArray(
    props.resourceAvailability.viewType,
    currentStartDate,
    currentEndDate,
    moment(props.selectedActivity.plannedStartDate),
    moment(props.selectedActivity.plannedEndDate)
  );

  // -- End Processing for Day/Week/Month View -- //
  const customDateFormat = isJapanLocale ? 'YYYY/MM/DD' : 'LL';
  const viewDuration = `${DateUtil.customFormat(
    currentStartDate,
    customDateFormat
  )}
  - ${DateUtil.customFormat(currentEndDate, customDateFormat)}`;

  let scheduleStartDate = get(props.selectedRole, 'assignment.startDate', '');
  let scheduleEndDate = get(props.selectedRole, 'assignment.endDate', '');
  let scheduleEffort = 0;
  const bookedEffort =
    get(props.selectedRole, 'assignment.strategy.bookedEffort', 0) / 60;

  if (props.resourceSelection && props.roleScheduleResult) {
    const hourArray =
      props.resourceSelection.currentState ===
        ResourceSelectionState.STRATEGY_PREVIEW &&
      isEqual(
        props.resourceSelection.scheduledBookedHours,
        props.resourceSelection.scheduledCustomHours
      )
        ? props.roleScheduleResult.bookedTime
        : props.roleScheduleResult.customHours;
    scheduleEffort =
      hourArray.map((n) => (n === -1 ? 0 : n)).reduce((a, b) => a + b, 0) / 60;

    // adjust start and end date if the custom hours is different from book hours
    if (
      props.resourceSelection.currentState ===
        ResourceSelectionState.CUSTOM_SCHEDULE ||
      !isEqual(
        props.roleScheduleResult.bookedTime,
        props.roleScheduleResult.customHours
      )
    ) {
      const adjustedDuration = getAdjustedDate(
        props.roleScheduleResult.customHours,
        props.selectedActivity.plannedStartDate
      );

      scheduleStartDate = adjustedDuration.adjustedStartDate;
      scheduleEndDate = adjustedDuration.adjustedEndDate;
    }
  }

  // Display durations for current and scheduled
  const scheduleDuration = ` (${DateUtil.customFormat(
    scheduleStartDate,
    customDateFormat
  )}
  - ${DateUtil.customFormat(scheduleEndDate, customDateFormat)})`;

  const currentDuration = ` (${DateUtil.customFormat(
    get(props.selectedRole, 'assignment.startDate', ''),
    customDateFormat
  )}
  - ${DateUtil.customFormat(
    get(props.selectedRole, 'assignment.endDate', ''),
    customDateFormat
  )})`;

  // Dynamic constants based on props change
  const isCustomScheduleState =
    props.resourceSelection.currentState ===
    ResourceSelectionState.CUSTOM_SCHEDULE;
  const isCustomPreviewState =
    props.resourceSelection.currentState ===
    ResourceSelectionState.CUSTOM_PREVIEW;
  const isStrategyPreviewState =
    props.resourceSelection.currentState ===
    ResourceSelectionState.STRATEGY_PREVIEW;

  // process scheduleOutOfRangeArray
  let scheduleOutOfRangeArray = generateOutOfRangeArray(
    props.resourceAvailability.viewType,
    currentStartDate,
    currentEndDate,
    moment(props.selectedActivity.plannedStartDate),
    moment(props.selectedActivity.plannedEndDate)
  );
  if (isStrategyPreviewState) {
    scheduleOutOfRangeArray = generateOutOfRangeArray(
      props.resourceAvailability.viewType,
      currentStartDate,
      currentEndDate,
      moment(props.roleScheduleResult.startDate),
      moment(props.roleScheduleResult.endDate)
    );
  } else if (isCustomPreviewState) {
    const adjustedDuration = getAdjustedDate(
      props.roleScheduleResult.customHours,
      props.selectedActivity.plannedStartDate
    );
    scheduleOutOfRangeArray = generateOutOfRangeArray(
      props.resourceAvailability.viewType,
      currentStartDate,
      currentEndDate,
      moment(adjustedDuration.adjustedStartDate),
      moment(adjustedDuration.adjustedEndDate)
    );
  }

  // on click handlers
  const onClickEditCustomSchedule = () => {
    props.setResourceSelectionState(ResourceSelectionState.CUSTOM_SCHEDULE);
  };

  const onclickReset = () => {
    props.resetSchedule(props.roleScheduleResult.bookedTime);
  };

  // on button click handlers
  const onClickPreviewSchedule = () => {
    props.setResourceSelectionState(ResourceSelectionState.CUSTOM_PREVIEW);
  };

  const trimBookedTime = (
    bookedTime: number[],
    roleStartDate: string,
    scheduledStartDate: string,
    scheduledEndDate: string
  ) => {
    const start = moment(roleStartDate); // now
    const adjustedEndDate = moment(scheduledEndDate);
    const adjustedStartDate = moment(scheduledStartDate);

    const totalDays = adjustedEndDate.diff(adjustedStartDate, 'days') + 1;

    const adjustedBookTime = new Array(totalDays).fill(0);
    bookedTime.forEach((dailyHour, index) => {
      adjustedBookTime[index] = dailyHour;
    });

    const daysToTrim = adjustedStartDate.diff(start, 'days');
    adjustedBookTime.splice(0, daysToTrim);
    return adjustedBookTime.slice(0, totalDays);
  };

  const rescheduleResourceWithComments = (comments: string) => {
    if (
      has(props.roleScheduleResult, 'bookedTime') &&
      has(props.resourceSelection, 'resource.id')
    ) {
      const roleRescheduleParam = {
        roleId: props.selectedRole.roleId,
        startDate: scheduleStartDate,
        endDate: scheduleEndDate,
        workTimePerDay: trimBookedTime(
          props.roleScheduleResult.customHours,
          props.selectedActivity.plannedStartDate,
          scheduleStartDate,
          scheduleEndDate
        ).map((x) => (x === -1 ? 0 : x)),
        comments,
      };

      props.rescheduleRole(roleRescheduleParam);
    }
  };

  const onClickCancel = () => {
    props.selectRole(props.selectedRole.roleId);
  };

  const renderActiveDialog = () => {
    const currentActiveDialog = last(props.activeDialog);
    const isCapabilityInfoDialogActive =
      currentActiveDialog === dialogTypes.EMPLOYEE_CAPABILITY_INFO;

    let dialog = null;

    if (isCapabilityInfoDialogActive) {
      dialog = <CapabilityInfoContainer />;
    } else if (currentActiveDialog === dialogTypes.ROLE_COMMENT) {
      dialog = (
        <ProjectRoleCommentContainer
          primaryAction={ROLE_ACTIONS.RESCHEDULE}
          rescheduleResource={rescheduleResourceWithComments}
        />
      );
    }

    return dialog;
  };

  const enabledFilters = {
    endDate: false,
    requiredHours: true,
    startDate: false,
  };

  const onChangeCustomHour = (updatedCustomHours: Array<number>) => {
    props.setCustomHours(updatedCustomHours);
  };

  const calculatePercent = (targetNum: number, baseNum: number) => {
    return Math.ceil((targetNum / baseNum) * 100);
  };

  const calculateHours = (targetPercent: number, baseNum: number) => {
    return +((targetPercent * baseNum) / 100).toFixed(1);
  };

  // on change handlers
  const onSelectWorkHoursPerDay = (option: string) => {
    const hourPerDay = props.selectedProject.workTimePerDay / 60;
    if (option === '') {
      setAllocatedWorkHoursPerDay(option);
      setAllocatedWorkHoursPercent(option);
    } else if (requiredEffortUnit === EffortOption.HOURS) {
      // Allow empty string
      // Input is restrict from 0 to 12 with 1 decimal point
      // If the input is more than 12, auto assign to 12
      if (option.match(/^$|^([0-9]|1[012])(\.\d{0,1})?$/)) {
        if (+option > 12) {
          option = '12';
        }
        // Process only when whole number is detected
        if (option.match(/^\d*(\.\d+)?$/)) {
          const calculatedPercent = calculatePercent(+option, hourPerDay);
          // props.setCurrentWorkHoursPerDay(+option);
          // props.setCurrentWorkHoursPercentPerDay(calculatedPercent);
          setAllocatedWorkHoursPerDay(+option);
          setAllocatedWorkHoursPercent(calculatedPercent);
        } else {
          setAllocatedWorkHoursPerDay(option);
          setAllocatedWorkHoursPercent(option);
        }
      }
    } else if (requiredEffortUnit === EffortOption.PERCENTAGE) {
      if (option.match(/^$|^[0-9][0-9]?$|^100$/)) {
        const calculatedHours = calculateHours(+option, hourPerDay);
        // props.setCurrentWorkHoursPerDay(calculatedHours);
        // props.setCurrentWorkHoursPercentPerDay(+option);
        setAllocatedWorkHoursPerDay(calculatedHours);
        setAllocatedWorkHoursPercent(+option);
      }
    }
  };

  const applyBulkSchedule = () => {
    props.scheduleBulkUpdate(
      startBulkUpdate,
      endBulkUpdate,
      +allocatedWorkHoursPerDay
    );
    props.setResourceSelectionState(ResourceSelectionState.CUSTOM_PREVIEW);
  };

  const renderRescheduleHeader = () => {
    return (
      <div className={`${ROOT}__resource-list-content`}>
        <div className={`${ROOT}__resource-header-container`}>
          <div className={`${ROOT}__resource-list-header`}>
            <div className={`${ROOT}__resource-list-header__resources`}>
              <Legend
                toolTipGroupList={LegendToolTip}
                testId={`${ROOT}__legend-testId`}
              />
              {msg().Psa_Lbl_SelectedResource}
            </div>
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
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className={`${ROOT}`}>
      {renderActiveDialog()}
      <div className="ts-psa-fixed-header">
        <PSACommonHeader title={viewDuration}>
          <ViewSelector
            startDate={
              resourceAvailability.startDate
                ? resourceAvailability.startDate
                : props.selectedActivity.plannedStartDate
            }
            endDate={props.selectedActivity.plannedEndDate}
            page={page}
            viewType={viewType}
            selectView={props.selectView}
            updateScheduledViewType={props.updateScheduledViewType}
            selectScheduledView={props.selectScheduledView}
            scheduledEndDate={props.selectedActivity.plannedEndDate}
            resourceSelectionState={props.resourceSelection.currentState}
            isMonthViewDisabled={isCustomScheduleState || isCustomPreviewState}
            isWeekViewDisabled={isCustomScheduleState || isCustomPreviewState}
            reduxFilterState={reduxFilterState}
          />
        </PSACommonHeader>
        <ResourcePlannerFilterInfo
          showFilter={false}
          selectedRole={props.selectedRole}
          enabledFilters={enabledFilters}
          applyFilter={props.applyFilter}
          resourceSelectionFilterState={reduxFilterState}
          skillCategories={props.skillCategories}
          jobGradeOptions={jobGradeOptions}
          currencyCode={props.currencyCode}
          groupList={props.groupList}
          groupDetail={props.groupDetail}
          getGroupMembers={props.getGroupMembers}
          siteRoute={props.siteRoute}
          filterResultsLabel={getFilterResultsLabel()}
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
          }}
        />
        {renderRescheduleHeader()}
      </div>
      {!props.isLoading && (
        <div className={`${ROOT}__content-container`}>
          <div className={`${ROOT}__resource-container`}>
            <div className={`${ROOT}__resource-list-content`}>
              <div className={`${ROOT}__reschedule-form`}>
                <div className={`${ROOT}__reschedule-current-header`}>
                  <div className={`${ROOT}__reschedule-current-header__title`}>
                    {msg().Psa_Lbl_ScheduleCurrent}
                    {currentDuration}
                  </div>
                  <div className={`${ROOT}__reschedule-current-header__effort`}>
                    {msg().Psa_Lbl_AssignedEffortCurrent}: {bookedEffort}{' '}
                    {msg().Psa_Lbl_Hours}
                  </div>
                </div>
                <div className={`${ROOT}__reschedule-form-body`}>
                  <div className={`${ROOT}__reschedule-form-body__row`}>
                    <AvailabilityItem
                      availableHours={[
                        props.resourceAvailability.availableHours[0],
                      ]}
                      hideTotalHours
                      index={props.resourceSelection.currentIndex}
                      openEmployeeCapabilityInfo={
                        props.openEmployeeCapabilityInfo
                      }
                      outOfRangeArray={outOfRangeArray}
                      resource={props.resourceSelection.resource}
                      testId={`${ROOT}__resource-list-item--${props.resourceSelection.currentIndex}`}
                      totalAvailableHours={
                        +get(
                          props.resourceSelection,
                          'resource.availableTime',
                          0
                        )
                      }
                    />
                    <BookedHourItem
                      activityTitle={props.activityTitle}
                      assignmentStatus={props.selectedRole.status}
                      availableHours={
                        props.resourceSelection.scheduledBookedHours
                      }
                      hideTotalHours
                      outOfRangeArray={outOfRangeArray}
                      projectTitle={props.projectTitle}
                      testId={`${ROOT}__resource-list-item--${props.resourceSelection.currentIndex}`}
                      totalAvailableHours={0}
                    />
                  </div>
                </div>
              </div>

              <div className={`${ROOT}__reschedule-form`}>
                <div className={`${ROOT}__reschedule-form-header`}>
                  <div className={`${ROOT}__reschedule-form-header__title`}>
                    {msg().Psa_Lbl_ScheduleNew}
                    {scheduleDuration}
                  </div>
                  <div className={`${ROOT}__reschedule-form-header__effort`}>
                    {msg().Psa_Lbl_AssignedEffortNew}: {scheduleEffort}{' '}
                    {msg().Psa_Lbl_Hours}
                  </div>
                </div>
                <div className={`${ROOT}__reschedule-form-body`}>
                  <div className={`${ROOT}__reschedule-form-bulk-update__row`}>
                    <FormField
                      title={'From'}
                      testId={`${ROOT}__start-date`}
                      error={startDateError}
                      isTouched
                    >
                      <PsaDateField
                        className="ts-text-field slds-input"
                        value={startBulkUpdate}
                        onChange={(e) => {
                          setStartBulkUpdate(e);
                          const formattedStartDate = new Date(e);
                          const formattedEndDate = new Date(endBulkUpdate);
                          const activityStartDate = new Date(
                            props.selectedActivity.plannedStartDate
                          );
                          const activityEndDate = new Date(
                            props.selectedActivity.plannedEndDate
                          );
                          if (
                            endBulkUpdate &&
                            formattedStartDate > formattedEndDate
                          ) {
                            setStartDateError('Com_Err_InvalidEndDate');
                          } else if (
                            formattedStartDate < activityStartDate ||
                            formattedStartDate > activityEndDate
                          ) {
                            setStartDateError('Com_Err_InvalidDate');
                          } else {
                            if (formattedEndDate <= activityEndDate) {
                              setEndDateError('');
                            }
                            setStartDateError('');
                          }
                        }}
                        minDate={moment(
                          props.selectedActivity.plannedStartDate
                        )}
                        maxDate={moment(props.selectedActivity.plannedEndDate)}
                        disabled={
                          props.resourceSelection.currentState !==
                          ResourceSelectionState.CUSTOM_SCHEDULE
                        }
                      />
                    </FormField>

                    <span
                      className={`${ROOT}__reschedule-form-bulk-update__row__separator`}
                    >
                      –
                    </span>

                    <FormField
                      title={'To'}
                      testId={`${ROOT}__end-date`}
                      error={endDateError}
                      isTouched
                    >
                      <PsaDateField
                        className="ts-text-field slds-input"
                        value={endBulkUpdate}
                        onChange={(e) => {
                          setEndBulkUpdate(e);
                          const formattedStartDate = new Date(startBulkUpdate);
                          const formattedEndDate = new Date(e);
                          const activityStartDate = new Date(
                            props.selectedActivity.plannedStartDate
                          );
                          const activityEndDate = new Date(
                            props.selectedActivity.plannedEndDate
                          );
                          if (
                            endBulkUpdate &&
                            formattedStartDate > formattedEndDate
                          ) {
                            setEndDateError('Com_Err_InvalidEndDate');
                          } else if (
                            formattedEndDate > activityEndDate ||
                            formattedEndDate < activityStartDate
                          ) {
                            setEndDateError('Com_Err_InvalidDate');
                          } else {
                            if (formattedStartDate >= activityStartDate) {
                              setStartDateError('');
                            }
                            setEndDateError('');
                          }
                        }}
                        minDate={moment(
                          props.selectedActivity.plannedStartDate
                        )}
                        maxDate={moment(props.selectedActivity.plannedEndDate)}
                        disabled={
                          props.resourceSelection.currentState !==
                          ResourceSelectionState.CUSTOM_SCHEDULE
                        }
                      />
                    </FormField>

                    <FormField
                      className={`${ROOT}__work-hours-per-day`}
                      title={calculatedHoursPerDay}
                      testId={`${ROOT}__work-hours-per-day`}
                    >
                      <div className={`${ROOT}__work-hours-per-day__container`}>
                        <TextField
                          className={`${ROOT}__work-hours-per-day__input`}
                          type={'string'}
                          value={
                            requiredEffortUnit === EffortOption.HOURS
                              ? allocatedWorkHoursPerDay
                              : allocatedWorkHoursPercent
                          }
                          onChange={(e) =>
                            onSelectWorkHoursPerDay(e.target.value)
                          }
                          data-testid={`${ROOT}__reschedule-form-bulk-update__work-hours-per-day`}
                          disabled={
                            props.resourceSelection.currentState !==
                            ResourceSelectionState.CUSTOM_SCHEDULE
                          }
                        />
                        <DropDown
                          className={`${ROOT}__work-hours-per-day__dropdown`}
                          menuStyle={{ 'max-width': '80px' }}
                          onSelect={(item) => {
                            setRequiredEffortUnit(item.value);
                          }}
                          options={effortOptions}
                          value={requiredEffortUnit}
                          disabled={
                            props.resourceSelection.currentState !==
                            ResourceSelectionState.CUSTOM_SCHEDULE
                          }
                        />
                      </div>
                    </FormField>
                    <div className={`${ROOT}__bulk-preview-button-container`}>
                      <Button
                        className={`${ROOT}__bulk-update-button`}
                        type="primary"
                        onClick={applyBulkSchedule}
                        disabled={
                          !startBulkUpdate ||
                          !endBulkUpdate ||
                          startDateError !== '' ||
                          endDateError !== '' ||
                          props.resourceSelection.currentState !==
                            ResourceSelectionState.CUSTOM_SCHEDULE
                        }
                        data-testid={`${ROOT}__bulk-update-button`}
                      >
                        {msg().Com_Lbl_Apply}
                      </Button>
                    </div>
                  </div>
                  <div className={`${ROOT}__reschedule-form-body__row`}>
                    <div className={`${ROOT}__resource-reschedule-content`}>
                      <AvailabilityItem
                        availableHours={
                          props.resourceSelection.scheduledRemainingHours
                        }
                        hideTotalHours
                        index={props.resourceSelection.currentIndex}
                        openEmployeeCapabilityInfo={
                          props.openEmployeeCapabilityInfo
                        }
                        outOfRangeArray={scheduleOutOfRangeArray}
                        resource={props.resourceSelection.resource}
                        testId={`${ROOT}__resource-list-item--${props.resourceSelection.currentIndex}`}
                        totalAvailableHours={0}
                      />
                      <BookedHourItem
                        activityTitle={props.activityTitle}
                        assignmentStatus={props.selectedRole.status}
                        availableHours={
                          props.resourceSelection.currentState ===
                          ResourceSelectionState.CUSTOM_SCHEDULE
                            ? props.resourceSelection.scheduledCustomHours
                            : isEqual(
                                props.resourceSelection.scheduledBookedHours,
                                props.resourceSelection.scheduledCustomHours
                              )
                            ? props.resourceSelection.scheduledBookedHours
                            : props.resourceSelection.scheduledCustomHours
                        }
                        bookedHours={
                          props.resourceSelection.scheduledBookedHours
                        }
                        hideTotalHours
                        isCustomSchedule={
                          props.resourceSelection.currentState ===
                          ResourceSelectionState.CUSTOM_SCHEDULE
                        }
                        outOfRangeArray={scheduleOutOfRangeArray}
                        projectTitle={props.projectTitle}
                        setCustomHours={onChangeCustomHour}
                        testId={`${ROOT}__resource-list-item--${props.resourceSelection.currentIndex}`}
                        totalAvailableHours={0}
                      />
                    </div>
                  </div>
                </div>
                <div className={`${ROOT}__reschedule-form-footer`}>
                  <Button
                    className={`${ROOT}__reschedule-edit-schedule-button`}
                    type="default"
                    onClick={onClickEditCustomSchedule}
                    disabled={
                      props.resourceSelection.currentState !==
                        ResourceSelectionState.CUSTOM_PREVIEW ||
                      viewType !== ViewTypes.DAY
                    }
                    data-testid={`${ROOT}__reschedule-edit-schedule-button`}
                  >
                    {msg().Psa_Btn_EditSchedule}
                  </Button>
                  <Button
                    className={`${ROOT}__reschedule-reset-button`}
                    type="default"
                    onClick={onclickReset}
                    disabled={
                      props.resourceSelection.currentState ===
                        ResourceSelectionState.STRATEGY_PREVIEW ||
                      props.resourceSelection.currentState ===
                        ResourceSelectionState.SELECT_STRATEGY
                    }
                    data-testid={`${ROOT}__reschedule-reset-button`}
                  >
                    {msg().Psa_Btn_Reset}
                  </Button>
                  <Button
                    className={`${ROOT}__reschedule-preview-button`}
                    type="primary"
                    onClick={onClickPreviewSchedule}
                    disabled={
                      props.resourceSelection.currentState !==
                      ResourceSelectionState.CUSTOM_SCHEDULE
                    }
                    data-testid={`${ROOT}__reschedule-preview-button`}
                  >
                    {msg().Psa_Lbl_PreviewSchedule}
                  </Button>
                  <Button
                    className={`${ROOT}__reschedule-cancel-button`}
                    type="default"
                    onClick={onClickCancel}
                    data-testid={`${ROOT}__reschedule-cancel-button`}
                  >
                    {msg().Psa_Btn_Cancel}
                  </Button>
                  <Button
                    className={`${ROOT}__reschedule-save-button`}
                    type="primary"
                    onClick={props.openRoleCommentDialog}
                    disabled={
                      props.resourceSelection.currentState !==
                      ResourceSelectionState.CUSTOM_PREVIEW
                    }
                    data-testid={`${ROOT}__reschedule-save-button`}
                  >
                    {msg().Psa_Btn_Save}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reschedule;
