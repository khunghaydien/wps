import { connect } from 'react-redux';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import { confirm } from '../../../commons/actions/app';
import HeaderView from '../../../commons/components/exp/Header';
import msg from '../../../commons/languages';
import subRoleOptionHelper from '@apps/commons/components/exp/SubRole/subRoleOptionCreator';

import { expenseListArea } from '@apps/domain/models/exp/Report';

import { modes } from '../../modules/ui/expenses/mode';
import { actions as overlapActions } from '../../modules/ui/expenses/overlap';
import { actions as openTitleActions } from '../../modules/ui/expenses/recordListPane/summary/openTitle';
import { actions as viewAction } from '../../modules/ui/expenses/view';

import {
  createNewExpReport,
  getUserSettings,
  setSelectedSubRole,
} from '../../action-dispatchers/Requests';

const mapStateToProps = (state) => {
  const subroleIds = get(state, 'ui.expenses.subrole.ids');
  const delegateEmp = get(
    state,
    'ui.expenses.delegateApplicant.selectedEmployee'
  );
  const isProxyMode = !isEmpty(delegateEmp);
  const employeeDetails = get(state, 'common.exp.entities.employeeDetails');
  const employHistories = get(employeeDetails, 'details', undefined);
  const primaryRole = subRoleOptionHelper.getPrimaryRole(employHistories);
  const loadingAreas = get(state, 'common.app.loadingAreas', []);
  const isListLoading = loadingAreas.includes(expenseListArea);
  const selectedRoleId = get(state, 'ui.expenses.subrole.selectedRole');

  const tabCompanyId = get(state, 'ui.expenses.tab.companyId');
  const isPrimaryCompany =
    isEmpty(employHistories) || primaryRole?.companyId === tabCompanyId;

  return {
    isExpenseRequest: true,
    employeeId: state.userSetting.employeeId,
    mode: state.ui.expenses.mode,
    selectedView: state.ui.expenses.view,
    reportTypeList: state.entities.exp.expenseReportType.list.active,
    defaultCostCenter: {
      costCenterCode: state.userSetting.costCenterCode,
      costCenterName: state.userSetting.costCenterName,
      costCenterHistoryId: state.userSetting.costCenterHistoryId,
    },
    employHistories,
    subroleIds,
    isProxyMode,
    primaryRoleId: get(primaryRole, 'id'),
    isListLoading,
    selectedRoleId,
    isPrimaryCompany,
  };
};

const mapDispatchToProps = {
  confirm,
  createNewExpReport,
  openTitle: openTitleActions.open,
  closeTitle: openTitleActions.close,
  backToHome: overlapActions.nonOverlapReport,
  moveToReport: overlapActions.overlapReport,
  moveToRecord: overlapActions.overlapRecord,
  closeRecord: overlapActions.nonOverlapRecord,
  setDetailView: viewAction.setDetailView,
  setSelectedExpenseSubRole: setSelectedSubRole,
  getUserSettings,
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  onClickNewReportButton: () => {
    const { isProxyMode, subroleIds, employHistories, isPrimaryCompany } =
      stateProps;
    const callback = async (yes: boolean) => {
      if (yes) {
        dispatchProps.openTitle();
        dispatchProps.createNewExpReport(
          stateProps.reportTypeList,
          stateProps.defaultCostCenter
        );
        dispatchProps.closeRecord();
        dispatchProps.moveToReport();
        const roleId = subRoleOptionHelper.getFirstActiveRole(
          subroleIds,
          employHistories,
          isPrimaryCompany
        );
        if (roleId !== stateProps.selectedRoleId && !isProxyMode) {
          dispatchProps.setSelectedExpenseSubRole(roleId);
        }
        if (!isProxyMode) await dispatchProps.getUserSettings(roleId);
        dispatchProps.setDetailView();
      }
    };

    if (stateProps.mode === modes.REPORT_EDIT) {
      dispatchProps.confirm(msg().Common_Confirm_DiscardEdits, callback);
    } else {
      callback(true);
    }
  },
  onClickNewRecordButton: () => {
    const callback = (yes: boolean) => {
      if (yes) {
        dispatchProps.createNewExpReport(
          stateProps.reportTypeList,
          stateProps.defaultCostCenter
        );
        dispatchProps.closeTitle();
        dispatchProps.closeRecord();
        dispatchProps.moveToReport();
      }
    };

    if (stateProps.mode === modes.REPORT_EDIT) {
      dispatchProps.confirm(msg().Common_Confirm_DiscardEdits, callback);
    } else {
      callback(true);
    }
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(HeaderView) as React.ComponentType<Record<string, any>>;
