import React, { useState } from 'react';

import has from 'lodash/has';
import isEqual from 'lodash/isEqual';
import last from 'lodash/last';
import moment from 'moment';

import Button from '@apps/commons/components/buttons/Button';
import DropDown from '@apps/commons/components/fields/Dropdown';
import TextField from '@apps/commons/components/fields/TextField';
import msg from '@apps/commons/languages/index';
import DateUtil from '@apps/commons/utils/DateUtil';
import {
  floorToOneDecimal,
  getAdjustedDate,
} from '@apps/commons/utils/psa/resourcePlannerUtil';
import Dropdown from '@apps/core/blocks/Dropdown';

import { Project } from '@apps/domain/models/psa/Project';
import { StrategyOptions } from '@apps/domain/models/psa/PsaResourceSchedule';
import { ViewTypes } from '@apps/domain/models/psa/Resource';
import {
  Role,
  ROLE_ACTIONS,
  RoleAssignParam,
  RoleScheduleParam,
  RoleScheduleResult,
} from '@apps/domain/models/psa/Role';

import { dialogTypes } from '@psa/modules/ui/dialog/activeDialog';
import { modes as projectModes } from '@psa/modules/ui/mode';
import { modes } from '@resource/modules/ui/mode';
import {
  ResourceSelectionState,
  ResourceSelectionUIState,
} from '@resource/modules/ui/resourceSelection';

import ProjectRoleCommentContainer from '@psa/containers/RoleCommentContainer';

import './index.scss';

const ROOT = 'ts-psa__resource-planner';

type Props = {
  activeDialog?: Array<string>;
  assignRole: (roleAssignParam: RoleAssignParam) => void;
  backToRequestSelection: () => void;
  companyId: string;
  currentViewType?: string;
  initializeResourceSelection: () => void;
  mode?: string;
  openResourcePlannerCommentDialog?: () => void;
  resetButtonEnabled: boolean;
  resetStrategy?: (hours: Array<number>) => void;
  resourceSelection: ResourceSelectionUIState;
  resourceSelectionSchedulePreview: (
    roleScheduleParam: RoleScheduleParam,
    selectedResourceAvailability: Array<number>
  ) => void;
  roleScheduleResult: RoleScheduleResult;
  selectedProject: Project;
  selectedRole: Role;
  setCurrentStrategy: (arg0: string) => void;
  setCurrentWorkHoursPercentPerDay: (arg0: number) => void;
  setCurrentWorkHoursPerDay: (arg0: number) => void;
  setResourceSelectionState?: (resourceSelectionState: string) => void;
};

export const checkChanged = (obj1: any, obj2: any) => {
  return obj1 === obj2 ? '' : 'changed';
};
enum EffortOption {
  HOURS,
  PERCENTAGE,
}
const StrategyForm = (props: Props) => {
  const [scheduleParamChanged, setScheduleParamChanged] = useState(false);
  const [requiredEffortUnit, setRequiredEffortUnit] = useState(
    EffortOption.PERCENTAGE
  );
  const [allocatedWorkHoursPercent, setAllocatedWorkHoursPercent] = useState(
    props.resourceSelection.currentWorkHoursPercentPerDay || ''
  );
  const [allocatedWorkHoursPerDay, setAllocatedWorkHoursPerDay] = useState(
    props.resourceSelection.currentWorkHoursPerDay || ''
  );

  const [assignedParam, setAssignedParam] = useState(null);

  const isStrategyPreviewState =
    props.resourceSelection.currentState ===
    ResourceSelectionState.STRATEGY_PREVIEW;
  const isSelectStrategyState =
    props.resourceSelection.currentState ===
    ResourceSelectionState.SELECT_STRATEGY;
  const isCustomScheduleState =
    props.resourceSelection.currentState ===
    ResourceSelectionState.CUSTOM_SCHEDULE;
  const isCustomPreviewState =
    props.resourceSelection.currentState ===
    ResourceSelectionState.CUSTOM_PREVIEW;

  let { startDate: scheduleStartDate, endDate: scheduleEndDate } =
    props.selectedRole;
  let bookedEffort = 0;

  if (props.resourceSelection && props.roleScheduleResult) {
    ({ startDate: scheduleStartDate, endDate: scheduleEndDate } =
      props.roleScheduleResult);
    const hourArray =
      isStrategyPreviewState &&
      isEqual(
        props.resourceSelection.scheduledBookedHours,
        props.resourceSelection.scheduledCustomHours
      )
        ? props.roleScheduleResult.bookedTime
        : props.roleScheduleResult.customHours;
    bookedEffort =
      hourArray.map((n) => (n === -1 ? 0 : n)).reduce((a, b) => a + b, 0) / 60;

    const adjustedDuration = getAdjustedDate(
      props.roleScheduleResult.customHours,
      props.selectedRole.startDate
    );

    if (
      props.resourceSelection.currentState ===
        ResourceSelectionState.CUSTOM_SCHEDULE ||
      !isEqual(
        props.roleScheduleResult.bookedTime,
        props.roleScheduleResult.customHours
      )
    ) {
      scheduleStartDate = adjustedDuration.adjustedStartDate;
      scheduleEndDate = adjustedDuration.adjustedEndDate;
    }
  }
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
          setScheduleParamChanged(true);
          props.setCurrentWorkHoursPerDay(+option);
          props.setCurrentWorkHoursPercentPerDay(calculatedPercent);
          setAllocatedWorkHoursPerDay(+option);
          setAllocatedWorkHoursPercent(calculatedPercent);
        } else {
          setAllocatedWorkHoursPerDay(option);
          setAllocatedWorkHoursPercent(option);
        }
      }
    } else if (requiredEffortUnit === EffortOption.PERCENTAGE) {
      if (option.match(/^$|^[1-9][0-9]?$|^100$/)) {
        setScheduleParamChanged(true);
        const calculatedHours = calculateHours(+option, hourPerDay);
        props.setCurrentWorkHoursPerDay(calculatedHours);
        props.setCurrentWorkHoursPercentPerDay(+option);
        setAllocatedWorkHoursPerDay(calculatedHours);
        setAllocatedWorkHoursPercent(+option);
      }
    }
  };
  const onSelectScheduleStrategy = (option: any) => {
    setScheduleParamChanged(true);
    props.setCurrentStrategy(option.value);
  };
  const onClickEditCustomSchedule = () => {
    props.setResourceSelectionState(ResourceSelectionState.CUSTOM_SCHEDULE);
  };

  const onclickReset = () => {
    props.resetStrategy(props.roleScheduleResult.bookedTime);
  };

  // on button click handlers
  const onClickPreviewSchedule = () => {
    if (isCustomScheduleState) {
      props.setResourceSelectionState(ResourceSelectionState.CUSTOM_PREVIEW);
    } else {
      if (has(props.resourceSelection, 'resource.id')) {
        const schedulePreviewParam = {
          roleId: props.selectedRole.roleId,
          companyId: props.companyId,
          employeeBaseId: props.resourceSelection.resource.id,
          startDate: props.selectedRole.startDate,
          endDate: props.selectedRole.endDate,
          timePerDay: Math.ceil(
            props.resourceSelection.currentWorkHoursPerDay * 60
          ),
          requiredTime: +props.selectedRole.requiredTime,
          strategy: props.resourceSelection.currentStrategy,
        };

        props.resourceSelectionSchedulePreview(
          schedulePreviewParam,
          props.resourceSelection.resource.availability
        );
        setScheduleParamChanged(false);
      }
    }
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

  const renderActiveDialog = () => {
    const currentActiveDialog = last(props.activeDialog);
    let dialog = null;
    if (currentActiveDialog === dialogTypes.RESOURCE_PLANNER_COMMENT) {
      dialog = (
        <ProjectRoleCommentContainer
          primaryAction={ROLE_ACTIONS.NOMINATE}
          onClickSubmit={(comment) => {
            const assignedParamWithComments = {
              ...assignedParam,
              comments: comment,
            };
            props.assignRole(assignedParamWithComments);
          }}
        />
      );
    }
    return dialog;
  };

  const onClickBookResource = () => {
    if (
      has(props.roleScheduleResult, 'bookedTime') &&
      has(props.resourceSelection, 'resource.id')
    ) {
      const strategyParam = {
        schedulingStrategy: props.resourceSelection.currentStrategy,
        bookedEffort: bookedEffort * 60,
        scheduledTimePerDay:
          props.resourceSelection.currentWorkHoursPerDay * 60,
      };
      const isCustomScheduleEdited = !isEqual(
        props.roleScheduleResult.customHours,
        props.roleScheduleResult.bookedTime
      );

      const roleAssignParam = {
        roleId: props.selectedRole.roleId,
        employeeBaseId: props.resourceSelection.resource.id,
        startDate: isCustomScheduleEdited
          ? scheduleStartDate
          : props.roleScheduleResult.startDate,
        endDate: isCustomScheduleEdited
          ? scheduleEndDate
          : props.roleScheduleResult.endDate,
        workTimePerDay: isCustomScheduleEdited
          ? trimBookedTime(
              props.roleScheduleResult.customHours,
              props.selectedRole.startDate,
              scheduleStartDate,
              scheduleEndDate
            ).map((x) => (x === -1 ? 0 : x))
          : trimBookedTime(
              props.roleScheduleResult.bookedTime,
              props.selectedRole.startDate,
              scheduleStartDate,
              scheduleEndDate
            ).map((x) => (x === -1 ? 0 : x)),
        strategy: strategyParam,
        assignBy: props.mode === projectModes.DIRECT_ASSIGNMENT ? 'PM' : 'RM',
      };
      if (props.mode === projectModes.DIRECT_ASSIGNMENT) {
        props.openResourcePlannerCommentDialog();
        setAssignedParam(roleAssignParam);
      } else props.assignRole(roleAssignParam);
    }
  };

  const onClickCancel = () => {
    setScheduleParamChanged(false);
    if (props.mode === modes.RESOURCE_ASSIGNMENT) {
      props.backToRequestSelection();
    } else {
      props.initializeResourceSelection();
    }
  };

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

  const isDisabled =
    isCustomScheduleState ||
    isCustomPreviewState ||
    !isEqual(
      props.resourceSelection.scheduledBookedHours,
      props.resourceSelection.scheduledCustomHours
    );
  return (
    <div className={`${ROOT}__schedule-strategy-form`}>
      <div className={`${ROOT}__schedule-strategy-form-header`}>
        <div className={`${ROOT}__schedule-strategy-form-header__title`}>
          {msg().Psa_Lbl_ScheduleStrategyDetails}
        </div>
        <div className={`${ROOT}__schedule-strategy-form-header__button-area`}>
          <Button
            className={`${ROOT}__schedule-strategy-edit-schedule-button`}
            type="default"
            onClick={onClickEditCustomSchedule}
            disabled={
              (!isStrategyPreviewState && !isCustomPreviewState) ||
              scheduleParamChanged ||
              props.currentViewType !== ViewTypes.DAY
            }
            data-testid={`${ROOT}__schedule-strategy-edit-schedule-button`}
          >
            {msg().Psa_Btn_EditSchedule}
          </Button>
          <Button
            className={`${ROOT}__schedule-strategy-reset-button`}
            data-testid={`${ROOT}__schedule-strategy-reset-button`}
            disabled={
              isStrategyPreviewState ||
              isSelectStrategyState ||
              !props.resetButtonEnabled
            }
            onClick={onclickReset}
            type="default"
          >
            {msg().Psa_Btn_Reset}
          </Button>
          <Button
            className={`${ROOT}__schedule-strategy-preview-button`}
            data-testid={`${ROOT}__schedule-strategy-preview-button`}
            disabled={
              (isStrategyPreviewState || isCustomPreviewState) &&
              !scheduleParamChanged
            }
            onClick={onClickPreviewSchedule}
            type="primary"
          >
            {msg().Psa_Lbl_PreviewSchedule}
          </Button>
        </div>
      </div>
      <div className={`${ROOT}__schedule-strategy-form-body`}>
        <div className={`${ROOT}__schedule-strategy-form-body__row`}>
          <div className={`${ROOT}__schedule-strategy-form-body__dropdown`}>
            <span className="label">{msg().Psa_Lbl_Strategy}</span>
            <Dropdown
              data-testid={`${ROOT}__schedule-strategy-form-body__dropdown__strategy`}
              listBoxClassName={`${ROOT}__strategy-dropdown`}
              onSelect={onSelectScheduleStrategy}
              options={StrategyOptions()}
              readOnly={isDisabled}
              value={props.resourceSelection.currentStrategy}
            />
          </div>
          <div className={`${ROOT}__schedule-strategy-form-body__dropdown`}>
            <span className="label">
              {`${msg().Psa_Lbl_WorkHoursPerDaySettings} (
              ${allocatedWorkHoursPerDay} ${msg().Psa_Lbl_Hours} |
              ${allocatedWorkHoursPercent}%)`}
            </span>
            <div className={`${ROOT}__work-hours-per-day`}>
              <TextField
                className={`${ROOT}__work-hours-per-day__input`}
                type={'string'}
                value={
                  requiredEffortUnit === EffortOption.HOURS
                    ? allocatedWorkHoursPerDay
                    : allocatedWorkHoursPercent
                }
                onChange={(e) => onSelectWorkHoursPerDay(e.target.value)}
                data-testid={`${ROOT}__schedule-strategy-form-body__work-hours-per-day`}
                disabled={
                  isCustomScheduleState ||
                  isCustomPreviewState ||
                  !isEqual(
                    props.resourceSelection.scheduledBookedHours,
                    props.resourceSelection.scheduledCustomHours
                  )
                }
              />
              <DropDown
                className={`${ROOT}__work-hours-per-day__dropdown${
                  isDisabled ? '__disabled' : ''
                }`}
                menuStyle={{ 'max-width': '100px' }}
                onSelect={(item) => {
                  setRequiredEffortUnit(item.value);
                }}
                options={effortOptions}
                value={requiredEffortUnit}
                disabled={isDisabled}
              />
            </div>
          </div>
        </div>
        <div className={`${ROOT}__schedule-strategy-form-body__row`}>
          <div className={`${ROOT}__schedule-strategy-form-body__field`}>
            <span className="label">
              {msg().Psa_Lbl_StrategyRequiredEffort}
            </span>
            <input
              className="value"
              value={`${floorToOneDecimal(
                +props.selectedRole.requiredTime / 60
              )} ${msg().Psa_Lbl_Hours}`}
              disabled
              data-testid={`${ROOT}__schedule-strategy-form-body__field__required-effort`}
            />
          </div>
          <div
            className={`${ROOT}__schedule-strategy-form-body__field ${checkChanged(
              props.selectedRole.startDate,
              scheduleStartDate
            )}`}
          >
            <span className="label">{msg().Psa_Lbl_StartDate}</span>
            <input
              className="value"
              value={`${DateUtil.format(scheduleStartDate)}`}
              disabled
              data-testid={`${ROOT}__schedule-strategy-form-body__field__scheduled-start-date`}
            />
          </div>
          <div
            className={`${ROOT}__schedule-strategy-form-body__field ${checkChanged(
              props.selectedRole.endDate,
              scheduleEndDate
            )}`}
          >
            <span className="label">{msg().Psa_Lbl_EndDate}</span>
            <input
              className="value"
              value={`${DateUtil.format(scheduleEndDate)}`}
              disabled
              data-testid={`${ROOT}__schedule-strategy-form-body__field__scheduled-end-date`}
            />
          </div>
          <div
            className={`${ROOT}__schedule-strategy-form-body__field ${checkChanged(
              props.selectedRole.requiredTime / 60,
              bookedEffort
            )}`}
          >
            <span className="label">{msg().Psa_Lbl_BookedEffort}</span>
            <input
              className="value"
              value={
                bookedEffort === 0
                  ? '-'
                  : `${floorToOneDecimal(bookedEffort)} ${msg().Psa_Lbl_Hours}`
              }
              disabled
              data-testid={`${ROOT}__schedule-strategy-form-body__field__booked-effort`}
            />
          </div>
        </div>
      </div>
      <div className={`${ROOT}__schedule-strategy-form-footer`}>
        <Button
          className={`${ROOT}__schedule-strategy-cancel-button`}
          type="default"
          onClick={onClickCancel}
          data-testid={`${ROOT}__schedule-strategy-cancel-button`}
        >
          {msg().Psa_Btn_Cancel}
        </Button>
        <Button
          className={`${ROOT}__schedule-strategy-book-button`}
          type="primary"
          onClick={onClickBookResource}
          disabled={
            isSelectStrategyState ||
            isCustomScheduleState ||
            scheduleParamChanged
          }
          data-testid={`${ROOT}__schedule-strategy-book-button`}
        >
          {msg().Psa_Btn_NominateAsCandidate}
        </Button>
      </div>
      {renderActiveDialog()}
    </div>
  );
};

export default StrategyForm;
