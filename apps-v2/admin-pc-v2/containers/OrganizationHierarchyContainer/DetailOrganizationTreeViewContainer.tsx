import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import DateUtil from '@commons/utils/DateUtil';

import { OrganizationHierarchyHistory } from '@apps/domain/models/organization/OrganizationHierarchy';

import DepartmentsActions from '../../action-dispatchers/OrganizationHierarchy/Departments';
import HistoriesActions from '../../action-dispatchers/OrganizationHierarchy/Histories';
import { AppDispatch } from '@admin-pc/action-dispatchers/AppThunk';

import { State } from '@admin-pc-v2/reducers';

import OrganizationTreeView from '../../presentational-components/OrganizationHierarchy/DetailOrganizationTreeView';

const mapStateToProps = (state: State) => ({
  orgPatternId: state.editRecord.id,
  companyId: state.base.menuPane.ui.targetCompanyId,
  searchHistory: state.organizationHierarchy.entities.histories,
  selectedHistory: state.organizationHierarchy.ui.selectedHistory,
  isRevisionDialogOpened:
    state.organizationHierarchy.ui.revisionDialog.isOpened,
  dialog: state.departmentManager.ui.dialog,
  sortCondition: state.base.listPane.ui.sortCondition,
});

const DetailOrganizationTreeViewContainer = () => {
  /*
   * Map State to Props
   */
  const {
    orgPatternId,
    companyId,
    searchHistory,
    selectedHistory,
    isRevisionDialogOpened,
    dialog,
    sortCondition,
  } = useSelector(mapStateToProps);

  const { validDateFrom: targetDate } = React.useMemo(
    () => selectedHistory || ({} as OrganizationHierarchyHistory),
    [selectedHistory]
  );

  /*
   * Map Dispatch to Props
   */
  const dispatch = useDispatch() as AppDispatch;
  const [
    {
      initialize: initializeHistories,
      clear: clearHistories,
      openRevisionDialog,
      closeRevisionDialog,
      ...historiesActions
    },
    { openDeptManagerDialog, removeDepartment, ...departmentsActions },
  ] = React.useMemo(
    () => [HistoriesActions(dispatch), DepartmentsActions(dispatch)],
    [dispatch]
  );

  /*
   * Merge Props
   */
  const switchCurrentHistory = React.useCallback(
    (id: string) => historiesActions.switchCurrentHistory(searchHistory, id),
    [historiesActions.switchCurrentHistory, searchHistory]
  );

  const reviseHistory = React.useCallback(
    ({ targetDate, comment }: { targetDate: string; comment: string }) =>
      historiesActions.reviseHistory({
        hierarchyPtnId: orgPatternId,
        validFrom: targetDate,
        comment,
      }),
    [historiesActions.reviseHistory, orgPatternId]
  );

  const deleteHistory = React.useCallback(
    () =>
      historiesActions.deleteHistory(
        selectedHistory?.id,
        { hierarchyPtnId: orgPatternId },
        searchHistory
      ),
    [historiesActions.deleteHistory, selectedHistory?.id, orgPatternId]
  );

  const getChildDepartments = React.useCallback(
    (deptId: string) => {
      if (!orgPatternId || !targetDate) {
        return Promise.resolve([]);
      }
      return departmentsActions.getChildDepartments(
        orgPatternId,
        targetDate,
        deptId
      );
    },
    [departmentsActions.getChildDepartments, orgPatternId, targetDate]
  );

  const searchDepartment = React.useCallback(
    (code: string, name: string, targetDate: string) =>
      departmentsActions.searchDepartment({
        code,
        name,
        targetDate,
        companyId,
        sortCondition,
      }),
    [departmentsActions.searchDepartment, companyId, sortCondition]
  );

  const addDepartment = React.useCallback(
    (param: { childBaseId: string; parentBaseId: string }) =>
      departmentsActions.addDepartment({
        ...param,
        hierarchyPatternId: orgPatternId,
        validFrom: selectedHistory.validDateFrom,
        validTo: DateUtil.addDays(selectedHistory.validDateTo, 1),
        removed: false,
      }),
    [departmentsActions.addDepartment, orgPatternId, selectedHistory]
  );

  /*
   * Life-Cycle
   */
  React.useEffect(() => {
    initializeHistories({ hierarchyPtnId: orgPatternId });
    return clearHistories;
  }, [orgPatternId]);

  /*
   * Applying
   */
  return (
    <OrganizationTreeView
      targetDate={selectedHistory?.validDateFrom}
      searchHistory={searchHistory}
      currentHistory={selectedHistory}
      onChangeHistory={switchCurrentHistory}
      onClickDeleteHistoryButton={deleteHistory}
      onClickRevisionButton={openRevisionDialog}
      isShowRevisionDialog={isRevisionDialogOpened}
      onClickExecuteReviseButton={reviseHistory}
      onClickCancelReviseButton={closeRevisionDialog}
      orgPatternId={orgPatternId}
      getChildDepartments={getChildDepartments}
      openDeptManagerDialog={openDeptManagerDialog}
      onSearchDepartment={searchDepartment}
      onAddDepartment={addDepartment}
      onRemoveChild={removeDepartment}
      dialog={dialog}
    />
  );
};

export default DetailOrganizationTreeViewContainer;
