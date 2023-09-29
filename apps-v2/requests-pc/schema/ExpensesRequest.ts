// flow
import { get } from 'lodash';
import * as Yup from 'yup';

import {
  amountMatchSchema,
  amountPayableSchema,
  amountRequiredSchema,
  amountSchema,
  bcAndFcAmountSchema,
  cashAdvanceRequestAmountSchema,
  cashAdvanceRequestDateSchema,
  costCenterNameSchema,
  expReportTypeIdSchema,
  expTypeIdSchema,
  fixedAmountSelectionSchema,
  getCashAdvanceValidators,
  getExtendedItemsValidators,
  itemizationSettingRequiredSchema,
  jobIdSchema,
  mileageRouteInfoSchema,
  paymentDueDateRecordSchema,
  paymentDueDateReportSchema,
  paymentMethodSchema,
  purposeSchema,
  recordDateSchema,
  recordItemDateSchema,
  recordItemExpTypeIdSchema,
  routeInfoSchema,
  scheduledDateSchema,
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
// save
//
const saveSchema = (values) => {
  return Yup.object().shape({
    report: Yup.object().shape({
      subject: subjectSchema(),
      vendorId: vendorIdSchema(values),
      costCenterName: costCenterNameSchema(values),
      jobId: jobIdSchema(values),
      paymentDueDate: paymentDueDateReportSchema(values),
      scheduledDate: scheduledDateSchema(),
      purpose: purposeSchema(),
      expReportTypeId: expReportTypeIdSchema(values),
      ...getExtendedItemsValidators(),
      ...getCashAdvanceValidators(values),
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
      scheduledDate: scheduledDateSchema(),
      purpose: purposeSchema(),
      expReportTypeId: expReportTypeIdSchema(values),
      cashAdvanceRequestAmount: cashAdvanceRequestAmountSchema(values),
      cashAdvanceRequestDate: cashAdvanceRequestDateSchema(values),
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
                ...getExtendedItemsValidators(true),
              })
            ),
            otherwise: Yup.array().of(
              Yup.object().shape({
                amount: amountSchema(),
                expTypeId: expTypeIdSchema(values),
                ...getExtendedItemsValidators(true),
                expTypeItemizationSetting:
                  itemizationSettingRequiredSchema(values),
              })
            ),
          }),
          routeInfo: routeInfoSchema(),
          recordDate: recordDateSchema(values),
        })
      ),
    }),
  });
};

const submitFASchema = (values) => {
  return Yup.object().shape({
    report: Yup.object().shape({
      subject: subjectSchema(),
      scheduledDate: scheduledDateSchema(),
      purpose: purposeSchema(),
      expReportTypeId: expReportTypeIdSchema(values),
      cashAdvanceRequestAmount: cashAdvanceRequestAmountSchema(values),
      cashAdvanceRequestDate: cashAdvanceRequestDateSchema(values),
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
              })
            ),
            otherwise: Yup.array().of(
              Yup.object().shape({
                amount: amountSchema(),
                expTypeId: expTypeIdSchema(values),
                ...getExtendedItemsValidators(true),
              })
            ),
          }),
          routeInfo: routeInfoSchema(),
          recordDate: recordDateSchema(values),
        })
      ),
    }),
  });
};

//
// recodeSave
//
const recordSaveSchema = (values) => {
  const { recordIdx } = values.ui;
  const selectedRecordId = get(values, `report.records[${recordIdx}].recordId`);
  return Yup.object().shape({
    report: Yup.object().shape({
      records: Yup.array().of(
        Yup.object().when('.', {
          is: ({ recordId }) => recordId === selectedRecordId,
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
                    amountPayable: Yup.number()
                      .nullable()
                      .when('useForeignCurrency', {
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
          }),
        })
      ),
    }),
  });
};

const recordSaveFASchema = (values) => {
  const { recordIdx } = values.ui;
  const selectedRecordId = get(values, `report.records[${recordIdx}].recordId`);
  return Yup.object().shape({
    report: Yup.object().shape({
      records: Yup.array().of(
        Yup.object().when('.', {
          is: ({ recordId }) => recordId === selectedRecordId,
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
                    expTypeId: recordItemExpTypeIdSchema(),
                    taxTypeHistoryId: taxTypeHistoryIdSchema(),
                    ...getExtendedItemsValidators(true),
                  })
                ),
                otherwise: Yup.array().of(
                  Yup.object().shape({
                    amount: amountSchema(),
                    taxTypeHistoryId: taxTypeHistoryIdSchema(),
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
                    amountPayable: Yup.number()
                      .nullable()
                      .when('useForeignCurrency', {
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
          }),
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
      records: Yup.array().of(
        Yup.object().shape({
          amount: Yup.number().when(['recordType'], {
            is: (recordType: string) => recordType === RECORD_TYPE.Mileage,
            then: amountRequiredSchema().concat(amountMatchSchema(true)),
          }),
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
                  expTypeId: expTypeIdSchema(values),
                })
              ),
              otherwise: Yup.array().of(
                Yup.object().shape({
                  expTypeId: expTypeIdSchema(values),
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
// bulk record edit
//
const bulkRecordEditSchema = (values) => {
  return Yup.object().shape({
    report: Yup.object().shape({
      records: Yup.array().of(
        Yup.object().shape({
          amount: Yup.number().when('recordType', {
            is: (recordType: string, items = []) =>
              isItemizedRecord(items.length) ||
              recordType === RECORD_TYPE.Mileage,
            then: amountRequiredSchema().concat(amountMatchSchema(true)),
          }),
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
                  expTypeId: expTypeIdSchema(values),
                })
              ),
              otherwise: Yup.array().of(
                Yup.object().shape({
                  expTypeId: expTypeIdSchema(values),
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

const editSchema = (values) => {
  return Yup.object().shape({
    report: Yup.object().shape({
      records: Yup.array().of(
        Yup.object().shape({
          amount: amountMatchSchema(),
          paymentMethodId: paymentMethodSchema(values),
          items: Yup.array()
            .when('.', {
              is: (items = []) => isItemizedRecord(items.length),
              then: Yup.array().of(
                Yup.object().shape({
                  expTypeId: expTypeIdSchema(values),
                  recordDate: recordItemDateSchema(values),
                  taxTypeHistoryId: taxTypeHistoryIdSchema(),
                  ...getExtendedItemsValidators(true),
                })
              ),
              otherwise: Yup.array().of(
                Yup.object().shape({
                  expTypeId: expTypeIdSchema(values),
                  vendorId: vendorIdSchema(values, true),
                  paymentDueDate: paymentDueDateRecordSchema(values),
                  ...getExtendedItemsValidators(true),
                  expTypeItemizationSetting:
                    itemizationSettingRequiredSchema(values),
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
                  amountPayable: Yup.number()
                    .nullable()
                    .when('useForeignCurrency', {
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
      ...getExtendedItemsValidators(),
      records: Yup.array().of(
        Yup.object().shape({
          amount: amountMatchSchema(),
          paymentMethodId: paymentMethodSchema(values),
          items: Yup.array()
            .when('recordType', {
              is: RECORD_TYPE.General,
              then: bcAndFcAmountSchema(),
            })
            .when('.', {
              is: (items = []) => isItemizedRecord(items.length),
              then: Yup.array().of(
                Yup.object().shape({
                  expTypeId: recordItemExpTypeIdSchema(),
                  taxTypeHistoryId: taxTypeHistoryIdSchema(),
                })
              ),
              otherwise: Yup.array().of(
                Yup.object().shape({
                  vendorId: vendorIdSchema(values, true),
                  paymentDueDate: paymentDueDateRecordSchema(values),
                  expTypeItemizationSetting:
                    itemizationSettingRequiredSchema(values),
                })
              ),
            }),
        })
      ),
    }),
  });
};

export default Yup.lazy((values) => {
  const { report } = values;
  // For pending, approved or claimed report, no validation
  const isExpReqApprovedReport =
    !values.ui.isFAEditMode && report.status === status.APPROVED;
  const isNonEditableReport =
    report.status === status.PENDING ||
    report.status === status.APPROVED_PRE_REQUEST ||
    report.status === status.CLAIMED ||
    report.status === status.ACCOUNTING_AUTHORIZED ||
    report.status === status.ACCOUNTING_REJECTED ||
    report.status === status.JOURNAL_CREATED ||
    report.status === status.FULLY_PAID ||
    isExpReqApprovedReport;

  // no validation if it's new preRequest or non-editable report
  // cnanot return null as lazy requires a valid schema. Hence, we return empty schema
  if (isNonEditableReport) {
    return Yup.object().shape({});
  }

  if (values.ui.isRecordSave) {
    // record save
    return report.status === status.APPROVED
      ? recordSaveFASchema(values)
      : recordSaveSchema(values);
  } else if (values.ui.isRecordBulkSave) {
    return bulkRecordSaveSchema(values);
  } else if (values.ui.saveMode || values.ui.approveMode) {
    // save and approve
    return saveSchema(values);
  } else if (values.ui.submitMode) {
    // submit
    return report.status === status.APPROVED
      ? submitFASchema(values)
      : submitSchema(values);
  } else {
    return report.status === status.APPROVED ||
      (report.reportId && !report.status)
      ? inputFASchema(values)
      : values.ui.isBulkEditMode
      ? bulkRecordEditSchema(values)
      : editSchema(values);
  }
});
