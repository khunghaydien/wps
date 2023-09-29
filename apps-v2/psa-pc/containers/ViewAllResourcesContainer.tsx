import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import get from 'lodash/get';
import moment from 'moment';

import ViewAllResources from '@apps/commons/components/psa/ViewAllResources';
import { processView } from '@apps/commons/utils/psa/resourcePlannerUtil';

import {
  initialResourceSelectionFilterState,
  ResourceSelectionFilterState,
} from '@apps/domain/models/psa/Request';
import { CALL_BY, ViewTypes } from '@apps/domain/models/psa/Resource';

import { State } from '@psa/modules';
import { actions as filterActions } from '@resource/modules/ui/filter/viewAllResources';

import { openEmployeeCapabilityInfo } from '@psa/action-dispatchers/PSA';
import { openRoleDetails } from '@resource/action-dispatchers/Request';
import {
  fetchAssignmentDetailList,
  fetchViewAllResources,
  fetchViewAllResourcesById,
  initializePagination,
  setAssignmentBookedTimePerDay,
  setAssignmentDetailList,
  setResourceAvailability,
} from '@resource/action-dispatchers/Resource';
import {
  getGroupList,
  getGroupMembers,
} from '@resource/action-dispatchers/ResourceGroup';

import { getJobGradeList } from '@apps/admin-pc/containers/JobGradeContainer';

export const addMinMax = (skill: any) => ({
  ...skill,
  min: get(skill, 'rating.0', null),
  max: get(skill, 'rating.1', null),
});

const ViewAllResourcesContainer = () => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const activeDialog = useSelector(
    (state: State) => state.ui.dialog.activeDialog
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
  const isLoading = useSelector(
    (state: State) => state.common.app.loadingDepth > 0
  );
  const jobGrades = useSelector((state: State) => getJobGradeList(state));
  const pageNum = useSelector(
    (state: State) => state.entities.psa.resource.viewAllResourceList.pageNum
  );
  const pageSize = useSelector(
    (state: State) => state.entities.psa.resource.viewAllResourceList.pageSize
  );
  const resourceAvailability = useSelector(
    (state: State) => state.ui.resourceAvailability
  );
  const resourceIds = useSelector(
    (state: State) => state.entities.psa.resource.resourceIdList
  );
  const resourceList = useSelector(
    (state: State) => state.entities.psa.resource.resourceList
  );
  const selectedEmployeeId = useSelector(
    (state: State) =>
      state.entities.psa.resource.assignmentDetailList.employeeBaseId
  );
  const siteRoute = useSelector((state: State) => state.ui.siteRoute);
  const skillCategories = useSelector(
    (state: State) => state.entities.skillsetCategoryList
  );
  const totalRecords = useSelector(
    (state: State) =>
      state.entities.psa.resource.viewAllResourceList.totalRecords
  );
  const totalPages = useSelector(
    (state: State) => state.entities.psa.resource.viewAllResourceList.totalPages
  );
  const viewAllResourcesFilterState = useSelector(
    (state: State) => state.ui.filter.viewAllResources
  );

  useEffect(() => {
    dispatch(initializePagination(companyId, employeeId, CALL_BY.PM));
  }, []);

  const applyFilter = (nextFilterState: ResourceSelectionFilterState) => {
    const startDate = nextFilterState.startDate;
    const endDate = nextFilterState.endDate;
    if (startDate && endDate) {
      if (
        moment(endDate).diff(moment(startDate), 'days') < 11 ||
        !moment(endDate).isAfter(moment(startDate))
      ) {
        nextFilterState = {
          ...nextFilterState,
          startDate: initialResourceSelectionFilterState.startDate,
          endDate: initialResourceSelectionFilterState.endDate,
          isDateFilterNotApplied:
            initialResourceSelectionFilterState.isDateFilterNotApplied,
        };
      }
    }
    dispatch(filterActions.update(nextFilterState));
    dispatch(
      fetchViewAllResources(
        {
          ...nextFilterState,
          skills: nextFilterState.skills
            ? nextFilterState.skills.map(addMinMax)
            : null,
          jobGradeIds: nextFilterState.jobGradeIds
            ? nextFilterState.jobGradeIds.map((jobGrade) => jobGrade.id)
            : null,
          companyId,
          rmId: null,
          groupIds: nextFilterState.resourceGroups
            ? nextFilterState.resourceGroups.map((group) => group.id)
            : [],
          callBy: CALL_BY.PM,
        },
        pageSize,
        nextFilterState.startDate,
        nextFilterState.endDate,
        resourceAvailability
      )
    );
  };
  const onClickPagerLink = (pageNum: number) => {
    dispatch(
      fetchViewAllResourcesById(
        resourceIds.ids.slice((pageNum - 1) * pageSize, pageNum * pageSize),
        pageNum,
        totalRecords,
        totalPages,
        pageSize
      )
    );
  };
  const onChangeListSize = (listSize) => {
    dispatch(
      fetchViewAllResourcesById(
        resourceIds.ids.slice(0, listSize),
        1,
        totalRecords,
        Math.ceil(totalRecords / listSize),
        listSize
      )
    );
  };
  const selectView = (page: number, view: string, nextStartDate: string) => {
    const roleStartDate =
      view === ViewTypes.MONTH
        ? moment().format('YYYY-MM-01')
        : moment().format();
    dispatch(
      setResourceAvailability(
        processView(
          page,
          resourceList.map((resource) => resource.availability),
          view,
          nextStartDate,
          roleStartDate
        )
      )
    );
    const processedData = processView(
      page,
      assignmentDetailList?.map(
        (assignmentDetail) => assignmentDetail.bookedTimePerDay
      ),
      view,
      nextStartDate,
      roleStartDate
    );
    dispatch(setAssignmentBookedTimePerDay(processedData.availableHours));
  };
  const updateAssignmentBookedTimePerDay = (view: string) => {
    const processedData = processView(
      resourceAvailability.page,
      assignmentDetailList.map(
        (assignmentDetail) => assignmentDetail.bookedTimePerDay
      ),
      view,
      '',
      moment().format('YYYY-MM-01')
    );
    dispatch(setAssignmentBookedTimePerDay(processedData.availableHours));
  };

  const Actions = bindActionCreators(
    {
      fetchAssignmentDetailList,
      getGroupList,
      getGroupMembers,
      openEmployeeCapabilityInfo,
      openRoleDetails,
      setAssignmentDetailList,
    },
    dispatch
  );

  return (
    <ViewAllResources
      activeDialog={activeDialog}
      applyFilter={applyFilter}
      assignmentDetail={assignmentDetail}
      assignmentDetailList={assignmentDetailList}
      companyId={companyId}
      currencyCode={currencyCode}
      deptSuggestList={deptSuggestList}
      employeeId={employeeId}
      fetchAssignmentDetailList={Actions.fetchAssignmentDetailList}
      getGroupList={Actions.getGroupList}
      getGroupMembers={Actions.getGroupMembers}
      groupDetail={groupDetail}
      groupList={groupList}
      isLoading={isLoading}
      jobGrades={jobGrades}
      onChangeListSize={onChangeListSize}
      onClickPagerLink={onClickPagerLink}
      openEmployeeCapabilityInfo={Actions.openEmployeeCapabilityInfo}
      openRoleDetails={Actions.openRoleDetails}
      pageNum={pageNum}
      pageSize={pageSize}
      resourceAvailability={resourceAvailability}
      resourceList={resourceList}
      selectedEmployeeId={selectedEmployeeId}
      selectView={selectView}
      setAssignmentDetailList={Actions.setAssignmentDetailList}
      siteRoute={siteRoute}
      skillCategories={skillCategories}
      totalRecords={totalRecords}
      updateAssignmentBookedTimePerDay={updateAssignmentBookedTimePerDay}
      viewAllResourcesFilterState={viewAllResourcesFilterState}
      isFetching={isFetching}
      isFetchingOthers={isFetching}
    />
  );
};

export default ViewAllResourcesContainer;
