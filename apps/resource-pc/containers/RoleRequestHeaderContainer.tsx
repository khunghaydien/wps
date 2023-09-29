import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { catchBusinessError } from '@commons/actions/app';

import { PsaPermissionType } from '@apps/domain/models/psa/PsaAccess';
import {
  makeInitialRequestListFilterState,
  RoleRequestListFilterState,
} from '@apps/domain/models/psa/Request';

import { actions as psaAccessSettingActions } from '@apps/domain/modules/psa/access';
import { actions as psaGroupActions } from '@apps/domain/modules/psa/psaGroup';
import { State } from '@resource/modules';
import { actions as requestSelectionFilterActions } from '@resource/modules/ui/filter/requestSelection';
import { actions as filterActions } from '@resource/modules/ui/filter/roleRequest';
import { modes } from '@resource/modules/ui/mode';

import { openEmployeeCapabilityInfo as openTalentProfile } from '@psa/action-dispatchers/PSA';
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
  const dispatch = useDispatch() as ThunkDispatch<State, void, AnyAction>;

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
  const employeeId = useSelector(
    (state: State) => state.userSetting.employeeId
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

  const groupDetail = useSelector(
    (state: State) => state.entities.psa.resourceGroup.detail
  );
  const groupList = useSelector(
    (state: State) => state.entities.psa.resourceGroup.groups
  );
  const psaGroupList = useSelector(
    (state: State) => state.entities.psa.psaGroup.groupList
  );
  const selectedGroup = useSelector(
    (state: State) => state.entities.psa.psaGroup.selectedGroup
  );
  const openEmployeeCapabilityInfo = (empId: string) => {
    dispatch(openTalentProfile(empId, selectedGroup.id));
  };
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
        selectedGroup.id,
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

  const updateSelectedGroup = (selectedGroupId: string) => {
    const newSelectedGroup = psaGroupList.filter(
      (group) => group.id === selectedGroupId
    );
    dispatch(psaGroupActions.setSelectedGroup(newSelectedGroup[0]));

    const initialFilterState: RoleRequestListFilterState =
      makeInitialRequestListFilterState(employeeName);
    if (mode === modes.RESOURCE_ASSIGNMENT) {
      dispatch(requestSelectionFilterActions.update(initialFilterState));
    } else {
      dispatch(filterActions.update(initialFilterState));
    }

    dispatch(
      fetchResourceRequestList(
        companyId,
        1,
        selectedGroupId,
        formatDateRangeInFilter({
          ...initialFilterState,
        }),
        pageSize
      )
    );
    const psaPermissions: Array<PsaPermissionType> = [
      'CONFIRM_PROJECT_ROLES',
      'UPLOAD_PROJECT_ROLES',
    ];
    dispatch(
      psaAccessSettingActions.get(
        employeeId,
        psaPermissions,
        newSelectedGroup[0].id
      )
    );
  };

  const Actions = bindActionCreators(
    {
      backToRequestList,
      catchBusinessError,
      fetchResourceRequestList,
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
      openEmployeeCapabilityInfo={openEmployeeCapabilityInfo}
      requestSelectionFilterState={requestSelectionFilterState}
      roleRequestFilterState={roleRequestFilterState}
      selectedResource={selectedResource}
      updateRoleRequestFilter={Actions.updateRoleRequestFilter}
      viewAllResources={Actions.viewAllResources}
      getGroupMembers={Actions.getGroupMembers}
      groupDetail={groupDetail}
      groupList={groupList}
      updateSelectedGroup={updateSelectedGroup}
      psaGroupList={psaGroupList}
      selectedGroup={selectedGroup}
    />
  );
};

export default RoleRequestHeaderContainer;
