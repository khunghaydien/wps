import { get } from 'lodash';
import * as Yup from 'yup';

import msg from '../../../commons/languages';

import {
  totalNumExpTypeExtendedItems,
  totalNumExtendedItems,
} from '../../../domain/models/exp/ExtendedItem';

function validateExtendedItem(value) {
  const index = this.path.substr(-7, 2);
  const info = get(this.parent, `extendedItemText${index}Info`);
  const limitLength = info && info.limitLength;
  return value && limitLength ? !(value.length > limitLength) : true;
}

function validateEIIsRequired(isRequired, schema) {
  if (isRequired === 'true') {
    // TODO unify the argument passed in for mobile and PC ('Common_Err_Required') for all the error messages, and then remove this file
    return schema.test(
      'is-required',
      msg().Common_Err_Required,
      function validateEIRequired(value) {
        return this.path.includes('items[0]') ? !!value : true;
      }
    );
  }
  return schema;
}

const getExtendedItemsValidators = (isRecord?: boolean) => {
  const totalNumberEI = isRecord
    ? totalNumExpTypeExtendedItems
    : totalNumExtendedItems;
  const eIValidators = {};

  [...Array(totalNumberEI).keys()].forEach((i) => {
    const index = `0${i + 1}`.slice(-2);
    eIValidators[`extendedItemText${index}Value`] = Yup.string()
      .when(`extendedItemText${index}Info.isRequired`, validateEIIsRequired)
      .test(`ExtendedItem${index}`, msg().Common_Err_Max, validateExtendedItem)
      .nullable();
    eIValidators[`extendedItemText${index}Info`] = Yup.object()
      .shape({
        isRequired: Yup.string(),
      })
      .nullable();
  });

  [...Array(totalNumberEI).keys()].forEach((i) => {
    const index = `0${i + 1}`.slice(-2);
    eIValidators[`extendedItemPicklist${index}Value`] = Yup.string()
      .when(`extendedItemPicklist${index}Info.isRequired`, validateEIIsRequired)
      .nullable();
    eIValidators[`extendedItemPicklist${index}Info`] = Yup.object()
      .shape({
        isRequired: Yup.string(),
      })
      .nullable();
  });

  [...Array(totalNumberEI).keys()].forEach((i) => {
    const index = `0${i + 1}`.slice(-2);
    eIValidators[`extendedItemLookup${index}Value`] = Yup.string()
      .when(`extendedItemLookup${index}Info.isRequired`, validateEIIsRequired)
      .nullable();
    eIValidators[`extendedItemLookup${index}Info`] = Yup.object()
      .shape({
        isRequired: Yup.string(),
      })
      .nullable();
  });

  [...Array(totalNumberEI).keys()].forEach((i) => {
    const index = `0${i + 1}`.slice(-2);
    eIValidators[`extendedItemDate${index}Value`] = Yup.string()
      .when(`extendedItemDate${index}Info.isRequired`, validateEIIsRequired)
      .nullable();
    eIValidators[`extendedItemDate${index}Info`] = Yup.object()
      .shape({
        isRequired: Yup.string(),
      })
      .nullable();
  });

  return eIValidators;
};

export default getExtendedItemsValidators;
