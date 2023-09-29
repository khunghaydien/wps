import React, { useState } from 'react';
// @ts-ignore
import { RouterHistory } from 'react-router-dom';

import { Form } from 'formik';
import {
  cloneDeep,
  concat,
  drop,
  find,
  get,
  isEmpty,
  isNil,
  set,
} from 'lodash';
import moment from 'moment';

import { goBack } from '@mobile/concerns/routingHistory';

import CheckActive from '@commons/images/icons/check-active.svg';
import msg from '@commons/languages';
import { ErrorInfo } from '@commons/utils/AppPermissionUtil';
import DateUtil from '@commons/utils/DateUtil';
import { updateValues } from '@commons/utils/FormikUtils';
import TextUtil from '@commons/utils/TextUtil';
import Dialog from '@mobile/components/molecules/commons/Dialog';
import LikeInputButtonField from '@mobile/components/molecules/commons/Fields/LikeInputButtonField';
import SFDateField from '@mobile/components/molecules/commons/Fields/SFDateField';
import TextField from '@mobile/components/molecules/commons/Fields/TextField';
import Navigation from '@mobile/components/molecules/commons/Navigation';
import ViewItem from '@mobile/components/molecules/commons/ViewItem';
import WrapperWithPermission from '@mobile/components/organisms/commons/WrapperWithPermission';

import { LatestCostCenter } from '@apps/domain/models/exp/CostCenter';
import { CustomHint } from '@apps/domain/models/exp/CustomHint';
import {
  AmountOption,
  ExpenseType,
  ExpenseTypeList,
} from '@apps/domain/models/exp/ExpenseType';
import {
  calcAmountFromRate,
  CurrencyList,
  RoundingType,
} from '@apps/domain/models/exp/foreign-currency/Currency';
import { ExchangeRate } from '@apps/domain/models/exp/foreign-currency/ExchangeRate';
import {
  isUseJctNo,
  JCT_REGISTRATION_NUMBER_USAGE,
} from '@apps/domain/models/exp/JCTNo';
import {
  isUseMerchant,
  MERCHANT_USAGE,
} from '@apps/domain/models/exp/Merchant';
import { Base64FileList, FileMetadata } from '@apps/domain/models/exp/Receipt';
import {
  calcItemsTotalAmount,
  isCCRecord,
  isHotelFee,
  isIcRecord,
  newRecordItem,
  Record,
  RECORD_TYPE,
  RecordItem,
} from '@apps/domain/models/exp/Record';
import { Report } from '@apps/domain/models/exp/Report';
import {
  AmountInputMode,
  calcAmountFromTaxExcluded,
  calcTaxFromGstVat,
  calculateTax,
  ExpTaxTypeList,
} from '@apps/domain/models/exp/TaxType';
import {
  getDetailDisplay,
  TransitIcRecordInfo,
} from '@apps/domain/models/exp/TransportICCard';

import { Props as ExchangeRateMapProp } from '@mobile/modules/expense/entities/exchangeRate';

import { AppAction } from '@apps/mobile-app/action-dispatchers/AppThunk';

import Errors from '@mobile/components/atoms/Errors';
import IconButton from '@mobile/components/atoms/IconButton';
import TextButton from '@mobile/components/atoms/TextButton';
import CloneCalendarDialog, {
  CALENDAR_CLONE,
} from '@mobile/components/organisms/expense/CloneCalendarDialog';
import CloneNumberDialog, {
  NUMBER_CLONE,
} from '@mobile/components/organisms/expense/CloneNumberDialog';
import FooterOptionsModal, {
  FOOTER_MODAL,
} from '@mobile/components/organisms/expense/FooterOptionsModal';

import AmountArea from './AmountArea';
import Attachment from './Attachment';
import ChildExpTypeField, {
  Props as ChildExpTypeProps,
} from './ChildExpTypeField';
import ExtendedItem from './ExtendedItem';
import FixedAmountSelectionArea from './FixedAmountSelectionArea';
import ForeignCurrencyArea, {
  ForeignCurrencyProps,
} from './ForeignCurrencyArea';
import RecordInvoice from './Invoice';
import ItemsArea from './ItemsArea';

import './index.scss';

const ROOT = 'mobile-app-pages-expense-page-record-new-general';

// To keep track of which screen opened record
export const UI_TYPE = {
  ADD: 'add', // New record through `Add Record` in Report Detail page
  REPORT_LIST: 'reportList', // View or Edit record through record list inside Report Detail page
};

type Props = ForeignCurrencyProps & {
  language: string;
  companyId: string;
  report: Report;
  taxTypeList: ExpTaxTypeList;
  isNotEditable: boolean;
  isUnderApprovedPreRequest: boolean;
  reportDiscarded?: boolean;
  reportClaimed?: boolean;
  childExpTypes: ExpenseTypeList;
  values: Record;
  rate: number;
  type: string;
  errors: Record;
  touched: Record;
  expRoundingSetting: RoundingType;
  taxRoundingSetting: RoundingType;
  allowTaxExcludedAmount: boolean;
  allowTaxAmountChange: boolean;
  useTransitManager: boolean;
  useImageQualityCheck: boolean;
  selectedMetadata: FileMetadata;
  currencyDecimalPlace: number;
  currencySymbol: string;
  currencyList: CurrencyList;
  exchangeRateMap: ExchangeRateMapProp;
  readOnly: boolean;
  hasPermissionError: ErrorInfo | null;
  selectedExpType: ExpenseType;
  history: RouterHistory;
  jctInvoiceManagement?: boolean;
  setFieldTouched: (
    arg0: string,
    arg1: { [key: string]: unknown } | boolean,
    arg2?: boolean
  ) => void;
  validateForm: () => void;
  setFieldValue: (key: string, value: any, arg2: boolean) => void;
  setValues: (value: any) => void;
  setTouched: (value: any) => void;
  setRate: (arg0: number) => void;
  saveFormValues: (arg0: Record) => void;
  saveItemValues: (RecordItem) => void;
  clearItemValues: () => void;
  handleSubmit: () => void;
  onDeleteClick: () => void;
  onClickEditButton: () => void;
  onBackClick: () => void;
  onClickSearchExpType: () => void;
  onClickSearchCustomEI: (
    arg0: string,
    arg1: string,
    arg2: string,
    arg3: string
  ) => void;
  showConfirm: (string) => Promise<boolean>;
  getBase64files: (
    e: React.FormEvent<HTMLInputElement>
  ) => AppAction<Promise<Base64FileList>>;
  uploadReceipts: (list: Base64FileList) => AppAction<
    Promise<{
      contentVersionId: string;
      contentDocumentId: string;
    }>
  >;
  // Custom Hint
  activeHints: Array<string>;
  customHints: CustomHint;
  onClickHint: (arg0: string) => void;
  onClickSearchCostCenter: (arg0: string) => void;
  onClickSearchJob: (arg0: string) => void;
  getLatestHistoryCostCenter: (
    historyId: string,
    targetDate: string
  ) => Promise<LatestCostCenter | boolean>;
  getRateFromId: (
    arg0: string,
    arg1: string,
    arg2: string
  ) => AppAction<Promise<ExchangeRate>>;
  getTaxTypeList: (
    arg0: string,
    arg1: string
  ) => AppAction<Promise<ExpTaxTypeList>>;
  openReceiptLibrary: () => void;
  clearSelectedExpType: () => void;
  onClickCloneRecord: (cloneTimes?: number, targetDates?: string[]) => void;
  onClickLinkBtn: (values: Record) => void;
  getExchangeRate: (currencyId: string, recordDate: string) => Promise<number>;
  onClickAddItem: (values: Record) => void;
  onClickChildItem: (idx: number, values: Record) => void;
  saveFileMetadata: (fileMetadata: FileMetadata) => void;
  searchExpTypesByParentRecord: (targetDate: string, expTypeId: string) => void;
  isRequest?: boolean;
} & ChildExpTypeProps;

const renderBackButton = (type, onBackClick, isItem) => {
  const hasBackBtn =
    isItem || [UI_TYPE.ADD, UI_TYPE.REPORT_LIST].includes(type);
  return hasBackBtn ? onBackClick : undefined;
};

const DELETE = 'delete';

type Modal =
  | ''
  | typeof DELETE
  | typeof FOOTER_MODAL
  | typeof CALENDAR_CLONE
  | typeof NUMBER_CLONE;

const Recordform = (props: Props) => {
  const [modal, setModal] = useState<Modal>('');

  const {
    values,
    type,
    readOnly,
    report,
    selectedExpType,
    isNotEditable,
    itemIdx = 0,
    onBackClick,
    setFieldValue,
    saveFormValues,
    saveItemValues,
    setValues,
    setTouched,
    onClickCloneRecord,
    isRequest,
  } = props;

  const onSearchClick = () => {
    setFieldValue('recordId', values.recordId, false);
    saveFormValues(values);
    props.onClickSearchExpType();
  };

  const onSearchJob = () => {
    setFieldValue('items.0.jobName', values.items[0].jobName, false);
    saveFormValues(values);
    props.onClickSearchJob(values.recordDate);
  };

  const onSearchCostCenter = () => {
    setFieldValue(
      'items.0.costCenterName',
      values.items[0].costCenterName,
      false
    );
    saveFormValues(values);
    props.onClickSearchCostCenter(values.recordDate);
  };

  const onChangeValue = (field: string) => (e: any) => {
    setFieldValue(field, e.target.value, true);
    props.setFieldTouched(field, false);
  };

  const onChangeUpdateValues = (updateObj: any) => {
    const { values, touched } = updateValues(
      props.values,
      props.touched,
      updateObj
    );
    setTouched(touched);
    setValues(values);
  };

  const onChangeJctRegistrationNo = (value: string) => {
    const updateValues = {
      'items.0.jctRegistrationNumber': value,
    };
    onChangeUpdateValues(updateValues);
  };

  const onChangeSelectedJctInvoiceOption = (optionValue: string) => {
    const updateValues = {
      'items.0.jctInvoiceOption': optionValue,
    };
    onChangeUpdateValues(updateValues);
  };

  const onOpenReceiptLibrary = () => {
    saveFormValues(values);
    props.openReceiptLibrary();
  };

  const onClickAddItem = () => {
    props.onClickAddItem(values);
  };

  const handleDateChange = async (
    e: React.FormEvent<HTMLElement>,
    data: any
  ) => {
    const formattedDate = moment(data.date).format('YYYY-MM-DD');
    const values = cloneDeep(props.values);
    values.items[itemIdx].recordDate = formattedDate;
    if (itemIdx === 0) {
      values.recordDate = formattedDate;
    }

    const expType = values.items[itemIdx].expTypeId;
    /*
    when change date with a selected expense type,
    if expense type is valid on the targeted date,
    skip record reset but only update date, tax/exchange rate
    */
    const { validDateFrom = '', validDateTo = '' } = props.selectedExpType;
    const isInRange = DateUtil.inRange(data.date, validDateFrom, validDateTo);
    if (!isInRange && itemIdx === 0) {
      props.clearSelectedExpType();
      values.items[0] = newRecordItem(
        '',
        '',
        false,
        null,
        true,
        '',
        '',
        0,
        formattedDate
      ) as RecordItem;
      values.withoutTax = 0;
    } else if (!isParentHotel) {
      const {
        companyId,
        getTaxTypeList,
        getRateFromId,
        currencyDecimalPlace,
        expRoundingSetting,
        taxRoundingSetting,
        currencyList,
      } = props;
      if (values.items[0].useForeignCurrency) {
        const currencyId = values.items[0].currencyId || currencyList[0].id;
        const rateList = await getRateFromId(
          companyId,
          currencyId,
          formattedDate
        );
        const rate = rateList[0];
        values.items[itemIdx].exchangeRate = rate;
        values.items[itemIdx].originalExchangeRate = rate;
        values.items[itemIdx].exchangeRateManual = rate === 0;
        const amount = Number(
          calcAmountFromRate(
            rate,
            values.items[itemIdx].localAmount,
            currencyDecimalPlace,
            expRoundingSetting
          )
        );
        if (itemIdx === 0) {
          values.amount = amount;
        }
        values.items[itemIdx].amount = amount;
      } else if (expType) {
        // if no exp type on record/item, skip tax update
        const tax = await getTaxTypeList(
          values.items[itemIdx].expTypeId,
          formattedDate
        );

        const taxList = get(tax, '0.payload', [{}]);

        const {
          rate = 0,
          baseId,
          historyId,
          name,
        } = find(taxList, {
          historyId: values.items[itemIdx].taxTypeHistoryId,
        }) ||
        find(taxList, {
          baseId: values.items[itemIdx].taxTypeBaseId,
        }) ||
        taxList[0];

        values.items[itemIdx].taxTypeBaseId = baseId;
        values.items[itemIdx].taxTypeHistoryId = historyId;
        values.items[itemIdx].taxTypeName = name;
        values.items[itemIdx].taxRate = rate;

        props.setRate(rate);

        if (values.items[itemIdx].taxManual) {
          // keep existing amount info
        } else if (values.amountInputMode === AmountInputMode.TaxIncluded) {
          const { amountWithoutTax, gstVat } = calculateTax(
            rate,
            values.items[itemIdx].amount,
            currencyDecimalPlace,
            taxRoundingSetting
          );
          values.items[itemIdx].withoutTax = amountWithoutTax;
          values.items[itemIdx].gstVat = gstVat;
          if (itemIdx === 0) {
            values.withoutTax = amountWithoutTax;
          }
        } else {
          const { amountWithTax, gstVat } = calcAmountFromTaxExcluded(
            rate,
            values.items[itemIdx].withoutTax,
            props.currencyDecimalPlace,
            props.taxRoundingSetting
          );
          values.items[itemIdx].amount = amountWithTax;
          values.items[itemIdx].gstVat = gstVat;
          if (itemIdx === 0) {
            values.amount = amountWithTax;
          }
        }
      }
    }
    if (itemIdx === 0) {
      // get cc latest revised name
      const { costCenterHistoryId, recordDate } = values.items[0];
      const currentCCHistoryId =
        costCenterHistoryId || report.costCenterHistoryId;
      if (currentCCHistoryId) {
        const latestCostCenter = await props.getLatestHistoryCostCenter(
          currentCCHistoryId,
          recordDate
        );
        const { baseCode, id, name } =
          latestCostCenter[0] || ({} as LatestCostCenter);
        values.items[0].costCenterCode = baseCode;
        values.items[0].costCenterHistoryId = id;
        values.items[0].costCenterName = name;
      }
    }
    setValues(values);
    setTouched({ recordDate: true });
  };

  const setError = (field: string) => {
    const errors = get(props.errors, field);
    const isFieldTouched = get(props.touched, field);
    return errors && isFieldTouched ? [errors] : [];
  };

  const getCustomHintProps = (fieldName: string) => ({
    hintMsg: !readOnly ? props.customHints[fieldName] : '',
    isShowHint: props.activeHints.includes(fieldName),
    onClickHint: () => props.onClickHint(fieldName),
  });

  const renderEditAndDotBtn = () => {
    const {
      isUnderApprovedPreRequest,
      reportDiscarded,
      reportClaimed,
      readOnly,
    } = props;

    if (isUnderApprovedPreRequest || reportDiscarded || reportClaimed) {
      return [];
    } else if (readOnly) {
      return [
        <TextButton
          key="edit"
          type="submit"
          disabled={isNotEditable}
          onClick={props.onClickEditButton}
        >
          {msg().Com_Btn_Edit}
        </TextButton>,
        <IconButton
          key="more"
          size="small"
          className={`${ROOT}__actions-btn`}
          icon="threedots_vertical"
          onClick={() => setModal(FOOTER_MODAL)}
        />,
      ];
    } else {
      return [];
    }
  };

  const isRecordTypeIc = isIcRecord(values.recordType);
  const isRecordTypeHotel = isHotelFee(values.recordType);
  const isRecordCC = isCCRecord(values);
  const isItem = !!itemIdx;
  const isParentHotel = isRecordTypeHotel && itemIdx === 0;

  const childItems = drop(values.items);
  const hasChildItems = childItems && childItems.length > 0;

  // update all child record items as touched
  const updateTouchedForItems = () => {
    const item = values.items[itemIdx];
    const tmpTouched = {};
    Object.keys(item).forEach((key) => {
      set(tmpTouched, `items.${itemIdx}.${key}`, true);
    });
    setTouched(tmpTouched);
  };

  const getUpdatedFCRecord = (record: Record) => {
    const updatedRecord = cloneDeep(record);
    const childItems = drop(updatedRecord.items);
    const totalAmount = calcItemsTotalAmount(
      childItems,
      'amount',
      props.currencyDecimalPlace
    );
    updatedRecord.amount = totalAmount;
    updatedRecord.items[0].amount = totalAmount;
    return updatedRecord;
  };

  const getUpdatedBCRecord = (record: Record) => {
    const { currencyDecimalPlace } = props;
    const updatedRecord = cloneDeep(record);
    const childItems = drop(updatedRecord.items);
    const isTaxIncluded =
      record.amountInputMode === AmountInputMode.TaxIncluded;
    const totalGstVat = calcItemsTotalAmount(
      childItems,
      'gstVat',
      currencyDecimalPlace
    );
    const totalAmount = calcItemsTotalAmount(
      childItems,
      'amount',
      currencyDecimalPlace
    );
    const totalWithoutTax = calcItemsTotalAmount(
      childItems,
      'withoutTax',
      currencyDecimalPlace
    );
    const calculatedAmount = calcTaxFromGstVat(
      totalGstVat,
      isTaxIncluded ? totalAmount : totalWithoutTax,
      currencyDecimalPlace,
      isTaxIncluded
    );

    if (isTaxIncluded) {
      updatedRecord.withoutTax = Number(calculatedAmount.amountWithoutTax);
      updatedRecord.items[0].withoutTax = Number(
        calculatedAmount.amountWithoutTax
      );
    } else {
      updatedRecord.amount = Number(calculatedAmount.amountWithTax);
      updatedRecord.items[0].amount = Number(calculatedAmount.amountWithTax);
    }
    updatedRecord.items[0].gstVat = totalGstVat;

    return updatedRecord;
  };

  const onSaveChildItem = async () => {
    updateTouchedForItems();
    // save item value if no error for THIS item
    const errorsRes = await props.validateForm();
    const itemErrors = get(errorsRes, `items.${itemIdx}`);
    if (isEmpty(itemErrors)) {
      const useForeignCurrency = get(values, 'items.0.useForeignCurrency');
      const updatedRecord = useForeignCurrency
        ? getUpdatedFCRecord(values)
        : getUpdatedBCRecord(values);
      props.saveFormValues(updatedRecord);
      props.clearItemValues();
      goBack(props.history);
    }
  };

  const onClickSave = () => {
    return itemIdx > 0 ? onSaveChildItem() : props.handleSubmit();
  };

  const onClickDeleteItem = () => {
    const record = cloneDeep(values);
    // remove this item
    record.items.splice(itemIdx, 1);
    // update record amount info
    const useForeignCurrency = get(record, 'items.0.useForeignCurrency');
    const updatedRecord = useForeignCurrency
      ? getUpdatedFCRecord(record)
      : getUpdatedBCRecord(record);
    props.saveFormValues(updatedRecord);
    props.clearItemValues();
    goBack(props.history);
  };

  const renderBtnsEditMode = () => {
    const btns = [];
    if (!props.readOnly) {
      if (itemIdx > 0) {
        const deleteItemBtn = (
          <TextButton
            type="submit"
            key="deleteItem"
            onClick={onClickDeleteItem}
          >
            {msg().Com_Btn_Delete}
          </TextButton>
        );
        btns.push(deleteItemBtn);
      }
      const saveBtn = (
        <TextButton type="submit" key="save" onClick={onClickSave}>
          {msg().Com_Btn_Save}
        </TextButton>
      );
      btns.push(saveBtn);
    }
    return btns;
  };

  const renderBaseCurrencyArea = (isRecordTypeIc: boolean) => (
    <AmountArea
      rate={props.rate}
      setError={setError}
      values={values}
      itemIdx={itemIdx}
      showConfirm={props.showConfirm}
      hasChildItems={hasChildItems}
      onChangeUpdateValues={onChangeUpdateValues}
      currencyDecimalPlace={props.currencyDecimalPlace}
      currencySymbol={props.currencySymbol}
      readOnly={props.readOnly || (isRecordTypeIc && !isRequest)}
      isRecordTypeIc={isRecordTypeIc}
      isRecordCC={isRecordCC}
      isRecordTypeHotel={isRecordTypeHotel}
      taxTypeList={props.taxTypeList}
      taxRoundingSetting={props.taxRoundingSetting}
      setRate={props.setRate}
      allowTaxExcludedAmount={props.allowTaxExcludedAmount}
      allowTaxAmountChange={props.allowTaxAmountChange}
      baseCurrencyDecimal={props.currencyDecimalPlace}
    />
  );

  const renderForeignCurrencyArea = () => (
    <ForeignCurrencyArea
      values={values}
      itemIdx={itemIdx}
      isParentHotel={isParentHotel}
      hasChildItems={hasChildItems}
      isRecordTypeHotel={isRecordTypeHotel}
      readOnly={props.readOnly}
      expRoundingSetting={props.expRoundingSetting}
      baseCurrencyDecimal={props.currencyDecimalPlace}
      baseCurrencySymbol={props.currencySymbol}
      currencyList={props.currencyList}
      exchangeRateMap={props.exchangeRateMap}
      onChangeUpdateValues={onChangeUpdateValues}
      getExchangeRate={props.getExchangeRate}
      setError={setError}
    />
  );

  const renderICBtn = () => {
    const isNotLinked = !values.transitIcRecordId;
    const isLinkBtnDisabled = readOnly || !props.useTransitManager;

    const btn = isNotLinked && (
      <TextButton
        onClick={() => props.onClickLinkBtn(values)}
        className={`${ROOT}__ic-link-btn`}
        disabled={isLinkBtnDisabled}
      >
        {msg().Exp_Btn_LinkIcCardTransaction}
      </TextButton>
    );

    const linkError = setError('transitIcRecordId');
    const feedback = <Errors messages={linkError} />;
    return (
      <>
        {btn}
        {feedback}
      </>
    );
  };

  const renderICField = () => {
    const transitIcRecordInfo = get(
      values,
      'transitIcRecordInfo',
      {} as TransitIcRecordInfo
    );
    const detailDisplay = getDetailDisplay(transitIcRecordInfo);
    const field = (
      <ViewItem label={msg().Exp_Lbl_Detail}>{detailDisplay}</ViewItem>
    );

    return field;
  };

  const isDisabledExpenseType =
    isEmpty(values.recordDate) ||
    readOnly ||
    isRecordTypeIc ||
    isRecordCC ||
    (isParentHotel && hasChildItems) ||
    !isNil(values.ocrAmount);

  const isDisabledCcJob = isEmpty(values.recordDate) || readOnly;

  const expType =
    itemIdx > 0 ? (
      <ChildExpTypeField
        values={values}
        itemIdx={itemIdx}
        childExpTypes={props.childExpTypes}
        searchExpTypesByParentRecord={props.searchExpTypesByParentRecord}
        setValues={setValues}
        getTaxTypeList={props.getTaxTypeList}
        currencyDecimalPlace={props.currencyDecimalPlace}
        taxRoundingSetting={props.taxRoundingSetting}
        setFieldTouched={props.setFieldTouched}
        setRate={props.setRate}
        errors={setError(`items.${itemIdx}.expTypeName`)}
      />
    ) : (
      <LikeInputButtonField
        required
        disabled={isDisabledExpenseType}
        errors={setError(`items.${itemIdx}.expTypeName`)}
        onClick={onSearchClick}
        value={values.items[itemIdx].expTypeName || ''}
        label={msg().Exp_Clbl_ExpenseType}
        {...getCustomHintProps('recordExpenseType')}
      />
    );

  const { jobId, costCenterHistoryId } = report;
  let { jobName, costCenterName } = report;
  if (values.items[0].jobId) {
    jobName = values.items[0].jobName;
  }
  if (values.items[0].costCenterHistoryId) {
    costCenterName = values.items[0].costCenterName;
  }

  const fixedAllowanceOptionList: Array<AmountOption> | null | undefined = get(
    selectedExpType,
    'fixedAllowanceOptionList',
    []
  );
  const isForeignCurrency = values.items[0].useForeignCurrency;

  const onClickCloneByDate = () => {
    setModal(CALENDAR_CLONE);
  };

  const onClickCloneByNumber = () => {
    setModal(NUMBER_CLONE);
  };

  const onClickDelete = () => {
    setModal(DELETE);
  };

  const closeModal = () => {
    setModal('');
  };

  const isMerchantRequired =
    !isRequest && values.merchantUsage === MERCHANT_USAGE.Required;
  const ocrDate = values.ocrDate;
  const isDateMatch = ocrDate === values.items[0].recordDate;
  const cssDateClass = isDateMatch ? 'ok' : '';
  const dateBaseMsg = isDateMatch
    ? msg().Exp_Msg_MatchedWithReceipt
    : msg().Exp_Msg_ManuallyEntered;
  const dateMsg = TextUtil.template(dateBaseMsg, msg().Exp_Clbl_Date);

  const title = isItem
    ? msg().Exp_Lbl_RecordItem
    : type !== 'new'
    ? msg().Exp_Lbl_Records
    : msg().Exp_Lbl_NewRecord;

  const jctRegistrationNumberUsage = get(
    selectedExpType,
    'jctRegistrationNumberUsage',
    JCT_REGISTRATION_NUMBER_USAGE.NotUsed
  );
  const isShowRecordInvoice =
    !isItem &&
    props.jctInvoiceManagement &&
    isUseJctNo(jctRegistrationNumberUsage);
  const isShowJctRegistrationNumber = get(
    selectedExpType,
    'displayJctNumberInput',
    false
  );

  return (
    <WrapperWithPermission
      className={ROOT}
      hasPermissionError={props.hasPermissionError}
    >
      <Navigation
        backButtonLabel={msg().Com_Lbl_Back}
        onClickBack={renderBackButton(type, onBackClick, isItem)}
        title={title}
        actions={concat(renderEditAndDotBtn(), renderBtnsEditMode())}
      />
      <Form className="main-content">
        <SFDateField
          required
          disabled={props.readOnly || isRecordTypeIc || isRecordCC}
          label={msg().Exp_Clbl_Date}
          errors={setError(`items.${itemIdx}.recordDate`)}
          onChange={handleDateChange}
          value={values.items[itemIdx].recordDate}
          {...getCustomHintProps('recordDate')}
        />

        {!isNil(ocrDate) && (
          <div className={`input-feedback ${cssDateClass}`}>
            {isDateMatch && <CheckActive className="input-feedback-icon-ok" />}
            {dateMsg}
          </div>
        )}

        {expType}

        {values.recordType === RECORD_TYPE.FixedAllowanceMulti && (
          <FixedAmountSelectionArea
            rate={props.rate}
            values={values}
            fixedAllowanceOptionList={fixedAllowanceOptionList}
            currencySymbol={props.currencySymbol}
            readOnly={props.readOnly}
            errors={setError('items.0.fixedAllowanceOptionId')}
            onChangeUpdateValues={onChangeUpdateValues}
            decimalPlaces={props.currencyDecimalPlace}
            expRoundingSetting={props.expRoundingSetting}
            taxRoundingSetting={props.taxRoundingSetting}
          />
        )}

        {!isRequest && isRecordTypeIc && !readOnly && renderICBtn()}

        {isForeignCurrency
          ? renderForeignCurrencyArea()
          : renderBaseCurrencyArea(isRecordTypeIc)}

        {isRecordTypeIc && renderICField()}

        {costCenterHistoryId && !isItem && (
          <LikeInputButtonField
            required
            disabled={isDisabledCcJob}
            errors={setError('items.0.costCenterName')}
            onClick={() => onSearchCostCenter()}
            value={costCenterName || ''}
            label={msg().Exp_Clbl_CostCenter}
            {...getCustomHintProps('recordCostCenter')}
          />
        )}
        {jobId && !isItem && (
          <LikeInputButtonField
            required
            disabled={isDisabledCcJob}
            errors={setError('items.0.jobName')}
            onClick={() => onSearchJob()}
            value={jobName || ''}
            label={msg().Exp_Lbl_Job}
            {...getCustomHintProps('recordJob')}
          />
        )}
        {!isItem && (
          <Attachment
            receiptFileId={values.receiptFileId}
            receiptId={values.receiptId}
            selectedMetadata={props.selectedMetadata}
            useImageQualityCheck={props.useImageQualityCheck}
            receiptDataType={values.receiptDataType}
            receiptTitle={values.receiptTitle}
            receiptCreatedDate={values.receiptCreatedDate}
            readOnly={props.readOnly}
            getBase64files={props.getBase64files}
            uploadReceipts={props.uploadReceipts}
            onChangeUpdateValues={onChangeUpdateValues}
            openReceiptLibrary={onOpenReceiptLibrary}
            receiptConfig={values.fileAttachment}
            saveFileMetadata={props.saveFileMetadata}
            errors={setError('receiptId')}
            isRequest={isRequest}
          />
        )}

        {!isItem && isUseMerchant(values.merchantUsage) && (
          <TextField
            label={msg().Exp_Clbl_Merchant}
            value={values.items[0].merchant || ''}
            disabled={props.readOnly}
            required={isMerchantRequired}
            onChange={onChangeValue('items.0.merchant')}
            errors={setError('items.0.merchant')}
          />
        )}

        {isShowRecordInvoice && (
          <RecordInvoice
            {...getCustomHintProps('recordInvoice')}
            jctRegistrationNumberUsage={jctRegistrationNumberUsage}
            disabled={readOnly}
            recordJctNumber={values.items[0].jctRegistrationNumber}
            onChangeJctNumber={onChangeJctRegistrationNo}
            onChangeRadio={onChangeSelectedJctInvoiceOption}
            optionValue={values.items[0].jctInvoiceOption}
            isShowJctRegistrationNumber={isShowJctRegistrationNumber}
          />
        )}

        {!isParentHotel && (
          <ExtendedItem
            setError={setError}
            onChangeUpdateValues={onChangeUpdateValues}
            onChangeValue={onChangeValue}
            item={values.items[itemIdx]}
            itemIdx={itemIdx}
            readOnly={props.readOnly}
            onClickSearchCustomEI={props.onClickSearchCustomEI}
            saveFormValues={saveFormValues}
            saveItemValues={saveItemValues}
            record={values}
            activeHints={props.activeHints}
            onClickHint={props.onClickHint}
          />
        )}

        <TextField
          disabled={readOnly}
          label={msg().Exp_Clbl_Summary}
          onChange={onChangeValue(`items.${itemIdx}.remarks`)}
          errors={setError(`items.${itemIdx}.remarks`)}
          value={values.items[itemIdx].remarks || ''}
          {...getCustomHintProps('recordSummary')}
        />

        {isParentHotel && (
          <ItemsArea
            onClickAddItem={onClickAddItem}
            onClickChildItem={props.onClickChildItem}
            readOnly={readOnly}
            values={values}
            hasChildItems={hasChildItems}
            currencyDecimalPlace={props.currencyDecimalPlace}
            currencySymbol={props.currencySymbol}
          />
        )}
      </Form>
      {modal === FOOTER_MODAL && (
        <FooterOptionsModal
          title={msg().Exp_Btn_More}
          menuItems={[
            {
              label: msg().Exp_Lbl_Clone,
              disabled: isNotEditable,
              action: onClickCloneByDate,
            },
            {
              label: msg().Exp_Lbl_CloneOneTime,
              disabled: isNotEditable,
              action: () => onClickCloneRecord(1),
            },
            {
              label: msg().Exp_Lbl_CloneMultiple,
              disabled: isNotEditable,
              action: onClickCloneByNumber,
            },
            {
              label: msg().Com_Btn_Delete,
              disabled: isNotEditable,
              action: onClickDelete,
            },
          ]}
          closeModal={closeModal}
        />
      )}
      <CloneCalendarDialog
        isOpen={modal === CALENDAR_CLONE}
        defaultDate={values.recordDate}
        language={props.language}
        closeDialog={closeModal}
        onClickClone={(dates) => onClickCloneRecord(null, dates)}
      />
      <CloneNumberDialog
        isOpen={modal === NUMBER_CLONE}
        closeDialog={closeModal}
        onClickClone={(number) => onClickCloneRecord(number)}
      />
      <Dialog
        isOpened={modal === DELETE}
        title={msg().Exp_Msg_ConfirmDelete}
        content={<div>{msg().Exp_Msg_ConfirmDeleteSelectedRecords}</div>}
        leftButtonLabel={msg().Com_Btn_Cancel}
        rightButtonLabel={msg().Com_Btn_Delete}
        onClickLeftButton={closeModal}
        onClickRightButton={props.onDeleteClick}
        onClickCloseButton={closeModal}
      />
    </WrapperWithPermission>
  );
};

export default Recordform;
