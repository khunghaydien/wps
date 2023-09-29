import { connect } from 'react-redux';

import { confirm } from '../../../commons/actions/app';
import HeaderView from '../../../commons/components/exp/Header';
import msg from '../../../commons/languages';

import { modes } from '../../modules/ui/expenses/mode';
import { actions as overlapActions } from '../../modules/ui/expenses/overlap';
import { actions as accountingPeriodActions } from '../../modules/ui/expenses/recordListPane/accountingPeriod';
import { actions as openTitleActions } from '../../modules/ui/expenses/recordListPane/summary/openTitle';
import { actions as viewAction } from '../../modules/ui/expenses/view';

import { createNewExpReport } from '../../action-dispatchers/Expenses';

const mapStateToProps = (state) => ({
  mode: state.ui.expenses.mode,
  selectedView: state.ui.expenses.view,
  companyId: state.userSetting.companyId,
  reportTypeList: state.entities.exp.expenseReportType.list.active,
  defaultCostCenter: {
    costCenterCode: state.userSetting.costCenterCode,
    costCenterName: state.userSetting.costCenterName,
    costCenterHistoryId: state.userSetting.costCenterHistoryId,
  },
});

const mapDispatchToProps = {
  confirm,
  createNewExpReport,
  openTitle: openTitleActions.open,
  closeTitle: openTitleActions.close,
  backToHome: overlapActions.nonOverlapReport,
  moveToReport: overlapActions.overlapReport,
  moveToRecord: overlapActions.overlapRecord,
  closeRecord: overlapActions.nonOverlapRecord,
  searchAccountPeriod: accountingPeriodActions.search,
  setDetailView: viewAction.setDetailView,
};

const mergeProps = (stateProps, dispatchProps) => ({
  ...stateProps,
  ...dispatchProps,
  onClickNewReportButton: () => {
    const callback = (yes: boolean) => {
      const { reportTypeList, defaultCostCenter } = stateProps;
      if (yes) {
        dispatchProps.openTitle();
        dispatchProps.createNewExpReport(reportTypeList, defaultCostCenter);
        dispatchProps.closeRecord();
        dispatchProps.moveToReport();
        dispatchProps.setDetailView();
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
