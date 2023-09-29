import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import moment from 'moment';

import { confirm } from '@apps/commons/actions/app';
import msg from '@apps/commons/languages';
import { processView } from '@apps/commons/utils/psa/resourcePlannerUtil';

import { CALL_BY, ViewTypes } from '@apps/domain/models/psa/Resource';

import { actions as siteRouteActions } from '@apps/resource-pc-schedule/modules/ui/siteRoute';
import { State } from '@psa/modules';
import { ResourceSelectionState } from '@resource/modules/ui/resourceSelection';

import { selfRescheduleRole } from '@psa/action-dispatchers/Role';
import {
  initializeReschedule,
  setResourceAvailability,
  setResourceAvailabilityDate,
  setResourceSelectionScheduledAvailableHours,
  setResourceSelectionScheduledBookedHours,
  setResourceSelectionScheduledCustomHours,
  setResourceSelectionScheduledRemainingHours,
  setResourceSelectionScheduleResult,
  setResourceSelectionState,
} from '@resource/action-dispatchers/Resource';

import SelfReschedule from '@apps/resource-pc-schedule/components/SelfReschedule';

const SelfRescheduleContainer = () => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const companyId = useSelector((state: State) => state.userSetting.companyId);
  const language = useSelector(
    (state: State) => state.userSetting.organizationSetting.language0
  );
  const currencyCode = useSelector(
    (state: State) => state.userSetting.currencyCode
  );
  const employeeId = useSelector(
    (state: State) => state.userSetting.employeeId
  );

  const isLoading = useSelector(
    (state: State) => state.common.app.loadingDepth > 0
  );

  const resourceAvailability = useSelector(
    (state: State) => state.ui.resourceAvailability
  );
  const resourceList = useSelector(
    (state: State) => state.entities.psa.resource.resourceList
  );
  const roleScheduleResult = useSelector(
    (state: State) => state.entities.psa.role.scheduleResult
  );
  const resourceSelection = useSelector(
    (state: State) => state.ui.resourceSelection
  );

  const selectedRole = useSelector(
    (state: State) => state.entities.psa.role.role
  );
  const roleUploadInProgress = useSelector(
    (state: State) => state.entities.psa.role.role.roleUploadInProcess
  );

  const selectedGroup = useSelector(
    (state: State) => state.entities.psa.psaGroup.selectedGroup
  );

  const projectTitle = useSelector(
    (state: State) => state.entities.psa.role.role.assignment.projectTitle
  );

  const projectWorkTimePerDay = useSelector(
    (state: State) =>
      state.entities.psa.role.role.assignment.projectWorkTimePerDay
  );

  const activityTitle = useSelector(
    (state: State) => state.entities.psa.role.role.assignment.activityTitle
  );
  const activityPlannedStartDate = useSelector(
    (state: State) =>
      state.entities.psa.role.role.assignment.activityPlannedStartDate
  );
  const activityPlannedEndDate = useSelector(
    (state: State) =>
      state.entities.psa.role.role.assignment.activityPlannedEndDate
  );
  useEffect(() => {
    dispatch(
      initializeReschedule(
        companyId,
        selectedRole,
        employeeId,
        {
          plannedStartDate: activityPlannedStartDate,
          plannedEndDate: activityPlannedEndDate,
        },
        CALL_BY.PM,
        selectedGroup.id,
        'User'
      )
    );
    dispatch(setResourceAvailabilityDate(''));
  }, []);

  useEffect(() => {
    if (roleUploadInProgress === true) {
      dispatch(siteRouteActions.showScheduleDetails());
    }
  }, [roleUploadInProgress]);

  const selectView = (page: number, view: string, nextStartDate: string) => {
    dispatch(
      setResourceAvailability(
        processView(
          page,
          resourceList.map((resource) => resource.availability),
          view,
          nextStartDate,
          activityPlannedStartDate
        )
      )
    );
  };
  const selectScheduledView = (
    page: number,
    view: string,
    nextStartDate: string
  ) => {
    dispatch(
      setResourceSelectionScheduledAvailableHours(
        processView(
          page,
          [roleScheduleResult.availableTime],
          view,
          nextStartDate,
          selectedRole.startDate
        ).availableHours
      )
    );
    dispatch(
      setResourceSelectionScheduledBookedHours(
        processView(
          page,
          [roleScheduleResult.bookedTime],
          view,
          nextStartDate,
          selectedRole.startDate
        ).availableHours
      )
    );
    dispatch(
      setResourceSelectionScheduledRemainingHours(
        processView(
          page,
          [roleScheduleResult.remainingHours],
          view,
          nextStartDate,
          selectedRole.startDate
        ).availableHours
      )
    );
    dispatch(
      setResourceSelectionScheduledCustomHours(
        processView(
          page,
          [roleScheduleResult.customHours],
          view,
          nextStartDate,
          selectedRole.startDate
        ).availableHours
      )
    );
  };

  const updateScheduledViewType = (view: string, pageNum?: number) => {
    dispatch(
      setResourceSelectionScheduledAvailableHours(
        processView(
          pageNum || 0,
          [roleScheduleResult.availableTime],
          view,
          pageNum && pageNum !== 0 ? resourceAvailability.startDate : '',
          selectedRole.startDate
        ).availableHours
      )
    );
    dispatch(
      setResourceSelectionScheduledBookedHours(
        processView(
          pageNum || 0,
          [roleScheduleResult.bookedTime],
          view,
          pageNum && pageNum !== 0 ? resourceAvailability.startDate : '',
          selectedRole.startDate
        ).availableHours
      )
    );
    dispatch(
      setResourceSelectionScheduledRemainingHours(
        processView(
          pageNum || 0,
          [roleScheduleResult.remainingHours],
          view,
          pageNum && pageNum !== 0 ? resourceAvailability.startDate : '',
          selectedRole.startDate
        ).availableHours
      )
    );
    dispatch(
      setResourceSelectionScheduledCustomHours(
        processView(
          pageNum || 0,
          [roleScheduleResult.customHours],
          view,
          pageNum && pageNum !== 0 ? resourceAvailability.startDate : '',
          selectedRole.startDate
        ).availableHours
      )
    );
  };
  const setCustomHours = (customHours: Array<number>) => {
    let updatedScheduleResult = {
      ...roleScheduleResult,
      customHours,
    };

    const originalCustomHours = Array.from(roleScheduleResult.customHours);
    const viewLimit = 12;
    const startIndex = resourceAvailability.page * viewLimit;
    const endIndex = startIndex + viewLimit;
    const adjustedArray = new Array(endIndex).fill(-1);
    originalCustomHours.forEach((hour, index) => (adjustedArray[index] = hour));
    let normalIndex = 0;
    for (let i = startIndex; i < endIndex; i++) {
      if (
        originalCustomHours[i] !== undefined ||
        originalCustomHours[i] !== null
      ) {
        adjustedArray[i] =
          customHours[normalIndex] === 0 ? -1 : customHours[normalIndex];
      }
      normalIndex++;
    }
    updatedScheduleResult = {
      ...roleScheduleResult,
      customHours: adjustedArray,
    };

    // Calculate remaining hours
    updatedScheduleResult.remainingHours =
      updatedScheduleResult.availableTime.map((hour, index) => {
        const considerMinusOne = hour === -1 ? 0 : hour;
        const result = updatedScheduleResult.customHours[index]
          ? considerMinusOne -
            (updatedScheduleResult.customHours[index] === -1
              ? 0
              : updatedScheduleResult.customHours[index])
          : hour;
        return result;
      });

    updatedScheduleResult.remainingHours =
      updatedScheduleResult.remainingHours.map(
        (hour, index) =>
          hour +
          (updatedScheduleResult.bookedTime[index]
            ? updatedScheduleResult.availableTime[index] === -1
              ? 0
              : updatedScheduleResult.bookedTime[index]
            : 0)
      );

    // Finally set the updated schedule result
    dispatch(setResourceSelectionScheduleResult(updatedScheduleResult));

    dispatch(
      setResourceSelectionScheduledCustomHours(
        processView(
          resourceAvailability.page,
          [customHours],
          ViewTypes.DAY,
          '',
          selectedRole.startDate
        ).availableHours
      )
    );

    // This update is for the date duration
    dispatch(
      setResourceAvailability(
        processView(
          resourceAvailability.page,
          resourceList.map((resource) => resource.availability),
          ViewTypes.DAY,
          resourceAvailability.startDate,
          selectedRole.startDate
        )
      )
    );
  };

  const scheduleBulkUpdate = (
    fromDate: string,
    toDate: string,
    workHours: number
  ) => {
    const activityStartDate = moment(activityPlannedStartDate);
    const bulkStartDate = moment(fromDate);
    const bulkEndDate = moment(toDate);
    const adjustedStartIndex = Math.abs(
      activityStartDate.diff(bulkStartDate, 'days')
    );
    const adjustedEndIndex = Math.abs(
      activityStartDate.diff(bulkEndDate, 'days')
    );

    const adjustedArray = new Array(adjustedEndIndex).fill(-1);

    const originalCustomHours = Array.from(roleScheduleResult.customHours);
    const capacityArray = Array.from(roleScheduleResult.capacity);
    const remainingArray = Array.from(roleScheduleResult.remainingHours);

    originalCustomHours.forEach((hour, index) => (adjustedArray[index] = hour));

    for (let i = adjustedStartIndex; i <= adjustedEndIndex; i++) {
      if (capacityArray[i] !== 0 || remainingArray[i] !== 0) {
        adjustedArray[i] = Math.ceil(workHours * 60);
      }
    }
    const updatedScheduleResult = {
      ...roleScheduleResult,
      customHours: adjustedArray,
    };

    // Calculate remaining hours
    updatedScheduleResult.remainingHours =
      updatedScheduleResult.availableTime.map((hour, index) => {
        const considerMinusOne = hour === -1 ? 0 : hour;
        const result = updatedScheduleResult.customHours[index]
          ? considerMinusOne -
            (updatedScheduleResult.customHours[index] === -1
              ? 0
              : updatedScheduleResult.customHours[index])
          : hour;
        return result;
      });

    updatedScheduleResult.remainingHours =
      updatedScheduleResult.remainingHours.map(
        (hour, index) =>
          hour +
          (updatedScheduleResult.bookedTime[index]
            ? updatedScheduleResult.availableTime[index] === -1
              ? 0
              : updatedScheduleResult.bookedTime[index]
            : 0)
      );

    // Finally set the updated schedule result
    dispatch(setResourceSelectionScheduleResult(updatedScheduleResult));

    // For the current display window
    const viewLimit = 12;
    const startIndex = resourceAvailability.page * viewLimit;
    const endIndex = startIndex + viewLimit;
    const customHours = adjustedArray.slice(startIndex, endIndex);

    dispatch(
      setResourceSelectionScheduledCustomHours(
        processView(
          resourceAvailability.page,
          [customHours],
          ViewTypes.DAY,
          '',
          selectedRole.startDate
        ).availableHours
      )
    );

    // This update is for the date duration
    dispatch(
      setResourceAvailability(
        processView(
          resourceAvailability.page,
          resourceList.map((resource) => resource.availability),
          ViewTypes.DAY,
          resourceAvailability.startDate,
          selectedRole.startDate
        )
      )
    );
  };
  const resetSchedule = (hours: Array<number>) => {
    dispatch(
      confirm(msg().Psa_Msg_ResetSchedule, (yes) => {
        if (yes) {
          dispatch(
            setResourceSelectionState(ResourceSelectionState.CUSTOM_PREVIEW)
          );
          const updatedScheduleResult = {
            ...roleScheduleResult,
            customHours: hours,
          };
          updatedScheduleResult.remainingHours =
            updatedScheduleResult.availableTime;

          // Finally set the updated schedule result
          dispatch(setResourceSelectionScheduleResult(updatedScheduleResult));

          dispatch(
            setResourceSelectionScheduledCustomHours(
              processView(
                resourceAvailability.page,
                [hours],
                ViewTypes.DAY,
                '',
                selectedRole.startDate
              ).availableHours
            )
          );

          // This update is for the date duration
          dispatch(
            setResourceAvailability(
              processView(
                resourceAvailability.page,
                resourceList.map((resource) => resource.availability),
                ViewTypes.DAY,
                resourceAvailability.startDate,
                selectedRole.startDate
              )
            )
          );
        }
      })
    );
  };

  const Actions = bindActionCreators(
    {
      selfRescheduleRole,
      setResourceSelectionState,
    },
    dispatch
  );

  return (
    <SelfReschedule
      activityTitle={activityTitle}
      activityEndDate={activityPlannedEndDate}
      activityStartDate={activityPlannedStartDate}
      currencyCode={currencyCode}
      isLoading={isLoading}
      language={language}
      projectTitle={projectTitle}
      projectWorkTimePerDay={projectWorkTimePerDay}
      rescheduleRole={Actions.selfRescheduleRole}
      resetSchedule={resetSchedule}
      resourceAvailability={resourceAvailability}
      resourceSelection={resourceSelection}
      roleScheduleResult={roleScheduleResult}
      scheduleBulkUpdate={scheduleBulkUpdate}
      selectedRole={selectedRole}
      selectScheduledView={selectScheduledView}
      selectView={selectView}
      setCustomHours={setCustomHours}
      setResourceSelectionState={Actions.setResourceSelectionState}
      updateScheduledViewType={updateScheduledViewType}
    />
  );
};

export default SelfRescheduleContainer;
