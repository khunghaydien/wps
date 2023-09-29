import * as Yup from 'yup';

import msg from '../../commons/languages';

import getExtendedItemsValidators from './expenses/ExtendedItemSchema';

export default Yup.lazy(() => {
  return Yup.object().shape({
    items: Yup.array().of(
      Yup.object().shape({
        amount: Yup.number()
          .typeError(msg().Common_Err_TypeNumber)
          .required(msg().Common_Err_Required)
          .max(999999999999, msg().Common_Err_Max)
          .nullable(),
        recordDate: Yup.string().required(msg().Common_Err_Required).nullable(),
        expTypeId: Yup.string()
          .nullable()
          .test(
            'is-required',
            msg().Common_Err_Required,
            function validateExpTypeId(value) {
              if (!this.path.includes('items[0]')) {
                return !!value;
              }
            }
          ),
        expTypeName: Yup.string()
          .required(msg().Common_Err_Required)
          .nullable(),
        useForeignCurrency: Yup.boolean(),
        taxTypeBaseId: Yup.string()
          .nullable()
          .when('useForeignCurrency', {
            is: false,
            then: Yup.string().required(msg().Common_Err_Required),
          }),
        remarks: Yup.string().max(1024, msg().Common_Err_Max).nullable(),
        ...getExtendedItemsValidators(true),
      })
    ),
  });
});
