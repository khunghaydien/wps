// flow
import { get } from 'lodash';
import * as Yup from 'yup';

import {
  accountingDateSchema,
  accountingPeriodIdSchema,
  amountSchema,
  costCenterNameSchema,
  customRequestIdSchema,
  expReportTypeIdSchema,
  expTypeIdSchema,
  fileAttachmentListSchema,
  fixedAmountSelectionSchema,
  getExtendedItemsValidators,
  jobIdSchema,
  merchantSchema,
  paymentDueDateSchema,
  receiptIdSchema,
  recordDateSchema,
  recordItemsCreateSchema,
  recordItemsEditSchema,
  routeInfoSchema,
  subjectSchema,
  taxTypeHistoryIdSchema,
  vendorIdSchema,
} from '../../commons/schema/Expense';

import { status } from '../../domain/models/exp/Report';

//
// Report save schema
//
const saveSchema = (values) => {
  return Yup.object().shape({
    report: Yup.object().shape({
      subject: subjectSchema(),
      accountingPeriodId: accountingPeriodIdSchema(values),
      accountingDate: accountingDateSchema(),
      costCenterName: costCenterNameSchema(values),
      jobId: jobIdSchema(values),
      vendorId: vendorIdSchema(values),
      paymentDueDate: paymentDueDateSchema(values, false),
      expReportTypeId: expReportTypeIdSchema(values),
      ...getExtendedItemsValidators(values),
    }),
  });
};

//
// submit
//
const submitSchema = (values) => {
  return Yup.object().shape({
    report: Yup.object().shape({
      subject: subjectSchema(),
      attachedFileList: fileAttachmentListSchema(values),
      customRequestId: customRequestIdSchema(values),
      accountingPeriodId: accountingPeriodIdSchema(values),
      accountingDate: accountingDateSchema(),
      expReportTypeId: expReportTypeIdSchema(values),
      ...getExtendedItemsValidators(values),
      records: Yup.array().of(
        Yup.object().shape({
          recordType: Yup.string(),
          items: Yup.array().when('recordType', {
            is: 'HotelFee',
            then: Yup.array().of(
              Yup.object().shape({
                amount: amountSchema(),
                expTypeId: expTypeIdSchema(values),
                merchant: merchantSchema(values),
              })
            ),
            otherwise: Yup.array().of(
              Yup.object().shape({
                amount: amountSchema(),
                expTypeId: expTypeIdSchema(values),
                ...getExtendedItemsValidators(values),
                merchant: merchantSchema(values),
              })
            ),
          }),
          transitIcRecordId: Yup.string()
            .when('recordType', {
              is: 'TransportICCardJP',
              then: Yup.string()
                .nullable()
                .required('Exp_Err_NoIcTransactionLinked'),
            })
            .nullable(),
          receiptId: receiptIdSchema(values),
          routeInfo: routeInfoSchema(),
          recordDate: recordDateSchema(values),
        })
      ),
    }),
  });
};

//
// input
//
const inputSchema = (values) => {
  return Yup.object().shape({
    report: Yup.object().shape({
      subject: subjectSchema(),
      accountingDate: accountingDateSchema(),
      expReportTypeId: expReportTypeIdSchema(values),
      records: Yup.array().of(
        Yup.object().shape({
          recordType: Yup.string(),
          items: Yup.array().when('recordType', {
            is: 'HotelFee',
            then: Yup.array()
              .of(
                Yup.object().shape({
                  amount: amountSchema(),
                  expTypeId: expTypeIdSchema(values),
                  merchant: merchantSchema(values),
                })
              )
              .min(2, 'Exp_Err_RecordItemsMandatory'),
            otherwise: Yup.array().of(
              Yup.object().shape({
                amount: amountSchema(),
                ...getExtendedItemsValidators(values),
                expTypeId: expTypeIdSchema(values),
                merchant: merchantSchema(values),
              })
            ),
          }),
          transitIcRecordId: Yup.string()
            .when('recordType', {
              is: 'TransportICCardJP',
              then: Yup.string()
                .nullable()
                .required('Exp_Err_NoIcTransactionLinked'),
            })
            .nullable(),
          receiptId: receiptIdSchema(values),
          routeInfo: routeInfoSchema(),
          recordDate: recordDateSchema(values),
        })
      ),
    }),
  });
};

//
// recordSave
//
const recordSaveSchema = (values) => {
  const { recordIdx } = values.ui;
  const selectedRecordId = get(values, `report.records[${recordIdx}].recordId`);

  return Yup.object().shape({
    report: Yup.object().shape({
      records: Yup.array().of(
        Yup.object().when('.', {
          // validate only current selected record
          is: (self) => self.recordId === selectedRecordId,
          then: Yup.object().shape({
            recordType: Yup.string(),
            items: Yup.array()
              .when('recordType', {
                is: 'HotelFee',
                then: Yup.array().of(
                  Yup.object().shape({
                    amount: amountSchema(),
                    merchant: merchantSchema(values),
                  })
                ),
                otherwise: Yup.array().of(
                  Yup.object().shape({
                    amount: amountSchema(),
                    taxTypeHistoryId: taxTypeHistoryIdSchema(),
                    merchant: merchantSchema(values),
                  })
                ),
              })
              .when('recordType', {
                is: 'FixedAllowanceMulti',
                then: Yup.array().of(
                  Yup.object().shape({
                    fixedAllowanceOptionId: fixedAmountSelectionSchema(),
                    merchant: merchantSchema(values),
                  })
                ),
              }),
            recordDate: recordDateSchema(values),
            transitIcRecordId: Yup.string()
              .when('recordType', {
                is: 'TransportICCardJP',
                then: Yup.string()
                  .nullable()
                  .required('Exp_Err_NoIcTransactionLinked'),
              })
              .nullable(),
          }),
          otherwise: Yup.object(),
        })
      ),
    }),
  });
};

//
// recordSave Schema for FA
//
const recordSaveFASchema = (values) => {
  const { recordIdx } = values.ui;
  const selectedRecordId = get(values, `report.records[${recordIdx}].recordId`);

  return Yup.object().shape({
    report: Yup.object().shape({
      records: Yup.array().of(
        Yup.object().when('.', {
          // validate only current selected record
          is: (self) => self.recordId === selectedRecordId,
          then: Yup.object().shape({
            recordType: Yup.string(),
            items: Yup.array()
              .when('recordType', {
                is: 'HotelFee',
                then: Yup.array().of(
                  Yup.object().shape({
                    amount: amountSchema(),
                    merchant: merchantSchema(values),
                  })
                ),
                otherwise: Yup.array().of(
                  Yup.object().shape({
                    amount: amountSchema(),
                    taxTypeHistoryId: taxTypeHistoryIdSchema(),
                    merchant: merchantSchema(values),
                    ...getExtendedItemsValidators(values),
                  })
                ),
              })
              .when('recordType', {
                is: 'FixedAllowanceMulti',
                then: Yup.array().of(
                  Yup.object().shape({
                    fixedAllowanceOptionId: fixedAmountSelectionSchema(),
                  })
                ),
              }),
            recordDate: recordDateSchema(values),
            transitIcRecordId: Yup.string()
              .when('recordType', {
                is: 'TransportICCardJP',
                then: Yup.string()
                  .nullable()
                  .required('Exp_Err_NoIcTransactionLinked'),
              })
              .nullable(),
          }),
          otherwise: Yup.object(),
        })
      ),
    }),
  });
};

//
// submit schema for FA, ignore the records' expense type check
//
const submitFASchema = (values) => {
  return Yup.object().shape({
    report: Yup.object().shape({
      subject: subjectSchema(),
      accountingDate: accountingDateSchema(),
      expReportTypeId: expReportTypeIdSchema(values),
      ...getExtendedItemsValidators(values),
      records: Yup.array().of(
        Yup.object().shape({
          recordType: Yup.string(),
          items: Yup.array().when('recordType', {
            is: 'HotelFee',
            then: Yup.array().of(
              Yup.object().shape({
                amount: amountSchema(),
              })
            ),
            otherwise: Yup.array().of(
              Yup.object().shape({
                amount: amountSchema(),
                ...getExtendedItemsValidators(values),
              })
            ),
          }),
          receiptId: receiptIdSchema(values),
          routeInfo: routeInfoSchema(),
          recordDate: recordDateSchema(values),
        })
      ),
    }),
  });
};

//
// input schema for FA, ignore the records' expense type check
//
const inputFASchema = (values) => {
  return Yup.object().shape({
    report: Yup.object().shape({
      subject: subjectSchema(),
      accountingDate: accountingDateSchema(),
      expReportTypeId: expReportTypeIdSchema(values),
      ...getExtendedItemsValidators(values),
      records: Yup.array().of(
        Yup.object().shape({
          recordType: Yup.string(),
          items: Yup.array().when('recordType', {
            is: 'HotelFee',
            then: Yup.array().of(
              Yup.object().shape({
                amount: amountSchema(),
              })
            ),
            otherwise: Yup.array().of(
              Yup.object().shape({
                amount: amountSchema(),
                ...getExtendedItemsValidators(values),
              })
            ),
          }),
          receiptId: receiptIdSchema(values),
          routeInfo: routeInfoSchema(),
          recordDate: recordDateSchema(values),
        })
      ),
    }),
  });
};

export default Yup.lazy((values) => {
  // child record items create / edit
  if (get(values, 'ui.isRecordItemsEdit')) {
    return recordItemsEditSchema(values);
  } else if (get(values, 'ui.isRecordItemsCreate')) {
    return recordItemsCreateSchema(values);
  }
  const { report } = values;
  // if it has preRequestId and no reportId, it's a new approved preRequest
  const isNewPreRequest = report.preRequestId && !report.reportId;
  // For pending, claimed or any status after financial approval approved stage, no validation
  // ??check status of approved record/report
  const isNonEditableReport =
    report.status === status.PENDING ||
    report.status === status.CLAIMED ||
    report.status === status.ACCOUNTING_AUTHORIZED ||
    report.status === status.ACCOUNTING_REJECTED ||
    report.status === status.JOURNAL_CREATED ||
    report.status === status.FULLY_PAID;

  // no validation if it's new preRequest or non-editable report or financial page
  // canot return null as lazy requires a valid schema. Hence, we return empty schema
  if (isNewPreRequest || isNonEditableReport) {
    return Yup.object().shape({});
  }

  // separates report & record save schema
  if (values.ui.isRecordSave) {
    // record save
    return values.report.status === status.APPROVED
      ? recordSaveFASchema(values)
      : recordSaveSchema(values);
  } else if (values.ui.saveMode) {
    // save
    return saveSchema(values);
  } else if (values.ui.submitMode) {
    // submit
    return values.report.status === status.APPROVED
      ? submitFASchema(values)
      : submitSchema(values);
  } else {
    // // Check when you are typing
    return values.report.status === status.APPROVED
      ? inputFASchema(values)
      : inputSchema(values);
  }
});
