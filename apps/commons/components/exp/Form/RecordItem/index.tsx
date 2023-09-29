import React from 'react';

import classNames from 'classnames';
import { drop, get, isEmpty } from 'lodash';

import Tooltip from '@apps/commons/components/Tooltip';

import { CustomHint } from '../../../../../domain/models/exp/CustomHint';
import {
  AmountOption,
  ExpenseType,
  ExpenseTypeList,
} from '../../../../../domain/models/exp/ExpenseType';
import { EISearchObj } from '../../../../../domain/models/exp/ExtendedItem';
import {
  isUseMerchant,
  MERCHANT_USAGE,
} from '../../../../../domain/models/exp/Merchant';
import {
  calcItemsTotalAmount,
  isAmountMatch,
  isCCRecord,
  isFixedAllowanceMulti,
  isFixedAllowanceSingle,
  isIcRecord,
  isRecordItemized,
  newRecord,
  RECEIPT_TYPE,
  Record,
  RECORD_TYPE,
  RecordItem as Item,
  RouteInfo,
} from '../../../../../domain/models/exp/Record';
import { Report, status } from '../../../../../domain/models/exp/Report';
import { AmountInputMode } from '../../../../../domain/models/exp/TaxType';
import {
  getDetailDisplay,
  TransitIcRecordInfo,
} from '../../../../../domain/models/exp/TransportICCard';
import {
  isUseJctNo,
  JCT_REGISTRATION_NUMBER_USAGE,
} from '@apps/domain/models/exp/JCTNo';
import { FileMetadata } from '@apps/domain/models/exp/Receipt';

import FormatUtil from '../../../../utils/FormatUtil';

import msg from '../../../../languages';
import Button from '../../../buttons/Button';
import TextField from '../../../fields/TextField';
import MultiColumnsGrid from '../../../MultiColumnsGrid';
import { Option } from '../QuickSearch';
import ActionButtons from './ActionButtons';
import AmountSelection from './AmountSelection';
import ChildRecordItem, { ChildRecordItemProps } from './ChildRecordItem';
import RecordCostCenter from './CostCenter';
import ExtendedItems from './ExtendedItem';
import General from './General';
import RecordInvoice from './Invoice';
import RecordJob from './Job';
import RecordDate from './RecordDate';
import RecordItemsArea from './RecordItemsArea';
import RecordReceipt from './RecordReceipt';
import RecordSkeleton from './RecordSkeleton';
import Summary from './Summary';
import TransitJorudanJP from './TransitJorudanJP';

import './index.scss';

const ROOT = 'ts-expenses-requests';

type Props = {
  // Components
  baseCurrency: any;
  // ui states
  baseCurrencyCode: string;
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  customHint: CustomHint;
  errors: { recordDate?: string; records?: Array<any> };
  expReport: Report;
  expenseTypeList: ExpenseTypeList;
  fileMetadata: FileMetadata[];
  fixedAmountOptionList: Array<AmountOption>;
  foreignCurrency: any;
  isChildRecord?: boolean;
  isExpenseRequest?: boolean;
  isFinanceApproval?: boolean;
  isLoading: boolean;
  isRecordLoading: boolean;
  loadingAreas: string[];
  mode: string;
  overlap: { record: boolean; report: boolean };
  readOnly: boolean;

  recordIdx: number;
  recordItemIdx: number;
  routeForm: any;
  selectedCompanyId: string;
  suggest: any;
  tempSavedRecordItems: Array<Item>;

  touched: { recordDate?: string; records?: Array<any> };
  useImageQualityCheck: boolean;
  useJctRegistrationNumber?: boolean;
  useTransitManager: boolean;
  fetchFileMetadata: (ids: string[]) => void;
  getRecentCostCenters: () => Promise<Option[]>;

  getRecentJobs: () => Promise<Option[]>;
  onChangeAmountSelection: (value: string) => void;
  onChangeRecordDate: (value: string) => void;
  onClickCostCenterBtn: () => void;
  // event handlers
  onClickHideRecordButton: () => void;
  onClickJobBtn: () => void;
  onClickLookupEISearch: (item: EISearchObj) => void;
  // receipt-library
  onClickOpenLibraryButton: () => void;
  onClickRecordItemsConfirmButton: () => void;
  onClickRecordItemsCreateButton: () => void;
  onClickRecordItemsDeleteButton: () => void;
  onClickResetRouteInfoButton: () => void;
  onClickSaveButton: () => void;
  onImageDrop: (files: File) => void;
  openIcTransactionDialog: () => void;
  removeAllChildItems: () => void;
  reportEdit: () => void;
  resetRouteForm: (arg0?: RouteInfo) => void;
  searchCostCenters: (keyword?: string) => Promise<Option[]>;
  searchJobs: (keyword?: string) => Promise<Option[]>;
  setFieldError: (arg0: string, arg1: any) => void;
  setFieldTouched: (
    arg0: string,
    arg1: { [key: string]: unknown } | boolean,
    arg2?: boolean
  ) => void;
  updateReport: (arg0: string, arg1: any, arg2?: boolean) => void;
} & ChildRecordItemProps;

type State = {
  expTypeDescription: string;
};

export default class RecordItem extends React.Component<Props, State> {
  state = {
    expTypeDescription: '',
  };

  componentDidMount() {
    const {
      expReport,
      recordIdx,
      useImageQualityCheck,
      fileMetadata,
      fetchFileMetadata,
    } = this.props;
    const expTypeDescription = get(
      expReport,
      `records.${recordIdx}.items.0.expTypeDescription`,
      ''
    );
    this.setState({ expTypeDescription });

    const targetRecord = expReport.records[recordIdx];
    const contentDocumentId = targetRecord && targetRecord.receiptId;
    if (contentDocumentId && useImageQualityCheck) {
      const selectedMetadata = fileMetadata.find(
        (x) => x.contentDocumentId === contentDocumentId
      );
      if (!selectedMetadata) {
        fetchFileMetadata([contentDocumentId]);
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const { expReport, recordIdx, fileMetadata, useImageQualityCheck } =
      nextProps;
    const targetRecord = expReport.records[recordIdx];
    const currentRecord = this.props.expReport.records[this.props.recordIdx];
    const isChangeRecord = this.props.recordIdx !== recordIdx;
    if (isChangeRecord && !isEmpty(nextProps.expenseTypeList)) {
      const expType =
        (targetRecord &&
          (nextProps.expenseTypeList as ExpenseTypeList).find(
            (x) => x.id === expReport.records[recordIdx].items[0].expTypeId
          )) ||
        ({} as ExpenseType);
      this.setState({
        expTypeDescription: expType.description,
      });
    }

    // fetch receipt metadata
    const contentDocumentId = targetRecord && targetRecord.receiptId;
    const currentDocId = currentRecord && currentRecord.receiptId;
    const isChangeReceipt = currentDocId !== contentDocumentId;
    if (
      contentDocumentId &&
      useImageQualityCheck &&
      (isChangeRecord || isChangeReceipt)
    ) {
      const selectedMetadata = fileMetadata.find(
        (x) => x.contentDocumentId === contentDocumentId
      );
      if (!selectedMetadata) {
        nextProps.fetchFileMetadata([contentDocumentId]);
      }
    }
  }

  onChangeSelectedJctInvoiceOption = (optionValue: string) => {
    const targetRecord = `records[${this.props.recordIdx}]`;
    this.props.updateReport(
      `${targetRecord}.items.0.jctInvoiceOption`,
      optionValue
    );
  };

  onChangeJctRegistrationNo = (value: string) => {
    const targetRecord = `records[${this.props.recordIdx}]`;
    this.props.updateReport(
      `${targetRecord}.items.0.jctRegistrationNumber`,
      value
    );
  };

  renderIcRecordContent = (contents: React.ReactElement, expRecord: Record) => {
    const transitIcRecordInfo = get(
      expRecord,
      'transitIcRecordInfo',
      {} as TransitIcRecordInfo
    );
    const detailDisplay = getDetailDisplay(transitIcRecordInfo);
    const isNotLinked = !expRecord.transitIcRecordId;
    const isLinkBtnDisabled =
      this.props.readOnly || !this.props.useTransitManager;

    const btn = isNotLinked && !this.props.isExpenseRequest && (
      <Button
        disabled={isLinkBtnDisabled}
        className={`${ROOT}__ic-link-btn`}
        onClick={this.props.openIcTransactionDialog}
      >
        {msg().Exp_Btn_LinkIcCardTransaction}
      </Button>
    );

    const showWithTooltip = btn && !this.props.useTransitManager;
    const toolTipStyle = { display: 'inline-block' };

    const linkBtn = showWithTooltip ? (
      <Tooltip
        align="top"
        content={msg().Com_Err_NoApiPermission}
        className={`${ROOT}__ic-link`}
        style={toolTipStyle}
      >
        <div className={`${ROOT}__ic-link-btn-disabled-wrapper`}>{btn}</div>
      </Tooltip>
    ) : (
      <div className={`${ROOT}__ic-link`}>{btn}</div>
    );

    const linkError = get(
      this.props.errors,
      `records[${this.props.recordIdx}].transitIcRecordId`
    );
    const feedback = <div className="input-feedback">{msg()[linkError]}</div>;

    const disabled = this.props.readOnly || !this.props.isExpenseRequest;
    const displayAsLabel = !!expRecord.transitIcRecordId;
    const detail = (
      <div className={`${ROOT}__ic-detail ts-text-field-container`}>
        <div className="key">{msg().Exp_Lbl_Detail}</div>
        <TextField
          value={detailDisplay}
          disabled={disabled}
          readOnly={displayAsLabel}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            this.props.updateReport(
              `records.${this.props.recordIdx}.transitIcRecordInfo.route`,
              e.target.value
            );
          }}
        />
      </div>
    );

    return (
      <>
        {linkBtn}
        {feedback}
        {contents}
        {detail}
      </>
    );
  };

  render() {
    const {
      recordIdx,
      isFinanceApproval,
      isExpenseRequest,
      isRecordLoading,
      expReport,
      tempSavedRecordItems,
      baseCurrencyDecimal,
      baseCurrencySymbol,
      isChildRecord,
      recordItemIdx = 0,
      customHint,
      selectedCompanyId,
      useJctRegistrationNumber,
    } = this.props;

    let expRecord;
    let errors;
    let touched;
    const targetRecord = `records[${this.props.recordIdx}]`;
    if (recordIdx === -1) {
      expRecord = newRecord('', '', RECORD_TYPE.General);
      errors = {};
      touched = {};
    } else {
      expRecord = get(expReport, targetRecord);
      errors = get(this.props.errors, targetRecord) || {};
      touched = get(this.props.touched, targetRecord) || {};
    }

    if (!expRecord) {
      return null;
    }

    // Itemization
    const isItemized = isRecordItemized(expRecord.recordType, isChildRecord);
    const hasChildItems =
      tempSavedRecordItems && tempSavedRecordItems.length > 1;
    const useForeignCurrency = get(expRecord, 'items.0.useForeignCurrency');
    const tempSavedChildItems = drop(tempSavedRecordItems);
    const decimalPlaces = useForeignCurrency
      ? get(expRecord, 'items.0.currencyInfo.decimalPlaces', 0)
      : baseCurrencyDecimal;
    const isTaxIncluded =
      expRecord.amountInputMode === AmountInputMode.TaxIncluded;
    const key =
      (useForeignCurrency && 'localAmount') ||
      (isTaxIncluded && 'amount') ||
      'withoutTax';
    const childTotalAmount = calcItemsTotalAmount(
      tempSavedChildItems,
      key,
      decimalPlaces
    );
    const parentAmount =
      (useForeignCurrency && get(expRecord, 'items.0.localAmount')) ||
      (isTaxIncluded && expRecord.amount) ||
      expRecord.withoutTax;
    const isMatch = isAmountMatch(childTotalAmount, parentAmount);
    const hasRIErrors = isItemized && (!hasChildItems || !isMatch);

    const contentsCss = classNames({
      disabled: recordIdx === -1,
      'to-be-itemized': isItemized && !hasChildItems,
      hidden: !!isRecordLoading,
    });

    const contentsDisabled = this.props.readOnly || recordIdx === -1;

    // Receipt Logic
    const { fileAttachment } = expRecord;
    const isReceiptOptional = fileAttachment === RECEIPT_TYPE.Optional;
    const isReceiptDisabled = fileAttachment === RECEIPT_TYPE.NotUsed;

    const canRenderReceipt =
      isFinanceApproval && !isReceiptOptional
        ? !!expRecord.receiptFileId
        : !isReceiptDisabled;

    const isMerchantRequired =
      !isExpenseRequest && expRecord.merchantUsage === MERCHANT_USAGE.Required;

    // End Receipt Logic

    const isDisabled =
      expReport.status === status.ACCOUNTING_AUTHORIZED ||
      expReport.status === status.ACCOUNTING_REJECTED ||
      expReport.status === status.JOURNAL_CREATED ||
      expReport.status === status.FULLY_PAID;

    const hasReportId = expReport.reportId;
    const hasPreRequestId = expReport.preRequestId;
    const isNewReportFromPreRequest = hasPreRequestId && !hasReportId;
    const isBaseCurrencyHotel =
      expRecord.recordType === 'HotelFee' && !useForeignCurrency;
    const isTransitJorudan = expRecord.recordType === 'TransitJorudanJP';

    // Fixed Allownance
    const isMultiFixedAllowance = isFixedAllowanceMulti(expRecord.recordType);
    const isSingleFixedAllowance = isFixedAllowanceSingle(expRecord.recordType);
    const isFixedAllowance = isSingleFixedAllowance || isMultiFixedAllowance;
    const fixedAmountMessage = isSingleFixedAllowance
      ? msg().Exp_Hint_FixedAllownceSingle
      : msg().Exp_Hint_FixedAllowanceMulti;

    // multi-amount option
    const expTypeId = get(expRecord, 'items.0.expTypeId');
    let currencySymbol = baseCurrencySymbol;
    if (useForeignCurrency) {
      const foreignCurrencySymbol = get(
        expRecord,
        'items.0.currencyInfo.symbol'
      );
      currencySymbol = foreignCurrencySymbol || '';
    }
    const optionList = get(
      this.props.fixedAmountOptionList,
      `${expTypeId}`,
      []
    );
    const recordId = expRecord.recordId;

    const navTitle =
      !!recordId || isFinanceApproval
        ? msg().Exp_Lbl_Records
        : msg().Exp_Btn_NewRecord;

    const amountOptions = optionList.map((item) => ({
      id: item.id,
      text: `${item.label} ${currencySymbol}${FormatUtil.formatNumber(
        item.allowanceAmount,
        decimalPlaces
      )}`,
    }));

    if (isEmpty(recordId)) {
      amountOptions.unshift({
        id: '',
        text: msg().Exp_Lbl_PleaseSelect,
      });
    }
    // multi-amount value
    const amountValue = get(expRecord, 'items.0.fixedAllowanceOptionId', '');
    const amountError = get(
      this.props.errors,
      `records[${this.props.recordIdx}]items.0.fixedAllowanceOptionId`,
      ''
    );

    const merchantError = get(
      this.props.errors,
      `records[${this.props.recordIdx}]items.0.merchant`,
      ''
    );

    // Job
    const isShowJob = expReport.jobId;

    // Cost Center
    const isShowCostCenter = expReport.costCenterHistoryId;

    let contents = null;
    switch (expRecord.recordType) {
      case 'General':
      case 'HotelFee':
      case 'FixedAllowanceSingle':
      case 'FixedAllowanceMulti':
      case 'TransportICCardJP':
        contents = (
          <General
            expRecord={expRecord}
            targetRecord={targetRecord}
            onChangeEditingExpReport={this.props.updateReport}
            readOnly={contentsDisabled}
            errors={errors}
            touched={touched}
            baseCurrencyCode={this.props.baseCurrencyCode}
            baseCurrencySymbol={this.props.baseCurrencySymbol}
            baseCurrencyDecimal={this.props.baseCurrencyDecimal}
            baseCurrency={this.props.baseCurrency}
            foreignCurrency={this.props.foreignCurrency}
            isItemized={isItemized}
            isFixedAllowance={isFixedAllowance}
            isFinanceApproval={isFinanceApproval}
            isExpenseRequest={isExpenseRequest}
            fixedAmountMessage={(isFixedAllowance && fixedAmountMessage) || ''}
            hasChildItems={hasChildItems}
            recordItemIdx={recordItemIdx}
            selectedCompanyId={selectedCompanyId}
            removeAllChildItems={this.props.removeAllChildItems}
          />
        );

        if (isIcRecord(expRecord.recordType)) {
          contents = this.renderIcRecordContent(contents, expRecord);
        }

        break;

      case 'TransitJorudanJP':
        contents = (
          <TransitJorudanJP
            expRecord={expRecord}
            expReport={expReport}
            targetRecord={targetRecord}
            onChangeEditingExpReport={this.props.updateReport}
            readOnly={contentsDisabled}
            errors={errors}
            touched={touched}
            onClickResetRouteInfoButton={this.props.onClickResetRouteInfoButton}
            resetRouteForm={this.props.resetRouteForm}
            baseCurrencySymbol={this.props.baseCurrencySymbol}
            routeForm={this.props.routeForm}
            suggest={this.props.suggest}
          />
        );
        break;

      default:
        break;
    }

    if (isChildRecord) {
      return (
        <ChildRecordItem
          expRecord={expRecord}
          recordIdx={recordIdx}
          recordItemIdx={this.props.recordItemIdx}
          onChangeChildDateOrTypeForBC={this.props.onChangeChildDateOrTypeForBC}
          onChangeChildExpTypeForFC={this.props.onChangeChildExpTypeForFC}
          onChangeChildDateForFC={this.props.onChangeChildDateForFC}
          onChangeEditingExpReport={this.props.updateReport}
          errors={this.props.errors}
          touched={this.props.touched}
          baseCurrencyCode={this.props.baseCurrencyCode}
          baseCurrencySymbol={this.props.baseCurrencySymbol}
          baseCurrencyDecimal={this.props.baseCurrencyDecimal}
          baseCurrency={this.props.baseCurrency}
          foreignCurrency={this.props.foreignCurrency}
          handleClickDeleteBtn={this.props.handleClickDeleteBtn}
          expTypesDisplay={this.props.expTypesDisplay}
          onClickLookupEISearch={this.props.onClickLookupEISearch}
          isFinanceApproval={isFinanceApproval}
          customHint={customHint}
          expTypeList={this.props.expTypeList}
          selectedCompanyId={this.props.selectedCompanyId}
        />
      );
    }

    const isRecordDateDisabled =
      this.props.readOnly ||
      (isIcRecord(expRecord.recordType) && !isExpenseRequest) ||
      isCCRecord(expRecord);

    const selectedExpenseType = (this.props.expenseTypeList || []).find(
      ({ id }) => id === expRecord.items[0].expTypeId
    );

    const jctRegistrationNumberUsage = get(
      selectedExpenseType,
      'jctRegistrationNumberUsage',
      JCT_REGISTRATION_NUMBER_USAGE.NotUsed
    );
    const isShowJctRegistrationNumber = get(
      selectedExpenseType,
      'displayJctNumberInput',
      false
    );
    const isShowRecordInvoice =
      useJctRegistrationNumber && isUseJctNo(jctRegistrationNumberUsage);
    const jctInvoiceOption = get(expRecord, 'items[0].jctInvoiceOption');

    return (
      <div className="ts-expenses-requests slds">
        <section className={`${ROOT}-header`}>
          <div className={`${ROOT}-nav-title`}>
            <span>{navTitle}</span>
          </div>
          <ActionButtons
            mode={this.props.mode}
            isDisabled={isDisabled}
            isExpenseReportDisabled={this.props.readOnly}
            isNewReportFromPreRequest={!!isNewReportFromPreRequest}
            isExpTypeDisableSave={isBaseCurrencyHotel || isTransitJorudan}
            isFinanceApproval={isFinanceApproval}
            onClickEditButton={this.props.reportEdit}
            onClickBackButton={this.props.onClickHideRecordButton}
            onClickSaveButton={this.props.onClickSaveButton}
            hasRIErrors={hasRIErrors}
            isLoading={this.props.isLoading}
            isRecordLoading={this.props.isRecordLoading}
          />
        </section>

        {!!isRecordLoading && (
          <div className={`${ROOT}__contents`}>
            <RecordSkeleton />
          </div>
        )}

        <div className={`${ROOT}__contents ${contentsCss}`}>
          <RecordDate
            recordDate={expRecord.recordDate}
            ocrDate={expRecord.ocrDate}
            targetRecord={targetRecord}
            hintMsg={
              isExpenseRequest
                ? customHint.requestRecordDate
                : customHint.recordDate
            }
            onChangeRecordDate={this.props.onChangeRecordDate}
            readOnly={isRecordDateDisabled}
            errors={this.props.errors}
          />
          <MultiColumnsGrid sizeList={[6, 6]}>
            <div className={`${ROOT}__exp-type`}>
              <TextField
                className={`${ROOT}__contents__expense-type`}
                data-testid={`${ROOT}}__contents__expense-type`}
                value={expRecord.items[0].expTypeName}
                label={msg().Exp_Clbl_ExpenseType}
                isRequired
                disabled
              />
            </div>
            <div className={`${ROOT}__amount-selection`}>
              {isMultiFixedAllowance && (
                <AmountSelection
                  readOnly={this.props.readOnly}
                  value={amountValue}
                  onChangeAmountSelection={(e: any) =>
                    this.props.onChangeAmountSelection(e.target.value)
                  }
                  error={msg()[amountError]}
                  options={amountOptions || []}
                />
              )}
            </div>
          </MultiColumnsGrid>
          {this.state.expTypeDescription && (
            <div className={`${ROOT}__contents__expense-type-description`}>
              {this.state.expTypeDescription}
            </div>
          )}
          <div className={`${ROOT}--spacing-border`} />
          {contents}
          {canRenderReceipt && (
            <RecordReceipt
              isFinanceApproval={isFinanceApproval}
              isExpenseRequest={isExpenseRequest}
              expRecord={expRecord}
              hintMsg={
                isExpenseRequest
                  ? customHint.recordQuotation
                  : customHint.recordReceipt
              }
              recordType={expRecord.recordType}
              useImageQualityCheck={this.props.useImageQualityCheck}
              fileAttachment={expRecord.fileAttachment}
              targetRecord={targetRecord}
              onChangeEditingExpReport={this.props.updateReport}
              readOnly={this.props.readOnly}
              errors={errors}
              fileMetadata={this.props.fileMetadata}
              setFieldError={this.props.setFieldError}
              setFieldTouched={this.props.setFieldTouched}
              touched={touched}
              onClickOpenLibraryButton={this.props.onClickOpenLibraryButton}
              onImageDrop={this.props.onImageDrop}
            />
          )}
          {isUseMerchant(expRecord.merchantUsage) && (
            <div className={`${ROOT}__merchant`}>
              <TextField
                label={msg().Exp_Clbl_Merchant}
                value={expRecord.items[0].merchant || ''}
                disabled={contentsDisabled}
                isRequired={isMerchantRequired}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  this.props.updateReport(
                    `${targetRecord}.items.0.merchant`,
                    e.target.value
                  );
                }}
              />
              {merchantError && (
                <div className="input-feedback">{msg()[merchantError]}</div>
              )}
            </div>
          )}
          {isShowRecordInvoice && (
            <RecordInvoice
              customHint={customHint}
              isLoading={this.props.isLoading}
              loadingAreas={this.props.loadingAreas}
              jctRegistrationNumberUsage={jctRegistrationNumberUsage}
              disabled={this.props.readOnly}
              optionValue={jctInvoiceOption}
              recordJctNumber={expRecord.items[0].jctRegistrationNumber}
              onChangeJctNumber={this.onChangeJctRegistrationNo}
              onChangeRadio={this.onChangeSelectedJctInvoiceOption}
              isShowJctRegistrationNumber={isShowJctRegistrationNumber}
            />
          )}
          {isItemized && (
            <RecordItemsArea
              expRecord={expRecord}
              readOnly={this.props.readOnly}
              isFinanceApproval={isFinanceApproval}
              hasChildItems={hasChildItems}
              isAmountMatch={isMatch}
              onClickRecordItemsCreateButton={
                this.props.onClickRecordItemsCreateButton
              }
              onClickRecordItemsConfirmButton={
                this.props.onClickRecordItemsConfirmButton
              }
              onClickRecordItemsDeleteButton={
                this.props.onClickRecordItemsDeleteButton
              }
            />
          )}
          {isShowJob && (
            <RecordJob
              isFinanceApproval={isFinanceApproval}
              recordIdx={this.props.recordIdx}
              expReport={expReport}
              expRecord={expRecord}
              readOnly={this.props.readOnly}
              hintMsg={customHint.recordJob}
              handleClickJobBtn={this.props.onClickJobBtn}
              getRecentJobs={this.props.getRecentJobs}
              searchJobs={this.props.searchJobs}
              updateReport={this.props.updateReport}
            />
          )}
          {isShowCostCenter && (
            <RecordCostCenter
              isFinanceApproval={isFinanceApproval}
              recordIdx={this.props.recordIdx}
              expReport={expReport}
              expRecord={expRecord}
              readOnly={this.props.readOnly}
              hintMsg={customHint.recordCostCenter}
              handleClickCostCenterBtn={this.props.onClickCostCenterBtn}
              getRecentCostCenters={this.props.getRecentCostCenters}
              searchCostCenters={this.props.searchCostCenters}
              updateReport={this.props.updateReport}
            />
          )}
          {!isItemized && (
            <ExtendedItems
              recordItem={expRecord.items[0]}
              onClickLookupEISearch={this.props.onClickLookupEISearch}
              onChangeEditingExpReport={this.props.updateReport}
              readOnly={this.props.readOnly}
              targetRecordItem={`${targetRecord}.items.0`}
              errors={this.props.errors}
              touched={this.props.touched}
            />
          )}
          <Summary
            value={expRecord.items[0].remarks}
            hintMsg={customHint.recordSummary}
            onChangeEditingExpReport={this.props.updateReport}
            readOnly={this.props.readOnly}
            targetRecord={`${targetRecord}.items.${recordItemIdx}`}
            errors={this.props.errors}
            touched={this.props.touched}
          />
        </div>
      </div>
    );
  }
}
