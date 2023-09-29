import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { cloneDeep, remove } from 'lodash';

import DeleteSearchCondition from '../../../../commons/components/exp/Form/Dialog/DeleteSearchCondition';
import { actions as accountingDateActions } from '@commons/modules/exp/ui/reportList/advSearch/accountingDateRange';
import { actions as amountActions } from '@commons/modules/exp/ui/reportList/advSearch/amountRange';
import { actions as costCenterActions } from '@commons/modules/exp/ui/reportList/advSearch/costCenterBaseIds';
import { actions as departmentActions } from '@commons/modules/exp/ui/reportList/advSearch/departmentBaseIds';
import { actions as detailActions } from '@commons/modules/exp/ui/reportList/advSearch/detail';
import { actions as employeeActions } from '@commons/modules/exp/ui/reportList/advSearch/empBaseIds';
import { actions as statusActions } from '@commons/modules/exp/ui/reportList/advSearch/financeStatusList';
import { actions as reportNoActions } from '@commons/modules/exp/ui/reportList/advSearch/reportNo';
import { actions as reportTypeActions } from '@commons/modules/exp/ui/reportList/advSearch/reportTypeIds';
import { actions as requestDateActions } from '@commons/modules/exp/ui/reportList/advSearch/requestDateRange';

import {
  FAExpSearchConditionList,
  FAReqSearchConditionList,
  getSearchConditionListType,
  SearchConditions,
} from '../../../../domain/models/exp/FinanceApproval';

import { actions as commentActions } from '../../../../expenses-pc/modules/ui/expenses/dialog/approval/comment';
import { State } from '../../../modules';
import { actions as selectedSearchConditionActions } from '../../../modules/ui/FinanceApproval/RequestList/selectedSearchCondition';
import { isRequestTab } from '@apps/finance-approval-pc/modules/ui/FinanceApproval/tabs';

import {
  deteleAdvSearchCondition,
  fetchFinanceApprovalIdList,
  fetchInitialSetting,
} from '../../../action-dispatchers/FinanceApproval';

import { Props as OwnProps } from '../../../components/FinanceApproval/Dialog';

const DeleteSearchConditionContainer = (ownProps: OwnProps) => {
  const dispatch = useDispatch();
  const selectedCompanyId = useSelector(
    (state: State) =>
      state.ui.FinanceApproval.companySwitch || state.userSetting.companyId
  );
  const selectedTab = useSelector(
    (state: State) => state.ui.FinanceApproval.tabs.selected
  );

  const selectedSearchConditionName = useSelector(
    (state: State) =>
      state.ui.FinanceApproval.RequestList.selectedSearchCondition
  );
  const isRequestTabSelected = isRequestTab(selectedTab);
  const searchConditionListType =
    getSearchConditionListType(isRequestTabSelected);
  const fetchedAdvSearchConditionList = useSelector(
    (state: State) =>
      state.entities.advSearchConditionList[searchConditionListType]
  );

  const actions = bindActionCreators(
    {
      fetchInitialSetting,
      fetchFinanceApprovalIdList,
      deteleAdvSearchCondition,
      setSearchCondition: selectedSearchConditionActions.set,
      resetDepartmentInitialValue: departmentActions.clear,
      resetDetailInitialValue: detailActions.clear,
      resetEmployeeInitialValue: employeeActions.clear,
      resetStatusInitialValue: statusActions.reset,
      resetComment: commentActions.clear,
      clearRequestDate: requestDateActions.clear,
      clearAccountingDate: accountingDateActions.clear,
      clearAmount: amountActions.clear,
      clearReportNo: reportNoActions.clear,
      resetReportTypeInitialValue: reportTypeActions.clear,
      resetCostCenterInitialValue: costCenterActions.clear,
    },
    dispatch
  );

  const onClickDeleteSearchCondition = () => {
    actions.resetComment();
    const cFetchedAdvSearchConditionList: SearchConditions[] = cloneDeep(
      fetchedAdvSearchConditionList
    );
    cFetchedAdvSearchConditionList.splice(0, 1);
    remove(cFetchedAdvSearchConditionList, (o) => {
      return (
        o.name === selectedSearchConditionName &&
        o.companyId === selectedCompanyId
      );
    });
    actions.deteleAdvSearchCondition({
      [`${searchConditionListType}`]: cFetchedAdvSearchConditionList,
    } as FAReqSearchConditionList | FAExpSearchConditionList);
    actions.setSearchCondition('');
    actions.resetDepartmentInitialValue();
    actions.resetEmployeeInitialValue();
    actions.resetStatusInitialValue();
    actions.clearRequestDate();
    actions.clearAccountingDate();
    actions.clearReportNo();
    actions.clearAmount();
    actions.resetDetailInitialValue();
    actions.resetReportTypeInitialValue();
    actions.resetCostCenterInitialValue();
    const _ = null;
    actions.fetchFinanceApprovalIdList(selectedCompanyId, _, _, _);
    actions.fetchInitialSetting();
  };

  return (
    <DeleteSearchCondition
      onClickDeleteSearchCondition={onClickDeleteSearchCondition}
      onClickHideDialogButton={ownProps.onClickHideDialogButton}
    />
  );
};

export default DeleteSearchConditionContainer;
