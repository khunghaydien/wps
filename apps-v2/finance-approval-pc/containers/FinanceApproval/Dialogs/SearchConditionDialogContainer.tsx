import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { cloneDeep, find, findIndex } from 'lodash';

import SearchCondition from '../../../../commons/components/exp/Form/Dialog/SearchCondition';
import msg from '../../../../commons/languages';

import {
  FAExpSearchConditionList,
  FAReqSearchConditionList,
  getSearchConditionListType,
  SearchConditions,
} from '../../../../domain/models/exp/FinanceApproval';

import { actions as commentActions } from '../../../../expenses-pc/modules/ui/expenses/dialog/approval/comment';
import { State } from '../../../modules';
import { actions as inputErrorActions } from '../../../modules/ui/FinanceApproval/dialog/searchCondition/inputError';
import { actions as selectedSearchConditionActions } from '../../../modules/ui/FinanceApproval/RequestList/selectedSearchCondition';
import { isRequestTab } from '@apps/finance-approval-pc/modules/ui/FinanceApproval/tabs';

import { saveSearchCondition } from '../../../action-dispatchers/FinanceApproval';

import { Props as OwnProps } from '../../../components/FinanceApproval/Dialog';

const SearchConditionContainer = (ownProps: OwnProps) => {
  const dispatch = useDispatch();

  const selectedCompanyId = useSelector(
    (state: State) =>
      state.ui.FinanceApproval.companySwitch || state.userSetting.companyId
  );
  const selectedTab = useSelector(
    (state: State) => state.ui.FinanceApproval.tabs.selected
  );
  const inputError = useSelector(
    (state: State) => state.ui.FinanceApproval.dialog.searchCondition.inputError
  );
  const comment = useSelector(
    (state: State) => state.ui.expenses.dialog.approval.comment
  );
  const name = useSelector(
    (state: State) => state.ui.expenses.dialog.approval.comment
  );
  const advSearchCondition = useSelector(
    (state: State) => state.common.exp.ui.reportList.advSearch
  );
  const selectedSearchConditionName = useSelector(
    (state: State) =>
      state.ui.FinanceApproval.RequestList.selectedSearchCondition
  );
  const selectedConditionName = useSelector(
    (state: State) =>
      state.ui.FinanceApproval.RequestList.selectedSearchCondition
  );
  const isRequestTabSelected = isRequestTab(selectedTab);
  const searchConditionListType =
    getSearchConditionListType(isRequestTabSelected);
  const allAdvSearchConditionList = useSelector(
    (state: State) =>
      state.entities.advSearchConditionList[searchConditionListType]
  );
  const fetchedAdvSearchConditionList = allAdvSearchConditionList.filter(
    ({ companyId }, idx) => selectedCompanyId === companyId || idx === 0
  );

  const actions = bindActionCreators(
    {
      saveSearchCondition,
      resetComment: commentActions.clear,
      setInputError: inputErrorActions.set,
      onChangeName: commentActions.set,
      setSearchCondition: selectedSearchConditionActions.set,
    },
    dispatch
  );

  const onClickSaveOverwriteButton = () => {
    actions.resetComment();
    const newSearchCondList = cloneDeep(allAdvSearchConditionList);
    const foundCond = find(fetchedAdvSearchConditionList, {
      name,
    });
    const isExistSameName =
      foundCond && foundCond.name !== selectedSearchConditionName;
    if (isExistSameName) {
      actions.setInputError(msg().Exp_Lbl_ExistsSameName);
    } else if (!name) {
      actions.setInputError(msg().Exp_Lbl_SetName);
    } else {
      const newCond = cloneDeep(advSearchCondition) as SearchConditions;
      newCond.name = name || selectedSearchConditionName;
      newCond.companyId = selectedCompanyId;
      const index = findIndex(newSearchCondList, {
        name: selectedSearchConditionName,
      });
      newSearchCondList[index] = newCond;
      newSearchCondList.splice(0, 1);

      actions.saveSearchCondition({
        [`${searchConditionListType}`]: newSearchCondList,
      } as FAReqSearchConditionList | FAExpSearchConditionList);

      if (name) {
        actions.setSearchCondition(name);
      }
    }
  };

  const onClickSaveNewButton = () => {
    actions.resetComment();
    const searchConditionList = cloneDeep(allAdvSearchConditionList);
    const isExistSameName = find(fetchedAdvSearchConditionList, {
      name,
    });

    if (isExistSameName) {
      actions.setInputError(msg().Exp_Lbl_ExistsSameName);
    } else if (!name) {
      actions.setInputError(msg().Exp_Lbl_SetName);
    } else {
      const searchCondition = cloneDeep(advSearchCondition) as SearchConditions;
      searchCondition.name = name;
      searchCondition.companyId = selectedCompanyId;
      searchConditionList.splice(0, 1);
      searchConditionList.push(searchCondition);
      actions
        .saveSearchCondition({
          [`${searchConditionListType}`]: searchConditionList,
        } as FAReqSearchConditionList | FAExpSearchConditionList)
        // @ts-ignore
        .then((isSuccess) => {
          if (isSuccess) {
            actions.setSearchCondition(name);
          }
        });
    }
  };

  return (
    <SearchCondition
      title={msg().Exp_Btn_SaveSearchCondition}
      comment={comment}
      inputError={inputError}
      selectedConditionName={selectedConditionName}
      onClickSaveNewButton={onClickSaveNewButton}
      onClickSaveOverwriteButton={onClickSaveOverwriteButton}
      onChangeName={actions.onChangeName}
      onClickHideDialogButton={ownProps.onClickHideDialogButton}
    />
  );
};

export default SearchConditionContainer;
