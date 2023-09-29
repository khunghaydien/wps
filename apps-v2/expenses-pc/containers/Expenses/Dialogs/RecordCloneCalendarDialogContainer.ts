import { connect } from 'react-redux';

import { find, get, isEmpty } from 'lodash';

import RecordCloneDate, {
  Props,
} from '../../../../commons/components/exp/Form/Dialog/RecordClone/CloneDateSelection';
import msg from '../../../../commons/languages';
import { showToast } from '../../../../commons/modules/toast';
import DateUtil from '../../../../commons/utils/DateUtil';

import { State } from '../../../modules';
import { actions as activeDialogActions } from '../../../modules/ui/expenses/dialog/activeDialog';
import { actions as recordCloneActions } from '../../../modules/ui/expenses/dialog/recordClone/dialog';

import { cloneRecords } from '../../../action-dispatchers/Expenses';
import { getRecordsClonedToSpecifiedDate } from '@apps/expenses-pc/action-dispatchers/BulkEdit';

import { Props as OwnProps } from '../../../components/Expenses/Dialog';

const mapStateToProps = (state: State) => ({
  recordClone: state.ui.expenses.dialog.recordClone.dialog,
  language: state.userSetting.language,
  reportTypeList: state.entities.exp.expenseReportType.list.active,
  accountingPeriodAll: state.ui.expenses.recordListPane.accountingPeriod,
  employeeId: state.userSetting.employeeId,
  isBulkEditMode: state.common.exp.ui.bulkEditRecord.isEnabled,
});

const mapDispatchToProps = {
  cloneRecords,
  showToast,
  showRecordUpdateDialog: activeDialogActions.recordUpdated,
  onChangeCloneDate: recordCloneActions.setDate,
  hideActiveDialog: activeDialogActions.hide,
  getRecordsClonedToSpecifiedDate,
};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: typeof mapDispatchToProps,
  ownProps: OwnProps
): Props => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  onClickCalendarRecordClone: () => {
    const { expReport, onChangeEditingExpReport } = ownProps;
    const { isBulkEditMode, recordClone, reportTypeList } = stateProps;
    const { dates, records } = recordClone;

    if (isBulkEditMode) {
      dispatchProps
        .getRecordsClonedToSpecifiedDate(dates, records, expReport)
        // @ts-ignore
        .then(({ clonedRecordList, isShowRecordUpdateDialog }) => {
          const newRecordList = expReport.records.concat(clonedRecordList);
          onChangeEditingExpReport('report.records', newRecordList, true);
          dispatchProps.hideActiveDialog();
          if (isShowRecordUpdateDialog) {
            dispatchProps.showRecordUpdateDialog();
          }
        });
      return;
    }

    const { expReportTypeId, reportId, isCostCenterChangedManually } =
      ownProps.expReport;
    const selectedReportType = find(reportTypeList, { id: expReportTypeId });
    const targetDates = dates.map((item) =>
      DateUtil.format(item, 'YYYY-MM-DD')
    );
    dispatchProps
      .cloneRecords(
        targetDates,
        records,
        reportId || '',
        reportTypeList,
        null,
        stateProps.employeeId,
        get(selectedReportType, 'useCashAdvance'),
        isCostCenterChangedManually
      ) // @ts-ignore
      .then((cloneRes) => {
        if (!isEmpty(get(cloneRes, 'recordIds'))) {
          dispatchProps.showToast(msg().Exp_Msg_CloneRecords, 4000);
          if (!isEmpty(get(cloneRes, 'updatedRecords'))) {
            dispatchProps.showRecordUpdateDialog();
          }
        }
        // giving formik information of accounting period and displaying error if the recordDate is out of accounting period range
        const selectedAccountingPeriod = find(stateProps.accountingPeriodAll, {
          id: ownProps.expReport.accountingPeriodId,
        });
        ownProps.onChangeEditingExpReport(
          'ui.selectedAccountingPeriod',
          selectedAccountingPeriod,
          false
        );
      });
  },
  onClickChangeDate: (selectedDates) => {
    dispatchProps.onChangeCloneDate(selectedDates);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(RecordCloneDate) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
