import { connect } from 'react-redux';

import SwitchEmployee, {
  Props,
} from '../../../../commons/components/exp/Form/Dialog/SwitchEmployee';

import { State } from '../../../modules';
import { actions as originalEmployeeActions } from '../../../modules/ui/expenses/delegateApplicant/originalEmployee';
import { actions as delegateApplicantActions } from '../../../modules/ui/expenses/delegateApplicant/selectedEmployee';
import { clearDefaultCostCenter } from '@apps/domain/modules/exp/cost-center/defaultCostCenter';
import { actions as tabAction } from '@apps/expenses-pc/modules/ui/expenses/tab';

import { initialize } from '../../../action-dispatchers/app';
import {
  clearHistories,
  setSelectedSubRole,
  setSubroleIds,
} from '../../../action-dispatchers/Expenses';

import { Props as OwnProps } from '../../../components/Expenses/Dialog';

const mapStateToProps = (state: State) => ({
  companyId: state.userSetting.companyId,
  employeeId: state.userSetting.employeeId,
  userSetting: state.userSetting,
  delegatorList: state.entities.exp.delegateApplicant,
  currentLanguage: state.userSetting.language,
  selectedTab: state.ui.expenses.tab.tabIdx,
});

const mapDispatchToProps = {
  setDelegateApplicant: delegateApplicantActions.set,
  setOriginalEmployee: originalEmployeeActions.set,
  initialize,
  setSubroleIds,
  setSelectedSubRole,
  clearDefaultCostCenter,
  clearHistories,
  changeTab: tabAction.changeTab,
};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: typeof mapDispatchToProps,
  ownProps: OwnProps
): Props => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,

  onClickEmployee: (empInfo) => {
    const originalUserInfo = stateProps.userSetting;
    dispatchProps.clearHistories();
    dispatchProps.setSubroleIds([]);
    dispatchProps.changeTab(0);
    dispatchProps.setSelectedSubRole(undefined);
    dispatchProps.setOriginalEmployee(originalUserInfo);
    dispatchProps.setDelegateApplicant(empInfo);
    dispatchProps.clearDefaultCostCenter();
    ownProps.onClickHideDialogButton();
    dispatchProps.initialize(empInfo.id, stateProps.currentLanguage, false);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(SwitchEmployee) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
