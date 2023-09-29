// flow
import { get } from 'lodash';
import * as Yup from 'yup';

import {
  accountingDateSchema,
  accountingPeriodIdSchema,
  amountMatchSchema,
  amountPayableSchema,
  amountRequiredSchema,
  amountSchema,
  bcAndFcAmountSchema,
  costCenterNameSchema,
  customRequestIdSchema,
  expReportTypeIdSchema,
  expTypeIdSchema,
  fileAttachmentListSchema,
  fixedAmountSelectionSchema,
  getExtendedItemsValidators,
  itemizationSettingRequiredSchema,
  jobIdSchema,
  merchantSchema,
  mileageRouteInfoSchema,
  paymentDueDateRecordSchema,
  paymentDueDateReportSchema,
  paymentMethodCCSchema,
  paymentMethodSchema,
  receiptListSchema,
  recordDateSchema,
  recordItemDateSchema,
  recordItemExpTypeIdSchema,
  routeInfoSchema,
  subjectSchema,
  taxTypeHistoryIdSchema,
  vendorIdSchema,
  withholdingTaxAmountSchema,
} from '../../commons/schema/Expense';

import { status } from '../../domain/models/exp/Report';
import {
  isItemizedRecord,
  isUseWithholdingTax,
  RECORD_TYPE,
  WITHHOLDING_TAX_TYPE,
} from '@apps/domain/models/exp/Record';

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
      paymentDueDate: paymentDueDateReportSchema(values),
      expReportTypeId: expReportTypeIdSchema(values),
      ...getExtendedItemsValidators(),
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
      ...getExtendedItemsValidators(),
      records: Yup.array().of(
        Yup.object().shape({
          recordType: Yup.string(),
          amount: amountMatchSchema(),
          paymentMethodId: paymentMethodSchema(values),
          items: Yup.array().when('.', {
            is: (items = []) => isItemizedRecord(items.length),
            then: Yup.array().of(
              Yup.object().shape({
                amount: amountSchema(),
                expTypeId: expTypeIdSchema(values),
                merchant: merchantSchema(values),
                ...getExtendedItemsValidators(true),
              })
            ),
            otherwise: Yup.array().of(
              Yup.object().shape({
                amount: amountSchema(),
                expTypeId: expTypeIdSchema(values),
                merchant: merchantSchema(values),
                ...getExtendedItemsValidators(true),
                expTypeItemizationSetting:
                  itemizationSettingRequiredSchema(values),
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
          receiptList: receiptListSchema(values),
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
          amount: amountMatchSchema(),
          paymentMethodId: paymentMethodSchema(values),
          items: Yup.array()
            .when('.', {
              is: (items = []) => isItemizedRecord(items.length),
              then: Yup.array().of(
                Yup.object().shape({
                  amount: amountSchema(),
                  expTypeId: expTypeIdSchema(values),
                  merchant: merchantSchema(values),
                  recordDate: recordItemDateSchema(values),
                  taxTypeHistoryId: taxTypeHistoryIdSchema(),
                  ...getExtendedItemsValidators(true),
                })
              ),
              otherwise: Yup.array().of(
                Yup.object().shape({
                  amount: amountSchema(),
                  ...getExtendedItemsValidators(true),
                  expTypeId: expTypeIdSchema(values),
                  merchant: merchantSchema(values),
                  vendorId: vendorIdSchema(values, true),
                  paymentDueDate: paymentDueDateRecordSchema(values),
                  expTypeItemizationSetting:
                    itemizationSettingRequiredSchema(values),
                })
              ),
            })
            .when('recordType', {
              is: RECORD_TYPE.Mileage,
              then: Yup.array().of(
                Yup.object().shape({
                  amount: amountSchema(),
                  mileageDistance: Yup.number().required('Com_Lbl_Required'),
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
            })
            .when('recordType', {
              is: RECORD_TYPE.General,
              then: bcAndFcAmountSchema(),
            })
            .when('withholdingTaxUsage', {
              is: (withholdingTaxUsage: string) =>
                isUseWithholdingTax(withholdingTaxUsage),
              then: Yup.array().of(
                Yup.object().shape({
                  amountPayable: Yup.number().when('useForeignCurrency', {
                    is: (useForeignCurrency: string) => !useForeignCurrency,
                    then: amountPayableSchema(),
                  }),
                })
              ),
            })
            .when('withholdingTaxUsage', {
              is: (withholdingTaxUsage: string) =>
                withholdingTaxUsage === WITHHOLDING_TAX_TYPE.Required,
              then: Yup.array().of(
                Yup.object().shape({
                  withholdingTaxAmount: withholdingTaxAmountSchema(),
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
          receiptList: receiptListSchema(values),
          routeInfo: routeInfoSchema(),
          recordDate: recordDateSchema(values),
        })
      ),
    }),
  });
};

//
// bulk record input
//
const bulkRecordInputSchema = (values) => {
  return Yup.object().shape({
    report: Yup.object().shape({
      expReportTypeId: expReportTypeIdSchema(values),
      records: Yup.array().of(
        Yup.object().shape({
          amount: Yup.number().when('recordType', {
            is: (recordType: string) =>
              recordType !== RECORD_TYPE.TransitJorudanJP,
            then: amountRequiredSchema().concat(amountMatchSchema(true)),
          }),
          recordType: Yup.string(),
          items: Yup.array()
            .when('.', {
              is: (items = []) => isItemizedRecord(items.length),
              then: Yup.array().of(
                Yup.object().shape({
                  amount: amountSchema(),
                  expTypeId: expTypeIdSchema(values),
                })
              ),
              otherwise: Yup.array().of(
                Yup.object().shape({
                  amount: amountSchema(),
                  expTypeId: expTypeIdSchema(values),
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
            })
            .when('recordType', {
              is: RECORD_TYPE.General,
              then: bcAndFcAmountSchema(),
            }),
          receiptList: receiptListSchema(values),
          recordDate: recordDateSchema(values),
          routeInfo: routeInfoSchema(values),
          mileageRouteInfo: Yup.object().nullable().when('recordType', {
            is: RECORD_TYPE.Mileage,
            then: mileageRouteInfoSchema(),
          }),
        })
      ),
    }),
  });
};

//
// recordSave
//
const recordSaveSchema = (values) => {
  const { isCCPaymentMethod, recordIdx } = values.ui;
  const selectedRecordId = get(values, `report.records[${recordIdx}].recordId`);

  return Yup.object().shape({
    report: Yup.object().shape({
      records: Yup.array().of(
        Yup.object().when('.', {
          // validate only current selected record
          is: (self) => self.recordId === selectedRecordId,
          then: Yup.object().shape({
            recordType: Yup.string(),
            amount: amountMatchSchema(),
            withholdingTaxUsage: Yup.string().nullable(),
            paymentMethodId: paymentMethodSchema(values),
            items: Yup.array()
              .when('.', {
                is: (items = []) => isItemizedRecord(items.length),
                then: Yup.array().of(
                  Yup.object().shape({
                    amount: amountSchema(),
                    merchant: merchantSchema(values),
                    expTypeId: recordItemExpTypeIdSchema(),
                    taxTypeHistoryId: taxTypeHistoryIdSchema(),
                    recordDate: recordItemDateSchema(values),
                    ...getExtendedItemsValidators(true),
                  })
                ),
                otherwise: Yup.array().of(
                  Yup.object().shape({
                    amount: amountSchema(),
                    taxTypeHistoryId: taxTypeHistoryIdSchema(),
                    merchant: merchantSchema(values),
                    vendorId: vendorIdSchema(values, true),
                    paymentDueDate: paymentDueDateRecordSchema(values),
                    expTypeItemizationSetting:
                      itemizationSettingRequiredSchema(values),
                    ...getExtendedItemsValidators(true),
                  })
                ),
              })
              .when('recordType', {
                is: RECORD_TYPE.Mileage,
                then: Yup.array().of(
                  Yup.object().shape({
                    amount: amountSchema(),
                    mileageDistance: Yup.number().required('Com_Lbl_Required'),
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
              })
              .when('recordType', {
                is: RECORD_TYPE.General,
                then: bcAndFcAmountSchema(),
              })
              .when('withholdingTaxUsage', {
                is: (withholdingTaxUsage: string) =>
                  isUseWithholdingTax(withholdingTaxUsage),
                then: Yup.array().of(
                  Yup.object().shape({
                    amountPayable: Yup.number().when('useForeignCurrency', {
                      is: (useForeignCurrency: string) => !useForeignCurrency,
                      then: amountPayableSchema(),
                    }),
                  })
                ),
              })
              .when('withholdingTaxUsage', {
                is: (withholdingTaxUsage: string) =>
                  withholdingTaxUsage === WITHHOLDING_TAX_TYPE.Required,
                then: Yup.array().of(
                  Yup.object().shape({
                    withholdingTaxAmount: withholdingTaxAmountSchema(),
                  })
                ),
              }),
            recordDate: recordDateSchema(values),
            mileageRouteInfo: Yup.object()
              .when('recordType', {
                is: RECORD_TYPE.Mileage,
                then: Yup.object().shape({
                  destinations: Yup.array().of(
                    Yup.object().shape({
                      name: Yup.string().required('Exp_Err_Destination'),
                    })
                  ),
                }),
              })
              .nullable(),
            transitIcRecordId: Yup.string()
              .when('recordType', {
                is: 'TransportICCardJP',
                then: Yup.string()
                  .nullable()
                  .required('Exp_Err_NoIcTransactionLinked'),
              })
              .nullable(),
            creditCardTransactionId: paymentMethodCCSchema(isCCPaymentMethod),
          }),
          otherwise: Yup.object(),
        })
      ),
    }),
  });
};

//
// bulk record save
//
const bulkRecordSaveSchema = (values) => {
  return Yup.object().shape({
    report: Yup.object().shape({
      expReportTypeId: expReportTypeIdSchema(values),
      records: Yup.array().of(
        Yup.object().shape({
          recordType: Yup.string(),
          amount: Yup.number().when('recordType', {
            is: (recordType: string) =>
              recordType !== RECORD_TYPE.TransitJorudanJP,
            then: amountRequiredSchema().concat(amountMatchSchema(true)),
          }),
          receiptList: receiptListSchema(values),
          recordDate: recordDateSchema(values),
          routeInfo: routeInfoSchema(values),
          mileageRouteInfo: Yup.object().nullable().when('recordType', {
            is: RECORD_TYPE.Mileage,
            then: mileageRouteInfoSchema(),
          }),
          items: Yup.array()
            .when('.', {
              is: (items = []) => isItemizedRecord(items.length),
              then: Yup.array().of(
                Yup.object().shape({
                  amount: amountSchema(),
                  expTypeId: expTypeIdSchema(values),
                })
              ),
              otherwise: Yup.array().of(
                Yup.object().shape({
                  amount: amountSchema(),
                  expTypeId: expTypeIdSchema(values),
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
            })
            .when('recordType', {
              is: RECORD_TYPE.General,
              then: bcAndFcAmountSchema(),
            }),
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
            amount: amountMatchSchema(),
            withholdingTaxUsage: Yup.string().nullable(),
            paymentMethodId: paymentMethodSchema(values),
            items: Yup.array()
              .when('.', {
                is: (items = []) => isItemizedRecord(items.length),
                then: Yup.array().of(
                  Yup.object().shape({
                    amount: amountSchema(),
                    merchant: merchantSchema(values),
                    expTypeId: recordItemExpTypeIdSchema(),
                    taxTypeHistoryId: taxTypeHistoryIdSchema(),
                    ...getExtendedItemsValidators(true),
                  })
                ),
                otherwise: Yup.array().of(
                  Yup.object().shape({
                    amount: amountSchema(),
                    taxTypeHistoryId: taxTypeHistoryIdSchema(),
                    merchant: merchantSchema(values),
                    vendorId: vendorIdSchema(values, true),
                    paymentDueDate: paymentDueDateRecordSchema(values),
                    ...getExtendedItemsValidators(true),
                    expTypeItemizationSetting:
                      itemizationSettingRequiredSchema(values),
                  })
                ),
              })
              .when('recordType', {
                is: RECORD_TYPE.Mileage,
                then: Yup.array().of(
                  Yup.object().shape({
                    amount: amountSchema(),
                    mileageDistance: Yup.number().required('Com_Lbl_Required'),
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
              })
              .when('recordType', {
                is: RECORD_TYPE.General,
                then: bcAndFcAmountSchema(),
              })
              .when('withholdingTaxUsage', {
                is: (withholdingTaxUsage: string) =>
                  isUseWithholdingTax(withholdingTaxUsage),
                then: Yup.array().of(
                  Yup.object().shape({
                    amountPayable: Yup.number().when('useForeignCurrency', {
                      is: (useForeignCurrency: string) => !useForeignCurrency,
                      then: amountPayableSchema(),
                    }),
                  })
                ),
              })
              .when('withholdingTaxUsage', {
                is: (withholdingTaxUsage: string) =>
                  withholdingTaxUsage === WITHHOLDING_TAX_TYPE.Required,
                then: Yup.array().of(
                  Yup.object().shape({
                    withholdingTaxAmount: withholdingTaxAmountSchema(),
                  })
                ),
              }),
            recordDate: recordDateSchema(values),
            mileageRouteInfo: Yup.object()
              .when('recordType', {
                is: RECORD_TYPE.Mileage,
                then: Yup.object().shape({
                  destinations: Yup.array().of(
                    Yup.object().shape({
                      name: Yup.string().required('Exp_Err_Destination'),
                    })
                  ),
                }),
              })
              .nullable(),
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
      ...getExtendedItemsValidators(),
      records: Yup.array().of(
        Yup.object().shape({
          recordType: Yup.string(),
          amount: amountMatchSchema(),
          paymentMethodId: paymentMethodSchema(values),
          items: Yup.array().when('.', {
            is: (items = []) => isItemizedRecord(items.length),
            then: Yup.array().of(
              Yup.object().shape({
                amount: amountSchema(),
              })
            ),
            otherwise: Yup.array().of(
              Yup.object().shape({
                amount: amountSchema(),
                ...getExtendedItemsValidators(true),
              })
            ),
          }),
          receiptList: receiptListSchema(values),
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
      ...getExtendedItemsValidators(),
      records: Yup.array().of(
        Yup.object().shape({
          recordType: Yup.string(),
          amount: amountMatchSchema(),
          paymentMethodId: paymentMethodSchema(values),
          items: Yup.array()
            .when('.', {
              is: (items = []) => isItemizedRecord(items.length),
              then: Yup.array().of(
                Yup.object().shape({
                  amount: amountSchema(),
                  merchant: merchantSchema(values),
                  expTypeId: recordItemExpTypeIdSchema(),
                  taxTypeHistoryId: taxTypeHistoryIdSchema(),
                })
              ),
              otherwise: Yup.array().of(
                Yup.object().shape({
                  amount: amountSchema(),
                  ...getExtendedItemsValidators(true),
                  merchant: merchantSchema(values),
                  vendorId: vendorIdSchema(values, true),
                  paymentDueDate: paymentDueDateRecordSchema(values),
                  expTypeItemizationSetting:
                    itemizationSettingRequiredSchema(values),
                })
              ),
            })
            .when('recordType', {
              is: RECORD_TYPE.General,
              then: bcAndFcAmountSchema(),
            }),
          receiptList: receiptListSchema(values),
          routeInfo: routeInfoSchema(),
          recordDate: recordDateSchema(values),
        })
      ),
    }),
  });
};

export default Yup.lazy((values) => {
  const { report } = values;
  if (report && values.ui) {
    // if it has preRequestId and no reportId, it's a new approved preRequest
    const isNewPreRequest = report.preRequestId && !report.reportId;
    // For pending, claimed or any status after financial approval approved stage, no validation
    // ??check status of approved record/report
    const isExpReqApprovedReport =
      !values.ui.isFAEditMode && report.status === status.APPROVED;
    const isNonEditableReport =
      report.status === status.PENDING ||
      report.status === status.CLAIMED ||
      report.status === status.ACCOUNTING_AUTHORIZED ||
      report.status === status.ACCOUNTING_REJECTED ||
      report.status === status.JOURNAL_CREATED ||
      report.status === status.FULLY_PAID ||
      isExpReqApprovedReport;

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
    } else if (values.ui.isRecordBulkSave) {
      return bulkRecordSaveSchema(values);
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
      return values.report.status === status.APPROVED ||
        (report.reportId && !report.status)
        ? inputFASchema(values)
        : values.ui.isBulkEditMode
        ? bulkRecordInputSchema(values)
        : inputSchema(values);
    }
  }
  return Yup.object().shape({});
});
