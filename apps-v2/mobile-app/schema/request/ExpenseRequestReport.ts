import _ from 'lodash';
import * as Yup from 'yup';

import msg from '../../../commons/languages';

import { VENDOR_PAYMENT_DUE_DATE_USAGE } from '@apps/domain/models/exp/Vendor';

import getExtendedItemsValidators from './ExtendedItemSchema';

export default Yup.lazy((values) => {
  return Yup.object().shape({
    report: Yup.object().shape({
      accountingPeriodId: Yup.string()
        .nullable()
        .test('accountingPeriodId', msg().Common_Err_Required, (value) => {
          if (values.ui.existActiveAp) {
            return !!value;
          }
          return true;
        }),
      scheduledDate: Yup.string().required(msg().Common_Err_Required),
      purpose: Yup.string().nullable().required(msg().Common_Err_Required),
      subject: Yup.string()
        .required(msg().Common_Err_Required)
        .max(80, msg().Common_Err_Max)
        .trim(msg().Common_Err_Required),
      expReportTypeId: Yup.string()
        .nullable()
        .required(msg().Common_Err_Required),
      isJobRequired: Yup.boolean(),
      jobId: Yup.string()
        .when(`isJobRequired`, {
          is: (isJobRequired) => !!isJobRequired,
          then: Yup.string().nullable().required(msg().Common_Err_Required),
        })
        .nullable(),
      isCostCenterRequired: Yup.boolean(),
      costCenterName: Yup.string()
        .when(`isCostCenterRequired`, {
          is: (isCostCenterRequired) => !!isCostCenterRequired,
          then: Yup.string().nullable().required(msg().Common_Err_Required),
        })
        .nullable(),
      isVendorRequired: Yup.boolean(),
      vendorId: Yup.string()
        .when(`isVendorRequired`, {
          is: (isVendorRequired) => !!isVendorRequired,
          then: Yup.string().nullable().required(msg().Common_Err_Required),
        })
        .nullable(),
      paymentDueDateUsage: Yup.string().nullable(),
      paymentDueDate: Yup.string()
        .when(['vendorId', 'paymentDueDateUsage'], {
          is: (vendorId, paymentDueDateUsage) =>
            vendorId &&
            paymentDueDateUsage === VENDOR_PAYMENT_DUE_DATE_USAGE.Required,
          then: Yup.string().nullable().required(msg().Common_Err_Required),
        })
        .nullable(),
      ...getExtendedItemsValidators(),
    }),
  });
});
