// flow
import { get } from 'lodash';
import * as Yup from 'yup';

import {
  amountSchema,
  costCenterNameSchema,
  expReportTypeIdSchema,
  expTypeIdSchema,
  fixedAmountSelectionSchema,
  getExtendedItemsValidators,
  jobIdSchema,
  paymentDueDateSchema,
  purposeSchema,
  recordDateSchema,
  recordItemsCreateSchema,
  recordItemsEditSchema,
  routeInfoSchema,
  scheduledDateSchema,
  subjectSchema,
  taxTypeHistoryIdSchema,
  vendorIdSchema,
} from '../../commons/schema/Expense';

import { status } from '../../domain/models/exp/Report';
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
      paymentDueDate: paymentDueDateSchema(values, true),
      scheduledDate: scheduledDateSchema(),
      purpose: purposeSchema(),
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
      scheduledDate: scheduledDateSchema(),
      purpose: purposeSchema(),
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
              })
            ),
            otherwise: Yup.array().of(
              Yup.object().shape({
                amount: amountSchema(),
                expTypeId: expTypeIdSchema(values),
                ...getExtendedItemsValidators(values),
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
  return Yup.object().shape({
    report: Yup.object().shape({
      records: Yup.array().of(
        Yup.object().shape({
          recordType: Yup.string(),
          items: Yup.array()
            .when('recordType', {
              is: 'HotelFee',
              then: Yup.array().of(
                Yup.object().shape({
                  amount: amountSchema(),
                })
              ),
              otherwise: Yup.array().of(
                Yup.object().shape({
                  amount: amountSchema(),
                  taxTypeHistoryId: taxTypeHistoryIdSchema(),
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
          items: Yup.array().when('recordType', {
            is: 'HotelFee',
            then: Yup.array()
              .min(2, 'Exp_Err_RecordItemsMandatory')
              .of(
                Yup.object().shape({
                  expTypeId: expTypeIdSchema(values),
                })
              ),
            otherwise: Yup.array().of(
              Yup.object().shape({
                expTypeId: expTypeIdSchema(values),
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
  const isNonEditableReport =
    report.status === status.PENDING ||
    report.status === status.APPROVED_PRE_REQUEST ||
    report.status === status.CLAIMED;

  // no validation if it's new preRequest or non-editable report
  // cnanot return null as lazy requires a valid schema. Hence, we return empty schema
  if (isNonEditableReport) {
    return Yup.object().shape({});
  }

  // child record items create / edit
  if (get(values, 'ui.isRecordItemsEdit')) {
    return recordItemsEditSchema(values);
  } else if (get(values, 'ui.isRecordItemsCreate')) {
    return recordItemsCreateSchema(values);
  }

  if (values.ui.isRecordSave) {
    // record save
    return recordSaveSchema(values);
  } else if (values.ui.saveMode) {
    // save
    return saveSchema(values);
  } else if (values.ui.submitMode) {
    // submit
    return submitSchema(values);
  } else {
    return editSchema(values);
  }
});
