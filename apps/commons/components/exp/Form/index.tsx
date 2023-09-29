import React from 'react';

import { FormikProps } from 'formik';
import { cloneDeep, find, get, isEmpty, merge, set } from 'lodash';

import { AccountingPeriod } from '../../../../domain/models/exp/AccountingPeriod';
import { ExpenseReportType } from '../../../../domain/models/exp/expense-report-type/list';
import { RecordItem as Record } from '../../../../domain/models/exp/Record';
import {
  calcTotalAmount,
  CUSTOM_REQUEST_LINK_USAGE_TYPE,
  expFormArea,
  FILE_ATTACHMENT_TYPE,
  getDisplayOfVendorCCJob,
  initialStateReport,
  Report,
  status,
} from '../../../../domain/models/exp/Report';
import { needsResetForm } from '../../../../requests-pc/models/expenses/ExpensesRequestForm';

import { modes } from '../../../../requests-pc/modules/ui/expenses/mode';

import { CommonProps, OverlapProps } from '../index';

import './index.scss';

const ROOT = 'ts-expenses__form';

export type Values = {
  report: Report;
  ui: {
    checkboxes: Array<number>;
    isCostCenterRequired?: string;
    isJobRequired?: string;
    isRecordSave?: boolean;
    isVendorRequired?: string;
    recalc: boolean;
    recordIdx: number;
    recordItemIdx?: number;
    saveMode?: boolean;
    // eslint-disable-line react/no-unused-prop-types
    selectedAccountingPeriod?: AccountingPeriod;
    selectedRecord?: Record;
    submitMode?: boolean;
    tempSavedRecordItems?: Array<Record>;
  };
};

type Containers = {
  accountingDate: any;
  baseCurrency: any;
  dialog: any;
  foreignCurrency: any;
  recordItem: any;
  recordList: any;
  reportSummary: any;
  routeForm: any;
  suggest: any;
};

export type FormContainerProps = {
  accountingPeriodAll?: AccountingPeriod[];
  availableExpType?: Array<string>;
  currencyCode?: string;
  currencyDecimalPlaces?: string;
  currencySymbol?: string;
  isExpense?: boolean;
  isFinanceApproval?: boolean;
  isRequest?: boolean;
  onClickApprovalHistoryButton: () => void;
  onClickApproveButton: () => void;
  onClickBackButton: () => void;
  onClickCancelRequestButton: () => void;
  onClickDeleteButton: () => void;
  onClickDiscardButton: () => void;
  onClickEditHistoryButton: () => void;
  onClickRejectButton: () => void;
  onClickSubmitButton: (values?: Values) => void;
  reportEdit: () => void;
  setFinanceReportEdited?: () => void;
  showToastWithType?: (arg0: string, arg1: number, arg3: string) => void;
};

// For Formik Bag
type AdditionalProps = {
  catchApiError: Function;
  onClickSaveButton: Function;
  saveRecord: Function;
  taxTypeListForSaving: any;
  updateLinkedExpTypeIds: Function;
};

export type BaseFormikProps = AdditionalProps & {
  errors: any;
  touched: any;
  values: Values;
  handleSubmit: () => void;
  resetForm: (arg0: Values) => void;
  setFieldError: (arg0: string, arg1: any) => void;
  setFieldTouched: (
    arg0: string,
    arg1: { [key: string]: unknown } | boolean,
    arg2?: boolean
  ) => void;
  setFieldValue: (arg0: string, arg1: any) => void;
  setTouched: (arg0: { [key: string]: unknown }) => void;
  submitForm: () => void;
  validateForm: () => void;
};

export type Props = FormikProps<Values> &
  CommonProps &
  Containers &
  OverlapProps &
  BaseFormikProps &
  FormContainerProps & {
    apActive: Array<AccountingPeriod>;
    disabled: boolean;
    reportTypeList: Array<ExpenseReportType>;
    reportTypeListInactive: Array<ExpenseReportType>;
    selectedCompanyId: string;
  };

export default class ExpensesForm extends React.Component<Props> {
  static displayName = expFormArea;
  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const isResetFormNeeded = needsResetForm(
      this.props.mode,
      nextProps.mode,
      this.props.selectedExpReport,
      nextProps.selectedExpReport,
      this.props.isFinanceApproval
    );
    const isRecalcNeeded = nextProps.values.ui.recalc;
    // For expense and request, if temporary availableExpType is gone, set it based on saved data in redux
    if (this.props.isExpense || this.props.isRequest) {
      const uiAvialableExpType = get(nextProps, 'values.ui.availableExpType');
      const isAvailableExpTypeChanged =
        this.props.availableExpType !== nextProps.availableExpType;
      if (
        nextProps.availableExpType &&
        (!uiAvialableExpType || isAvailableExpTypeChanged)
      ) {
        this.onChangeEditingExpReport(
          'ui.availableExpType',
          nextProps.availableExpType
        );
      }
    }
    if (isResetFormNeeded) {
      const selectedAccountingPeriod =
        this.props.values.ui.selectedAccountingPeriod;
      const isVendorRequired = this.props.values.ui.isVendorRequired;
      const isCostCenterRequired = this.props.values.ui.isCostCenterRequired;
      const isJobRequired = this.props.values.ui.isJobRequired;

      const resetValues = {
        ui: {
          isVendorRequired,
          isCostCenterRequired,
          isJobRequired,
          selectedAccountingPeriod,
          checkboxes: [],
          recordIdx: -1,
          recalc: false,
          saveMode: false,
        },
        report: nextProps.selectedExpReport,
      };
      this.props.resetForm(resetValues);
      if (this.props.isExpense || this.props.isRequest) {
        this.onChangeEditingExpReport(
          'ui.availableExpType',
          this.props.availableExpType
        );
      }
      if (this.props.isFinanceApproval) {
        this.props.validateForm(resetValues);
      }
    }

    if (isRecalcNeeded) {
      this.recalc(nextProps.values.report);
    }
  }

  onChangeEditingExpReport = (
    key: string,
    value: any,
    touched?: any,
    shouldValidate?: boolean
  ) => {
    const isReportEditMode = this.props.mode === modes.REPORT_EDIT;
    const isFinanceReportEdited =
      this.props.mode === modes.FINANCE_REPORT_EDITED;
    const isTouchedBoolean = typeof touched === 'boolean';
    const isTouchedObject = typeof touched === 'object';
    if (
      !(isReportEditMode || isFinanceReportEdited) &&
      ((isTouchedBoolean && touched) || !isEmpty(touched))
    ) {
      this.props.reportEdit();
    }

    if (
      this.props.isFinanceApproval &&
      !isFinanceReportEdited &&
      isReportEditMode &&
      touched &&
      (isTouchedBoolean || isTouchedObject) &&
      this.props.setFinanceReportEdited
    ) {
      this.props.setFinanceReportEdited();
    }
    this.props.setFieldValue(key, value, shouldValidate);

    if (isTouchedBoolean) {
      this.props.setFieldTouched(key, touched, false);
    } else if (touched) {
      const tmpTouched = cloneDeep(this.props.touched);
      const tmpGetTouched = get(tmpTouched, key);
      const mergedTouched = merge(tmpGetTouched, touched);
      set(tmpTouched, key, mergedTouched);
      this.props.setTouched(tmpTouched, false);
    }
  };

  onClickSaveReportButton = () => {
    const { reportTypeList, values } = this.props;
    const currentReportType = find(reportTypeList, [
      'id',
      values.report.expReportTypeId,
    ]);
    const { isCostCenterRequired, isJobRequired, isVendorRequired } =
      getDisplayOfVendorCCJob(currentReportType);

    // reset invalid report type to trigger required validation for reports except those from request(report type cannot be changed)
    if (!currentReportType && !values.report.preRequestId) {
      this.props.setFieldValue(
        'report.expReportTypeId',
        initialStateReport.expReportTypeId
      );
    }

    this.props.setFieldValue('ui.isCostCenterRequired', isCostCenterRequired);
    this.props.setFieldValue('ui.isJobRequired', isJobRequired);
    this.props.setFieldValue('ui.isVendorRequired', isVendorRequired);

    this.props.setFieldValue('ui.saveMode', true);
    this.props.setFieldValue('ui.isRecordSave', false);
    this.props.setFieldValue('ui.submitMode', false);
    setTimeout(this.props.submitForm, 1);
  };

  onClickSaveRecordButton = () => {
    this.props.setFieldValue('ui.saveMode', true);
    this.props.setFieldValue('ui.isRecordSave', true);
    this.props.setFieldValue('ui.submitMode', false);
    setTimeout(this.props.submitForm, 1);
  };

  onClickSubmitButton = () => {
    const { reportTypeList, values } = this.props;
    const currentReportType =
      find(reportTypeList, ['id', values.report.expReportTypeId]) ||
      ({} as ExpenseReportType);

    this.props.setFieldValue(
      'ui',
      {
        ...this.props.values.ui,
        saveMode: false,
        isRecordSave: false,
        submitMode: true,
        isFileAttachmentRequired:
          currentReportType.fileAttachment === FILE_ATTACHMENT_TYPE.Required,
        isCustomRequestRequired:
          currentReportType.customRequestLinkUsage ===
          CUSTOM_REQUEST_LINK_USAGE_TYPE.Required,
      },
      false
    );
    // workaround as setFieldValue is asynchronous
    setTimeout(() => {
      this.props.validateForm().then((errors) => {
        if (isEmpty(errors)) {
          this.props.onClickSubmitButton(this.props.values);
        } else {
          this.props.setTouched({ ...this.props.touched, ...errors });
        }
      });
    }, 1);
  };

  // 再計算が必要な処理の集まり
  // method to recalculate amount
  recalc = (report: Report) => {
    if (!report.isEstimated) {
      this.props.setFieldValue(
        'report.totalAmount',
        calcTotalAmount(report),
        false
      );
    }
    this.props.setFieldValue('ui.recalc', false, false);
  };

  checkReportStatus(reportStatus: string) {
    return this.props.selectedExpReport.status === status[reportStatus];
  }

  handleFormSubmit = () => {
    return false;
  };

  render() {
    const { isFinanceApproval, values } = this.props;
    const hasReportId = values.report.reportId;
    const hasPreRequestId = values.report.preRequestId;

    const isReportEditMode = this.props.mode === modes.REPORT_EDIT;
    const isFinanceReportEdited =
      this.props.mode === modes.FINANCE_REPORT_EDITED;
    const isReportPending = this.checkReportStatus('PENDING');
    const isReportApproved =
      this.checkReportStatus('APPROVED') ||
      this.checkReportStatus('CLAIMED') ||
      this.checkReportStatus('DISCARDED');
    const isReportPendingOrApproved = isReportPending || isReportApproved;
    const readOnly =
      isFinanceApproval && (isReportEditMode || isFinanceReportEdited)
        ? false
        : this.props.disabled || isReportPending || isReportApproved;
    const isNewReportFromPreRequest = hasPreRequestId && !hasReportId;
    const isNewReportOrRequest = !hasReportId;
    const reportSummaryReadOnly = readOnly || isNewReportFromPreRequest;
    let recordReadOnly =
      (readOnly || (isReportEditMode && !isFinanceApproval)) &&
      !isReportPendingOrApproved;

    if (isNewReportOrRequest) {
      recordReadOnly = true;
    }

    const recordItemReadOnly = isNewReportFromPreRequest ? true : readOnly;

    if (isFinanceApproval) {
      recordReadOnly = isReportEditMode || isFinanceReportEdited;
    }
    const ReportSummary = this.props.reportSummary;
    const RecordList = this.props.recordList;
    const RecordItem = this.props.recordItem;
    const Dialog = this.props.dialog;

    // if no tempSavedRecordItems, use items[0] which is parent record
    const firstRecordItem = get(
      values,
      `report.records.${values.ui.recordIdx}.items`,
      []
    ).slice(0, 1);

    const tempSavedRecordItems =
      values.ui.tempSavedRecordItems || firstRecordItem;

    const currencyFields = {
      currencyCode: this.props.currencyCode,
      currencySymbol: this.props.currencySymbol,
      currencyDecimalPlaces: this.props.currencyDecimalPlaces,
    };

    return (
      <form
        className={`${ROOT}`}
        onSubmit={() => {
          return false;
        }}
      >
        <ReportSummary
          readOnly={reportSummaryReadOnly}
          isExpense={this.props.isExpense}
          isFinanceApproval={isFinanceApproval}
          expReport={this.props.values.report}
          errors={this.props.errors.report || {}}
          touched={this.props.touched.report || {}}
          checkboxes={this.props.values.ui.checkboxes}
          recordIdx={this.props.values.ui.recordIdx}
          isRecordOpen={this.props.overlap.record}
          onChangeEditingExpReport={this.onChangeEditingExpReport}
          onClickSaveButton={this.onClickSaveReportButton}
          onClickBackButton={this.props.onClickBackButton}
          onClickDeleteButton={this.props.onClickDeleteButton}
          onClickDiscardButton={this.props.onClickDiscardButton}
          onClickSubmitButton={this.onClickSubmitButton}
          onClickCancelRequestButton={this.props.onClickCancelRequestButton}
          onClickApprovalHistoryButton={this.props.onClickApprovalHistoryButton}
          onClickEditHistoryButton={this.props.onClickEditHistoryButton}
          onClickRejectButton={this.props.onClickRejectButton}
          onClickApproveButton={this.props.onClickApproveButton}
          labelObject={this.props.labelObject}
          setFieldValue={this.props.setFieldValue}
          validateForm={this.props.validateForm}
          apActive={this.props.apActive}
          isReadOnlyApexPage={this.props.isReadOnlyApexPage}
          {...currencyFields}
        />
        <RecordList
          readOnly={recordReadOnly}
          isNewReportFromPreRequest={isNewReportFromPreRequest}
          isReportPendingOrApproved={isReportPendingOrApproved}
          ui={this.props.values.ui}
          expReport={this.props.values.report}
          errors={this.props.errors.report || {}}
          touched={this.props.touched.report || {}}
          checkboxes={this.props.values.ui.checkboxes}
          recordIdx={this.props.values.ui.recordIdx}
          onChangeEditingExpReport={this.onChangeEditingExpReport}
          isFinanceApproval={this.props.isFinanceApproval}
          selectedExpReport={this.props.selectedExpReport}
          reportTypeList={this.props.reportTypeList}
          {...currencyFields}
        />
        {this.props.overlap.record && (
          <RecordItem
            readOnly={recordItemReadOnly}
            isExpense={this.props.isExpense}
            isFinanceApproval={isFinanceApproval}
            setFieldTouched={this.props.setFieldTouched}
            setFieldError={this.props.setFieldError}
            recalc={this.recalc}
            expReport={this.props.values.report}
            selectedRecord={this.props.values.ui.selectedRecord}
            selectedCompanyId={this.props.selectedCompanyId}
            tempSavedRecordItems={tempSavedRecordItems}
            recordIdx={this.props.values.ui.recordIdx}
            errors={this.props.errors.report || {}}
            touched={this.props.touched.report || {}}
            baseCurrency={this.props.baseCurrency}
            foreignCurrency={this.props.foreignCurrency}
            routeForm={this.props.routeForm}
            suggest={this.props.suggest}
            ui={this.props.values.ui}
            onChangeEditingExpReport={this.onChangeEditingExpReport}
            onClickSaveButton={this.onClickSaveRecordButton}
            onClickBackButton={this.props.onClickBackButton}
            {...currencyFields}
          />
        )}
        <Dialog
          setFieldError={this.props.setFieldError}
          setFieldTouched={this.props.setFieldTouched}
          expReport={this.props.values.report}
          onChangeEditingExpReport={this.onChangeEditingExpReport}
          recordIdx={this.props.values.ui.recordIdx}
          recordItemIdx={this.props.values.ui.recordItemIdx}
          touched={this.props.touched.report || {}}
          setTouched={this.props.setTouched}
          errors={this.props.errors.report || {}}
          setFieldValue={this.props.setFieldValue}
          isExpense={this.props.isExpense}
          baseCurrency={this.props.baseCurrency}
          foreignCurrency={this.props.foreignCurrency}
          tempSavedRecordItems={tempSavedRecordItems}
          isFinanceApproval={isFinanceApproval}
          validateForm={this.props.validateForm}
          recordItemReadOnly={recordItemReadOnly}
          {...currencyFields}
        />
      </form>
    );
  }
}
