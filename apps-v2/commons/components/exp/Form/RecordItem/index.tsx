import React, { ReactElement } from 'react';

import classNames from 'classnames';
import { FormikErrors } from 'formik';
import { cloneDeep, get, isEmpty, isEqual, isNil } from 'lodash';

import { MileageFormContainerProps } from '@apps/commons/containers/exp/MileageFormContainer';
import {
  convertDifferenceValues,
  DifferenceValues,
  isDifferent,
} from '@apps/commons/utils/exp/RequestReportDiffUtils';
import { ContainerProps as JobCCEISumContainerProps } from '@commons/components/exp/Form/RecordItem/JobCCEISum';
import { ContainerProps as ItemizationTabContainerProps } from '@commons/components/exp/Form/RecordItem/Tabs/ItemizationTab';
import ActiveDialogProvider from '@commons/components/exp/Form/RecordList/BulkEdit/GridArea/GridProofCell/ActiveDialogProvider';
import LabelWithHint from '@commons/components/fields/LabelWithHint';
import SelectField from '@commons/components/fields/SelectField';
import CalendarContainer from '@commons/containers/exp/CalendarContainer';
import ToastContainer from '@commons/containers/ToastContainer';
import { PaymentMethodOptionList } from '@commons/modules/exp/ui/paymentMethodOption';
import {
  calculateFCChildItemListAmount,
  getTotalAmountMatch,
} from '@commons/utils/exp/ItemizationUtil';

import { CustomHint } from '../../../../../domain/models/exp/CustomHint';
import {
  AmountOption,
  ExpenseType,
  ExpenseTypeList,
} from '../../../../../domain/models/exp/ExpenseType';
import {
  isUseMerchant,
  MERCHANT_USAGE,
} from '../../../../../domain/models/exp/Merchant';
import {
  isCCRecord,
  isFixedAllowanceMulti,
  isFixedAllowanceSingle,
  isIcRecord,
  isItemizedRecord,
  isJorudanRecord,
  isMileageRecord,
  isRequiredOrItemizedRecord,
  isShowItemizationTab,
  newRecord,
  RECEIPT_TYPE,
  Record,
  RECORD_ATTACHMENT_MAX_COUNT,
  RECORD_TYPE,
  RecordItem as RecordItemType,
  RouteInfo,
} from '../../../../../domain/models/exp/Record';
import {
  getDisplayOfRecordVendor,
  Report,
  status,
} from '../../../../../domain/models/exp/Report';
import {
  getDetailDisplay,
  TransitIcRecordInfo,
} from '../../../../../domain/models/exp/TransportICCard';
import { ExpenseReportType } from '@apps/domain/models/exp/expense-report-type/list';
import {
  isUseJctNo,
  JCT_NUMBER_INVOICE,
  JCT_REGISTRATION_NUMBER_USAGE,
} from '@apps/domain/models/exp/JCTNo';
import { MileageUnit } from '@apps/domain/models/exp/Mileage';
import {
  isCCPaymentMethod,
  isShowPaymentMethodField,
  isUnlinkCCTrans,
  PaymentMethod,
} from '@apps/domain/models/exp/PaymentMethod';
import { FileMetadata } from '@apps/domain/models/exp/Receipt';
import {
  VendorBackType,
  vendorBackTypes,
} from '@apps/domain/models/exp/Vendor';

import FormatUtil from '../../../../utils/FormatUtil';

import msg from '../../../../languages';
import TextField from '../../../fields/TextField';
import MultiColumnsGrid from '../../../MultiColumnsGrid';
import { Values } from '..';
import { Option } from '../QuickSearch';
import ActionButtons from './ActionButtons';
import Attachment from './ActionButtons/Attachment';
import AmountSelection from './AmountSelection';
import AttachmentPreview from './AttachmentPreview';
import General from './General';
import ICCCLinkButton from './ICCCLinkButton';
import RecordInvoice from './Invoice';
import RecordMerchant from './Merchant';
import RecordDate from './RecordDate';
import RecordReceipt from './RecordReceipt';
import RecordSkeleton from './RecordSkeleton';
import Summary from './Summary';
import Tabs from './Tabs';
import TransitJorudanJP from './TransitJorudanJP';
import RecordVendor from './Vendor';

import './index.scss';

const ROOT = 'ts-expenses-requests';

export type RecordErrors = FormikErrors<Record>;

export type Touched = {
  [key: string]: boolean;
};

type Props = {
  availablePaymentMethodIds: string[];
  // Components
  baseCurrency: any;
  // ui states
  baseCurrencyCode: string;
  baseCurrencyDecimal: number;
  baseCurrencySymbol: string;
  customHint: CustomHint;
  displayCalendar: boolean;
  errors: { recordDate?: string; records?: Array<any> };
  expPreRequest?: Report;
  expReport: Report;
  expRoundingSetting: string;
  expenseTypeList: ExpenseTypeList;
  fileMetadata: FileMetadata[];
  fixedAmountOptionList: Array<AmountOption>;
  foreignCurrency: any;
  isExpenseRequest?: boolean;
  isFinanceApproval?: boolean;
  isHighlightDiff?: boolean;
  isLoading: boolean;
  isRecordLoading: boolean;
  loadingAreas: string[];
  mileageForm: React.FC<MileageFormContainerProps>;
  mileageUnit?: MileageUnit;
  mode: string;

  needGenerateMapPreview?: boolean;
  overlap: { record: boolean; report: boolean };
  paymentMethodList: PaymentMethod[];
  paymentMethodOptionList: PaymentMethodOptionList;
  readOnly: boolean;
  recordIdx: number;
  recordItemIdx: number;
  reportTypeList: Array<ExpenseReportType>;
  routeForm: any;
  selectedCompanyId: string;
  selectedPaymentMethod: PaymentMethod;
  selectedPreRecord?: Record;
  showVendorFilter: boolean;
  suggest: any;

  touched: { recordDate?: string; records?: Array<any> };
  ui: Values['ui'];
  useImageQualityCheck: boolean;
  useJctRegistrationNumber?: boolean;
  useTransitManager: boolean;

  fetchFileMetadata: (ids: string[]) => void;

  getRecentVendors: () => Promise<Option[]>;
  isShowFACCAlert: (paymentMethodId: string) => boolean;
  // component
  itemizationTabContainer: (
    props: ItemizationTabContainerProps
  ) => ReactElement;
  jobCCEISumContainer: (props: JobCCEISumContainerProps) => ReactElement;
  onChangeAmountSelection: (value: string) => void;
  onChangeEditingExpReport: (
    key: string,
    value: boolean | number | string | RecordItemType,
    touched?: Touched,
    shouldValidate?: boolean
  ) => void;
  onChangeRecordDate: (value: string) => void;
  // event handlers
  onClickHideRecordButton: () => void;
  // receipt-library
  onClickOpenLibraryButton: () => void;
  onClickResetRouteInfoButton: () => void;
  onClickSaveButton: (isCCRecord: boolean) => void;
  onClickVendorSearch: (backType: VendorBackType) => void;
  onImageDrop: (files: Array<File>) => void;
  openCCTransactionDialog?: () => void;
  openICTransactionDialog?: () => void;
  reportEdit: () => void;
  resetRouteForm: (arg0?: RouteInfo) => void;
  searchVendors: (keyword?: string) => Promise<Option[]>;
  setFieldError: (arg0: string, arg1: any) => void;
  setFieldTouched: (
    arg0: string,
    arg1: { [key: string]: unknown } | boolean,
    arg2?: boolean
  ) => void;
  toggleICCCCardAlert: (isHide?: boolean) => void;
  toggleVendorDetail: (arg0: boolean) => void;
  updatePaymentMethodOptionList: (
    paymentMethodList: PaymentMethod[],
    availablePaymentMethodIds: string[],
    record: Record
  ) => void;
  updateRecord: (
    updateObj: {
      [key: string]: any;
    },
    recalc?: boolean
  ) => void;
  updateReport: (
    arg0: string,
    arg1: any,
    arg2?: boolean,
    arg3?: unknown,
    args4?: boolean
  ) => void;
};

type State = {
  expTypeDescription: string;
  isDisableFASave: boolean;
};

export default class RecordItem extends React.Component<Props, State> {
  state = {
    expTypeDescription: '',
    isDisableFASave: false,
  };

  componentDidMount() {
    const {
      expReport,
      isFinanceApproval,
      readOnly,
      recordIdx,
      useImageQualityCheck,
      fileMetadata,
      fetchFileMetadata,
      toggleICCCCardAlert,
    } = this.props;
    const expTypeDescription = get(
      expReport,
      `records.${recordIdx}.items.0.expTypeDescription`,
      ''
    );
    this.setState({ expTypeDescription });

    const targetRecord = expReport.records[recordIdx];
    const receiptList = targetRecord && targetRecord.receiptList;
    if (!isEmpty(receiptList) && useImageQualityCheck) {
      const fetchMetadataList = [];
      receiptList.forEach((receipt) => {
        const contentDocumentId = receipt.receiptId;
        const selectedMetadata = fileMetadata.find(
          (x) => x.contentDocumentId === contentDocumentId
        );
        if (!selectedMetadata) fetchMetadataList.push(contentDocumentId);
      });
      if (!isEmpty(fetchMetadataList)) fetchFileMetadata(fetchMetadataList);
    }
    if (!isFinanceApproval && !readOnly) {
      toggleICCCCardAlert();
    }
    const isExistingRecord = get(targetRecord, 'recordId');
    if (isExistingRecord) this.setPaymentMethodOptionList(targetRecord);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const {
      expReport,
      isFinanceApproval,
      readOnly,
      recordIdx,
      fileMetadata,
      useImageQualityCheck,
      toggleICCCCardAlert,
    } = nextProps;
    const targetRecord = expReport.records[recordIdx];
    const currentRecord = this.props.expReport.records[this.props.recordIdx];
    const isChangeRecord = this.props.recordIdx !== recordIdx;
    if (isChangeRecord) {
      if (!isEmpty(nextProps.expenseTypeList)) {
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
      const isExistingRecord = get(targetRecord, 'recordId');
      if (isExistingRecord) this.setPaymentMethodOptionList(targetRecord);
      const isToggleICCCardAlert = !isFinanceApproval && !readOnly;
      if (isToggleICCCardAlert) toggleICCCCardAlert();
    }

    // fetch receipt metadata
    const currIdList = get(targetRecord, 'receiptList', []);
    const prevIdList = get(currentRecord, 'receiptList', []);
    const isChangeReceiptList = !isEqual(prevIdList, currIdList);
    if (
      !isEmpty(currIdList) &&
      useImageQualityCheck &&
      (isChangeRecord || isChangeReceiptList)
    ) {
      const fetchMetadataList = [];
      const receiptList = [...currIdList, ...prevIdList];
      receiptList.forEach((receipt) => {
        const contentDocumentId = receipt.receiptId;
        const selectedMetadata = fileMetadata.find(
          (x) => x.contentDocumentId === contentDocumentId
        );
        if (!selectedMetadata) fetchMetadataList.push(contentDocumentId);
      });
      if (!isEmpty(fetchMetadataList))
        nextProps.fetchFileMetadata(fetchMetadataList);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const {
      baseCurrencyDecimal,
      expRoundingSetting,
      expReport,
      recordIdx,
      updateRecord,
    } = this.props;
    const { expReport: preExpReport } = prevProps;
    const record = get(expReport, `records.${recordIdx}`, {});

    const { items = [] } = record;
    const isItemized = isItemizedRecord(items.length);

    if (isItemized) {
      const preRecord = get(preExpReport, `records.${recordIdx}`, {});
      const preParentItem = get(preRecord, `items.${0}`, {});
      const parentItem = get(record, `items.${0}`, {});

      const { currencyId: preCurrencyId, exchangeRate: preExchangeRate } =
        preParentItem;
      const { currencyId, exchangeRate } = parentItem;

      const isCurrencyChanged = preCurrencyId && preCurrencyId !== currencyId;
      const isExchangeRateChanged =
        !isNil(preExchangeRate) && preExchangeRate !== exchangeRate;

      if (isCurrencyChanged || isExchangeRateChanged) {
        const childItemList = calculateFCChildItemListAmount(
          baseCurrencyDecimal,
          expRoundingSetting,
          items
        );

        const itemList = [parentItem].concat(childItemList);
        updateRecord({
          items: itemList,
        });
      }
    }
  }

  componentWillUnmount() {
    const { toggleICCCCardAlert } = this.props;
    // hide IC/CC alert
    if (toggleICCCCardAlert) toggleICCCCardAlert(true);
  }

  onChangeJctRegistrationNo = (value: string) => {
    const targetRecord = `records[${this.props.recordIdx}]`;
    this.props.updateReport(
      `${targetRecord}.items.0.jctRegistrationNumber`,
      value
    );
  };

  onChangeSelectedJctInvoiceOption =
    (isRecordVendorVisible: boolean) => (optionValue: string) => {
      const { recordIdx, expReport } = this.props;
      const expRecord = expReport.records[recordIdx];
      const targetRecord = `records[${this.props.recordIdx}]`;
      const isInvoiceOption = optionValue === JCT_NUMBER_INVOICE.Invoice;
      const vendorJctRegistrationNumber = get(
        expRecord,
        'items[0].vendorJctRegistrationNumber'
      );

      // update jctInvoiceOption
      this.props.updateReport(
        `${targetRecord}.items.0.jctInvoiceOption`,
        optionValue
      );

      // update jctRegistrationNumber if vendorJctRegistrationNumber exists and jctRegistrationNumber is empty
      if (
        isInvoiceOption &&
        vendorJctRegistrationNumber &&
        isRecordVendorVisible
      ) {
        this.onChangeJctRegistrationNo(vendorJctRegistrationNumber);
      }
    };

  onChangePaymentMethod = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {
      availablePaymentMethodIds,
      expReport,
      isExpenseRequest,
      isFinanceApproval,
      isShowFACCAlert,
      paymentMethodList,
      recordIdx,
      toggleICCCCardAlert,
    } = this.props;
    const { value } = e.target;
    const record = expReport.records[recordIdx];
    const { creditCardTransactionId, paymentMethodId } = record;
    const isSelectedInactive =
      paymentMethodId && !availablePaymentMethodIds.includes(paymentMethodId);
    if (isSelectedInactive) {
      // remove prev selected inactive payment method from option list
      const recordCopy = { ...record };
      recordCopy.paymentMethodId = value;
      this.setPaymentMethodOptionList(recordCopy);
    }
    if (isFinanceApproval && !isExpenseRequest) {
      const hasError = isShowFACCAlert(value);
      this.setState({ isDisableFASave: hasError });
    }
    const touched: Touched = {
      paymentMethodId: true,
    };
    const isUnlinkCC = isUnlinkCCTrans(
      value,
      paymentMethodList,
      isCCRecord(record),
      isFinanceApproval
    );
    if (isUnlinkCC) {
      toggleICCCCardAlert(true);
      touched.creditCardTransactionId = true;
    }
    this.props.updateReport(
      `records[${recordIdx}]`,
      {
        ...record,
        paymentMethodId: value || null,
        creditCardTransactionId: isUnlinkCC ? null : creditCardTransactionId,
      },
      false,
      touched
    );
  };

  onRemoveFile = (
    deletedReceiptId: string,
    expRecord: Record,
    touched: Touched
  ) => {
    const { recordIdx, updateReport } = this.props;

    const tmpRecord = cloneDeep(expRecord);
    const tmpTouched = cloneDeep(touched);
    const { receiptList, ocrDate } = tmpRecord;
    const receiptListClone = cloneDeep(receiptList);
    tmpTouched.receiptList = true;

    const receiptIndex = receiptList.findIndex(
      ({ receiptId }) => receiptId === deletedReceiptId
    );
    const isOCRReceiptRemoved = receiptIndex === 0 && !isNil(ocrDate);

    receiptListClone.splice(receiptIndex, 1);
    tmpRecord.receiptList = receiptListClone;

    if (isOCRReceiptRemoved) {
      tmpRecord.ocrDate = null;
      tmpRecord.ocrAmount = null;
    }

    updateReport(`records[${recordIdx}]`, tmpRecord, false, tmpTouched);
  };

  setPaymentMethodOptionList = (record: Record) => {
    const {
      availablePaymentMethodIds,
      paymentMethodList,
      updatePaymentMethodOptionList,
    } = this.props;
    updatePaymentMethodOptionList(
      paymentMethodList,
      availablePaymentMethodIds,
      record
    );
  };

  getDiffItems = (
    recordItem: RecordItemType,
    preRecordItem: RecordItemType,
    fieldName: string
  ) => {
    const { expPreRequest, expReport } = this.props;
    // get costcenter/job values from report/pre-report if record does not have it
    const preValues = preRecordItem[fieldName] ? preRecordItem : expPreRequest;
    const values = recordItem[fieldName] ? recordItem : expReport;

    return {
      diffMapping: {
        [fieldName]: fieldName,
      },
      values,
      preValues,
    };
  };

  getDiffValues = (expRecord: Record): DifferenceValues => {
    const { selectedPreRecord, recordItemIdx = 0 } = this.props;
    let diffValues = {};
    if (selectedPreRecord) {
      const recordItem = expRecord.items[recordItemIdx];
      const preRecordItem = selectedPreRecord.items[recordItemIdx];

      const recordDiffMapping = { paymentMethodId: 'paymentMethodId' };
      const recordDiffValues = convertDifferenceValues(
        recordDiffMapping,
        expRecord,
        selectedPreRecord
      );

      const itemDiffMapping = {
        recordDate: 'recordDate',
        expTypeName: 'expTypeName',
        merchant: 'merchant',
        fixedAllowanceOptionId: 'fixedAllowanceOptionId',
      };
      const itemDiffValues = convertDifferenceValues(
        itemDiffMapping,
        recordItem,
        preRecordItem
      );

      // vendor
      const vendorDiffItems = this.getDiffItems(
        recordItem,
        preRecordItem,
        'vendorId'
      );
      const vendorDiffValues = convertDifferenceValues(
        vendorDiffItems.diffMapping,
        vendorDiffItems.values,
        vendorDiffItems.preValues
      );

      // payment due date
      const paymentDueDateDiffItems = this.getDiffItems(
        recordItem,
        preRecordItem,
        'paymentDueDate'
      );
      const paymentDueDateDiffValues = convertDifferenceValues(
        paymentDueDateDiffItems.diffMapping,
        paymentDueDateDiffItems.values,
        paymentDueDateDiffItems.preValues
      );

      // jct invoice option
      const jctInvoiceOptionDiffItems = this.getDiffItems(
        recordItem,
        preRecordItem,
        'jctInvoiceOption'
      );

      const jctInvoiceOptionDiffValues = convertDifferenceValues(
        jctInvoiceOptionDiffItems.diffMapping,
        jctInvoiceOptionDiffItems.values,
        jctInvoiceOptionDiffItems.preValues
      );

      // jct registration number
      const jctRegistrationNumberDiffItems = this.getDiffItems(
        recordItem,
        preRecordItem,
        'jctRegistrationNumber'
      );

      const jctRegistrationNumberDiffValues = convertDifferenceValues(
        jctRegistrationNumberDiffItems.diffMapping,
        jctRegistrationNumberDiffItems.values,
        jctRegistrationNumberDiffItems.preValues
      );

      diffValues = Object.assign(
        recordDiffValues,
        itemDiffValues,
        vendorDiffValues,
        paymentDueDateDiffValues,
        jctInvoiceOptionDiffValues,
        jctRegistrationNumberDiffValues
      );
      return diffValues;
    }
  };

  renderIcRecordContent = (contents: React.ReactElement, expRecord: Record) => {
    const transitIcRecordInfo = get(
      expRecord,
      'transitIcRecordInfo',
      {} as TransitIcRecordInfo
    );
    const detailDisplay = getDetailDisplay(transitIcRecordInfo);
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
        {contents}
        {detail}
      </>
    );
  };

  render() {
    const {
      displayCalendar,
      recordIdx,
      isFinanceApproval,
      isExpenseRequest,
      isRecordLoading,
      loadingAreas,
      expPreRequest,
      expReport,
      selectedPreRecord,
      isHighlightDiff,
      baseCurrencyDecimal,
      baseCurrencySymbol,
      recordItemIdx = 0,
      customHint,
      paymentMethodOptionList,
      selectedPaymentMethod,
      selectedCompanyId,
      paymentMethodList,
      useJctRegistrationNumber,
      readOnly,
      itemizationTabContainer: ItemizationTabContainer,
      jobCCEISumContainer: JobCCEISumContainer,
      onChangeEditingExpReport,
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

    const selectedExpenseType = (this.props.expenseTypeList || []).find(
      ({ id }) => id === expRecord.items[0].expTypeId
    );
    const itemizationSetting = get(
      selectedExpenseType,
      'itemizationSetting',
      ''
    );

    // Itemization
    const isShowItemizeTab = isShowItemizationTab(itemizationSetting);
    const isRequiredOrItemized = isRequiredOrItemizedRecord(
      itemizationSetting,
      expRecord.items.length
    );
    const hasItemizeRequiredError = !!get(
      this.props.errors,
      `records[${this.props.recordIdx}]items.0.expTypeItemizationSetting`
    );

    const useForeignCurrency = get(expRecord, 'items.0.useForeignCurrency');
    const decimalPlaces = useForeignCurrency
      ? get(expRecord, 'items.0.currencyInfo.decimalPlaces', 0)
      : baseCurrencyDecimal;

    const contentsCss = classNames({
      disabled: recordIdx === -1,
      hidden: !!isRecordLoading,
    });

    const contentsDisabled = this.props.readOnly || recordIdx === -1;

    // Receipt Logic
    const { fileAttachment } = expRecord;
    const isReceiptOptional = fileAttachment === RECEIPT_TYPE.Optional;
    const isReceiptDisabled = fileAttachment === RECEIPT_TYPE.NotUsed;

    const canRenderReceipt =
      isFinanceApproval && !isReceiptOptional
        ? !!expRecord.receiptFileId || !isEmpty(expRecord.receiptList)
        : !isReceiptDisabled;

    const isMerchantRequired =
      !isExpenseRequest && expRecord.merchantUsage === MERCHANT_USAGE.Required;

    // End Receipt Logic

    const isFADisabled = expReport.status !== status.APPROVED;
    const hasReportId = expReport.reportId;
    const hasPreRequestId = expReport.preRequestId;
    const isNewReportFromPreRequest = hasPreRequestId && !hasReportId;
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
    const paymentMethodError = get(
      this.props.errors,
      `records[${this.props.recordIdx}].paymentMethodId`,
      ''
    );
    const linkICCCError =
      get(
        this.props.errors,
        `records[${this.props.recordIdx}].transitIcRecordId`
      ) ||
      get(
        this.props.errors,
        `records[${this.props.recordIdx}].creditCardTransactionId`
      );

    // diff view
    const isHighlightNewRecord =
      isHighlightDiff && expRecord.expPreRequestRecordId === null;
    const diffValues =
      !isHighlightNewRecord && isHighlightDiff
        ? this.getDiffValues(expRecord)
        : {};

    let contents = null;
    switch (expRecord.recordType) {
      case 'General':
      case 'FixedAllowanceSingle':
      case 'FixedAllowanceMulti':
      case 'TransportICCardJP':
        contents = (
          <General
            customHint={customHint}
            expRecord={expRecord}
            expPreRecord={selectedPreRecord}
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
            isItemized={isRequiredOrItemized}
            isFixedAllowance={isFixedAllowance}
            isFinanceApproval={isFinanceApproval}
            isExpenseRequest={isExpenseRequest}
            isHighlightDiff={isHighlightDiff}
            isHighlightNewRecord={isHighlightNewRecord}
            fixedAmountMessage={(isFixedAllowance && fixedAmountMessage) || ''}
            recordItemIdx={recordItemIdx}
            selectedCompanyId={selectedCompanyId}
            updateRecord={this.props.updateRecord}
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
            expPreRecord={selectedPreRecord}
            isHighlightDiff={isHighlightDiff}
            isHighlightNewRecord={isHighlightNewRecord}
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
      case RECORD_TYPE.Mileage:
        const MileageContainer = this.props.mileageForm;
        contents = (
          <MileageContainer
            onChangeEditingExpReport={this.props.updateReport}
            expRecord={expRecord}
            expPreRecord={selectedPreRecord}
            targetRecord={targetRecord}
            readOnly={contentsDisabled}
            mileageUnit={this.props.mileageUnit}
            baseCurrencySymbol={this.props.baseCurrencySymbol}
            errors={this.props.errors}
            selectedCompanyId={selectedCompanyId}
            recordItemIdx={recordItemIdx}
            touched={touched}
            customHint={customHint}
            baseCurrencyCode={this.props.baseCurrencyCode}
            baseCurrencyDecimal={this.props.baseCurrencyDecimal}
            isFinanceApproval={isFinanceApproval}
            isExpenseRequest={isExpenseRequest}
            isHighlightDiff={isHighlightDiff}
            isHighlightNewRecord={isHighlightNewRecord}
            mode={this.props.mode}
            isLoading={this.props.isLoading}
            loadingAreas={loadingAreas}
          />
        );
        break;
      default:
        break;
    }

    const isRecordDateDisabled =
      this.props.readOnly ||
      (isIcRecord(expRecord.recordType) && !isExpenseRequest) ||
      isCCRecord(expRecord);

    const isMileage = isMileageRecord(expRecord.recordType);
    const needGenerateMapPreview =
      isMileage && this.props.needGenerateMapPreview;

    const isICOrCCRecordType =
      isIcRecord(expRecord.recordType) || isCCRecord(expRecord);

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
    const jctInvoiceOption = get(expRecord, 'items.0.jctInvoiceOption');
    const canAddReceipts = (() => {
      return !isFinanceApproval && !readOnly;
    })();

    const currentReportType = this.props.reportTypeList.find(
      (reportType) => reportType && reportType.id === expReport.expReportTypeId
    );
    const { isRecordVendorVisible, isRecordVendorRequired } =
      getDisplayOfRecordVendor(currentReportType);

    const isShowParentItemSummary = !canRenderReceipt || !canAddReceipts;

    const onDeleteFile = (receiptId: string) => {
      this.onRemoveFile(receiptId, expRecord, touched);
    };

    const recordTabContent = (
      <>
        {!!isRecordLoading && (
          <div className={`${ROOT}__contents`}>
            <RecordSkeleton />
          </div>
        )}

        <div className={`${ROOT}__contents ${contentsCss}`}>
          <MultiColumnsGrid sizeList={[6, 6]}>
            <div className={`${ROOT}__record-date`}>
              <RecordDate
                recordDate={expRecord.recordDate}
                className={classNames({
                  'highlight-bg':
                    isHighlightNewRecord ||
                    isDifferent('recordDate', diffValues),
                })}
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
            </div>
            <div className={`${ROOT}__exp-type`}>
              <TextField
                className={classNames(`${ROOT}__contents__expense-type`, {
                  'highlight-bg':
                    isHighlightNewRecord ||
                    isDifferent('expTypeName', diffValues),
                })}
                data-testid={`${ROOT}}__contents__expense-type`}
                value={expRecord.items[0].expTypeName}
                label={msg().Exp_Clbl_ExpenseType}
                isRequired
                disabled
              />
            </div>
          </MultiColumnsGrid>
          {this.state.expTypeDescription && (
            <div className={`${ROOT}__contents__expense-type-description`}>
              {this.state.expTypeDescription}
            </div>
          )}
          <MultiColumnsGrid sizeList={[6, 6]}>
            <></>
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
                  className={classNames({
                    'highlight-bg':
                      isHighlightNewRecord ||
                      isDifferent('fixedAllowanceOptionId', diffValues),
                  })}
                />
              )}
            </div>
          </MultiColumnsGrid>
          {isShowPaymentMethodField(
            paymentMethodList,
            expRecord,
            null,
            isExpenseRequest
          ) && (
            <>
              <div className={`${ROOT}--spacing-border`} />
              <div
                className={`${ROOT}__contents__payment-method ts-text-field-container`}
              >
                <MultiColumnsGrid
                  sizeList={[6, 6]}
                  alignments={['top', 'bottom']}
                >
                  <div>
                    <div className={`${ROOT}__payment-method`}>
                      <LabelWithHint
                        isRequired
                        text={msg().Exp_Clbl_PaymentMethod}
                        hintMsg={customHint.recordPaymentMethod}
                      />
                      <SelectField
                        className={classNames('ts-select-input', {
                          'highlight-bg':
                            isHighlightNewRecord ||
                            isDifferent('paymentMethodId', diffValues),
                        })}
                        onChange={this.onChangePaymentMethod}
                        options={paymentMethodOptionList}
                        value={expRecord.paymentMethodId}
                        disabled={
                          this.props.readOnly ||
                          (isICOrCCRecordType && isFinanceApproval)
                        }
                      />
                    </div>
                    <div className="input-feedback">
                      {paymentMethodError && msg()[paymentMethodError]}
                    </div>
                  </div>
                  {!isExpenseRequest && (
                    <ICCCLinkButton
                      cssRoot={ROOT}
                      errors={[linkICCCError]}
                      expRecord={expRecord}
                      isDisabled={this.props.readOnly || isFinanceApproval}
                      openCCTransactionDialog={
                        this.props.openCCTransactionDialog
                      }
                      openICTransactionDialog={
                        this.props.openICTransactionDialog
                      }
                      selectedExpenseType={selectedExpenseType}
                      selectedPaymentMethod={selectedPaymentMethod}
                      targetRecord={targetRecord}
                      updateReport={this.props.updateReport}
                    />
                  )}
                </MultiColumnsGrid>
              </div>
            </>
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
              readOnly={this.props.readOnly}
              errors={errors}
              fileMetadata={this.props.fileMetadata}
              setFieldError={this.props.setFieldError}
              setFieldTouched={this.props.setFieldTouched}
              touched={touched}
              onClickOpenLibraryButton={this.props.onClickOpenLibraryButton}
              onImageDrop={this.props.onImageDrop}
              onDeleteFile={onDeleteFile}
              maxReceipts={RECORD_ATTACHMENT_MAX_COUNT}
              canAddReceipts={canAddReceipts}
              summaryField={
                !isFinanceApproval && (
                  <Summary
                    value={expRecord.items[0].remarks}
                    className={classNames(`${ROOT}__summary`, {
                      'highlight-bg':
                        isHighlightNewRecord ||
                        isDifferent('remarks', diffValues),
                    })}
                    hintMsg={customHint.recordSummary}
                    onChangeEditingExpReport={this.props.updateReport}
                    readOnly={this.props.readOnly}
                    targetRecord={`${targetRecord}.items.${recordItemIdx}`}
                  />
                )
              }
            />
          )}
          {isUseMerchant(expRecord.merchantUsage) && (
            <RecordMerchant
              isHighlight={
                isHighlightNewRecord || isDifferent('merchant', diffValues)
              }
              readOnly={contentsDisabled}
              expRecord={expRecord}
              isRequired={isMerchantRequired}
              merchantError={merchantError}
              showVendorFilter={this.props.showVendorFilter}
              targetRecord={targetRecord}
              value={expRecord.items[0].merchant || ''}
              toggleVendorDetail={this.props.toggleVendorDetail}
              onClickVendorSearch={() =>
                this.props.onClickVendorSearch(vendorBackTypes.RECORD_MERCHANT)
              }
              getRecentVendors={this.props.getRecentVendors}
              searchVendors={this.props.searchVendors}
              updateReport={this.props.updateReport}
            />
          )}
          {isRecordVendorVisible && !isJorudanRecord(expRecord.recordType) && (
            <RecordVendor
              isHighlight={(key: string) =>
                isHighlightNewRecord || isDifferent(key, diffValues)
              }
              isRequired={isRecordVendorRequired}
              expRecord={expRecord}
              readOnly={this.props.readOnly}
              recordIdx={this.props.recordIdx}
              errors={this.props.errors}
              showVendorFilter={this.props.showVendorFilter}
              toggleVendorDetail={this.props.toggleVendorDetail}
              onClickVendorSearch={() =>
                this.props.onClickVendorSearch(vendorBackTypes.RECORD_VENDOR)
              }
              getRecentVendors={this.props.getRecentVendors}
              searchVendors={this.props.searchVendors}
              onChangeUpdateReport={this.props.updateReport}
              useJctRegistrationNumber={useJctRegistrationNumber}
              shouldUpdateJctRegistrationNumber={isShowJctRegistrationNumber}
            />
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
              onChangeRadio={this.onChangeSelectedJctInvoiceOption(
                isRecordVendorVisible
              )}
              isShowJctRegistrationNumber={isShowJctRegistrationNumber}
              expRecord={expRecord}
              getHighlightDiff={(fieldName: string) =>
                isHighlightNewRecord || isDifferent(fieldName, diffValues)
              }
              hasRecordVendor={isRecordVendorVisible}
            />
          )}
          <JobCCEISumContainer
            customHint={customHint}
            errors={errors}
            expPreRequest={expPreRequest}
            expRecord={expRecord}
            expReport={expReport}
            isFinanceApproval={isFinanceApproval}
            isHighlightDiff={isHighlightDiff}
            isHighlightNewRecord={isHighlightNewRecord}
            isShowParentItemSummary={isShowParentItemSummary}
            preRecordItem={get(selectedPreRecord, 'items.0', {})}
            readOnly={this.props.readOnly}
            recordIdx={recordIdx}
            recordItemIdx={recordItemIdx}
            targetRecord={targetRecord}
            touched={touched}
            onChangeEditingExpReport={onChangeEditingExpReport}
          />
        </div>
      </>
    );

    return (
      <ActiveDialogProvider>
        {!isFinanceApproval && displayCalendar && (
          <div className={`${ROOT}__calendar`}>
            <CalendarContainer
              isLoading={this.props.isLoading}
              isRecordLoading={isRecordLoading}
              loadingAreas={loadingAreas}
              targetDate={expRecord.recordDate}
            />
          </div>
        )}
        <div className="ts-expenses-requests slds">
          <Tabs
            actionButtonContent={
              <ActionButtons
                hasItemizeRequiredError={hasItemizeRequiredError}
                mode={this.props.mode}
                isDisabled={isFADisabled}
                isExpenseReportDisabled={this.props.readOnly}
                isFASaveDisabled={this.state.isDisableFASave}
                isNewReportFromPreRequest={!!isNewReportFromPreRequest}
                isExpTypeDisableSave={isTransitJorudan}
                isFinanceApproval={isFinanceApproval}
                isTotalAmountMatch={getTotalAmountMatch(
                  baseCurrencyDecimal,
                  expRecord
                )}
                onClickEditButton={this.props.reportEdit}
                onClickBackButton={this.props.onClickHideRecordButton}
                onClickSaveButton={() =>
                  this.props.onClickSaveButton(
                    isCCPaymentMethod(selectedPaymentMethod.integrationService)
                  )
                }
                isLoading={this.props.isLoading}
                isRecordLoading={this.props.isRecordLoading}
                needGenerateMapPreview={needGenerateMapPreview}
              />
            }
            attachmentContent={
              <Attachment
                isExpense={!isExpenseRequest}
                isFinanceApproval={isFinanceApproval}
                readOnly={readOnly}
                record={expRecord}
                onDeleteFile={onDeleteFile}
                openReceiptLibraryDialog={this.props.onClickOpenLibraryButton}
              />
            }
            itemizationTabContent={
              isShowItemizeTab && (
                <ItemizationTabContainer
                  customHint={customHint}
                  errors={this.props.errors}
                  expPreRecord={selectedPreRecord}
                  expPreRequest={expPreRequest}
                  expRecord={expRecord}
                  expReport={expReport}
                  fixedAmountMessage={fixedAmountMessage}
                  isExpenseRequest={isExpenseRequest}
                  isFinanceApproval={isFinanceApproval}
                  isFixedAllowance={isFixedAllowance}
                  isHighlightDiff={isHighlightDiff}
                  isHighlightNewRecord={isHighlightNewRecord}
                  readOnly={this.props.readOnly}
                  recordIdx={recordIdx}
                  touched={touched}
                  onChangeEditingExpReport={onChangeEditingExpReport}
                  updateRecord={this.props.updateRecord}
                  baseCurrencyCode={this.props.baseCurrencyCode}
                  baseCurrencyDecimal={this.props.baseCurrencyDecimal}
                  baseCurrencySymbol={this.props.baseCurrencySymbol}
                />
              )
            }
            errors={errors}
            hasItemizeRequiredError={hasItemizeRequiredError}
            recordIdx={recordIdx}
            recordTabContent={recordTabContent}
            touched={touched}
          />
        </div>
        <AttachmentPreview
          expRecord={expRecord}
          isFinanceApproval={isFinanceApproval}
          readOnly={readOnly}
          onDeleteFile={onDeleteFile}
        />
        <ToastContainer />
      </ActiveDialogProvider>
    );
  }
}
