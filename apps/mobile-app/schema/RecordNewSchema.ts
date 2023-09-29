import get from 'lodash/get';
import * as Yup from 'yup';

import msg from '../../commons/languages';

import {
  isHotelFee,
  RECEIPT_TYPE,
  RECORD_TYPE,
} from '../../domain/models/exp/Record';

import getExtendedItemsValidators from './expenses/ExtendedItemSchema';

export default Yup.lazy((values) => {
  return Yup.object().shape({
    fileAttachment: Yup.string().nullable(),
    receiptId: Yup.string()
      .nullable()
      .when('fileAttachment', {
        is: RECEIPT_TYPE.Required,
        then: Yup.string().nullable().required(msg().Common_Err_Required),
      })
      .when('fileAttachment', {
        is: RECEIPT_TYPE.Optional,
        then: Yup.string()
          .nullable()
          .test(
            'GeneralReceiptOptional',
            msg().Exp_Err_NoReceiptAndReceipt,
            function validateAttachmentBody(value) {
              const hasRemarks =
                this.parent.items[0].remarks &&
                this.parent.items[0].remarks.trim();
              if (hasRemarks || value) {
                return true;
              }
              return false;
            }
          ),
      }),
    items: Yup.array().of(
      Yup.object().shape({
        recordDate: Yup.string().required(msg().Common_Err_Required).nullable(),
        amount: Yup.number()
          .typeError(msg().Common_Err_TypeNumber)
          .required(msg().Common_Err_Required)
          .max(999999999999, msg().Common_Err_Max)
          .nullable(),
        expTypeName: Yup.string()
          .required(msg().Common_Err_Required)
          .nullable(),
        useForeignCurrency: Yup.boolean(),
        taxTypeBaseId: Yup.string()
          .nullable()
          .when('useForeignCurrency', {
            is: (useForeignCurrency) => {
              const requireTaxValidation =
                !useForeignCurrency && values && !isHotelFee(values.recordType);
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
        fixedAllowanceOptionId: Yup.string()
          .when({
            is: values && values.recordType === RECORD_TYPE.FixedAllowanceMulti,
            then: Yup.string().nullable().required(msg().Common_Err_Required),
          })
          .nullable(),
        remarks: Yup.string().max(1024, msg().Common_Err_Max).nullable(),
        ...getExtendedItemsValidators(values),
      })
    ),
    transitIcRecordId: Yup.string()
      .when('recordType', {
        is: RECORD_TYPE.TransportICCardJP,
        then: Yup.string()
          .nullable()
          .required(msg().Exp_Err_NoIcTransactionLinked),
      })
      .nullable(),
  });
});
