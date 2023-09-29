import React, { useEffect, useState } from 'react';

import get from 'lodash/get';
import has from 'lodash/has';
import isEqual from 'lodash/isEqual';
import last from 'lodash/last';
import moment from 'moment';

import AvailabilityItem from '@apps/commons/components/psa/AvailabilityItem';
import BookedHourItem from '@apps/commons/components/psa/BookedHourItem';
import CapabilityInfoContainer from '@apps/commons/containers/psa/CapabilityInfoContainer';
import msg from '@apps/commons/languages';
import {
  generateOutOfRangeArray,
  getAdjustedDate,
} from '@apps/commons/utils/psa/resourcePlannerUtil';

import { Activity } from '@apps/domain/models/psa/Activity';
import { Project } from '@apps/domain/models/psa/Project';
import {
  Role,
  RoleAssignParam,
  RoleScheduleParam,
  RoleScheduleResult,
} from '@apps/domain/models/psa/Role';

import { dialogTypes } from '@apps/psa-pc/modules/ui/dialog/activeDialog';
import { ResourceAvailabilityUIState } from '@resource/modules/ui/resourceAvailability';
import {
  ResourceSelectionState,
  ResourceSelectionUIState,
} from '@resource/modules/ui/resourceSelection';

import StrategyForm from '../StrategyForm';

import './index.scss';

const ROOT = 'ts-psa__resource-planner';

type Props = {
  activeDialog: Array<string>;
  activityTitle: string;
  assignRole: (roleAssignParam: RoleAssignParam) => void;
  backToRequestSelection: () => void;
  companyId: string;
  initializeResourceSelection: () => void;
  mode: string;
  openEmployeeCapabilityInfo: (empId: string) => void;
  openResourcePlannerCommentDialog?: () => void;
  projectTitle: string;
  resetStrategy: (hours: Array<number>) => void;
  resourceAvailability: ResourceAvailabilityUIState;
  resourceSelection: ResourceSelectionUIState;
  roleScheduleResult: RoleScheduleResult;
  schedulePreview: (
    roleScheduleParam: RoleScheduleParam,
    selectedResourceAvailability: Array<number>
  ) => void;
  selectedActivity: Activity;
  selectedProject: Project;
  selectedRole: Role;
  selectView: (page: number, view: string, date: string) => void;
  setCurrentStrategy: (strategy: string) => void;
  setCurrentWorkHoursPercentPerDay: (workHoursPercentPerDay: number) => void;
  setCurrentWorkHoursPerDay: (workHoursPerDay: number) => void;
  setCustomHours: (customHours: Array<number>) => void;
  setResourceSelectionState: (resourceSelectionState: string) => void;
  updateScheduledViewType: (view: string, pageNum?: number) => void;
};

const ResourceScheduler = (props: Props) => {
  const [resetButtonEnabled, setResetButtonEnabled] = useState(false);
  const isCapabilityInfoDialogActive =
    last(props.activeDialog) === dialogTypes.EMPLOYEE_CAPABILITY_INFO;

  useEffect(() => {
    const hasAvailableHours =
      get(props.roleScheduleResult, 'availableTime', []).length > 0;
    const hasBookedHours =
      get(props.roleScheduleResult, 'bookedTime', []).length > 0;
    const hasRemainingHours =
      get(props.roleScheduleResult, 'remainingHours', []).length > 0;
    if (
      hasAvailableHours &&
      hasBookedHours &&
      hasRemainingHours &&
      props.resourceSelection.currentState !==
        ResourceSelectionState.CUSTOM_SCHEDULE
    ) {
      props.updateScheduledViewType('day');
      props.selectView(0, 'day', '');
    }
    if (
      props.resourceSelection.currentState ===
      ResourceSelectionState.CUSTOM_SCHEDULE
    ) {
      props.updateScheduledViewType('day', props.resourceAvailability.page);
      props.selectView(props.resourceAvailability.page, 'day', '');
    }
  }, [props.roleScheduleResult]);

  useEffect(() => {
    if (
      isEqual(
        props.resourceSelection.scheduledBookedHours,
        props.resourceSelection.scheduledCustomHours
      )
    ) {
      setResetButtonEnabled(false);
    }
  }, [props.resourceSelection.scheduledCustomHours]);

  // -- Start Processing for Day/Week/Month View -- //
  const currentStartDate: any = props.resourceAvailability.startDate
    ? moment(props.resourceAvailability.startDate)
    : moment(props.selectedRole.startDate);
  const currentEndDate: any = currentStartDate
    .clone()
    .add(11, `${props.resourceAvailability.viewType}s`)
    .format('YYYY-MM-DD');
  const outOfRangeArray = generateOutOfRangeArray(
    props.resourceAvailability.viewType,
    currentStartDate,
    currentEndDate,
    moment(props.selectedRole.startDate),
    moment(props.selectedActivity.plannedEndDate)
  );

  const getTotal = (originalArray: Array<number>) => {
    if (originalArray.length === 0) return 0;
    return originalArray.reduce(
      (accumulator, currentValue) =>
        (accumulator === -1 ? 0 : accumulator) +
        (currentValue === -1 ? 0 : currentValue)
    );
  };

  // state booleans
  const isCustomScheduleState =
    props.resourceSelection.currentState ===
    ResourceSelectionState.CUSTOM_SCHEDULE;
  const isCustomPreviewState =
    props.resourceSelection.currentState ===
    ResourceSelectionState.CUSTOM_PREVIEW;
  const isStrategyPreviewState =
    props.resourceSelection.currentState ===
    ResourceSelectionState.STRATEGY_PREVIEW;
  const isSelectStrategyState =
    props.resourceSelection.currentState ===
    ResourceSelectionState.SELECT_STRATEGY;

  const showScheduledPreview =
    isStrategyPreviewState || isCustomScheduleState || isCustomPreviewState;
  const showOnlySelectedResource =
    has(props.resourceSelection, 'resource') &&
    props.resourceSelection.currentIndex >= 0 &&
    isSelectStrategyState;

  // process scheduleOutOfRangeArray
  let scheduleOutOfRangeArray = outOfRangeArray;
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
      props.selectedRole.startDate
    );
    scheduleOutOfRangeArray = generateOutOfRangeArray(
      props.resourceAvailability.viewType,
      currentStartDate,
      currentEndDate,
      moment(adjustedDuration.adjustedStartDate),
      moment(adjustedDuration.adjustedEndDate)
    );
  }

  const onChangeCustomHour = (updatedCustomHours: Array<number>) => {
    let isResetEnabled = false;
    for (let index = 0; index < updatedCustomHours.length; index++) {
      const min = updatedCustomHours[index];
      if (
        min !== props.resourceSelection.scheduledBookedHours[0][index] &&
        min !== -1
      ) {
        isResetEnabled = true;
        break;
      }
    }
    props.setCustomHours(updatedCustomHours);
    setResetButtonEnabled(isResetEnabled);
  };

  const onClickResetButton = (hours: Array<number>) => {
    props.resetStrategy(hours);
  };

  return (
    <div className={`${ROOT}`}>
      {isCapabilityInfoDialogActive && <CapabilityInfoContainer />}
      <div className={`${ROOT}__resource-list-content`}>
        <AvailabilityItem
          availableHours={
            showScheduledPreview || showOnlySelectedResource
              ? [
                  props.resourceAvailability.availableHours[
                    props.resourceSelection.currentIndex
                  ],
                ]
              : props.resourceSelection.scheduledAvailableHours
          }
          index={props.resourceSelection.currentIndex}
          isScheduled={showScheduledPreview}
          isSelected={!showScheduledPreview}
          openEmployeeCapabilityInfo={props.openEmployeeCapabilityInfo}
          outOfRangeArray={outOfRangeArray}
          resource={props.resourceSelection.resource}
          testId={`${ROOT}__resource-list-item--${props.resourceSelection.currentIndex}`}
          totalAvailableHours={
            +get(props.resourceSelection, 'resource.availableTime', 0)
          }
        />
      </div>

      {showScheduledPreview && (
        <div className={`${ROOT}__resource-preview-container`}>
          <div className={`${ROOT}__resource-preview-header`}>
            {msg().Psa_Lbl_ScheduleResult}
          </div>
          <div className={`${ROOT}__resource-list-content`}>
            <AvailabilityItem
              availableHours={props.resourceSelection.scheduledRemainingHours}
              index={props.resourceSelection.currentIndex}
              isSelected
              openEmployeeCapabilityInfo={props.openEmployeeCapabilityInfo}
              outOfRangeArray={outOfRangeArray}
              resource={props.resourceSelection.resource}
              testId={`${ROOT}__resource-list-item--${props.resourceSelection.currentIndex}`}
              totalAvailableHours={
                has(props.roleScheduleResult, 'remainingHours')
                  ? getTotal(props.roleScheduleResult.remainingHours)
                  : 0
              }
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
              bookedHours={props.resourceSelection.scheduledBookedHours}
              isCustomSchedule={
                props.resourceSelection.currentState ===
                ResourceSelectionState.CUSTOM_SCHEDULE
              }
              outOfRangeArray={scheduleOutOfRangeArray}
              projectTitle={props.projectTitle}
              setCustomHours={onChangeCustomHour}
              testId={`${ROOT}__resource-list-item--${props.resourceSelection.currentIndex}`}
              totalAvailableHours={getTotal(
                props.roleScheduleResult.customHours
              )}
            />
          </div>
        </div>
      )}

      <StrategyForm
        activeDialog={props.activeDialog}
        assignRole={props.assignRole}
        backToRequestSelection={props.backToRequestSelection}
        companyId={props.companyId}
        currentViewType={props.resourceAvailability.viewType}
        initializeResourceSelection={props.initializeResourceSelection}
        mode={props.mode}
        openResourcePlannerCommentDialog={
          props.openResourcePlannerCommentDialog
        }
        resetButtonEnabled={resetButtonEnabled}
        resetStrategy={onClickResetButton}
        resourceSelection={props.resourceSelection}
        resourceSelectionSchedulePreview={props.schedulePreview}
        roleScheduleResult={props.roleScheduleResult}
        selectedProject={props.selectedProject}
        selectedRole={props.selectedRole}
        setCurrentStrategy={props.setCurrentStrategy}
        setCurrentWorkHoursPercentPerDay={
          props.setCurrentWorkHoursPercentPerDay
        }
        setCurrentWorkHoursPerDay={props.setCurrentWorkHoursPerDay}
        setResourceSelectionState={props.setResourceSelectionState}
      />
    </div>
  );
};

export default ResourceScheduler;
