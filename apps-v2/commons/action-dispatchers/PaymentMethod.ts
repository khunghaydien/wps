import {
  actions as paymentMethodOptionActions,
  PaymentMethodOptionList,
} from '@commons/modules/exp/ui/paymentMethodOption';

import {
  getPaymentMethodOptions,
  PaymentMethod,
} from '@apps/domain/models/exp/PaymentMethod';
import { Record } from '@apps/domain/models/exp/Record';

import { AppDispatch } from '../modules/AppThunk';

export const updatePaymentMethodOptionList =
  (
    paymentMethodList: PaymentMethod[],
    availablePaymentMethodIds: string[],
    record: Record
  ) =>
  (dispatch: AppDispatch) => {
    const paymentMethodOptionList = getPaymentMethodOptions(
      paymentMethodList,
      availablePaymentMethodIds,
      record
    );
    dispatch(
      paymentMethodOptionActions.set(
        paymentMethodOptionList as PaymentMethodOptionList
      )
    );
    return paymentMethodOptionList;
  };
