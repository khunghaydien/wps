import moment from 'moment';

import { PAGE_SIZE } from '@apps/commons/constants/psa/page';

import {
  catchApiError,
  catchBusinessError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';
import { actions as fetchingLoadingActions } from '@apps/commons/modules/psa/fetchingLoading';
import { actions as loadingMoreActions } from '@apps/commons/modules/psa/loadingMore';
import msg from '@commons/languages';

import { Activity } from '@apps/domain/models/psa/Activity';
import { Project } from '@apps/domain/models/psa/Project';
import { ScheduleStrategyConst } from '@apps/domain/models/psa/PsaResourceSchedule';
import {
  initialResourceSelectionFilterState,
  ResourceSelectionFilterParam,
} from '@apps/domain/models/psa/Request';
import {
  AssignmentDetailList,
  ResourceIdListSearchQuery,
  ResourceSearchQuery,
} from '@apps/domain/models/psa/Resource';
import {
  Role,
  RoleScheduleParam,
  RoleScheduleResult,
} from '@apps/domain/models/psa/Role';

import { actions as resourceActions } from '@apps/domain/modules/psa/resource';
import { actions as roleActions } from '@apps/domain/modules/psa/role';
import { actions as filterActions } from '@resource/modules/ui/filter/resourceSelection';
import { actions as viewAllResourcesFilterActions } from '@resource/modules/ui/filter/viewAllResources';
import { actions as modeActions, modes } from '@resource/modules/ui/mode';
import { actions as assignmentDetailUIActions } from '@resource/modules/ui/resourceAssignmentDetail';
import {
  actions as resourceUIActions,
  ResourceAvailabilityUIState,
} from '@resource/modules/ui/resourceAvailability';
import {
  actions as resourceSelectionActions,
  ResourceSelectionState,
  ResourceSelectionUIState,
} from '@resource/modules/ui/resourceSelection';
import { actions as siteRouteActions } from '@resource/modules/ui/siteRoute';

import { listCategory } from '@apps/admin-pc/actions/category';
import { searchJobGrade } from '@apps/admin-pc/actions/jobGrade';

import { AppDispatch } from './AppThunk';

export const selectResource = () => (dispatch: AppDispatch) => {
  dispatch(modeActions.selectRequest());
  dispatch(siteRouteActions.showResourcePlanner());
};
export const viewAllResources = () => (dispatch: AppDispatch) => {
  dispatch(siteRouteActions.showViewAllResources());
};
export const searchResource =
  (searchQuery, resourceAvailability, psaGroupId) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(resourceActions.list(searchQuery, psaGroupId))
      .then(() => {
        dispatch(siteRouteActions.showResourcePlanner());
        dispatch(
          setResourceAvailability({
            ...resourceAvailability,
            startDate: searchQuery.capacityStartDate,
            page: 0,
          })
        );
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };
export const loadMoreResource =
  (searchQuery, resourceAvailability, psaGroupId) =>
  async (dispatch: AppDispatch) => {
    dispatch(loadingMoreActions.loadingMoreStart());
    await dispatch(resourceActions.appendList(searchQuery, psaGroupId))
      .then(() => {
        dispatch(siteRouteActions.showResourcePlanner());
        dispatch(
          setResourceAvailability({
            ...resourceAvailability,
            startDate: searchQuery.capacityStartDate,
            page: 0,
          })
        );
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })));
    dispatch(loadingMoreActions.loadingMoreEnd());
  };
export const rescheduleResource = () => async (dispatch: AppDispatch) => {
  await dispatch(resourceUIActions.setAvailabilityPage(0));
  dispatch(siteRouteActions.showReschedule());
};

export const setResourceAvailability =
  (availability: ResourceAvailabilityUIState) => (dispatch: AppDispatch) => {
    dispatch(resourceUIActions.setAvailability(availability));
  };

export const setResourceAvailabilityDate =
  (date: string) => (dispatch: AppDispatch) => {
    dispatch(resourceUIActions.setAvailabilityDate(date));
  };

export const setAssignmentBookedTimePerDay =
  (bookedTimePerDay: Array<number>) => (dispatch: AppDispatch) => {
    dispatch(assignmentDetailUIActions.setBookedTimePerDay(bookedTimePerDay));
  };

export const setResourceSelectionState =
  (current: string) => (dispatch: AppDispatch) => {
    dispatch(resourceSelectionActions.setResourceSelectionState(current));
  };

export const setResourceSelectionIndex =
  (currentIndex: number) => (dispatch: AppDispatch) => {
    dispatch(resourceSelectionActions.setResourceIndex(currentIndex));
  };

export const initializeResourceSelection = () => (dispatch: AppDispatch) => {
  dispatch(resourceSelectionActions.initialize());
};

export const setResourceSelection =
  (resourceSelection: ResourceSelectionUIState) => (dispatch: AppDispatch) => {
    dispatch(resourceSelectionActions.setResourceSelection(resourceSelection));
  };

export const setCurrentStrategy =
  (strategy: string) => (dispatch: AppDispatch) => {
    dispatch(resourceSelectionActions.setCurrentStrategy(strategy));
  };

export const setCurrentWorkHoursPerDay =
  (workHourPerDay: number) => (dispatch: AppDispatch) => {
    dispatch(
      resourceSelectionActions.setCurrentWorkHoursPerDay(workHourPerDay)
    );
  };

export const setCurrentWorkHoursPercentPerDay =
  (workHourPercentPerDay: number) => (dispatch: AppDispatch) => {
    dispatch(
      resourceSelectionActions.setCurrentWorkHoursPercentPerDay(
        workHourPercentPerDay
      )
    );
  };

export const setResourceSelectionScheduledAvailableHours =
  (hours: Array<number>) => (dispatch: AppDispatch) => {
    dispatch(
      resourceSelectionActions.setResourceSelectionScheduledAvailableHours(
        hours
      )
    );
  };
export const setResourceSelectionScheduledBookedHours =
  (hours: Array<number>) => (dispatch: AppDispatch) => {
    dispatch(
      resourceSelectionActions.setResourceSelectionScheduledBookedHours(hours)
    );
  };
export const setResourceSelectionScheduledRemainingHours =
  (hours: Array<number>) => (dispatch: AppDispatch) => {
    dispatch(
      resourceSelectionActions.setResourceSelectionScheduledRemainingHours(
        hours
      )
    );
  };
export const setResourceSelectionScheduledCustomHours =
  (hours: Array<number>) => (dispatch: AppDispatch) => {
    dispatch(
      resourceSelectionActions.setResourceSelectionScheduledCustomHours(hours)
    );
  };
export const setResourceSelectionScheduleResult =
  (scheduleResult: RoleScheduleResult) => (dispatch: AppDispatch) => {
    dispatch(roleActions.setScheduleResult(scheduleResult));
  };
export const resourceSelectionSchedulePreview =
  (
    roleScheduleParam: RoleScheduleParam,
    startDate: string,
    selectedResourceAvailability: Array<number>
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    dispatch(
      resourceSelectionActions.schedulePreview(
        roleScheduleParam,
        startDate,
        selectedResourceAvailability
      )
    )
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

export const initialize =
  (
    psaGroupId: string,
    currentTab: string,
    companyId: string,
    selectedRole: Role,
    selectedProject: Project,
    activityStartDate: string,
    activityEndDate: string,
    employeeId: string,
    currencyCode: string,
    selectedResource?: any,
    mode?: string,
    excludeEmployeeIds?: Array<string>,
    roleId?: string
  ) =>
  async (dispatch: AppDispatch) => {
    const { requiredTime, skills, jobGrades, groupId, groupName, startDate } =
      selectedRole;
    const defaultSearchFilter: ResourceSelectionFilterParam = {
      companyId,
      startDate,
      endDate: activityEndDate,
      capacityStartDate: startDate,
      capacityEndDate: activityEndDate,
      requiredTime,
      skills,
      jobGradeIds: jobGrades && jobGrades.map((jobGrade) => jobGrade.id),
      rmId: employeeId,
      groupIds: [groupId],
      excludeEmployeeIds,
      callBy: currentTab,
    };
    dispatch(loadingStart());
    dispatch(
      resourceSelectionActions.setResourceSelectionState(
        selectedResource && mode === modes.RESOURCE_ASSIGNMENT
          ? ResourceSelectionState.SELECT_STRATEGY
          : ResourceSelectionState.SEARCH_RESOURCE
      )
    );
    dispatch(
      filterActions.update({
        ...initialResourceSelectionFilterState,
        requiredTime,
        skills:
          skills &&
          skills.map((skill) => ({
            ...skill,
            rating: [skill.min, skill.max],
          })),
        jobGradeIds:
          jobGrades &&
          jobGrades.map((jobGrade) => {
            const jobLabel =
              jobGrade.costRate > 0
                ? `${jobGrade.name} / ${currencyCode} ${jobGrade.costRate}`
                : jobGrade.name;
            return {
              id: jobGrade.id,
              label: jobLabel,
              value: jobGrade.name,
              costRate: jobGrade.costRate,
            };
          }),
        resourceGroups: [{ id: groupId, name: groupName }],
        startDate,
        endDate: activityEndDate,
      })
    );
    dispatch(listCategory({ companyId }));
    dispatch(searchJobGrade({ companyId, psaGroupId }));

    // Clear schedule result when the resource planner screen is initialized
    dispatch(roleActions.clearScheduleResult);

    // Fetching the resource available hours for selected resource when in RESOURCE_ASSIGNMENT mode
    // Currently, api does not support search by employeeId. So employee name is used here
    // Need to upgrade to search by employee id to be accurate
    if (selectedResource && mode === modes.RESOURCE_ASSIGNMENT) {
      dispatch(
        resourceActions.rescheduleList(
          {
            ...defaultSearchFilter,
            empBaseId: selectedResource.id,
            requiredTime: 0,
            name: selectedResource.name,
            skills: [],
            jobGradeIds: [],
            groupIds: [],
            roleId,
          },
          psaGroupId
        )
      )
        .then((resource) => {
          dispatch(
            resourceSelectionActions.setResourceSelection({
              currentState: ResourceSelectionState.SELECT_STRATEGY,
              currentIndex: 0,
              currentStrategy: ScheduleStrategyConst.AdjustConsiderAvailability,
              currentWorkHoursPerDay: +(
                (selectedProject.workTimePerDay *
                  (selectedRole.requiredTimePercentage / 100)) /
                60
              ).toFixed(1),
              currentWorkHoursPercentPerDay:
                selectedRole.requiredTimePercentage,
              resource:
                resource.payload.length > 0
                  ? resource.payload[0]
                  : {
                      ...selectedResource,
                      availableTime: 0,
                      availability: [-1],
                    },
            })
          );
          if (resource.payload.length === 0) {
            dispatch(
              resourceActions.setList([
                { ...selectedResource, availableTime: 0, availability: [-1] },
              ])
            );
          }
        })
        .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
        .finally(() => dispatch(loadingEnd()));
    } else {
      dispatch(
        resourceActions.list({ ...defaultSearchFilter, roleId }, psaGroupId)
      )
        .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
        .finally(() => dispatch(loadingEnd()));
    }
  };

type MinActivity = {
  plannedStartDate: string;
  plannedEndDate: string;
};

export const initializeReschedule =
  (
    companyId: string,
    selectedRole: Role,
    employeeId: string,
    selectedActivity: Activity | MinActivity,
    currentTab: string,
    psaGroupId: string,
    callBy?: string
  ) =>
  async (dispatch: AppDispatch) => {
    const defaultSearchFilter: ResourceSearchQuery = {
      companyId,
      startDate: selectedRole.startDate,
      endDate: selectedRole.endDate,
      rmId: employeeId,
      groupIds: [selectedRole.groupId],
      empBaseId: selectedRole.assignment.employeeId,
      callBy: callBy || currentTab,
    };
    dispatch(loadingStart());
    dispatch(
      resourceActions.rescheduleList(
        {
          ...defaultSearchFilter,
          empBaseId: selectedRole.assignment.employeeId,
          startDate: selectedActivity.plannedStartDate,
          endDate: selectedActivity.plannedEndDate,
          capacityStartDate: selectedActivity.plannedStartDate,
          capacityEndDate: selectedActivity.plannedEndDate,
        },
        psaGroupId
      )
    )
      .then((resourceList) => {
        const schedulePreviewResult: RoleScheduleResult = {
          startDate: selectedActivity.plannedStartDate,
          endDate: selectedActivity.plannedEndDate,
          availableTime: resourceList.payload[0].availability,
          bookedTime: selectedRole.assignment.bookedTimePerDay,
          capacity: resourceList.payload[0].capacity,
          remainingHours: [],
          customHours: [],
        };
        // Readjust book time if scheduled result is different from roleScheduleParam
        const originalStartDate = moment(selectedActivity.plannedStartDate);
        const scheduledStartDate = moment(selectedRole.assignment.startDate);
        const diffDay = scheduledStartDate.diff(originalStartDate, 'days');

        if (diffDay > 0) {
          const prependArray = new Array(diffDay).fill(0);
          schedulePreviewResult.bookedTime = prependArray.concat(
            schedulePreviewResult.bookedTime
          );
        }
        schedulePreviewResult.remainingHours =
          schedulePreviewResult.availableTime;
        schedulePreviewResult.customHours = schedulePreviewResult.bookedTime;
        dispatch(
          resourceSelectionActions.setResourceSelectionResource(
            resourceList.payload[0]
          )
        );
        dispatch(setResourceSelectionScheduleResult(schedulePreviewResult));
        dispatch(
          setResourceSelectionState(ResourceSelectionState.CUSTOM_SCHEDULE)
        );
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };

const today = moment();
const endOfNextYearNextMonth = today.clone().add(12, 'months').endOf('month');

export const fetchViewAllResourcesById =
  (
    ids: Array<string>,
    pageNum: number,
    totalRecords: number,
    totalPages: number,
    pageSize: number,
    startDate?: string,
    endDate?: string
  ) =>
  async (dispatch: AppDispatch) => {
    if (!ids || ids.length === 0) {
      dispatch(
        catchBusinessError(
          msg().Psa_Err_Unexpected,
          msg().Psa_Err_IdsNotSet,
          ''
        )
      );
    } else {
      dispatch(loadingStart());
      await dispatch(
        resourceActions.getByIdList({
          ids,
          startDate: startDate || today.format('YYYY-MM-01'),
          endDate: endDate || endOfNextYearNextMonth.format('YYYY-MM-DD'),
        })
      ).catch((err) => dispatch(catchApiError(err, { isContinuable: true })));
      await dispatch(
        resourceActions.setViewAllResourcePagination({
          totalRecords,
          totalPages,
          pageSize,
          pageNum,
          pageData: [],
        })
      );
      dispatch(loadingEnd());
    }
  };
export const fetchAssignmentDetailList =
  (
    id: string,
    resourceName: string,
    psaGroupId: string,
    startDate?: string,
    endDate?: string
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch(fetchingLoadingActions.fetchingLoadingStart());
    await dispatch(
      resourceActions.getAssignmentDetailList(
        {
          id,
          startDate: startDate || moment().format('YYYY-MM-01'),
          endDate: endDate || endOfNextYearNextMonth.format('YYYY-MM-DD'),
        },
        resourceName,
        psaGroupId
      )
    ).catch((err) => dispatch(catchApiError(err, { isContinuable: true })));
    dispatch(fetchingLoadingActions.fetchingLoadingEnd());
  };
export const setAssignmentDetailList =
  (assignmentDetailList: AssignmentDetailList) => (dispatch: AppDispatch) => {
    dispatch(resourceActions.setAssignmentDetailList(assignmentDetailList));
  };
export const fetchViewAllResources =
  (
    searchFilter: ResourceIdListSearchQuery,
    pageSize: number,
    psaGroupId: string,
    startDate?: string,
    endDate?: string,
    resourceAvailability?: any
  ) =>
  async (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    // View period is up to the first day of current month
    const startDateOfMonth = moment().format('YYYY-MM-01');
    const updatePageSize = pageSize === 0 ? 10 : pageSize;
    await dispatch(resourceActions.idList(searchFilter, psaGroupId))
      .then((response) => {
        if (response.payload.ids && response.payload.ids.length > 0) {
          dispatch(
            fetchViewAllResourcesById(
              response.payload.ids.slice(0, updatePageSize),
              1,
              response.payload.ids.length,
              Math.ceil(response.payload.ids.length / updatePageSize),
              updatePageSize,
              startDate || startDateOfMonth,
              endDate
            )
          );
          dispatch(
            setResourceAvailability({
              ...resourceAvailability,
              startDate,
              page: 0,
            })
          );
        } else {
          dispatch(resourceActions.initialize());
        }
      })
      .catch(() =>
        dispatch(
          catchBusinessError(
            msg().Psa_Err_Unexpected,
            msg().Psa_Err_DataLimitExceed,
            ''
          )
        )
      );
    dispatch(loadingEnd());
  };
export const initializePagination =
  (companyId: string, employeeId: string, callBy: string, psaGroupId: string) =>
  async (dispatch: AppDispatch) => {
    const defaultSearchFilter: ResourceIdListSearchQuery = {
      companyId,
      rmId: employeeId,
      groupIds: [],
      callBy,
      psaGroupId,
    };
    dispatch(loadingStart());
    dispatch(
      resourceSelectionActions.setResourceSelectionState(
        ResourceSelectionState.SEARCH_RESOURCE
      )
    );
    dispatch(
      viewAllResourcesFilterActions.update({
        ...initialResourceSelectionFilterState,
      })
    );
    dispatch(listCategory({ companyId }));
    dispatch(searchJobGrade({ companyId, psaGroupId }));
    dispatch(fetchViewAllResources(defaultSearchFilter, PAGE_SIZE, psaGroupId))
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .finally(() => dispatch(loadingEnd()));
  };
