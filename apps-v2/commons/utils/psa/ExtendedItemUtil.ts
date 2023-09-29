import * as Yup from 'yup';

import msg from '@apps/commons/languages';

/**
 * Compare and sort by order
 * Default is ascending order
 * @param a
 * @param b
 */
export const sortByOrder = (a, b) => {
  let comparison = 0;
  if (a.order > b.order) {
    comparison = 1;
  } else if (a.order < b.order) {
    comparison = -1;
  }
  return comparison;
};

/**
 * Dynamically generate the Yup validation shape
 * Validation is not required if the eI is ReadOnly
 */
const DEFAULT_LENGTH = 255;
export const getExtendedItemsValidators = (values: any) => {
  const eIValidators = {};

  if (values.extendedItemConfigList) {
    values.extendedItemConfigList.forEach((eI) => {
      if (eI.required && eI.enabled && !eI.readOnly) {
        eIValidators[`${eI.id}`] = Yup.string()
          .required('Common_Err_Required')
          .max(
            eI.limitLength ? eI.limitLength : DEFAULT_LENGTH,
            'Common_Err_Max'
          )
          .trim('Common_Err_Required')
          .nullable();
      } else {
        eIValidators[`${eI.id}`] = Yup.string()
          .max(
            eI.limitLength ? eI.limitLength : DEFAULT_LENGTH,
            'Common_Err_Max'
          )
          .nullable();
      }
    });
  }

  return eIValidators;
};

/**
 * Return the list of object list needed for picklist
 */
export const generatePicklistOptions = (
  picklistLabels: string,
  picklistValues: string
) => {
  const labels = picklistLabels.split('\\n');
  const values = picklistValues.split('\\n');
  const result = labels.map((lb, i) => ({
    value: values[i],
    text: lb,
  }));
  const optionSelect = [
    {
      value: '',
      text: msg().Admin_Lbl_ExtendedItemPicklist,
    },
  ];

  return optionSelect.concat(result);
};
