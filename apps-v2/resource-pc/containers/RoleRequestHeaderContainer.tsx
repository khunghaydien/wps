import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { catchBusinessError } from '@commons/actions/app';

import { RoleRequestListFilterState } from '@apps/domain/models/psa/Request';

import { State } from '@resource/modules';
import { actions as requestSelectionFilterActions } from '@resource/modules/ui/filter/requestSelection';
import { actions as filterActions } from '@resource/modules/ui/filter/roleRequest';
import { modes } from '@resource/modules/ui/mode';

import { openEmployeeCapabilityInfo } from '@psa/action-dispatchers/PSA';
import {
  backToRequestList,
  fetchResourceRequestList,
} from '@resource/action-dispatchers/Request';
import { viewAllResources } from '@resource/action-dispatchers/Resource';
import { getGroupMembers } from '@resource/action-dispatchers/ResourceGroup';

import { formatDateRangeInFilter } from '@resource/utils';

import { getJobGradeList } from '@apps/admin-pc/containers/JobGradeContainer';

import RoleRequestHeader from '@resource/components/Header';

const RoleRequestHeaderContainer = () => {
  const dispatch = useDispatch() as ThunkDispatch<unknown, void, AnyAction>;

  const activeDialog = useSelector(
    (state: State) => state.ui.dialog.activeDialog
  );
  const companyId = useSelector((state: State) => state.userSetting.companyId);
  const currencyCode = useSelector(
    (state: State) => state.userSetting.currencyCode
  );
  const deptSuggestList = useSelector(
    (state: State) => state.entities.departmentList
  );
  const employeeName = useSelector(
    (state: State) => state.userSetting.employeeName
  );

  const groupDetail = useSelector(
    (state: State) => state.entities.psa.resourceGroup.detail
  );
  const groupList = useSelector(
    (state: State) => state.entities.psa.resourceGroup.groups
  );
  const jobGrades = useSelector((state: State) => getJobGradeList(state));
  const mode = useSelector((state: State) => state.ui.mode);
  const pageSize = useSelector(
    (state: State) => state.entities.psa.request.pageSize
  );
  const requestSelectionFilterState = useSelector(
    (state: State) => state.ui.filter.requestSelection
  );
  const roleRequestFilterState = useSelector(
    (state: State) => state.ui.filter.roleRequest
  );
  const selectedResource = useSelector(
    (state: State) => state.ui.resourceSelection.resource
  );

  const applyFilter = (nextFilterState: RoleRequestListFilterState) => {
    if (mode === modes.RESOURCE_ASSIGNMENT) {
      dispatch(requestSelectionFilterActions.update(nextFilterState));
    } else {
      dispatch(filterActions.update(nextFilterState));
    }

    dispatch(
      fetchResourceRequestList(
        companyId,
        1,
        formatDateRangeInFilter({
          ...nextFilterState,
          jobGradeIds: nextFilterState.jobGradeIds
            ? nextFilterState.jobGradeIds.map((jobGrade: any) => jobGrade.id)
            : null,
        }),
        pageSize
      )
    );
  };

  const Actions = bindActionCreators(
    {
      backToRequestList,
      catchBusinessError,
      fetchResourceRequestList,
      openEmployeeCapabilityInfo,
      updateRequestSelectionFilter: requestSelectionFilterActions.update,
      updateRoleRequestFilter: filterActions.update,
      viewAllResources,
      getGroupMembers,
    },
    dispatch
  );

  return (
    <RoleRequestHeader
      activeDialog={activeDialog}
      applyFilter={applyFilter}
      companyId={companyId}
      catchBusinessError={Actions.catchBusinessError}
      currencyCode={currencyCode}
      deptSuggestList={deptSuggestList}
      employeeName={employeeName}
      jobGrades={jobGrades}
      mode={mode}
      openEmployeeCapabilityInfo={Actions.openEmployeeCapabilityInfo}
      requestSelectionFilterState={requestSelectionFilterState}
      roleRequestFilterState={roleRequestFilterState}
      selectedResource={selectedResource}
      updateRoleRequestFilter={Actions.updateRoleRequestFilter}
      viewAllResources={Actions.viewAllResources}
      getGroupMembers={Actions.getGroupMembers}
      groupDetail={groupDetail}
      groupList={groupList}
    />
  );
};

export default RoleRequestHeaderContainer;
