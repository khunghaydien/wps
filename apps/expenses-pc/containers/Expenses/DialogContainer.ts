import * as React from 'react';
import { connect } from 'react-redux';

import { Report } from '../../../domain/models/exp/Report';

import { State } from '../../modules';
import { actions as activeDialogActions } from '../../modules/ui/expenses/dialog/activeDialog';
import { actions as dialogLoadingActions } from '../../modules/ui/expenses/dialog/isLoading';

import ExpDialog, { Props } from '../../components/Expenses/Dialog';

export type OwnProps = {
  activeDialog: Array<string>;
  baseCurrency: any;
  currencyCode?: string;
  currencyDecimalPlaces: number;
  currencySymbol: string;
  errors: any;
  expReport: Report;
  foreignCurrency: any;
  isExpense?: boolean;
  isFinanceApproval: boolean;
  recordIdx: number;
  recordItemIdx: number;
  recordItemReadOnly: boolean;
  selectedCompanyId: string;
  tempSavedRecordItems: Array<{
    amount: number;
    expTypeId: string;
    gstVal: number;
    recordDate: string;
    withoutTax: number;
  }>;
  touched: {
    records?: Array<any> | Record<string, any>;
    vendorCode?: boolean;
    vendorId?: boolean;
    vendorName?: boolean;
  };
  onChangeEditingExpReport: (
    arg0: string,
    arg1: any,
    arg2?: any,
    shouldValidate?: boolean
  ) => void;
  setFieldError: (arg0: string, arg1: any) => void;
  setFieldTouched: (
    arg0: string,
    arg1: Record<string, unknown> | boolean,
    arg2?: boolean
  ) => void;
  setFieldValue: (arg0: string, arg1: any) => void;
  setTouched: (arg0: Record<string, unknown>) => void;
  validateForm: () => void;
};

const mapStateToProps = (state: State) => ({
  activeDialog: state.ui.expenses.dialog.activeDialog,
});

const mapDispatchToProps = {
  hideDialog: activeDialogActions.hide,
  hideAllDialogs: activeDialogActions.hideAll,
  clearDialog: activeDialogActions.clear,
  clearIsLoading: dialogLoadingActions.clear,
};

const mergeProps = (
  stateProps: ReturnType<typeof mapStateToProps>,
  dispatchProps: typeof mapDispatchToProps,
  ownProps: OwnProps
): Props => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  onClickHideDialogButton: () => {
    dispatchProps.hideDialog();
    dispatchProps.clearDialog();
    dispatchProps.clearIsLoading();
  },
  hideAllDialogsAndClear: () => {
    dispatchProps.hideAllDialogs();
    dispatchProps.clearDialog();
    dispatchProps.clearIsLoading();
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ExpDialog) as React.ComponentType<any> as React.ComponentType<
  Record<string, any>
>;
