import { getPaymentMethodOptions } from '@apps/domain/models/exp/PaymentMethod';
import { Record } from '@apps/domain/models/exp/Record';

import { State } from '@mobile/modules';
import { AppDispatch } from '@mobile/modules/expense/AppThunk';
import {
  actions as paymentMethodOptionActions,
  PaymentMethodOptionList,
} from '@mobile/modules/expense/ui/paymentMethodOption';

/** fetch all payment method for create expense record, route record, create record from list
 * or get updated payment method options on record click
 */
export const getPaymentMethodOptionList =
  (values: Record, isJorudanRecord?: boolean) =>
  async (dispatch: AppDispatch, getState: () => State) => {
    const { paymentMethodList, selectedReportType } =
      getState().expense.entities;

    const availablePaymentMethodIds = selectedReportType.paymentMethodIds;

    const paymentMethodOption = getPaymentMethodOptions(
      paymentMethodList,
      availablePaymentMethodIds,
      values,
      isJorudanRecord,
      true
    ) as PaymentMethodOptionList;
    dispatch(paymentMethodOptionActions.set(paymentMethodOption));
    return paymentMethodOption;
  };

// remove inactive selected payment method from option list on payment method change
export const removeInactiveFromOptionList =
  (
    paymentMethodOptionList: PaymentMethodOptionList,
    selectedPaymentMethodId: string,
    reportTypePaymentMethodIds: string[] = []
  ) =>
  (dispatch: AppDispatch) => {
    const isSelectedInactive = !reportTypePaymentMethodIds.includes(
      selectedPaymentMethodId
    );
    if (selectedPaymentMethodId && isSelectedInactive) {
      // remove prev selected inactive payment method from option list
      const paymentMethodOptionListCopy = [...paymentMethodOptionList];
      paymentMethodOptionListCopy.splice(1, 1);
      dispatch(paymentMethodOptionActions.set(paymentMethodOptionListCopy));
    }
  };
