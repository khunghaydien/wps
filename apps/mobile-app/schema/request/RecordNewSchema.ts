import * as Yup from 'yup';

import msg from '../../../commons/languages';

import { isHotelFee, RECORD_TYPE } from '../../../domain/models/exp/Record';

import getExtendedItemsValidators from '../expenses/ExtendedItemSchema';

export default Yup.lazy((values) => {
  return Yup.object().shape({
    fileAttachment: Yup.string().nullable(),
    receiptId: Yup.string().nullable(),
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
  });
});
