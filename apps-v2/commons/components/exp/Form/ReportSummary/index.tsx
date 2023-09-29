import * as React from 'react';

import classNames from 'classnames';
import _ from 'lodash';

import {
  convertDifferenceValues,
  DifferenceValues,
  isDifferent,
} from '@apps/commons/utils/exp/RequestReportDiffUtils';

import { AccountingPeriod } from '../../../../../domain/models/exp/AccountingPeriod';
import { CustomHint } from '../../../../../domain/models/exp/CustomHint';
import { ExpenseReportType } from '../../../../../domain/models/exp/expense-report-type/list';
import { EISearchObj } from '../../../../../domain/models/exp/ExtendedItem';
import { Record as TypeRecord } from '../../../../../domain/models/exp/Record';
import {
  calculateSubtotalAmount,
  headerStatusLabels,
  Report,
  ReportStatuses,
  status,
} from '../../../../../domain/models/exp/Report';
import {
  Vendor,
  VendorItemList,
  VendorList,
} from '../../../../../domain/models/exp/Vendor';

import { modes } from '../../../../../requests-pc/modules/ui/expenses/mode';

import FormatUtil from '../../../../utils/FormatUtil';
import TextUtil from '../../../../utils/TextUtil';

import ImgEditOff from '../../../../images/btnEditOff.svg';
import ImgEditOn from '../../../../images/btnEditOn.svg';
import msg from '../../../../languages';
import IconButton from '../../../buttons/IconButton';
import AmountField from '../../../fields/AmountField';
import TextAreaField from '../../../fields/TextAreaField';
import OpenButton from '../../../OpenButton';
import Toast from '../../../Toast';
import Tooltip from '../../../Tooltip';
import WithLoadingContext from '../../../withLoading/withLoadingContext';
import Highlight from '../../Highlight';
import { CommonProps, OverlapProps } from '../../index';
import { FormContainerProps } from '..';
import PreRequestSummaryForm from '../PreRequestSummary';
import { Option } from '../QuickSearch';
import ReportStatus from '../ReportStatus';
import ActionButtons from './ActionButtons';
import { CustomRequestProps } from './ActionButtons/CustomRequest';
import { ReportAttachmentProps } from './ActionButtons/ReportAttachment';
import ReportSummaryForm from './Form';

import './index.scss';

const ROOT = 'ts-expenses__form-report-summary';

export type Errors = {
  cashAdvanceRequestAmount?: number;
  cashAdvanceRequestDate?: string;
  costCenterName?: string;
  expReportTypeId: string;
  jobId?: string;
  paymentDueDate?: string;
  purpose?: string;
  records?: Array<TypeRecord>;
  subject: string;
  vendorId?: string;
};

export type Touched = {
  accountingDate: string;
  cashAdvanceRequestAmount?: number;
  cashAdvanceRequestDate?: string;
  expReportTypeId: string;
  purpose?: string;
  records?: Array<TypeRecord>;
  subject: string;
  totalAmount: number;
};

export type FormikProps = {
  errors: Errors;
  touched: Touched;
};

export type ReportSummaryFormProps = {
  alwaysDisplaySettlementAmount?: boolean;
  apActive: AccountingPeriod;
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  isBulkEditMode?: boolean;
  isExpense: boolean;
  isExpenseRequest?: boolean;
  isFAExpenseTab?: boolean;
  isFinanceApproval: boolean;
  isHighlightDiff?: boolean;
  isLoading?: boolean;
  isRecordOpen?: boolean;
  loadingAreas?: string[];
  showVendorFilter?: boolean;
  createNewExpReport: () => void;
  getRecentCostCenters: () => Promise<Option[]>;
  getRecentJobs: () => Promise<Option[]>;
  getRecentVendors: () => Promise<Option[]>;
  handleChangeCostCenter: () => void;
  handleChangeExpenseReportType: (
    value: Record<string, any>,
    isEditTouched?: boolean
  ) => Promise<void>;
  handleChangeJob: () => void;
  handleChangePurpose: (e: any) => void;
  handleChangeRemarks: (e: any) => void;
  handleChangeSubject: (e: any) => void;
  handleClickCostCenterBtn: () => void;
  handleClickJobBtn: () => void;
  isNotDefaultCostCenter: (costCenterCode: string, date: string) => void;
  onClickLookupEISearch: (item: EISearchObj) => void;
  onClickVendorSearch: () => void;
  renderScheduledDate: (disabled: boolean, errors: any, touched: any) => void;
  searchCostCenters: (keyword?: string) => Promise<Option[]>;
  searchJobs: (keyword?: string) => Promise<Option[]>;
  searchVendorDetail: (vendorId: string) => Promise<VendorItemList>;
  searchVendors: (keyword?: string) => Promise<Option[]>;
  toggleVendorDetail: (toOpen: boolean) => void;
  updateReport: (updateReportObject: Report) => void;
};

type ReportSummaryContainerProps = ReportSummaryFormProps & {
  companyId?: string;
  customHint: CustomHint;
  inactiveReportTypeList: Array<ExpenseReportType>;
  isPartialLoading: boolean;
  openTitle: boolean;
  removedVendors: VendorList;
  reportCloneLink?: {
    isExpenseReport: boolean;
    reportId?: string;
  };
  reportTypeList: Array<ExpenseReportType>;
  subroleId?: string;
  useJctRegistrationNumber?: boolean;
  clearRemovedVendor: (id: string) => void;
  closeReportCloneToaster: () => void;
  handleChangeEstAmt: (arg0: number) => void;
  onClickCloneButton: (arg0: boolean) => void;
  onClickDiscardButton: () => void;
  onClickEditButton: () => void;
  onClickEstAmtEditButton: () => void;
  onClickPrintPageButton: () => void;
  onClickSaveButton: () => void;
  onClickSubmitButton: () => void;
  onClickTitleToggleButton: () => void;
  openClonedReportTab: () => void;
  openRequestReportPage: (id?: string) => void;
  openTitleAction: () => any;
  undoVendorDeletion: (vendor: Vendor, subroleId?: string) => void;
};

type Props = CommonProps &
  FormikProps &
  OverlapProps &
  FormContainerProps &
  ReportSummaryContainerProps &
  CustomRequestProps &
  ReportAttachmentProps & {
    expPreRequest?: Report;
    expReport: Report;
    readOnly: boolean;
    changeSubrole: (report: Report) => void;
    onChangeEditingExpReport: (arg0: string, arg1: any, arg2: boolean) => void;
  };

type State = {
  needOpen: boolean;
};

export default class ExpensesFormReportSummary extends React.Component<
  Props,
  State
> {
  titleInput?: HTMLTextAreaElement;

  state = {
    needOpen: false,
  };

  // estAmtFieldRef = React.createRef();
  componentDidMount() {
    if (
      this.titleInput &&
      !this.props.expReport.reportId &&
      !this.props.isLoading
    ) {
      this.titleInput.focus();
    }
  }

  // set availabe expense type based on selected report's report type on Expense
  componentDidUpdate(prevProps: Props) {
    const isReportChanged =
      prevProps.expReport.reportId !== this.props.expReport.reportId;

    // focus title only when create new
    if (this.titleInput && isReportChanged) {
      if (!this.props.expReport.reportId) {
        this.titleInput.focus();
      } else {
        this.titleInput.blur();
      }
    }

    const isExistingReport = !_.isEmpty(
      _.get(this.props.expReport, 'reportId')
    );
    if (
      !_.isEqual(this.props.reportTypeList, prevProps.reportTypeList) &&
      !_.isEmpty(this.props.reportTypeList) &&
      isExistingReport
    ) {
      // In case the subrole changed, we re initialise the selected report type after fetching new report.
      // If it is existing report, we get the report type id and search for that first, if doesn't exist, set 1st as selected by default
      let reportType = this.props.reportTypeList[0];
      let reportTypeFound = false;
      const { expReportTypeId } = this.props.expReport;
      if (!_.isEmpty(expReportTypeId)) {
        const rT = this.props.reportTypeList.find(
          // @ts-ignore
          (r) => r.id === expReportTypeId || r.value === expReportTypeId
        );
        if (!_.isEmpty(rT)) {
          reportType = rT;
          reportTypeFound = true;
        }
      }
      this.props.handleChangeExpenseReportType(reportType, !reportTypeFound);
    }

    const cloneReportId = _.get(this.props.reportCloneLink, 'reportId');
    if (
      cloneReportId &&
      cloneReportId !== _.get(prevProps.reportCloneLink, 'reportId')
    ) {
      setTimeout(() => {
        this.props.closeReportCloneToaster();
      }, 6000);
    }
    if (this.state.needOpen) {
      const errorsClone = _.cloneDeep(this.props.errors);
      delete errorsClone.records;
      const hasHeaderError = Object.keys(errorsClone).length > 0;

      if (hasHeaderError) {
        this.props.openTitleAction();
        this.setState({ needOpen: false });
      }
    }
  }

  onClickTitleToggle = (e: any) => {
    e.preventDefault();
    this.props.onClickTitleToggleButton();
  };

  handleAmountChange = (value: number | null) => {
    this.props.handleChangeEstAmt(Number(value));
  };

  getDiffValues = (): DifferenceValues => {
    let diffValues = {};
    const { expReport, expPreRequest, isHighlightDiff } = this.props;
    if (isHighlightDiff) {
      const diffMapping = {
        subject: 'subject',
        totalAmount: 'totalAmount',
      };
      diffValues = convertDifferenceValues(
        diffMapping,
        expReport,
        expPreRequest
      );
    }
    return diffValues;
  };

  renderEditImage = () => {
    const { expReport, isBulkEditMode, readOnly, onClickEstAmtEditButton } =
      this.props;
    const isEdited = expReport.isEstimated;
    const imgEdit = isEdited ? ImgEditOn : ImgEditOff;
    const imgEditAlt = isEdited ? 'ImgEditOn' : 'ImgEditOff';

    return (
      <IconButton
        src={imgEdit}
        onClick={onClickEstAmtEditButton}
        srcType="svg"
        alt={imgEditAlt}
        disabled={readOnly || isBulkEditMode}
      />
    );
  };

  renderSubtotalAmount = () => {
    const {
      baseCurrencySymbol,
      baseCurrencyDecimal,
      expReport,
      selectedExpReport,
    } = this.props;
    const report = this.props.isBulkEditMode ? selectedExpReport : expReport;
    const { foreignCurrency, baseCurrencyAmount } = calculateSubtotalAmount(
      report.records
    );

    const foreignCurrencyAmount = Object.keys(foreignCurrency).map((fc) => {
      const { symbol, amount, decimalPlaces } = foreignCurrency[fc];
      return (
        <div key={fc}>
          {symbol}&nbsp;
          {FormatUtil.formatNumber(amount, decimalPlaces)}
        </div>
      );
    });

    return (
      <>
        {!_.isEmpty(foreignCurrencyAmount) && (
          <Tooltip
            id={ROOT}
            align="bottom"
            content={msg().Exp_Msg_SubtotalAmount}
            position="absolute"
            className={`${ROOT}__subtotal-amount`}
          >
            <div>
              {!!baseCurrencyAmount && (
                <div
                  className={`${ROOT}__total-base-amount`}
                >{`${baseCurrencySymbol} ${FormatUtil.formatNumber(
                  baseCurrencyAmount,
                  baseCurrencyDecimal
                )}`}</div>
              )}
              <div className={`${ROOT}__total-foriegn-amount`}>
                {foreignCurrencyAmount}
              </div>
            </div>
          </Tooltip>
        )}
      </>
    );
  };

  render() {
    //    const [isOpen, setIsOpen] = useState(false);
    const {
      isExpense,
      expPreRequest,
      isBulkEditMode,
      isFinanceApproval,
      isHighlightDiff,
      readOnly,
      mode,
      reportCloneLink = {},
      openClonedReportTab,
      closeReportCloneToaster,
      clearRemovedVendor,
    } = this.props;
    const { reportId: clonedReportId } = reportCloneLink as {
      isExpenseReport: boolean;
      reportId?: string;
    };
    const showForm = this.props.openTitle
      ? `${ROOT}__form--open`
      : `${ROOT}__form--close`;
    const removeHeaderBorder = this.props.openTitle ? '' : `close-form`;
    const isReadOnly =
      readOnly ||
      !(
        mode === modes.REPORT_EDIT ||
        mode === modes.REPORT_SELECT ||
        mode === modes.FINANCE_REPORT_EDITED ||
        mode === modes.BULK_RECORD_EDIT
      );

    const getLabel = () => {
      return this.props.isExpenseRequest
        ? msg().Exp_Lbl_RequestNo
        : msg().Exp_Lbl_ReportNo;
    };

    // よくない。
    const amountClassName =
      this.props.expReport.totalAmount > 0
        ? `${ROOT}__header-amount-active`
        : `${ROOT}__header-amount`;

    const isEditImageShow =
      !isExpense &&
      !isFinanceApproval &&
      (!readOnly || (readOnly && this.props.expReport.isEstimated));

    const isNotClaimedApprovedRequest =
      this.props.expReport.preRequestId && !this.props.expReport.reportId;
    const reportStatus = isNotClaimedApprovedRequest
      ? status.APPROVED_PRE_REQUEST
      : this.props.expReport.status;

    const showReportNo =
      this.props.expReport.reportNo && reportStatus !== status.NOT_REQUESTED;

    const withLoadingCtx = {
      isLoading: this.props.isLoading,
      loadingAreas: this.props.loadingAreas,
    };
    const diffValues = this.getDiffValues();
    return (
      <div className={`${ROOT}`}>
        <div className={`${ROOT}__status-header`}>
          <div className={`${ROOT}__status-and-buttons`}>
            {(headerStatusLabels as ReportStatuses[]).indexOf(reportStatus) >
              -1 && (
              <ReportStatus
                isFinanceApproval={this.props.isFinanceApproval}
                departmentCode={this.props.expReport.departmentCode}
                departmentName={this.props.expReport.departmentName}
                employeeName={this.props.expReport.employeeName}
                reportStatus={reportStatus}
              />
            )}

            {showReportNo && (
              <div className={`${ROOT}__report-no`}>
                {getLabel()} : {this.props.expReport.reportNo}
              </div>
            )}
            <div
              className={classNames(`${ROOT}__reportNo_actionButton`, {
                'without-report-no': !showReportNo,
              })}
            >
              <ActionButtons
                key={this.props.expReport.reportId}
                mode={this.props.mode}
                expReport={this.props.expReport}
                onClickBackButton={() => {
                  this.props.toggleVendorDetail(false);
                  this.props.onClickBackButton();
                }}
                onClickSaveButton={() => {
                  this.setState({ needOpen: true });
                  this.props.onClickSaveButton();
                }}
                onClickDiscardButton={this.props.onClickDiscardButton}
                onClickDeleteButton={this.props.onClickDeleteButton}
                onClickSubmitButton={() => {
                  this.setState({ needOpen: true });
                  this.props.onClickSubmitButton();
                }}
                onClickApprovalHistoryButton={
                  this.props.onClickApprovalHistoryButton
                }
                onClickCloneButton={this.props.onClickCloneButton}
                onClickEditHistoryButton={this.props.onClickEditHistoryButton}
                onClickCancelRequestButton={
                  this.props.onClickCancelRequestButton
                }
                onClickRejectButton={this.props.onClickRejectButton}
                onClickEditButton={this.props.onClickEditButton}
                onClickApproveButton={this.props.onClickApproveButton}
                openCustomRequestDialog={this.props.openCustomRequestDialog}
                readOnly={this.props.readOnly}
                openTitle={this.props.openTitle}
                isBulkEditMode={this.props.isBulkEditMode}
                isExpenseRequest={this.props.isExpenseRequest}
                isPartialLoading={this.props.isPartialLoading}
                isExpense={this.props.isExpense}
                isFinanceApproval={this.props.isFinanceApproval}
                errors={this.props.errors}
                reportEdit={this.props.reportEdit}
                onClickPrintPageButton={this.props.onClickPrintPageButton}
                openReceiptLibraryDialog={this.props.openReceiptLibraryDialog}
                openCustomRequestPage={this.props.openCustomRequestPage}
                updateReport={this.props.updateReport}
                reportTypeList={this.props.reportTypeList}
                isReadOnlyApexPage={this.props.isReadOnlyApexPage}
              />
            </div>
          </div>

          {this.props.expReport.preRequest && (
            <PreRequestSummaryForm
              preRequest={this.props.expReport.preRequest}
              baseCurrencyDecimal={this.props.baseCurrencyDecimal}
              baseCurrencySymbol={this.props.baseCurrencySymbol}
              openRequestReportPage={this.props.openRequestReportPage}
            />
          )}
        </div>
        <div
          className={classNames(`${ROOT}__parent-header`, {
            [`${ROOT}__parent-header-disabled`]: isBulkEditMode,
          })}
        >
          <section className={`${ROOT}__header ${removeHeaderBorder}`}>
            <div className={`${ROOT}__toggle`}>
              {/* saved report -> title of the report, new report -> Exp_Lbl_NewReportCreate */}
              <TextAreaField
                className={classNames(`${ROOT}__header-input`, {
                  'highlight-bg': isDifferent('subject', diffValues),
                })}
                data-testid={`${ROOT}__header-input`}
                placeholder={msg().Exp_Lbl_ReportTitle}
                value={this.props.expReport.subject}
                resize="none"
                autosize
                minRows={1}
                maxRows={2}
                disabled={
                  isReadOnly || this.props.isRecordOpen || isBulkEditMode
                }
                onChange={this.props.handleChangeSubject}
                inputRef={(ref) => {
                  this.titleInput = ref;
                }}
              />

              <div className={`${ROOT}__header-right`}>
                {isExpense ||
                isFinanceApproval ||
                (!isExpense && !this.props.expReport.isEstimated) ? (
                  <Highlight highlight={isDifferent('totalAmount', diffValues)}>
                    <div className={amountClassName}>
                      <input
                        type="text"
                        className={`${ROOT}__estimated-amount-non-editable`}
                        data-testid={`${ROOT}__estimated-amount-non-editable`}
                        disabled
                        value={`${this.props.baseCurrencySymbol} ${
                          FormatUtil.formatNumber(
                            this.props.expReport.totalAmount,
                            this.props.baseCurrencyDecimal
                          ) || 0
                        }`}
                      />
                      {this.renderSubtotalAmount()}
                    </div>
                  </Highlight>
                ) : (
                  <div className={amountClassName}>
                    <AmountField
                      allowNegative={true}
                      className={`${ROOT}__estimated-amount-editable`}
                      data-testid={`${ROOT}__estimated-amount-editable`}
                      value={this.props.expReport.totalAmount}
                      disabled={readOnly || isBulkEditMode}
                      fractionDigits={this.props.baseCurrencyDecimal}
                      onBlur={this.handleAmountChange}
                      currencySymbol={this.props.baseCurrencySymbol}
                    />
                    {this.renderSubtotalAmount()}
                  </div>
                )}

                {isEditImageShow && (
                  <div className="edit-image">{this.renderEditImage()}</div>
                )}
                <div
                  className={`${ROOT}__header__toogle`}
                  data-testid={`${ROOT}__header-toggle`}
                >
                  <OpenButton
                    isDisabled={isBulkEditMode}
                    isOpen={this.props.openTitle}
                    testId={`${ROOT}__header-open-toggle`}
                    onClick={this.onClickTitleToggle}
                  />
                </div>
              </div>
              {this.props.errors.subject && this.props.touched.subject && (
                <div
                  className="input-feedback"
                  data-testid={`${ROOT}__feedback`}
                >
                  {msg()[this.props.errors.subject]}
                </div>
              )}
            </div>
          </section>

          <div className={showForm}>
            <WithLoadingContext.Provider value={withLoadingCtx}>
              <ReportSummaryForm
                subroleId={this.props.subroleId}
                isExpense={this.props.isExpense}
                isFAExpenseTab={this.props.isFAExpenseTab}
                isFinanceApproval={this.props.isFinanceApproval}
                isExpenseRequest={this.props.isExpenseRequest}
                mode={this.props.mode}
                customHint={this.props.customHint}
                reportStatus={reportStatus}
                reportTypeList={this.props.reportTypeList}
                inactiveReportTypeList={this.props.inactiveReportTypeList}
                expReport={this.props.expReport}
                expPreRequest={expPreRequest}
                isHighlightDiff={isHighlightDiff}
                errors={this.props.errors}
                touched={this.props.touched}
                readOnly={this.props.readOnly}
                showVendorFilter={this.props.showVendorFilter}
                baseCurrencySymbol={this.props.baseCurrencySymbol}
                baseCurrencyDecimal={this.props.baseCurrencyDecimal}
                apActive={this.props.apActive}
                onChangeEditingExpReport={this.props.onChangeEditingExpReport}
                handleChangeExpenseReportType={
                  this.props.handleChangeExpenseReportType
                }
                handleChangeCostCenter={this.props.handleChangeCostCenter}
                handleChangeJob={this.props.handleChangeJob}
                handleChangeSubject={this.props.handleChangeSubject}
                handleChangePurpose={this.props.handleChangePurpose}
                handleChangeRemarks={this.props.handleChangeRemarks}
                isNotDefaultCostCenter={this.props.isNotDefaultCostCenter}
                renderScheduledDate={this.props.renderScheduledDate}
                handleClickCostCenterBtn={this.props.handleClickCostCenterBtn}
                handleClickJobBtn={this.props.handleClickJobBtn}
                getRecentJobs={this.props.getRecentJobs}
                getRecentCostCenters={this.props.getRecentCostCenters}
                getRecentVendors={this.props.getRecentVendors}
                searchJobs={this.props.searchJobs}
                searchCostCenters={this.props.searchCostCenters}
                searchVendors={this.props.searchVendors}
                updateReport={this.props.updateReport}
                onClickLookupEISearch={this.props.onClickLookupEISearch}
                onClickVendorSearch={this.props.onClickVendorSearch}
                searchVendorDetail={this.props.searchVendorDetail}
                toggleVendorDetail={this.props.toggleVendorDetail}
                createNewExpReport={this.props.createNewExpReport}
                useJctRegistrationNumber={this.props.useJctRegistrationNumber}
                alwaysDisplaySettlementAmount={
                  this.props.alwaysDisplaySettlementAmount
                }
              />
            </WithLoadingContext.Provider>
          </div>
          {!!clonedReportId && (
            <Toast
              onClick={closeReportCloneToaster}
              onExit={() => {}}
              message={msg().Exp_Msg_CloneReport}
              isShow
            >
              <p
                className={`${ROOT}__cloned_report_link`}
                onClick={openClonedReportTab}
              >
                {msg().Exp_Msg_OpenReport}
              </p>
            </Toast>
          )}
          {this.props.removedVendors.map((o) => (
            <Toast
              key={o.id}
              onClick={() => {
                clearRemovedVendor(o.id);
              }}
              onExit={() => {}}
              message={TextUtil.template(msg().Exp_Msg_ItemDeleted, o.name)}
              isShow
              handleUndo={() =>
                this.props.undoVendorDeletion(o, this.props.subroleId)
              }
            />
          ))}
        </div>
      </div>
    );
  }
}
