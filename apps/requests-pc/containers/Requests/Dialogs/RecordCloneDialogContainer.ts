import { connect } from 'react-redux';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import RecordCloneDate, {
  Props,
} from '../../../../commons/components/exp/Form/Dialog/RecordClone/CloneDateSelection';
import msg from '../../../../commons/languages';
import { showToast } from '../../../../commons/modules/toast';
import DateUtil from '../../../../commons/utils/DateUtil';

import { State } from '../../../modules';
import { actions as activeDialogActions } from '../../../modules/ui/expenses/dialog/activeDialog';
import { actions as recordCloneActions } from '../../../modules/ui/expenses/dialog/recordClone/dialog';

import { cloneRecords } from '../../../action-dispatchers/Requests';

import { Props as OwnProps } from '../../../components/Requests/Dialog';

const mapStateToProps = (state: State) => ({
  recordClone: state.ui.expenses.dialog.recordClone.dialog,
  language: state.userSetting.language,
  reportTypeList: state.entities.exp.expenseReportType.list.active,
  employeeId: state.userSetting.employeeId,
});

const mapDispatchToProps = {
  cloneRecords,
  showToast,
  showRecordUpdateDialog: activeDialogActions.recordUpdated,
  onChangeCloneDate: recordCloneActions.setDate,
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
    const { dates, records } = stateProps.recordClone;
    const targetDates = dates.map((item) =>
      DateUtil.format(item, 'YYYY-MM-DD')
    );
    dispatchProps
      .cloneRecords(
        targetDates,
        records,
        ownProps.expReport.reportId || '',
        stateProps.reportTypeList,
        null,
        stateProps.employeeId,
        ownProps.expReport.isCostCenterChangedManually
      ) // @ts-ignore
      .then((cloneRes) => {
        if (!isEmpty(get(cloneRes, 'recordIds'))) {
          dispatchProps.showToast(msg().Exp_Msg_CloneRecords, 4000);
          if (!isEmpty(get(cloneRes, 'updatedRecords'))) {
            dispatchProps.showRecordUpdateDialog();
          }
        }
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
