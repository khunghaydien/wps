import Decimal from 'decimal.js';
import { get, isEmpty, isNil } from 'lodash';
import * as Yup from 'yup';

import {
  totalNumExpTypeExtendedItems,
  totalNumExtendedItems,
} from '../../domain/models/exp/ExtendedItem';
import {
  isItemizedRecord,
  isJorudanRecord,
  ITEMIZATION_SETTING_TYPE,
  RECEIPT_TYPE,
  RECORD_TYPE,
  TaxItems,
} from '../../domain/models/exp/Record';
import { status as STATUS, status } from '../../domain/models/exp/Report';
import { VENDOR_PAYMENT_DUE_DATE_USAGE } from '../../domain/models/exp/Vendor';

type TestOptionsExtended = Yup.TestOptions & {
  index?: number;
};

// check if itemized record, to skip validation for first item
const isItemized = (path: string, values) => {
  const isRecord = path.includes('records');
  if (!isRecord) return false;

  const recordPath = path.match(/report.records\[[0-9]+\]/)[0];
  const recordItemList = get(values, `${recordPath}.items`, []);
  return isItemizedRecord(recordItemList.length);
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

export const vendorIdSchema = (values, isRecord?: boolean) =>
  Yup.string()
    .nullable()
    .test('vendorId', 'Common_Err_Required', function (value) {
      const recordPath = this.path.match(/([^.]*\.[^.]*)./)[1];
      const recordType = get(values, `${recordPath}.recordType`);
      const isVendorRequired = isRecord
        ? values.ui.isRecordVendorRequired && !isJorudanRecord(recordType)
        : values.ui.isVendorRequired;
      if (isVendorRequired) {
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

export const paymentDueDateRecordSchema = (values) =>
  Yup.string()
    .nullable()
    .test(
      'Payment Due Date is Not Empty',
      'Common_Err_Required',
      function checkRequired(value) {
        const recordItemPath = this.path.match(
          /report.records\[[0-9]+\].items\[0\]/
        )?.[0];
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
          const recordType = get(
            values,
            recordItemPath.replace('.items[0]', '.recordType'),
            null
          );
          if (
            vendorId &&
            paymentDueDateUsage === VENDOR_PAYMENT_DUE_DATE_USAGE.Required &&
            !isJorudanRecord(recordType)
          ) {
            return !!value;
          }
          return true;
        }
        return true;
      }
    );

export const paymentDueDateReportSchema = (values) =>
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

export const cashAdvanceRequestAmountSchema = (values) =>
  Yup.number()
    .nullable()
    .test(
      'cashAdvanceRequestAmountRequired',
      'Common_Err_Required',
      (amount: number) => {
        if (values.ui.isUseCashAdvance) return amount > 0;
        return true;
      }
    )
    .test(
      'cashAdvanceRequestAmountMax',
      'Exp_Err_SpecifyWithinTotalAmount',
      (amount: number) =>
        !(values.ui.isUseCashAdvance && amount > values.report.totalAmount)
    );

export const cashAdvanceRequestDateSchema = (values) =>
  Yup.string()
    .nullable()
    .test('cashAdvanceRequestDate', 'Common_Err_Required', (date: string) => {
      if (values.ui.isUseCashAdvance) return !!date;
      return true;
    });
// /////////////////////////////////////////////////////////////////////
//
// Record
//
// /////////////////////////////////////////////////////////////////////

// Error in the following cases.
// 1. recordType is General, attachmentBody is empty
// 2. recordType is GeneralOption, attachmentBody and remarks empty
export const receiptListSchema = (values) =>
  Yup.array()
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

      const hasReceipt = value && value.length >= 1;
      const isNotSaveMode = values.ui.isBulkEditMode || !values.ui.saveMode;
      if (isNotSaveMode && !isTypeSkipValidation && !hasReceipt) {
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

        const hasReceipt = value && value.length >= 1;
        const isNotSaveMode = values.ui.isBulkEditMode || !values.ui.saveMode;
        if (
          isNotSaveMode &&
          isReceiptOptional &&
          !hasReceipt &&
          (!this.parent.items[0].remarks ||
            !this.parent.items[0].remarks.length)
        ) {
          return false;
        }
        return true;
      }
    )
    .of(
      Yup.object().shape({
        receiptId: Yup.string().nullable().required('Common_Err_Required'),
      })
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

const validateSelectedRoute = () =>
  Yup.string()
    .nullable()
    .test(
      'selectedRoute',
      'Exp_Err_NoSelectedRoute',
      function validateSelectedRoute(value) {
        return !!value;
      }
    );

export const validateEstimatedDistance = () => {
  return Yup.string()
    .nullable()
    .test(
      'estimatedDistance',
      'Exp_Err_NoSelectedRoute',
      function validateEstimatedDistance(value) {
        const isDestinationManuallyInput = isNil(value);
        if (isDestinationManuallyInput) return true;
        return !!Number(value);
      }
    );
};

export const mileageRouteInfoSchema = () =>
  Yup.object()
    .nullable()
    .shape({
      destinations: Yup.array().of(
        Yup.object().nullable().shape({
          name: validateSelectedRoute(),
        })
      ),
      estimatedDistance: validateEstimatedDistance(),
    });

// Error in the following cases.
// 1. recordDate and accountingPeriod do not match
export const recordDateSchema = (values) =>
  Yup.string()
    .test('is-date-in-range', 'Exp_Err_DateNotInRange', (value) => {
      const {
        bulkRecordIdx,
        isBulkEditMode,
        selectedAccountingPeriod,
        recordIdx,
      } = values.ui;
      const selectedRecordIdx = isBulkEditMode ? bulkRecordIdx : recordIdx;
      const currentSelectedRecord = values.report.records[selectedRecordIdx];
      const currentSelectedRecordDate =
        selectedRecordIdx > -1 && values.ui.isRecordSave
          ? currentSelectedRecord && currentSelectedRecord.recordDate
          : value;
      let isCurrentSelectedRecordDateValid = true;

      if (selectedAccountingPeriod && currentSelectedRecordDate) {
        const currentRecordDate = new Date(currentSelectedRecordDate);
        const startDate = new Date(selectedAccountingPeriod.validDateFrom);
        const endDate = new Date(selectedAccountingPeriod.validDateTo);

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
  Yup.string()
    .test(
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
    )
    .test('is-required', 'Common_Err_Required', itemExpTypeIdSchema);

export const recordItemExpTypeIdSchema = () =>
  Yup.string()
    .nullable()
    .test('is-required', 'Common_Err_Required', itemExpTypeIdSchema);

// Error in the the following case.
// record in base currency does not have taxTypeHistoryId (no tax type selected/available)
export const taxTypeHistoryIdSchema = () => {
  return Yup.string()
    .nullable()
    .when(['useForeignCurrency', 'taxItems'], {
      is: (useForeignCurrency: boolean, taxItems: TaxItems) =>
        useForeignCurrency || (!useForeignCurrency && taxItems?.length > 0),
      then: Yup.string().nullable(),
      otherwise: Yup.string()
        .nullable()
        .test('no-tax-available', 'Exp_Err_NoTaxAvailable', function (value) {
          return !!value;
        }),
    });
};

// Error in the following cases.
// recordType is FixedAllowanceMulti, amountSelection is empty
export const fixedAmountSelectionSchema = () =>
  Yup.string().nullable().required('Common_Err_Required');

// payment method
export const paymentMethodCCSchema = (isCCPaymentMethod: boolean) =>
  Yup.string()
    .nullable()
    .test(
      'creditCardTransactionId',
      'Exp_Err_NoCcTransactionLinked',
      (creditCardTransactionId: string) => {
        if (isCCPaymentMethod) return !!creditCardTransactionId;
        return true;
      }
    );

export const paymentMethodSchema = (values) => {
  const availablePaymentMethodIds = values.ui.availablePaymentMethodIds || [];

  return Yup.string()
    .nullable()
    .test('required', 'Common_Err_Required', function validateRequired(value) {
      return availablePaymentMethodIds.length > 0 ? !!value : true;
    })
    .test(
      'ValidateRecordPaymentMethodForReportType',
      'Exp_Err_SelectValidPaymentMethod',
      function validateRecordPaymentMethod(value) {
        return isValidPaymentMethod(value, values);
      }
    );
};

const isValidPaymentMethod = (value, values) => {
  const availablePaymentMethodIds = values.ui.availablePaymentMethodIds || [];
  if (value && !availablePaymentMethodIds.includes(value)) return false;
  return true;
};

// /////////////////////////////////////////////////////////////////////
//
// Items
//
// /////////////////////////////////////////////////////////////////////
export const amountRequiredSchema = () =>
  Yup.number().test('not-zero', 'Common_Err_Required', (value) => !!value);

export const amountMatchSchema = (isBulkEditMode?) => {
  return Yup.number().test({
    name: 'amount_match',
    message: 'Exp_Lbl_AmountOfAllTaxTypesDoNotAddUpToTotal',
    test: function (value) {
      const taxItems = get(this.parent, 'items[0].taxItems');
      if (!taxItems || isEmpty(taxItems)) {
        return true;
      }
      const totalAmount = taxItems?.reduce(
        (total, taxItem) => Decimal.add(total, taxItem.amount),
        new Decimal(0)
      );
      if (isBulkEditMode && totalAmount === 0) {
        return true;
      }
      return new Decimal(value).equals(totalAmount);
    },
  });
};

export const amountSchema = () =>
  Yup.number()
    .required('Common_Err_Required')
    .max(999999999999, 'Common_Err_Max');

const amountNegativeSchema = (msgKey: string) =>
  Yup.number().when('allowNegativeAmount', {
    is: (allowNegativeAmount: boolean) =>
      !isNil(allowNegativeAmount) && !allowNegativeAmount,
    then: Yup.number().min(0, msgKey),
  });

export const bcAndFcAmountSchema = () =>
  Yup.array().of(
    Yup.object().shape({
      amount: Yup.number().when('useForeignCurrency', {
        is: false,
        then: amountNegativeSchema('Exp_Err_AmountNegative'),
        otherwise: amountSchema(),
      }),
      localAmount: Yup.number().when('useForeignCurrency', {
        is: true,
        then: amountNegativeSchema('Exp_Err_LocalAmountNegative'),
      }),
    })
  );

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
const itemExpTypeIdSchema = function checkRequired(value) {
  if (this.path.includes('items[0]')) {
    return true;
  }
  return !!value;
};

// Withholding tax
export const amountPayableSchema = () =>
  Yup.number().test(
    'is-negative',
    'Exp_Err_AmountPayableNegative',
    function (amountPayable: number) {
      return this.path.includes('items[0]') ? amountPayable >= 0 : true;
    }
  );

export const withholdingTaxAmountSchema = () =>
  Yup.number()
    .nullable()
    .test(
      'is-required',
      'Common_Err_Required',
      function (withholdingTaxAmount: number) {
        return this.path.includes('items[0]')
          ? Math.abs(withholdingTaxAmount) > 0
          : true;
      }
    );

export const itemizationSettingRequiredSchema = (values) =>
  Yup.string()
    .nullable()
    .when('.', {
      is: ITEMIZATION_SETTING_TYPE.Required,
      then: Yup.string()
        .nullable()
        .test(
          'record items are mandatory',
          'Exp_Err_RecordItemsMandatory',
          function () {
            return this.path.includes('items[0]')
              ? isItemized(this.path, values)
              : true;
          }
        ),
    });

// /////////////////////////////////////////////////////////////////////
//
// Cash Advance (for FA Request only)
//
// /////////////////////////////////////////////////////////////////////
export const getCashAdvanceValidators = (values) => {
  return values.report.status === status.APPROVED
    ? {
        cashAdvanceAmount: cashAdvanceRequestAmountSchema(values),
        cashAdvanceDate: cashAdvanceRequestDateSchema(values),
        cashAdvanceRequestAmount: cashAdvanceRequestAmountSchema(values),
        cashAdvanceRequestDate: cashAdvanceRequestDateSchema(values),
      }
    : {};
};

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

const eiRequiredBuilder = () => {
  return {
    is: 'true',
    then: Yup.string()
      .nullable()
      .test(
        'is-required',
        'Common_Err_Required',
        function validateEIRequired(value) {
          const options = this?.options as TestOptionsExtended;
          const idx = options?.index;
          return idx > 0 ? true : !!value;
        }
      ),
  };
};

export const getExtendedItemsValidators = (isRecord?: boolean) => {
  const totalNumberEI = isRecord
    ? totalNumExpTypeExtendedItems
    : totalNumExtendedItems;
  const eIValidators = {};

  [...Array(totalNumberEI).keys()].forEach((i) => {
    const index = `0${i + 1}`.slice(-2);
    eIValidators[`extendedItemText${index}Value`] = Yup.string()
      .when(`extendedItemText${index}Info.isRequired`, eiRequiredBuilder())
      .test(`ExtendedItem${index}`, 'Common_Err_Max', validateExtendedItem)
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
      .when(`extendedItemPicklist${index}Info.isRequired`, eiRequiredBuilder())
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
      .when(`extendedItemLookup${index}Info.isRequired`, eiRequiredBuilder())
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
      .when(`extendedItemDate${index}Info.isRequired`, eiRequiredBuilder())
      .nullable();
    eIValidators[`extendedItemDate${index}Info`] = Yup.object()
      .shape({
        isRequired: Yup.string(),
      })
      .nullable();
  });

  return eIValidators;
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
