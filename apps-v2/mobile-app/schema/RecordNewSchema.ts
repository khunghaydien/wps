import get from 'lodash/get';
import * as Yup from 'yup';

import { amountMatchSchema } from '@commons/schema/Expense';

import msg from '../../commons/languages';

import {
  isMileageRecord,
  isUseWithholdingTax,
  RECEIPT_TYPE,
  RECORD_TYPE,
  WITHHOLDING_TAX_TYPE,
} from '../../domain/models/exp/Record';

import getExtendedItemsValidators from './expenses/ExtendedItemSchema';
import {
  paymentDueDateRecordSchema,
  vendorIdRecordSchema,
} from './request/RecordNewSchema';

function validateAttachmentBody(value) {
  const hasRemarks =
    this.parent.items[0].remarks && this.parent.items[0].remarks.trim();
  if (hasRemarks || (value && value.length > 0)) {
    return true;
  }
  return false;
}

export const amountNegativeSchema = (msgKey) => {
  return Yup.number().when('allowNegativeAmount', {
    is: false,
    then: Yup.number().min(0, msgKey),
  });
};

export const amountPayableSchema = (values) =>
  Yup.number()
    .nullable()
    .when('.', {
      is: () => {
        const withholdingTaxUsage = get(values, 'withholdingTaxUsage');
        return isUseWithholdingTax(withholdingTaxUsage);
      },
      then: Yup.number().min(0, msg().Exp_Err_AmountPayableNegative),
    });

export default Yup.lazy((values) => {
  return Yup.object().shape({
    amount: amountMatchSchema(),
    fileAttachment: Yup.string().nullable(),
    receiptList: Yup.array()
      .when('fileAttachment', {
        is: RECEIPT_TYPE.Required,
        then: Yup.array().min(1, msg().Common_Err_Required),
      })
      .when('fileAttachment', {
        is: RECEIPT_TYPE.Optional,
        then: Yup.array()
          .nullable()
          .test(
            'GeneralReceiptOptional',
            msg().Exp_Err_NoReceiptAndReceipt,
            validateAttachmentBody
          ),
      }),
    items: Yup.array().of(
      Yup.object().shape({
        recordDate: Yup.string().required(msg().Common_Err_Required).nullable(),
        amount: amountNegativeSchema('Exp_Err_AmountNegative')
          .typeError(msg().Common_Err_TypeNumber)
          .required(msg().Common_Err_Required)
          .max(999999999999, msg().Common_Err_Max)
          .nullable(),
        localAmount: Yup.number().when('useForeignCurrency', {
          is: true,
          then: amountNegativeSchema('Exp_Err_LocalAmountNegative'),
        }),
        expTypeName: Yup.string()
          .required(msg().Common_Err_Required)
          .nullable(),
        useForeignCurrency: Yup.boolean(),
        taxTypeBaseId: Yup.string()
          .nullable()
          .when(['useForeignCurrency', 'taxItems'], {
            is: (useForeignCurrency, taxItems) => {
              const requireTaxValidation = !useForeignCurrency && !taxItems;
              return requireTaxValidation;
            },
            then: Yup.string().required(msg().Common_Err_Required),
          }),
        merchant: Yup.string()
          .nullable()
          .test(
            'is-required',
            msg().Common_Err_Required,
            function validateNoMerchant(value) {
              if (!this.path.includes('items[0]')) {
                return true;
              }
              const merchantUsage = get(values, 'merchantUsage');
              const isRequired = merchantUsage === RECEIPT_TYPE.Required;
              if (isRequired && !value) {
                return false;
              }
              return true;
            }
          ),
        mileageDistance: Yup.number()
          .nullable()
          .test('is-required', 'Com_Lbl_Required', function (distance: number) {
            const isMileage = isMileageRecord(values.recordType);
            return isMileage ? Math.abs(distance) > 0 : true;
          }),
        fixedAllowanceOptionId: Yup.string()
          .when({
            is: values && values.recordType === RECORD_TYPE.FixedAllowanceMulti,
            then: Yup.string().nullable().required(msg().Common_Err_Required),
          })
          .nullable(),
        remarks: Yup.string().max(1024, msg().Common_Err_Max).nullable(),
        amountPayable: amountPayableSchema(values),
        withholdingTaxAmount: Yup.number()
          .nullable()
          .test(
            'is-required',
            msg().Common_Err_Required,
            function (withholdingTaxAmount: number) {
              if (!this.path.includes('items[0]')) return true;
              const withholdingTaxUsage = get(values, 'withholdingTaxUsage');
              const isRequired =
                withholdingTaxUsage === WITHHOLDING_TAX_TYPE.Required;
              return isRequired ? Math.abs(withholdingTaxAmount) > 0 : true;
            }
          ),
        vendorId: vendorIdRecordSchema(values),
        paymentDueDate: paymentDueDateRecordSchema(values),
        ...getExtendedItemsValidators(true),
      })
    ),
    mileageRouteInfo: Yup.object()
      .when('recordType', {
        is: RECORD_TYPE.Mileage,
        then: Yup.object().shape({
          destinations: Yup.array().of(
            Yup.object().shape({
              name: Yup.string().required('Exp_Err_Destination'),
            })
          ),
        }),
      })
      .nullable(),
    transitIcRecordId: Yup.string()
      .when('recordType', {
        is: RECORD_TYPE.TransportICCardJP,
        then: Yup.string()
          .nullable()
          .required(msg().Exp_Err_NoIcTransactionLinked),
      })
      .nullable(),
    creditCardTransactionId: Yup.string()
      .nullable()
      .test(
        'creditCardTransactionId',
        msg().Exp_Err_NoCcTransactionLinked,
        (creditCardTransactionId: string) => {
          if (values.isCCPaymentMethod) return !!creditCardTransactionId;
          return true;
        }
      )
      .nullable(),
  });
});
