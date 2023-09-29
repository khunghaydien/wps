import { connect } from 'react-redux';

import { get, isEmpty } from 'lodash';

import RecordCloneNumber, {
  Props,
} from '../../../../commons/components/exp/Form/Dialog/RecordClone/CloneNumber';
import msg from '../../../../commons/languages';
import { showToast } from '../../../../commons/modules/toast';

import { State } from '../../../modules';
import { actions as activeDialogActions } from '../../../modules/ui/expenses/dialog/activeDialog';
import { actions as recordCloneActions } from '../../../modules/ui/expenses/dialog/recordClone/dialog';

import { cloneRecords } from '../../../action-dispatchers/Requests';

import { Props as OwnProps } from '../../../components/Requests/Dialog';
import { getRecordsClonedMultipleTimes } from '@apps/commons/utils/exp/BulkEditUtil';

const mapStateToProps = (state: State) => ({
  records: state.ui.expenses.dialog.recordClone.dialog.records,
  language: state.userSetting.language,
  reportTypeList: state.entities.exp.expenseReportType.list.active,
  employeeId: state.userSetting.employeeId,
  accountingPeriodAll: (state.ui.expenses.recordListPane as any)
    .accountingPeriod,
  isBulkEditMode: state.common.exp.ui.bulkEditRecord.isEnabled,
});

const mapDispatchToProps = {
  cloneRecords,
  showToast,
  onChangeCloneDate: recordCloneActions.setDate,
  hideActiveDialog: activeDialogActions.hide,
};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: typeof mapDispatchToProps,
  ownProps: OwnProps
): Props => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  onClickMultiRecordClone: (cloneNum) => {
    const { expReport, onChangeEditingExpReport } = ownProps;
    const { isBulkEditMode, records } = stateProps;
    if (isBulkEditMode) {
      const clonedRecordList = getRecordsClonedMultipleTimes(
        cloneNum,
        records,
        expReport.records
      );
      onChangeEditingExpReport('report.records', clonedRecordList, true);
      dispatchProps.hideActiveDialog();
      return;
    }

    dispatchProps
      .cloneRecords(
        null,
        stateProps.records,
        ownProps.expReport.reportId || '',
        stateProps.reportTypeList,
        cloneNum,
        stateProps.employeeId,
        ownProps.expReport.isCostCenterChangedManually
      ) // @ts-ignore
      .then((res) => {
        if (!isEmpty(get(res, 'recordIds'))) {
          dispatchProps.showToast(msg().Exp_Msg_CloneRecords, 4000);
        }
      });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(RecordCloneNumber) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
