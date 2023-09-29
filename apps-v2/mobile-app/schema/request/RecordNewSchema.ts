import get from 'lodash/get';
import * as Yup from 'yup';

import { amountMatchSchema } from '@commons/schema/Expense';

import msg from '../../../commons/languages';

import {
  isJorudanRecord,
  isMileageRecord,
  RECORD_TYPE,
  WITHHOLDING_TAX_TYPE,
} from '../../../domain/models/exp/Record';
import { VENDOR_PAYMENT_DUE_DATE_USAGE } from '@apps/domain/models/exp/Vendor';

import getExtendedItemsValidators from '../expenses/ExtendedItemSchema';
import { amountNegativeSchema, amountPayableSchema } from '../RecordNewSchema';

export const vendorIdRecordSchema = (values) =>
  Yup.string()
    .test(`Vendor is Not Empty`, msg().Common_Err_Required, (value) => {
      if (
        values &&
        values.isRecordVendorRequired &&
        !isJorudanRecord(values.recordType)
      ) {
        return !!value;
      }
      return true;
    })
    .nullable();

export const paymentDueDateRecordSchema = (values) =>
  Yup.string()
    .test(
      'Payment Due Date is Not Empty',
      msg().Common_Err_Required,
      function checkRequired(value) {
        const recordItemPath = this.path.match(/items\[0\]/)?.[0];
        if (recordItemPath) {
          const paymentDueDateUsage = get(
            values,
            recordItemPath.concat('.paymentDueDateUsage'),
            null
          );
          const vendorId = get(
            values,
            recordItemPath.concat('.vendorId'),
            null
          );
          if (
            vendorId &&
            paymentDueDateUsage === VENDOR_PAYMENT_DUE_DATE_USAGE.Required &&
            !isJorudanRecord(values.recordType)
          ) {
            return !!value;
          }
          return true;
        }
        return true;
      }
    )
    .nullable();

export default Yup.lazy((values) => {
  return Yup.object().shape({
    amount: amountMatchSchema(),
    fileAttachment: Yup.string().nullable(),
    receiptList: Yup.array().nullable(),
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
        fixedAllowanceOptionId: Yup.string()
          .when({
            is: values && values.recordType === RECORD_TYPE.FixedAllowanceMulti,
            then: Yup.string().nullable().required(msg().Common_Err_Required),
          })
          .nullable(),
        remarks: Yup.string().max(1024, msg().Common_Err_Max).nullable(),
        amountPayable: amountPayableSchema(values),
        mileageDistance: Yup.number()
          .nullable()
          .test('is-required', 'Com_Lbl_Required', function (distance: number) {
            const isMileage = isMileageRecord(values.recordType);
            return isMileage ? Math.abs(distance) > 0 : true;
          }),
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
  });
});
