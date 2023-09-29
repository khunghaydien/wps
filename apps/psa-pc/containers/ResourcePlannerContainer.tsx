import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import moment from 'moment';

import { confirm } from '@apps/commons/actions/app';
import ResourcePlanner from '@apps/commons/components/psa/ResourcePlanner';
import msg from '@apps/commons/languages';
import { processView } from '@apps/commons/utils/psa/resourcePlannerUtil';

import { ResourceSelectionFilterState } from '@apps/domain/models/psa/Request';
import { CALL_BY, ViewTypes } from '@apps/domain/models/psa/Resource';
import { RoleScheduleParam } from '@apps/domain/models/psa/Role';

import { State } from '@psa/modules';
import { actions as filterActions } from '@resource/modules/ui/filter/resourceSelection';
import { ResourceSelectionState } from '@resource/modules/ui/resourceSelection';

import { backToProjectList } from '@psa/action-dispatchers/Project';
import {
  openEmployeeCapabilityInfo as openTalentProfile,
  openResourcePlannerCommentDialog,
  overlapProject,
} from '@psa/action-dispatchers/PSA';
import {
  backToRequestList,
  goToRequestSelection,
  showDownloadToast,
} from '@resource/action-dispatchers/Request';
import {
  fetchAssignmentDetailList,
  initialize,
  initializeResourceSelection,
  loadMoreResource,
  resourceSelectionSchedulePreview,
  searchResource,
  setAssignmentBookedTimePerDay,
  setAssignmentDetailList,
  setCurrentStrategy,
  setCurrentWorkHoursPercentPerDay,
  setCurrentWorkHoursPerDay,
  setResourceAvailability,
  setResourceSelection,
  setResourceSelectionIndex,
  setResourceSelectionScheduledAvailableHours,
  setResourceSelectionScheduledBookedHours,
  setResourceSelectionScheduledCustomHours,
  setResourceSelectionScheduledRemainingHours,
  setResourceSelectionScheduleResult,
  setResourceSelectionState,
  viewAllResources,
} from '@resource/action-dispatchers/Resource';
import {
  getGroupList,
  getGroupMembers,
} from '@resource/action-dispatchers/ResourceGroup';
import { assignRole, selectRole } from '@resource/action-dispatchers/Role';

import { getJobGradeList } from '@apps/admin-pc/containers/JobGradeContainer';

import { addMinMax } from './ViewAllResourcesContainer';

const ResourcePlannerContainer = () => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const activeDialog = useSelector(
    (state: State) => state.ui.dialog.activeDialog
  );
  const activityTitle = useSelector(
    (state: State) => state.entities.psa.activity.activity.title
  );
  const assignmentDetail = useSelector(
    (state: State) => state.ui.resourceAssignmentDetail
  );
  const assignmentDetailList = useSelector(
    (state: State) =>
      state.entities.psa.resource.assignmentDetailList.assignments
  );
  const companyId = useSelector((state: State) => state.userSetting.companyId);
  const currencyCode = useSelector(
    (state: State) => state.userSetting.currencyCode
  );
  const deptSuggestList = useSelector(
    (state: State) => state.entities.departmentList
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
  const isFetching = useSelector((state: State) => state.ui.isLoading);
  const loadingMore = useSelector((state: State) => state.ui.loadingMore);
  const isLoading = useSelector(
    (state: State) => state.common.app.loadingDepth > 0
  );
  const jobGrades = useSelector((state: State) => getJobGradeList(state));
  const mode = useSelector((state: State) => state.ui.mode);
  const pageNum = useSelector(
    (state: State) => state.entities.psa.request.pageNum
  );
  const projectListFilterState = useSelector(
    (state: State) => state.ui.filter.project
  );
  const projectTitle = useSelector(
    (state: State) => state.entities.psa.request.request.projectTitle
  );
  const resourceAvailability = useSelector(
    (state: State) => state.ui.resourceAvailability
  );
  const resourceList = useSelector(
    (state: State) => state.entities.psa.resource.resourceList
  );
  const resourceSelection = useSelector(
    (state: State) => state.ui.resourceSelection
  );
  const resourceSelectionFilterState = useSelector(
    (state: State) => state.ui.filter.resourceSelection
  );
  const roleScheduleResult = useSelector(
    (state: State) => state.entities.psa.role.scheduleResult
  );
  const roleRequestFilterState = useSelector(
    (state: State) => state.ui.filter.roleRequest
  );
  const roleRequestSelectionFilterState = useSelector(
    (state: State) => state.ui.filter.requestSelection
  );
  const selectedActivity = useSelector(
    (state: State) => state.entities.psa.activity.activity
  );
  const selectedEmployeeId = useSelector(
    (state: State) =>
      state.entities.psa.resource.assignmentDetailList.employeeBaseId
  );
  const selectedProject = useSelector(
    (state: State) => state.entities.psa.project.project
  );
  const selectedRole = useSelector(
    (state: State) => state.entities.psa.role.role
  );
  const siteRoute = useSelector((state: State) => state.ui.siteRoute);
  const skillCategories = useSelector(
    (state: State) => state.entities.skillsetCategoryList
  );
  const selectedGroup = useSelector(
    (state: State) => state.entities.psa.psaGroup.selectedGroup
  );
  const excludeEmployeeIdList = useSelector(
    (state: State) => state.entities.psa.resource.excludeEmployeeIds
  );
  const openEmployeeCapabilityInfo = (empId: string) => {
    dispatch(openTalentProfile(empId, selectedGroup.id));
  };

  useEffect(() => {
    const excludeEmployeeIds = [];
    selectedRole &&
      selectedRole.assignments &&
      selectedRole.assignments.forEach((individualAssignment) =>
        excludeEmployeeIds.push(individualAssignment.employeeId)
      );
    dispatch(
      initialize(
        selectedGroup.id,
        CALL_BY.PM,
        companyId,
        selectedRole,
        selectedProject,
        selectedActivity.plannedStartDate,
        selectedActivity.plannedEndDate,
        employeeId,
        currencyCode,
        resourceSelection.resource,
        mode,
        excludeEmployeeIds,
        selectedRole.roleId
      )
    );
    dispatch(getGroupList(companyId, selectedGroup.id, selectedRole.rmId));
  }, []);

  const onClickBackToProjectList = () => {
    dispatch(
      backToProjectList(
        companyId,
        pageNum,
        selectedGroup.id,
        projectListFilterState
      )
    );
  };
  const schedulePreview = (
    roleScheduleParam: RoleScheduleParam,
    selectedResourceAvailability: Array<number>
  ) => {
    dispatch(
      resourceSelectionSchedulePreview(
        roleScheduleParam,
        selectedRole.startDate,
        selectedResourceAvailability
      )
    );
  };
  const applyFilter = (
    nextFilterState: ResourceSelectionFilterState,
    loadMore?: boolean
  ) => {
    let excludeEmployeeIds = [];

    selectedRole &&
      selectedRole.assignments &&
      selectedRole.assignments.forEach((individualAssignment) =>
        excludeEmployeeIds.push(individualAssignment.employeeId)
      );
    if (loadMore) {
      excludeEmployeeIds = excludeEmployeeIds.concat(excludeEmployeeIdList);
    }
    const nextFilterStartDate = moment(nextFilterState.startDate).isAfter(
      selectedRole.startDate
    )
      ? nextFilterState.startDate
      : selectedRole.startDate;

    const nextFilterEndDate = moment(nextFilterState.endDate).isBefore(
      selectedActivity.plannedEndDate
    )
      ? nextFilterState.endDate
      : selectedActivity.plannedEndDate;

    const searchResourceParam = {
      ...nextFilterState,
      skills: nextFilterState.skills
        ? nextFilterState.skills.map(addMinMax)
        : null,
      jobGradeIds: nextFilterState.jobGradeIds
        ? nextFilterState.jobGradeIds.map((jobGrade) => jobGrade.id)
        : null,
      startDate: nextFilterStartDate,
      endDate: nextFilterEndDate,
      capacityStartDate: selectedRole.startDate,
      capacityEndDate: selectedActivity.plannedEndDate,
      companyId,
      rmId: employeeId,
      groupIds: nextFilterState.resourceGroups
        ? nextFilterState.resourceGroups.map((group) => group.id)
        : [],
      excludeEmployeeIds,
      callBy: CALL_BY.PM,
      roleId: selectedRole.roleId,
    };

    dispatch(filterActions.update(nextFilterState));

    if (loadMore) {
      dispatch(loadMoreResource(searchResourceParam, [], selectedGroup.id));
    } else {
      dispatch(searchResource(searchResourceParam, [], selectedGroup.id));
    }
  };
  const selectView = (page: number, view: string, nextStartDate: string) => {
    dispatch(
      setResourceAvailability(
        processView(
          page,
          resourceList.map((resource) => resource.availability),
          view,
          nextStartDate,
          selectedRole.startDate
        )
      )
    );
    const processedData = processView(
      page,
      assignmentDetailList.map(
        (assignmentDetail) => assignmentDetail.bookedTimePerDay
      ),
      view,
      nextStartDate,
      moment().format()
    );
    dispatch(setAssignmentBookedTimePerDay(processedData.availableHours));
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
  const updateAssignmentBookedTimePerDay = (view: string) => {
    const processedData = processView(
      resourceAvailability.page,
      assignmentDetailList.map(
        (assignmentDetail) => assignmentDetail.bookedTimePerDay
      ),
      view,
      '',
      moment().format()
    );
    dispatch(setAssignmentBookedTimePerDay(processedData.availableHours));
  };
  const onClickBackToRequestList = () => {
    dispatch(
      backToRequestList(
        companyId,
        pageNum,
        selectedGroup.id,
        roleRequestFilterState
      )
    );
  };
  const onClickBackToRequestSelection = () => {
    dispatch(
      goToRequestSelection(
        companyId,
        pageNum,
        selectedGroup.id,
        roleRequestSelectionFilterState
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
  const setCustomHours = (customHours: Array<any>) => {
    const convertedCustomHours = customHours.map((x) => (x === '' ? 0 : x));
    let updatedScheduleResult = {
      ...roleScheduleResult,
      customHours: convertedCustomHours,
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
          convertedCustomHours[normalIndex] === 0
            ? -1
            : convertedCustomHours[normalIndex];
      }
      normalIndex++;
    }
    updatedScheduleResult = {
      ...roleScheduleResult,
      customHours: adjustedArray,
    };

    // Calculate remaining hours
    updatedScheduleResult.remainingHours =
      updatedScheduleResult.availableTime.map((hour, index) =>
        updatedScheduleResult.customHours[index]
          ? hour -
            (updatedScheduleResult.customHours[index] === -1
              ? 0
              : updatedScheduleResult.customHours[index])
          : hour
      );

    // Finally set the updated schedule result
    dispatch(setResourceSelectionScheduleResult(updatedScheduleResult));

    dispatch(
      setResourceSelectionScheduledCustomHours(
        processView(
          resourceAvailability.page,
          [convertedCustomHours],
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
  const resetStrategy = (hours: Array<number>) => {
    dispatch(
      confirm(msg().Psa_Msg_ResetStrategy, (yes) => {
        if (yes) {
          dispatch(
            setResourceSelectionState(ResourceSelectionState.STRATEGY_PREVIEW)
          );
          const updatedScheduleResult = {
            ...roleScheduleResult,
            customHours: hours,
          };
          updatedScheduleResult.remainingHours =
            updatedScheduleResult.availableTime.map((hour, index) =>
              updatedScheduleResult.customHours[index]
                ? hour -
                  (updatedScheduleResult.customHours[index] === -1
                    ? 0
                    : updatedScheduleResult.customHours[index])
                : hour
            );

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
      assignRole,
      backToProjectList,
      confirm,
      fetchAssignmentDetailList,
      getGroupList,
      getGroupMembers,
      goToRequestSelection,
      initializeResourceSelection,
      openEmployeeCapabilityInfo,
      openResourcePlannerCommentDialog,
      overlapProject,
      resourceSelectionSchedulePreview,
      searchResource,
      selectRole,
      setAssignmentBookedTimePerDay,
      setAssignmentDetailList,
      setCurrentStrategy,
      setCurrentWorkHoursPercentPerDay,
      setCurrentWorkHoursPerDay,
      setResourceAvailability,
      setResourceSelection,
      setResourceSelectionIndex,
      setResourceSelectionScheduledAvailableHours,
      setResourceSelectionScheduledBookedHours,
      setResourceSelectionScheduledCustomHours,
      setResourceSelectionScheduledRemainingHours,
      setResourceSelectionScheduleResult,
      setResourceSelectionState,
      showDownloadToast,
      viewAllResources,
    },
    dispatch
  );

  return (
    <ResourcePlanner
      activeDialog={activeDialog}
      activityTitle={activityTitle}
      applyFilter={applyFilter}
      assignmentDetail={assignmentDetail}
      assignmentDetailList={assignmentDetailList}
      assignRole={Actions.assignRole}
      backToProjectList={onClickBackToProjectList}
      backToRequestList={onClickBackToRequestList}
      backToRequestSelection={onClickBackToRequestSelection}
      companyId={companyId}
      currencyCode={currencyCode}
      deptSuggestList={deptSuggestList}
      fetchAssignmentDetailList={Actions.fetchAssignmentDetailList}
      getGroupList={Actions.getGroupList}
      getGroupMembers={Actions.getGroupMembers}
      groupDetail={groupDetail}
      groupList={groupList}
      initializeResourceSelection={Actions.initializeResourceSelection}
      isFetching={isFetching}
      isFetchingOthers={isFetching}
      isLoading={isLoading}
      loadingMore={loadingMore}
      jobGrades={jobGrades}
      mode={mode}
      openEmployeeCapabilityInfo={openEmployeeCapabilityInfo}
      openResourcePlannerCommentDialog={
        Actions.openResourcePlannerCommentDialog
      }
      overlapProject={Actions.overlapProject}
      projectTitle={projectTitle}
      resetStrategy={resetStrategy}
      resourceAvailability={resourceAvailability}
      resourceList={resourceList}
      resourceSelection={resourceSelection}
      resourceSelectionFilterState={resourceSelectionFilterState}
      resourceSelectionSchedulePreview={
        Actions.resourceSelectionSchedulePreview
      }
      roleScheduleResult={roleScheduleResult}
      schedulePreview={schedulePreview}
      selectedActivity={selectedActivity}
      selectedEmployeeId={selectedEmployeeId}
      selectedProject={selectedProject}
      selectedRole={selectedRole}
      selectRole={Actions.selectRole}
      selectScheduledView={selectScheduledView}
      selectView={selectView}
      setAssignmentDetailList={Actions.setAssignmentDetailList}
      setCurrentStrategy={Actions.setCurrentStrategy}
      setCurrentWorkHoursPercentPerDay={
        Actions.setCurrentWorkHoursPercentPerDay
      }
      setCurrentWorkHoursPerDay={Actions.setCurrentWorkHoursPerDay}
      setCustomHours={setCustomHours}
      setResourceSelection={Actions.setResourceSelection}
      setResourceSelectionState={Actions.setResourceSelectionState}
      showDownloadToast={Actions.showDownloadToast}
      siteRoute={siteRoute}
      skillCategories={skillCategories}
      updateAssignmentBookedTimePerDay={updateAssignmentBookedTimePerDay}
      updateScheduledViewType={updateScheduledViewType}
      viewAllResources={Actions.viewAllResources}
      selectedGroup={selectedGroup}
    />
  );
};

export default ResourcePlannerContainer;
