import { connect } from 'react-redux';

import { cloneDeep, find, findIndex } from 'lodash';

import SearchCondition, {
  Props,
} from '../../../../commons/components/exp/Form/Dialog/SearchCondition';
import msg from '../../../../commons/languages';

import { SearchConditions } from '../../../../domain/models/exp/FinanceApproval';

import { actions as commentActions } from '../../../../expenses-pc/modules/ui/expenses/dialog/approval/comment';
import { State } from '../../../modules';
import { actions as inputErrorActions } from '../../../modules/ui/FinanceApproval/dialog/searchCondition/inputError';
import { actions as selectedSearchConditionActions } from '../../../modules/ui/FinanceApproval/RequestList/selectedSearchCondition';

import { saveSearchCondition } from '../../../action-dispatchers/FinanceApproval';

import { Props as OwnProps } from '../../../components/FinanceApproval/Dialog';

const mapStateToProps = (state: State) => ({
  title: msg().Exp_Btn_SaveSearchCondition,
  mainButtonTitle: msg().Exp_Lbl_Reject,
  photoUrl: state.userSetting.photoUrl,
  comment: state.ui.expenses.dialog.approval.comment,
  name: state.ui.expenses.dialog.approval.comment,
  inputError: state.ui.FinanceApproval.dialog.searchCondition.inputError,
  advSearchCondition: state.common.exp.ui.reportList.advSearch,
  selectedConditionName:
    state.ui.FinanceApproval.RequestList.selectedSearchCondition,
  fetchedAdvSearchConditionList: state.entities.advSearchConditionList,
  selectedSearchConditionName:
    state.ui.FinanceApproval.RequestList.selectedSearchCondition,
});

const mapDispatchToProps = {
  saveSearchCondition,
  resetComment: commentActions.clear,
  setInputError: inputErrorActions.set,
  onChangeName: commentActions.set,
  setSearchCondition: selectedSearchConditionActions.set,
};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: typeof mapDispatchToProps,
  ownProps: OwnProps
): Props => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  onClickSaveOverwriteButton: () => {
    dispatchProps.resetComment();
    const newSearchCondList = cloneDeep(
      stateProps.fetchedAdvSearchConditionList
    );
    const foundCond = find(newSearchCondList, {
      name: stateProps.name,
    });
    const isExistSameName =
      foundCond && foundCond.name !== stateProps.selectedSearchConditionName;
    if (isExistSameName) {
      dispatchProps.setInputError(msg().Exp_Lbl_ExistsSameName);
    } else if (!stateProps.name) {
      dispatchProps.setInputError(msg().Exp_Lbl_SetName);
    } else {
      const newCond = cloneDeep(
        stateProps.advSearchCondition
      ) as SearchConditions;
      newCond.name = stateProps.name || stateProps.selectedSearchConditionName;
      const index = findIndex(newSearchCondList, {
        name: stateProps.selectedSearchConditionName,
      });
      newSearchCondList[index] = newCond;
      newSearchCondList.shift();
      dispatchProps.saveSearchCondition(newSearchCondList);
      if (stateProps.name) {
        dispatchProps.setSearchCondition(stateProps.name);
      }
    }
  },
  onClickSaveNewButton: () => {
    dispatchProps.resetComment();
    const searchConditionList = cloneDeep(
      stateProps.fetchedAdvSearchConditionList
    );
    const isExistSameName = find(searchConditionList, {
      name: stateProps.name,
    });

    if (isExistSameName) {
      dispatchProps.setInputError(msg().Exp_Lbl_ExistsSameName);
    } else if (!stateProps.name) {
      dispatchProps.setInputError(msg().Exp_Lbl_SetName);
    } else {
      const searchCondition = cloneDeep(
        stateProps.advSearchCondition
      ) as SearchConditions;
      searchCondition.name = stateProps.name;
      searchConditionList.shift();
      searchConditionList.push(searchCondition);
      dispatchProps
        .saveSearchCondition(searchConditionList)
        // @ts-ignore
        .then((isSuccess) => {
          if (isSuccess) {
            dispatchProps.setSearchCondition(stateProps.name);
          }
        });
    }
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(SearchCondition) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
