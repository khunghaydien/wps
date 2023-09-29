import { get, isEmpty } from 'lodash';
import * as Yup from 'yup';

import {
  totalNumDateExtendedItems,
  totalNumLookupExtendedItems,
  totalNumPicklistExtendedItems,
  totalNumTextExtendedItems,
} from '../../domain/models/exp/ExtendedItem';
import {
  isHotelFee,
  RECEIPT_TYPE,
  RECORD_TYPE,
} from '../../domain/models/exp/Record';
import { status as STATUS } from '../../domain/models/exp/Report';
import { VENDOR_PAYMENT_DUE_DATE_USAGE } from '../../domain/models/exp/Vendor';

// check if hotel fee record, to skip validation for first item
const isHotelFeeRecord = (path: string, values) => {
  const isRecord = path.includes('records');
  if (!isRecord) return false;

  const recordPath = path.match(/report.records\[[0-9]+\]/)[0];
  const record = get(values, recordPath, {});
  return isHotelFee(record.recordType);
};

// /////////////////////////////////////////////////////////////////////
//
// Report
//
// /////////////////////////////////////////////////////////////////////
export const subjectSchema = () =>
  Yup.string()
    .required('Common_Err_Required')
    .max(80, 'Common_Err_Max')
    .trim('Common_Err_Required');

export const accountingPeriodIdSchema = (values) =>
  Yup.string()
    .nullable()
    .test('accountingPeriodId', 'Common_Err_Required', (value) => {
      if (values.ui.existActiveAp) {
        return !!value;
      }
      return true;
    });

export const accountingDateSchema = () =>
  Yup.string().required('Common_Err_Required');

export const expReportTypeIdSchema = (values) =>
  Yup.string()
    .test('expReportTypeId', 'Common_Err_Required', (value) => {
      const status = values.report.status;
      if (
        status === STATUS.RECALLED ||
        status === STATUS.NOT_REQUESTED ||
        !status
      ) {
        return !!value;
      }
      return true;
    })
    .nullable();

export const vendorIdSchema = (values) =>
  Yup.string()
    .nullable()
    .test('vendorId', 'Common_Err_Required', (value) => {
      if (values.ui.isVendorRequired) {
        return !!value;
      }
      return true;
    });

export const costCenterNameSchema = (values) =>
  Yup.string()
    .nullable()
    .test('costCenterName', 'Common_Err_Required', (value) => {
      if (values.ui.isCostCenterRequired) {
        return !!value;
      }
      return true;
    });

export const jobIdSchema = (values) =>
  Yup.string()
    .nullable()
    .test('jobId', 'Common_Err_Required', (value) => {
      if (values.ui.isJobRequired) {
        return !!value;
      }
      return true;
    });

export const fileAttachmentListSchema = (values) =>
  Yup.array()
    .nullable()
    .test('attachedFileList', 'Common_Err_Required', (value) => {
      if (values.ui.isFileAttachmentRequired) {
        return !isEmpty(value);
      }
      return true;
    });

export const customRequestIdSchema = (values) =>
  Yup.string()
    .nullable()
    .test('customRequestId', 'Common_Err_Required', (value) => {
      if (values.ui.isCustomRequestRequired) {
        return !!value;
      }
      return true;
    });

export const paymentDueDateSchema = (values, _args1?: boolean) =>
  Yup.string()
    .nullable()
    .test('Payment Due Date is Not Empty', 'Common_Err_Required', (value) => {
      if (
        values.report.vendorId &&
        values.report.paymentDueDateUsage ===
          VENDOR_PAYMENT_DUE_DATE_USAGE.Required
      ) {
        return !!value;
      }
      return true;
    });

// TODO modify the below logic when add validation of date difference
// .test(
//   'Payment Due Date is valid date',
//   isRequest
//     ? 'Exp_Err_PaymentDateAfterScheduledDate'
//     : 'Exp_Err_PaymentDateAfterRecordDate',
//   (value) => {
//     const paymentDueDate = new Date(value);
//     const headerDate = isRequest
//       ? new Date(values.report.scheduledDate)
//       : new Date(values.report.accountingDate);

//     if (paymentDueDate <= headerDate && value) {
//       return false;
//     }
//     return true;
//   }
// );

export const scheduledDateSchema = () =>
  Yup.string().required('Common_Err_Required');

export const purposeSchema = () =>
  Yup.string().nullable().required('Common_Err_Required');

// /////////////////////////////////////////////////////////////////////
//
// Record
//
// /////////////////////////////////////////////////////////////////////

// Error in the following cases.
// 1. recordType is General, attachmentBody is empty
// 2. recordType is GeneralOption, attachmentBody and remarks empty
export const receiptIdSchema = (values) =>
  Yup.string()
    .nullable()
    .test('General', 'Exp_Msg_NoRecipt', function validateNoReceipt(value) {
      const receiptType = this.parent.fileAttachment;
      const isReceiptNotUsed = receiptType === RECEIPT_TYPE.NotUsed;
      const isReceiptOptional = receiptType === RECEIPT_TYPE.Optional;
      const isTypeSkipValidation =
        this.parent.recordType === RECORD_TYPE.TransitJorudanJP ||
        this.parent.recordType === RECORD_TYPE.TransportICCardJP;

      if (isReceiptNotUsed || isReceiptOptional) {
        return true;
      }

      if (!values.ui.saveMode && !isTypeSkipValidation && !value) {
        return false;
      }

      return true;
    })
    .test(
      'GeneralReceiptOptional',
      'Exp_Err_NoReceiptAndReceipt',
      function validateAttachmentBody(value) {
        const receiptType = this.parent.fileAttachment;
        const isReceiptNotUsed = receiptType === RECEIPT_TYPE.NotUsed;
        const isReceiptOptional = receiptType === RECEIPT_TYPE.Optional;

        if (isReceiptNotUsed) {
          return true;
        }

        if (
          !values.ui.saveMode &&
          isReceiptOptional &&
          !value &&
          (!this.parent.items[0].remarks ||
            !this.parent.items[0].remarks.length)
        ) {
          return false;
        }
        return true;
      }
    );

export const merchantSchema = (values) => {
  return Yup.string()
    .nullable()
    .test(
      'is-required',
      'Common_Err_Required',
      function validateNoMerchant(value) {
        if (!this.path.includes('items[0]')) {
          return true;
        }
        const recordPath = this.path.match(/([^.]*\.[^.]*)./)[1];
        const merchantUsage = get(values, `${recordPath}.merchantUsage`);
        const isRequired = merchantUsage === RECEIPT_TYPE.Required;
        if (isRequired && !value) {
          return false;
        }
        return true;
      }
    );
};

// Error in the following cases.
// 1. recordType is TransitJorudanJP, selectedRoute is empty
export const routeInfoSchema = (values?: any) =>
  Yup.object()
    .nullable()
    .shape({
      selectedRoute: Yup.object()
        .nullable()
        .test(
          'selectedRoute',
          'Exp_Err_NoSelectedRoute',
          function validateSelectedRoute(value) {
            const recordPath = this.path.match(/([^.]*\.[^.]*)./)[1];
            const recordType = get(values, `${recordPath}.recordType`);
            if (recordType === 'TransitJorudanJP' && !value) {
              return false;
            }
            return true;
          }
        ),
    });

// Error in the following cases.
// 1. recordDate and accountingPeriod do not match
export const recordDateSchema = (values) =>
  Yup.string()
    .test('is-date-in-range', 'Exp_Err_DateNotInRange', (value) => {
      const accountingPeriod = values.ui.selectedAccountingPeriod;
      const currentSelectedRecord = values.report.records[values.ui.recordIdx];
      const currentSelectedRecordDate =
        values.ui.recordIdx > -1 && values.ui.isRecordSave
          ? currentSelectedRecord && currentSelectedRecord.recordDate
          : value;
      let isCurrentSelectedRecordDateValid = true;

      if (accountingPeriod && currentSelectedRecordDate) {
        const currentRecordDate = new Date(currentSelectedRecordDate);
        const startDate = new Date(accountingPeriod.validDateFrom);
        const endDate = new Date(accountingPeriod.validDateTo);

        if (!(currentRecordDate >= startDate && currentRecordDate <= endDate)) {
          isCurrentSelectedRecordDateValid = false;
        }

        // if currentSelectedRecordDate is invalid, continue checking other record items date
        if (!isCurrentSelectedRecordDateValid) {
          const recordItemDate = new Date(value);

          if (!(recordItemDate >= startDate && recordItemDate <= endDate)) {
            return false;
          }
        }

        return true;
      }
      return true;
    })
    .required('Common_Err_Required');

// local function for recordDate.
const checkWorkingDayFlag = (recordDate, target, workingDays) => {
  return get(workingDays, `${recordDate}.${target}`, false);
};

// Error in the following cases.
// 1. recordDate and accountingPeriod do not match
// 2. recordDate is not working day.
// Not formik
export const recordDateWithCheckWorkingDaysCheck = (values, workingDays) => {
  const error = {};
  const checkAttList = {
    isLeave: 'Exp_Warn_DateIsLeave',
    isHoliday: 'Exp_Warn_DateIsHoliday',
    isLegalHoliday: 'Exp_Warn_DateIsLegalHoliday',
    isLeaveOfAbsence: 'Exp_Warn_DateIsLeaveOfAbsence',
    isAbsence: 'Exp_Warn_DateIsAbsence',
    isAttRecordNotFound: 'Exp_Warn_AttRecordNotFound',
    isIllegalAttCalculation: 'Exp_Warn_IllegalAttCalculation',
    isOutOfRange: 'Exp_Err_DateNotInRange',
  };
  values.report.records.forEach((value, idx) => {
    const keys = Object.keys(checkAttList);
    for (const key of keys) {
      if (checkWorkingDayFlag(value.recordDate, key, workingDays)) {
        Object.assign(error, { [idx]: { recordDate: checkAttList[key] } });
        break;
      }
    }
  });
  return error;
};

// Error in the the following case.
// record's expense type doesn't match with report type
export const expTypeIdSchema = (values) =>
  Yup.string().test(
    'RecordExpenseTypeValidforReportType',
    'Exp_Err_InvalidRecordExpenseTypeForReportType',
    function validateRecordExpType(value) {
      // always return true if it's child record items
      if (!this.path.includes('items[0]')) {
        return true;
      }
      const availableExpType = values.ui.availableExpType || [];
      if (!availableExpType.includes(value)) {
        return false;
      }
      return true;
    }
  );

// Error in the the following case.
// record in base currency does not have taxTypeHistoryId (no tax type selected/available)
export const taxTypeHistoryIdSchema = (values?) => {
  return Yup.string()
    .nullable()
    .when('useForeignCurrency', {
      is: true,
      then: Yup.string().nullable(),
      otherwise: Yup.string()
        .nullable()
        .test('no-tax-available', 'Exp_Err_NoTaxAvailable', function (value) {
          if (!values) return !!value;
          const isHotelFee = isHotelFeeRecord(this.path, values);
          return isHotelFee && this.path.includes('items[0]') ? true : !!value;
        }),
    });
};

// Error in the following cases.
// recordType is FixedAllowanceMulti, amountSelection is empty
export const fixedAmountSelectionSchema = () =>
  Yup.string().nullable().required('Common_Err_Required');

// /////////////////////////////////////////////////////////////////////
//
// Items
//
// /////////////////////////////////////////////////////////////////////
export const amountSchema = () =>
  Yup.number()
    .required('Common_Err_Required')
    .max(999999999999, 'Common_Err_Max');

// Error in the following cases: items[n].recordDate is empty or out of range (skip items[0] which is parent record)
// use function(){} to access this.path in this scope
export const recordItemDateSchema = (values) =>
  Yup.string()
    .test(
      'is-date-in-range',
      'Exp_Err_DateNotInRange',
      function checkInRange(value) {
        // always return true if it's parent record (items[0])
        if (this.path.includes('items[0]')) {
          return true;
        }
        const accountingPeriod = values.ui.selectedAccountingPeriod;
        if (accountingPeriod) {
          const currentDate = new Date(value);
          const startDate = new Date(accountingPeriod.validDateFrom);
          const endDate = new Date(accountingPeriod.validDateTo);

          if (!(currentDate >= startDate && currentDate <= endDate)) {
            return false;
          }
        }
        return true;
      }
    )
    .test('is-required', 'Common_Err_Required', function checkRequired(value) {
      if (this.path.includes('items[0]')) {
        return true;
      }
      return !!value;
    });

// Error in the following cases: items[n].expTypeId is empty (skip items[0] which is parent record)
// use function(){} to access this.path in this scope
export const recordItemExpTypeIdSchema = () =>
  Yup.string().test(
    'is-required',
    'Common_Err_Required',
    function checkRequired(value) {
      if (this.path.includes('items[0]')) {
        return true;
      }
      return !!value;
    }
  );

// Error in the following cases: items[n].amount is empty or out of range (skip items[0] which is parent record)
// use function(){} to access this.path in this scope
export const recordItemAmountSchema = () =>
  Yup.number()
    .test('is-required', 'Common_Err_Required', function checkRequired(value) {
      if (this.path.includes('items[0]')) {
        return true;
      }
      return typeof value === 'number';
    })
    .test('too-large', 'Common_Err_Max', function checkMax(value) {
      if (this.path.includes('items[0]')) {
        return true;
      }
      return value <= 999999999999;
    });

// /////////////////////////////////////////////////////////////////////
//
// ExtendedItem
//
// /////////////////////////////////////////////////////////////////////
function validateExtendedItem(value) {
  const index = this.path.substr(-7, 2);
  const info = get(this.parent, `extendedItemText${index}Info`);
  const limitLength = info && info.limitLength;
  return value && limitLength ? !(value.length > limitLength) : true;
}

const eiRequiredBuilder = (values) => {
  return {
    is: 'true',
    then: Yup.string()
      .nullable()
      .test(
        'is-required',
        'Common_Err_Required',
        function validateEIRequired(value) {
          const isHotelFee = isHotelFeeRecord(this.path, values);
          if (isHotelFee && this.path.includes('items[0]')) return true;
          return !!value;
        }
      ),
  };
};

export const getExtendedItemsValidators = (values) => {
  const eIValidators = {};

  [...Array(totalNumTextExtendedItems).keys()].forEach((i) => {
    const index = `0${i + 1}`.slice(-2);
    eIValidators[`extendedItemText${index}Value`] = Yup.string()
      .when(
        `extendedItemText${index}Info.isRequired`,
        eiRequiredBuilder(values)
      )
      .test(`ExtendedItem${index}`, 'Common_Err_Max', validateExtendedItem)
      .nullable();
    eIValidators[`extendedItemText${index}Info`] = Yup.object()
      .shape({
        isRequired: Yup.string(),
      })
      .nullable();
  });

  [...Array(totalNumPicklistExtendedItems).keys()].forEach((i) => {
    const index = `0${i + 1}`.slice(-2);
    eIValidators[`extendedItemPicklist${index}Value`] = Yup.string()
      .when(
        `extendedItemPicklist${index}Info.isRequired`,
        eiRequiredBuilder(values)
      )
      .nullable();
    eIValidators[`extendedItemPicklist${index}Info`] = Yup.object()
      .shape({
        isRequired: Yup.string(),
      })
      .nullable();
  });

  [...Array(totalNumLookupExtendedItems).keys()].forEach((i) => {
    const index = `0${i + 1}`.slice(-2);
    eIValidators[`extendedItemLookup${index}Value`] = Yup.string()
      .when(
        `extendedItemLookup${index}Info.isRequired`,
        eiRequiredBuilder(values)
      )
      .nullable();
    eIValidators[`extendedItemLookup${index}Info`] = Yup.object()
      .shape({
        isRequired: Yup.string(),
      })
      .nullable();
  });

  [...Array(totalNumDateExtendedItems).keys()].forEach((i) => {
    const index = `0${i + 1}`.slice(-2);
    eIValidators[`extendedItemDate${index}Value`] = Yup.string()
      .when(
        `extendedItemDate${index}Info.isRequired`,
        eiRequiredBuilder(values)
      )
      .nullable();
    eIValidators[`extendedItemDate${index}Info`] = Yup.object()
      .shape({
        isRequired: Yup.string(),
      })
      .nullable();
  });

  return eIValidators;
};

// /////////////////////////////////////////////////////////////////////
//
// Record Items Create/Edit
//
// /////////////////////////////////////////////////////////////////////

export const recordItemsEditSchema = (values) => {
  return Yup.object().shape({
    report: Yup.object().shape({
      records: Yup.array().of(
        Yup.object().shape({
          items: Yup.array().of(
            Yup.object().shape({
              amount: recordItemAmountSchema(),
              recordDate: recordItemDateSchema(values),
              expTypeId: recordItemExpTypeIdSchema(),
              taxTypeHistoryId: taxTypeHistoryIdSchema(values),
              ...getExtendedItemsValidators(values),
            })
          ),
        })
      ),
    }),
  });
};

export const recordItemsCreateSchema = (values) => {
  return Yup.object().shape({
    report: Yup.object().shape({
      records: Yup.array().of(
        Yup.object().shape({
          items: Yup.array().of(
            Yup.object().shape({
              amount: recordItemAmountSchema(),
              recordDate: recordItemDateSchema(values),
              expTypeId: recordItemExpTypeIdSchema(),
            })
          ),
        })
      ),
    }),
  });
};

export const personalVendorSchema = () => {
  return Yup.object().shape({
    code: Yup.string()
      .required('Common_Err_Required')
      .trim('Common_Err_Required'),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    name_L0: Yup.string()
      .required('Common_Err_Required')
      .trim('Common_Err_Required'),
  });
};
