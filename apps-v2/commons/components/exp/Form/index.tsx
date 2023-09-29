import React from 'react';

import classNames from 'classnames';
import { FormikErrors, FormikProps } from 'formik';
import { cloneDeep, find, get, isEmpty, isEqual, merge, set } from 'lodash';

import { MileageFormContainerProps } from '@apps/commons/containers/exp/MileageFormContainer';
import { NavigationBar, Text } from '@apps/core';
import Spinner from '@commons/components/Spinner';
import msg from '@commons/languages';

import { AccountingPeriod } from '../../../../domain/models/exp/AccountingPeriod';
import { ExpenseReportType } from '../../../../domain/models/exp/expense-report-type/list';
import { RecordItem as Record } from '../../../../domain/models/exp/Record';
import {
  calcTotalAmount,
  CUSTOM_REQUEST_LINK_USAGE_TYPE,
  expFormArea,
  FILE_ATTACHMENT_TYPE,
  getDisplayOfRecordVendor,
  getDisplayOfVendorCCJob,
  initialStateReport,
  Report,
  status,
} from '../../../../domain/models/exp/Report';
import { needsResetForm } from '../../../../requests-pc/models/expenses/ExpensesRequestForm';
import { MileageUnit } from '@apps/domain/models/exp/Mileage';
import { PaymentMethod } from '@apps/domain/models/exp/PaymentMethod';

import { modes } from '../../../../requests-pc/modules/ui/expenses/mode';
import { DefaultCostCenterInfo } from '@apps/domain/modules/exp/cost-center/defaultCostCenter';

import { CommonProps, OverlapProps } from '../index';
import iconHeaderFinanceApproval from '@apps/approvals-pc/images/Approval.svg';

import './index.scss';

const ROOT = 'ts-expenses__form';

export type Values = {
  report: Report;
  ui: {
    availablePaymentMethodIds?: string[];
    bulkRecordIdx?: number;
    checkboxes: Array<number>;
    existActiveAp?: boolean;
    isCostCenterRequired?: string;
    isFAEditMode?: boolean;
    isJobRequired?: string;
    isRecordBulkSave?: boolean;
    isRecordSave?: boolean;
    isUseCashAdvance?: boolean;
    isVendorRequired?: string;
    recalc: boolean;
    recordIdx: number;
    recordItemIdx?: number;
    saveMode?: boolean;
    // eslint-disable-line react/no-unused-prop-types
    selectedAccountingPeriod?: AccountingPeriod;
    selectedPreRecord?: Record;
    selectedRecord?: Record;
    submitMode?: boolean;
  };
};

export type Errors = FormikErrors<Values['report']>;

type Containers = {
  accountingDate: any;
  baseCurrency: any;
  dialog: any;
  foreignCurrency: any;
  mileageForm: React.FC<MileageFormContainerProps>;
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
  defaultCostCenter?: DefaultCostCenterInfo[];
  expMileageUnit?: MileageUnit;
  isApexView?: boolean;
  isBulkEditMode: boolean;
  isExpense?: boolean;
  isFAExpenseTab?: boolean;
  isFinanceApproval?: boolean;
  isHighlightSetting?: boolean;
  isRequest?: boolean;
  isUseCashAdvance?: boolean;
  showLoading?: boolean;
  tabCompanyId?: string;
  bulkRecordEdit?: () => void;
  fetchExpReport?: (
    status: string,
    reportId: string,
    reportTypeList: ExpenseReportType[],
    empId: string,
    defaultCostCenter: DefaultCostCenterInfo[],
    companyId: string,
    apActive: AccountingPeriod[]
  ) => void;
  fetchExpReqReport?: (
    reportId: string,
    reportTypeList: ExpenseReportType[],
    employeeId: string,
    defaultCostCenterList: DefaultCostCenterInfo[],
    companyId: string,
    isCloned: boolean
  ) => void;
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
  reportSelect?: () => void;
  searchPaymentMethodList?: (reportTypeId: string) => void;
  setFinanceReportEdited?: () => void;
  showToastWithType?: (arg0: string, arg1: number, arg3: string) => void;
};

// For Formik Bag
type AdditionalProps = {
  catchApiError: Function;
  onClickSaveButton: Function;
  saveMultiRecord: Function;
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
    paymentMethodList: PaymentMethod[];
    reportTypeList: Array<ExpenseReportType>;
    reportTypeListInactive: Array<ExpenseReportType>;
    selectedCompanyId: string;
    selectedExpPreRequest?: Report;
    subRoleId?: string;
    confirm: (message: string) => Promise<boolean>;
  };

export default class ExpensesForm extends React.Component<Props> {
  static displayName = expFormArea;
  async UNSAFE_componentWillReceiveProps(nextProps: Props) {
    let isResetFormNeeded = needsResetForm(
      this.props.mode,
      nextProps.mode,
      this.props.selectedExpReport,
      nextProps.selectedExpReport,
      this.props.isFinanceApproval
    );
    isResetFormNeeded =
      isResetFormNeeded && nextProps.subRoleId === this.props.subRoleId;
    const isRecalcNeeded = nextProps.values.ui.recalc;
    const isExpenseOrRequest = this.props.isExpense || this.props.isRequest;
    // For expense and request, if temporary availableExpType is gone, set it based on saved data in redux
    if (isExpenseOrRequest) {
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
    const availablePaymentMethodIds = get(
      nextProps,
      'values.ui.availablePaymentMethodIds'
    );
    if (
      !availablePaymentMethodIds ||
      !isEqual(nextProps.paymentMethodList, this.props.paymentMethodList)
    ) {
      const validIds = nextProps.paymentMethodList.map(({ id }) => id);
      this.onChangeEditingExpReport('ui.availablePaymentMethodIds', validIds);
    }
    if (isResetFormNeeded) {
      const selectedAccountingPeriod =
        this.props.values.ui.selectedAccountingPeriod;
      const isVendorRequired = this.props.values.ui.isVendorRequired;
      const isCostCenterRequired = this.props.values.ui.isCostCenterRequired;
      const isJobRequired = this.props.values.ui.isJobRequired;
      const availablePaymentMethodIds =
        this.props.values.ui.availablePaymentMethodIds;
      const availableExpType = isExpenseOrRequest
        ? this.props.availableExpType
        : undefined;
      const resetValues = {
        ui: {
          isVendorRequired,
          isCostCenterRequired,
          isJobRequired,
          selectedAccountingPeriod,
          checkboxes: [],
          bulkRecordIdx: -1,
          recordIdx: -1,
          recalc: false,
          saveMode: false,
          availablePaymentMethodIds,
          availableExpType,
        },
        report: nextProps.selectedExpReport,
      };
      this.props.resetForm(resetValues);
      // workaround due async setFieldValue on record cancel click for FA
      setTimeout(() => this.props.validateForm(resetValues));
    }

    // validate in FA edit mode
    if (
      this.props.isFinanceApproval &&
      this.props.mode === modes.REPORT_SELECT &&
      [modes.REPORT_EDIT, modes.FINANCE_REPORT_EDITED].includes(nextProps.mode)
    ) {
      const isFAEditMode =
        nextProps.mode === modes.REPORT_EDIT ||
        nextProps.mode === modes.FINANCE_REPORT_EDITED;
      this.onChangeEditingExpReport('ui.isFAEditMode', isFAEditMode);
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
    const isBulkRecordEdited = this.props.mode === modes.BULK_RECORD_EDIT;
    const isTouchedBoolean = typeof touched === 'boolean';
    const isTouchedObject = typeof touched === 'object';
    if (
      !(isReportEditMode || isFinanceReportEdited) &&
      ((isTouchedBoolean && touched) || !isEmpty(touched)) &&
      !this.props.isBulkEditMode
    ) {
      this.props.reportEdit();
    }

    // set mode for bulk edit
    if (
      this.props.isBulkEditMode &&
      !isBulkRecordEdited &&
      !this.props.isFinanceApproval &&
      isTouchedBoolean &&
      touched
    ) {
      this.props.bulkRecordEdit();
    }

    if (
      this.props.isFinanceApproval &&
      !isFinanceReportEdited &&
      isReportEditMode &&
      touched &&
      (isTouchedObject || isTouchedBoolean) &&
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

  onClickSaveReportButton = async () => {
    const { reportTypeList, values } = this.props;
    const currentReportType = find(reportTypeList, [
      'id',
      values.report.expReportTypeId,
    ]);
    const isNewReport = !values.report.reportId;
    const isConfirm = await this.isConfirmSwitchReportType(
      currentReportType,
      isNewReport
    );
    if (!isConfirm) return;

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
    this.props.setFieldValue(
      'ui.isUseCashAdvance',
      get(currentReportType, 'useCashAdvance', false)
    );

    this.props.setFieldValue('ui.saveMode', true);
    this.props.setFieldValue('ui.isRecordSave', false);
    this.props.setFieldValue('ui.submitMode', false);
    setTimeout(this.props.submitForm, 1);
  };

  onClickSaveRecordButton = (isCCPaymentMethod: boolean) => {
    const { reportTypeList, values } = this.props;
    const currentReportType = find(reportTypeList, [
      'id',
      values.report.expReportTypeId,
    ]);
    const { isRecordVendorRequired } =
      getDisplayOfRecordVendor(currentReportType);
    this.props.setFieldValue(
      'ui.isRecordVendorRequired',
      isRecordVendorRequired
    );

    this.props.setFieldValue('ui.saveMode', true);
    this.props.setFieldValue('ui.isRecordSave', true);
    this.props.setFieldValue('ui.submitMode', false);
    this.props.setFieldValue('ui.isCCPaymentMethod', isCCPaymentMethod);
    this.props.setFieldValue('ui.recordItemIdx', -1);
    setTimeout(this.props.submitForm, 1);
  };

  onClickBulkSaveRecordButton = () => {
    this.props.setFieldValue('ui.saveMode', true);
    this.props.setFieldValue('ui.isRecordBulkSave', true);
    this.props.setFieldValue('ui.submitMode', false);
    setTimeout(this.props.submitForm, 1);
  };

  onClickSubmitButton = () => {
    const currentReportType = this.getSelectedReportType();
    this.props.setFieldValue(
      'ui',
      {
        ...this.props.values.ui,
        saveMode: false,
        isRecordSave: false,
        isRecordBulkSave: false,
        submitMode: true,
        isFileAttachmentRequired:
          currentReportType.fileAttachment === FILE_ATTACHMENT_TYPE.Required,
        isCustomRequestRequired:
          currentReportType.customRequestLinkUsage ===
          CUSTOM_REQUEST_LINK_USAGE_TYPE.Required,
        isUseCashAdvance: get(currentReportType, 'useCashAdvance', false),
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

  onClickApproveButton = () => {
    const currentReportType = this.getSelectedReportType();
    this.props.setFieldValue('ui.approveMode', true);
    this.props.setFieldValue(
      'ui.isUseCashAdvance',
      currentReportType.useCashAdvance
    );
    this.props.onClickApproveButton();
  };

  isConfirmSwitchReportType = async (
    currentReportType: ExpenseReportType,
    isNewReport: boolean
  ) => {
    // show dialog for payment method
    const { confirm, isExpense, reportTypeList, selectedExpReport } =
      this.props;
    const originalReportType = find(reportTypeList, [
      'id',
      selectedExpReport.expReportTypeId,
    ]);
    const hasPaymentMethodInOriginal =
      this.hasPaymentMethod(originalReportType);
    const originalReportTypeId = get(originalReportType, 'id');
    const currentReportTypeId = get(currentReportType, 'id');
    if (
      !isNewReport &&
      originalReportTypeId !== currentReportTypeId &&
      hasPaymentMethodInOriginal
    ) {
      const isShowRemovePaymentMethodMsg =
        hasPaymentMethodInOriginal && !this.hasPaymentMethod(currentReportType);
      // remove link message will not be displayed for request
      const isConfirm =
        !isShowRemovePaymentMethodMsg && !isExpense
          ? true
          : await confirm(
              msg()[
                isShowRemovePaymentMethodMsg
                  ? 'Exp_Msg_ConfirmRemovePaymentMethod'
                  : 'Exp_Msg_ConfirmRemoveExternalLink'
              ]
            );
      return isConfirm;
    }
    return true;
  };

  hasPaymentMethod = (reportType: ExpenseReportType) =>
    get(reportType, 'paymentMethodIds', []).length > 0;

  getSelectedReportType = () => {
    const { reportTypeList, values } = this.props;
    return (
      find(reportTypeList, ['id', values.report.expReportTypeId]) ||
      ({} as ExpenseReportType)
    );
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
    const rootClass = classNames(ROOT, {
      [`${ROOT}-FA`]: this.props.isFinanceApproval,
      [`${ROOT}-FA-apex-page`]:
        this.props.isFinanceApproval && this.props.isApexView,
    });
    const { isFinanceApproval, isHighlightSetting, values } = this.props;
    const hasReportId = values.report.reportId;
    const hasPreRequestId = values.report.preRequestId;
    const isHighlightDiff = isHighlightSetting || false;

    const isReportEditMode = this.props.mode === modes.REPORT_EDIT;
    const isFinanceReportEdited =
      this.props.mode === modes.FINANCE_REPORT_EDITED;
    const isBulkRecordEdited = this.props.mode === modes.BULK_RECORD_EDIT;
    const isReportPending = this.checkReportStatus('PENDING');
    const isReportApproved =
      this.checkReportStatus('APPROVED') ||
      this.checkReportStatus('CLAIMED') ||
      this.checkReportStatus('DISCARDED');
    const isReportPendingOrApproved = isReportPending || isReportApproved;
    const isFinanceApprovalApexView =
      this.props.isApexView && !isReportEditMode && isFinanceApproval;
    const readOnly =
      isFinanceApproval &&
      (isReportEditMode || isFinanceReportEdited || isBulkRecordEdited)
        ? false
        : this.props.disabled ||
          isReportPending ||
          isReportApproved ||
          isFinanceApprovalApexView;
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

    const currencyFields = {
      currencyCode: this.props.currencyCode,
      currencySymbol: this.props.currencySymbol,
      currencyDecimalPlaces: this.props.currencyDecimalPlaces,
    };
    const expMileageUnit = this.props.expMileageUnit;

    return (
      <>
        {isFinanceApprovalApexView && (
          <NavigationBar
            icon={iconHeaderFinanceApproval}
            iconAssistiveText={msg().Com_Lbl_FinanceApproval}
          >
            <div className={`${ROOT}-FA-apex-page__header`}>
              <Text color="secondary" size="xxl">
                {msg().Com_Lbl_FinanceApproval}
              </Text>
            </div>
          </NavigationBar>
        )}
        <form
          className={`${rootClass}`}
          onSubmit={() => {
            return false;
          }}
        >
          <ReportSummary
            readOnly={reportSummaryReadOnly}
            isExpense={this.props.isExpense}
            isFAExpenseTab={this.props.isFAExpenseTab}
            isFinanceApproval={isFinanceApproval}
            expReport={this.props.values.report}
            expPreRequest={this.props.selectedExpPreRequest}
            isHighlightDiff={isHighlightDiff}
            errors={this.props.errors.report || {}}
            touched={this.props.touched.report || {}}
            checkboxes={this.props.values.ui.checkboxes}
            recordIdx={this.props.values.ui.recordIdx}
            isRecordOpen={this.props.overlap.record}
            isUseCashAdvance={this.props.isUseCashAdvance}
            onChangeEditingExpReport={this.onChangeEditingExpReport}
            onClickSaveButton={this.onClickSaveReportButton}
            onClickBackButton={this.props.onClickBackButton}
            onClickDeleteButton={this.props.onClickDeleteButton}
            onClickDiscardButton={this.props.onClickDiscardButton}
            onClickSubmitButton={this.onClickSubmitButton}
            onClickCancelRequestButton={this.props.onClickCancelRequestButton}
            onClickApprovalHistoryButton={
              this.props.onClickApprovalHistoryButton
            }
            onClickEditHistoryButton={this.props.onClickEditHistoryButton}
            onClickRejectButton={this.props.onClickRejectButton}
            onClickApproveButton={this.onClickApproveButton}
            labelObject={this.props.labelObject}
            setFieldValue={this.props.setFieldValue}
            validateForm={this.props.validateForm}
            apActive={this.props.apActive}
            isReadOnlyApexPage={this.props.isReadOnlyApexPage}
            selectedCompanyId={this.props.selectedCompanyId}
            selectedExpReport={this.props.selectedExpReport}
            {...currencyFields}
          />
          <RecordList
            readOnly={recordReadOnly}
            isExpense={this.props.isExpense}
            isNewReportFromPreRequest={isNewReportFromPreRequest}
            isReportPendingOrApproved={isReportPendingOrApproved}
            isUseCashAdvance={this.props.isUseCashAdvance}
            ui={this.props.values.ui}
            expReport={this.props.values.report}
            expPreRequest={this.props.selectedExpPreRequest}
            isHighlightDiff={isHighlightDiff}
            errors={this.props.errors.report || {}}
            touched={this.props.touched.report || {}}
            checkboxes={this.props.values.ui.checkboxes}
            recordIdx={this.props.values.ui.recordIdx}
            onClickBulkSaveRecordButton={this.onClickBulkSaveRecordButton}
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
              expPreRequest={this.props.selectedExpPreRequest}
              availablePaymentMethodIds={
                this.props.values.ui.availablePaymentMethodIds
              }
              selectedRecord={this.props.values.ui.selectedRecord}
              selectedPreRecord={this.props.values.ui.selectedPreRecord}
              isHighlightDiff={isHighlightDiff}
              selectedCompanyId={this.props.selectedCompanyId}
              recordIdx={this.props.values.ui.recordIdx}
              errors={this.props.errors.report || {}}
              touched={this.props.touched.report || {}}
              baseCurrency={this.props.baseCurrency}
              foreignCurrency={this.props.foreignCurrency}
              routeForm={this.props.routeForm}
              mileageForm={this.props.mileageForm}
              suggest={this.props.suggest}
              onChangeEditingExpReport={this.onChangeEditingExpReport}
              onClickSaveButton={this.onClickSaveRecordButton}
              onClickBackButton={this.props.onClickBackButton}
              {...currencyFields}
              expMileageUnit={expMileageUnit}
            />
          )}
          <Dialog
            setFieldError={this.props.setFieldError}
            setFieldTouched={this.props.setFieldTouched}
            expReport={this.props.values.report}
            expPreRequest={this.props.selectedExpPreRequest}
            onChangeEditingExpReport={this.onChangeEditingExpReport}
            recordIdx={this.props.values.ui.recordIdx}
            bulkRecordIdx={this.props.values.ui.bulkRecordIdx}
            recordItemIdx={this.props.values.ui.recordItemIdx}
            touched={this.props.touched.report || {}}
            setTouched={this.props.setTouched}
            errors={this.props.errors.report || {}}
            setFieldValue={this.props.setFieldValue}
            isExpense={this.props.isExpense}
            isUseCashAdvance={this.props.isUseCashAdvance}
            baseCurrency={this.props.baseCurrency}
            foreignCurrency={this.props.foreignCurrency}
            isFinanceApproval={isFinanceApproval}
            validateForm={this.props.validateForm}
            recordItemReadOnly={recordItemReadOnly}
            isHighlightDiff={isHighlightDiff}
            {...currencyFields}
          />
          {this.props.isApexView && (
            <Spinner loading={this.props.showLoading} />
          )}
        </form>
      </>
    );
  }
}
