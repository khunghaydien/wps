import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import moment from 'moment';

import { confirm } from '@apps/commons/actions/app';
import Reschedule from '@apps/commons/components/psa/Reschedule';
import msg from '@apps/commons/languages';
import { processView } from '@apps/commons/utils/psa/resourcePlannerUtil';

import { ResourceSelectionFilterState } from '@apps/domain/models/psa/Request';
import { CALL_BY, ViewTypes } from '@apps/domain/models/psa/Resource';

import { State } from '@psa/modules';
import { actions as filterActions } from '@resource/modules/ui/filter/resourceSelection';
import { ResourceSelectionState } from '@resource/modules/ui/resourceSelection';

import {
  openEmployeeCapabilityInfo as openTalentProfile,
  openRoleCommentDialog,
} from '@psa/action-dispatchers/PSA';
import { rescheduleRole } from '@psa/action-dispatchers/Role';
import {
  initializeReschedule,
  resourceSelectionSchedulePreview,
  searchResource,
  setResourceAvailability,
  setResourceSelectionScheduledAvailableHours,
  setResourceSelectionScheduledBookedHours,
  setResourceSelectionScheduledCustomHours,
  setResourceSelectionScheduledRemainingHours,
  setResourceSelectionScheduleResult,
  setResourceSelectionState,
} from '@resource/action-dispatchers/Resource';
import { getGroupMembers } from '@resource/action-dispatchers/ResourceGroup';
import { selectRole } from '@resource/action-dispatchers/Role';

import { getJobGradeList } from '@apps/admin-pc/containers/JobGradeContainer';

import { addMinMax } from './ViewAllResourcesContainer';

const RescheduleContainer = () => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const activeDialog = useSelector(
    (state: State) => state.ui.dialog.activeDialog
  );
  const activityTitle = useSelector(
    (state: State) => state.entities.psa.activity.activity.title
  );
  const companyId = useSelector((state: State) => state.userSetting.companyId);
  const currencyCode = useSelector(
    (state: State) => state.userSetting.currencyCode
  );
  const employeeId = useSelector(
    (state: State) => state.userSetting.employeeId
  );
  const groupDetail = useSelector(
    (state: State) => state.entities.psa.resourceGroup.detail
  );
  const groupList = useSelector(
    (state: State) => state.entities.psa.resourceGroup.groups
  );
  const isLoading = useSelector(
    (state: State) => state.common.app.loadingDepth > 0
  );
  const jobGrades = useSelector((state: State) => getJobGradeList(state));
  const projectTitle = useSelector(
    (state: State) => state.entities.psa.request.request.projectTitle
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
  const resourceSelectionFilterState = useSelector(
    (state: State) => state.ui.filter.resourceSelection
  );
  const selectedActivity = useSelector(
    (state: State) => state.entities.psa.activity.activity
  );
  const selectedProject = useSelector(
    (state: State) => state.entities.psa.project.project
  );
  const siteRoute = useSelector((state: State) => state.ui.siteRoute);
  const selectedRole = useSelector(
    (state: State) => state.entities.psa.role.role
  );
  const skillCategories = useSelector(
    (state: State) => state.entities.skillsetCategoryList
  );
  const selectedGroup = useSelector(
    (state: State) => state.entities.psa.psaGroup.selectedGroup
  );
  const openEmployeeCapabilityInfo = (empId: string) => {
    dispatch(openTalentProfile(empId, selectedGroup.id));
  };

  useEffect(() => {
    dispatch(
      initializeReschedule(
        companyId,
        selectedRole,
        employeeId,
        selectedActivity,
        CALL_BY.PM,
        selectedGroup.id
      )
    );
  }, []);

  const applyFilter = (nextFilterState: ResourceSelectionFilterState) => {
    const excludeEmployeeIds = [];
    selectedRole &&
      selectedRole.assignments &&
      selectedRole.assignments.forEach((individualAssignment) =>
        excludeEmployeeIds.push(individualAssignment.employeeId)
      );
    dispatch(filterActions.update(nextFilterState));
    dispatch(
      searchResource(
        {
          ...nextFilterState,
          skills: nextFilterState.skills
            ? nextFilterState.skills.map(addMinMax)
            : null,
          jobGradeIds: nextFilterState.jobGradeIds
            ? nextFilterState.jobGradeIds.map((jobGrade) => jobGrade.id)
            : null,
          startDate: selectedRole.startDate,
          endDate: selectedRole.endDate,
          companyId,
          rmId: employeeId,
          requiredTime:
            nextFilterState.requiredTime === 0
              ? null
              : nextFilterState.requiredTime,
          groupIds: nextFilterState.resourceGroups
            ? nextFilterState.resourceGroups.map((group) => group.id)
            : [],
          excludeEmployeeIds,
        },
        [],
        selectedGroup.id
      )
    );
  };
  const selectView = (page: number, view: string, nextStartDate: string) => {
    dispatch(
      setResourceAvailability(
        processView(
          page,
          resourceList.map((resource) => resource.availability),
          view,
          nextStartDate,
          selectedActivity.startDate
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
  const updateViewType = (view: string, pageNum?: number) => {
    dispatch(
      setResourceAvailability(
        processView(
          pageNum || 0,
          resourceList.map((resource) => resource.availability),
          view,
          pageNum && pageNum !== 0 ? resourceAvailability.startDate : '',
          selectedRole.startDate
        )
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
    const activityStartDate = moment(selectedActivity.plannedStartDate);
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
      getGroupMembers,
      openRoleCommentDialog,
      rescheduleRole,
      resourceSelectionSchedulePreview,
      selectRole,
      setResourceSelectionState,
    },
    dispatch
  );

  return (
    <Reschedule
      activeDialog={activeDialog}
      activityTitle={activityTitle}
      applyFilter={applyFilter}
      currencyCode={currencyCode}
      getGroupMembers={Actions.getGroupMembers}
      groupDetail={groupDetail}
      groupList={groupList}
      isLoading={isLoading}
      jobGrades={jobGrades}
      openEmployeeCapabilityInfo={openEmployeeCapabilityInfo}
      openRoleCommentDialog={Actions.openRoleCommentDialog}
      projectTitle={projectTitle}
      rescheduleRole={Actions.rescheduleRole}
      resetSchedule={resetSchedule}
      resourceAvailability={resourceAvailability}
      resourceSelection={resourceSelection}
      resourceSelectionFilterState={resourceSelectionFilterState}
      roleScheduleResult={roleScheduleResult}
      scheduleBulkUpdate={scheduleBulkUpdate}
      selectedActivity={selectedActivity}
      selectedProject={selectedProject}
      selectedRole={selectedRole}
      selectRole={Actions.selectRole}
      selectScheduledView={selectScheduledView}
      selectView={selectView}
      setCustomHours={setCustomHours}
      setResourceSelectionState={Actions.setResourceSelectionState}
      siteRoute={siteRoute}
      skillCategories={skillCategories}
      updateScheduledViewType={updateScheduledViewType}
      updateViewType={updateViewType}
    />
  );
};

export default RescheduleContainer;
