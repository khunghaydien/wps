import { connect } from 'react-redux';

import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import get from 'lodash/get';

import ICCardTransaction, {
  Props,
} from '../../../../commons/components/exp/Form/Dialog/ICCardTransaction';
import { PROGRESS_STATUS } from '../../../../commons/components/ProgressBar';

import { calculateTax } from '../../../../domain/models/exp/TaxType';
import { RECORD_TYPE } from '@apps/domain/models/exp/Record';
import {
  getLatestICDate,
  getRouteInfo,
} from '@apps/domain/models/exp/TransportICCard';

import { State } from '../../../modules';
import { actions as ICTransactionSelectActions } from '../../../modules/ui/expenses/dialog/ICTransactionSelect/selected';
import { actions as dialogLoadingActions } from '../../../modules/ui/expenses/dialog/isLoading';
import { actions as progressBarActions } from '../../../modules/ui/expenses/dialog/progressBar';

import { openExpenseTypeDialog } from '../../../action-dispatchers/Dialog';
import {
  getIcCardList,
  getICCardTransactions,
} from '../../../action-dispatchers/Expenses';

import { Props as OwnProps } from '../../../components/Expenses/Dialog';

const mapStateToProps = (state: State, ownProps: OwnProps) => ({
  companyId: state.userSetting.companyId,
  employeeId: state.userSetting.employeeId,
  baseCurrencySymbol:
    ownProps.currencySymbol || state.userSetting.currencySymbol,
  baseCurrencyDecimal:
    ownProps.currencyDecimalPlaces || state.userSetting.currencyDecimalPlaces,
  taxRoundingSetting: state.userSetting.expTaxRoundingSetting,
  progressBar: state.ui.expenses.dialog.progressBar,
  selectedICTransaction: state.ui.expenses.dialog.ICTransactionSelect.selected,
  accountingPeriodAll: state.ui.expenses.recordListPane.accountingPeriod,
  overlap: state.ui.expenses.overlap,
  isLoading: !!state.ui.expenses.dialog.isLoading,
  // for IC card api
  employeeCode: state.userSetting.employeeCode,
  customerId: state.userSetting.customerId,
  salesId: state.userSetting.salesId,
});

const mapDispatchToProps = {
  getIcCardList,
  getICCardTransactions,
  openExpenseTypeDialog,
  setProgressBar: progressBarActions.set,
  resetProgressBar: progressBarActions.clear,
  setSelectedIcTransaction: ICTransactionSelectActions.set,
  clearSelectedICTransaction: ICTransactionSelectActions.clear,
  toggleIsLoading: dialogLoadingActions.toggle,
};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: typeof mapDispatchToProps,
  ownProps: OwnProps
): Props => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,

  getIcCardList: () =>
    // @ts-ignore
    dispatchProps.getIcCardList(
      stateProps.salesId || '',
      stateProps.customerId || '',
      stateProps.companyId,
      stateProps.employeeCode
    ),

  getIcTransactionsWithCardNo: (from, to) =>
    dispatchProps
      .getICCardTransactions(
        stateProps.salesId || '',
        stateProps.customerId || '',
        stateProps.companyId,
        stateProps.employeeCode,
        from,
        to
      ) // @ts-ignore
      .then((res) => {
        let formattedRecords = [];
        const recordsByCards = res || [];
        recordsByCards.forEach((detail) => {
          const recordsWithCardNo = detail.records.map((record) => ({
            ...record,
            cardNo: detail.cardNumber,
          }));
          formattedRecords = formattedRecords.concat(recordsWithCardNo);
        });
        return formattedRecords;
      }),

  onClickNextButton: () => {
    const recordDate =
      getLatestICDate(stateProps.selectedICTransaction) ||
      ownProps.expReport.accountingDate;

    dispatchProps.openExpenseTypeDialog(
      stateProps.employeeId,
      stateProps.companyId,
      recordDate,
      RECORD_TYPE.TransportICCardJP,
      ownProps.expReport.expReportTypeId || '',
      false
    );

    const steps = stateProps.progressBar || [];
    steps[steps.length - 1].status = PROGRESS_STATUS.SELECTED;
    dispatchProps.setProgressBar(steps);
  },

  onClickConfirmButton: () => {
    const { paymentDate, amount, recordId, cardNo, category } =
      stateProps.selectedICTransaction[0];

    // update record with new IC info & recalc tax
    const recordCopy = cloneDeep(
      get(ownProps.expReport, `records.${ownProps.recordIdx}`)
    );

    const taxRate = recordCopy.items[0].taxRate || 0;
    const taxRes = calculateTax(
      taxRate,
      amount,
      stateProps.baseCurrencyDecimal,
      stateProps.taxRoundingSetting
    );

    const route = getRouteInfo(stateProps.selectedICTransaction[0]);
    const transitIcRecordInfo = { category, route };
    const extendedInfo = {
      amount,
      withoutTax: taxRes.amountWithoutTax,
      transitIcCardNo: cardNo,
      transitIcRecordId: recordId,
      recordDate: paymentDate,
      transitIcRecordInfo,
    };
    Object.assign(recordCopy, extendedInfo);

    recordCopy.items[0].recordDate = paymentDate;
    recordCopy.items[0].amount = amount;
    recordCopy.items[0].withoutTax = taxRes.amountWithoutTax;
    recordCopy.items[0].gstVat = taxRes.gstVat;

    const touched = { transitIcRecordId: true };
    ownProps.onChangeEditingExpReport(
      `report.records.${ownProps.recordIdx}`,
      recordCopy,
      touched
    );

    ownProps.onClickHideDialogButton();
    dispatchProps.clearSelectedICTransaction();
  },

  hideAndReset: () => {
    ownProps.onClickHideDialogButton();
    dispatchProps.clearSelectedICTransaction();
    dispatchProps.resetProgressBar();
  },
  selectedAccountingPeriod: (() => {
    const selectedAccountingPeriod = find(stateProps.accountingPeriodAll, {
      id: ownProps.expReport.accountingPeriodId,
    });
    return selectedAccountingPeriod;
  })(),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ICCardTransaction) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
