import React, { SyntheticEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
// @ts-ignore
import { RouterHistory } from 'react-router-dom';

import classNames from 'classnames';
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

import { useScript } from '@apps/core/hooks';
import ICCCLinkButton from '@commons/components/exp/Form/RecordItem/ICCCLinkButton';
import googleMapsApiKey, {
  GOOGLE_MAP_SCRIPT_ID,
} from '@commons/config/exp/googleMapKey';
import CheckActive from '@commons/images/icons/check-active.svg';
import msg from '@commons/languages';
import { ErrorInfo } from '@commons/utils/AppPermissionUtil';
import DateUtil from '@commons/utils/DateUtil';
import {
  calculateBCChildItemListAmount,
  calculateFCChildItemListAmount,
  getItemCCJobObj,
  getTotalAmountMatch,
  updateChildItemExpType,
  updateChildItemInfo,
} from '@commons/utils/exp/ItemizationUtil';
import { updateValues } from '@commons/utils/FormikUtils';
import TextUtil from '@commons/utils/TextUtil';
import Alert from '@mobile/components/molecules/commons/Alert';
import Dialog from '@mobile/components/molecules/commons/Dialog';
import LikeInputButtonField from '@mobile/components/molecules/commons/Fields/LikeInputButtonField';
import SelectField from '@mobile/components/molecules/commons/Fields/SelectField';
import SFDateField from '@mobile/components/molecules/commons/Fields/SFDateField';
import TextField from '@mobile/components/molecules/commons/Fields/TextField';
import Navigation from '@mobile/components/molecules/commons/Navigation';
import ViewItem from '@mobile/components/molecules/commons/ViewItem';
import WrapperWithPermission from '@mobile/components/organisms/commons/WrapperWithPermission';

import { CustomHint } from '@apps/domain/models/exp/CustomHint';
import { ExpenseReportType } from '@apps/domain/models/exp/expense-report-type/list';
import {
  AmountOption,
  ExpenseType,
  ExpenseTypeList,
} from '@apps/domain/models/exp/ExpenseType';
import {
  calcAmountFromRate,
  CurrencyList,
  ROUNDING_TYPE,
  RoundingType,
} from '@apps/domain/models/exp/foreign-currency/Currency';
import { ExchangeRate } from '@apps/domain/models/exp/foreign-currency/ExchangeRate';
import {
  isUseJctNo,
  JCT_NUMBER_INVOICE,
  JCT_REGISTRATION_NUMBER_USAGE,
} from '@apps/domain/models/exp/JCTNo';
import {
  isUseMerchant,
  MERCHANT_USAGE,
} from '@apps/domain/models/exp/Merchant';
import {
  MileageDestinationInfo,
  MileageRate,
  MileageUnit,
} from '@apps/domain/models/exp/Mileage';
import {
  INTEGRATION_SERVICES,
  isCCPaymentMethod,
  isICPaymentMethod,
  isShowPaymentMethodField,
  isUnlinkCCTrans,
  PaymentMethod,
} from '@apps/domain/models/exp/PaymentMethod';
import { Base64FileList, FileMetadata } from '@apps/domain/models/exp/Receipt';
import {
  calculateTotalTaxes,
  isCCRecord,
  isIcRecord,
  isItemizedRecord,
  isMileageRecord,
  isShowItemizationTab,
  isUseWithholdingTax,
  ITEMIZATION_SETTING_TYPE,
  newRecordItem,
  Record,
  RECORD_TYPE,
  RecordItem,
  updateTaxItemRates,
} from '@apps/domain/models/exp/Record';
import {
  getDisplayOfRecordVendor,
  Report,
} from '@apps/domain/models/exp/Report';
import {
  AmountInputMode,
  calcAmountFromTaxExcluded,
  calculateTax,
  ExpTaxTypeList,
} from '@apps/domain/models/exp/TaxType';
import {
  getDetailDisplay,
  TransitIcRecordInfo,
} from '@apps/domain/models/exp/TransportICCard';

import { Props as ExchangeRateMapProp } from '@mobile/modules/expense/entities/exchangeRate';
import { PaymentMethodOptionList } from '@mobile/modules/expense/ui/paymentMethodOption';

import {
  AppAction,
  AppDispatch,
} from '@apps/mobile-app/action-dispatchers/AppThunk';
import { searchChildItemTaxTypeList } from '@mobile/action-dispatchers/expense/TaxType';

import { BACK_TYPE } from '@apps/mobile-app/containers/pages/expense/VendorContainer';

import Button from '@apps/mobile-app/components/atoms/Button';
import MileageForm from '@apps/mobile-app/components/pages/expense/Record/New/Mileage';
import IconButton from '@mobile/components/atoms/IconButton';
import CloneCalendarDialog, {
  CALENDAR_CLONE,
} from '@mobile/components/organisms/expense/CloneCalendarDialog';
import CloneNumberDialog, {
  NUMBER_CLONE,
} from '@mobile/components/organisms/expense/CloneNumberDialog';
import FooterOptionsModal, {
  FOOTER_MODAL,
} from '@mobile/components/organisms/expense/FooterOptionsModal';
import MultipleTaxEntriesForm from '@mobile/components/pages/expense/Record/New/General/MultipleTaxEntries/MultipleTaxEntriesForm';

import AmountArea from './AmountArea';
import AttachmentList from './AttachmentList';
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
import RecordMerchant from './Merchant';
import RecordVendor from './Vendor';

import './index.scss';

const ROOT = 'mobile-app-pages-expense-page-record-new-general';

// To keep track of which screen opened record
export const UI_TYPE = {
  ADD: 'add', // New record through `Add Record` in Report Detail page
  REPORT_LIST: 'reportList', // View or Edit record through record list inside Report Detail page
};

type Props = ForeignCurrencyProps & {
  employeeId: string;
  language: string;
  companyId: string;
  report: Report;
  taxTypeList: ExpTaxTypeList;
  mileageRates?: Array<MileageRate>;
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
  selectedMetadatas: Array<FileMetadata>;
  currencyDecimalPlace: number;
  currencySymbol: string;
  baseCurrencyDecimal: number;
  expMileageUnit?: MileageUnit;
  currencyList: CurrencyList;
  exchangeRateMap: ExchangeRateMapProp;
  readOnly: boolean;
  hasPermissionError: ErrorInfo | null;
  paymentMethodList?: PaymentMethod[];
  paymentMethodOptionList: PaymentMethodOptionList;
  selectedExpType: ExpenseType;
  selectedReportType: ExpenseReportType;
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
  openMileageMap?: (values: Record) => void;
  onClickSearchCustomEI: (
    arg0: string,
    arg1: string,
    arg2: string,
    arg3: string
  ) => void;
  onClickSearchVendor: (backType: string) => void;
  getBase64files: (file: File) => Base64FileList;
  uploadReceipts: (list: Base64FileList) => Array<{
    contentVersionId: string;
    contentDocumentId: string;
  }>;
  // Custom Hint
  activeHints: Array<string>;
  customHints: CustomHint;
  onClickHint: (arg0: string) => void;
  onClickSearchCostCenter: (arg0: string) => void;
  onClickSearchJob: (arg0: string) => void;
  getRateFromId: (
    arg0: string,
    arg1: string,
    arg2: string
  ) => AppAction<Promise<ExchangeRate>>;
  getTaxTypeList: (
    arg0: string,
    arg1: string
  ) => AppAction<Promise<ExpTaxTypeList>>;
  getMileageRates: (
    companyId: string,
    targetDate?: string
  ) => AppAction<Promise<Array<MileageRate>>>;
  searchMileageRoute?: (destinations: Array<MileageDestinationInfo>) => any;
  openReceiptLibrary: () => void;
  clearSelectedExpType: () => void;
  onClickCloneRecord: (cloneTimes?: number, targetDates?: string[]) => void;
  getExchangeRate: (currencyId: string, recordDate: string) => Promise<number>;
  navigateToItemizationPage: (idx: number, values: Record) => void;
  navigateToRecordPage: () => void;
  removeInactivePaymentMethod: (selectedPaymentMethodId: string) => void;
  saveFileMetadatas: (fileMetadata: Array<FileMetadata>) => void;
  searchExpTypesByParentRecord: (
    targetDate: string,
    expTypeId: string
  ) => ExpenseTypeList[];
  isRequest?: boolean;
  onClickMileageApply?: (values: Record) => void;
  onClickMileageReset?: () => void;
  openCCTransactionDialog?: (values: Record) => void;
  openICTransactionDialog?: (values: Record) => void;
  onClickVendorDetail: (values: Record) => void;
  getItemLatestCostCenter: (
    parentHistoryId: string,
    itemList: RecordItem[],
    selectedDate: string,
    loadInBackground: boolean
  ) => RecordItem[];
  startLoading: () => string;
  endLoading: (id: string) => void;
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
  const dispatch = useDispatch() as AppDispatch;

  const { loading } = useScript(
    `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`,
    GOOGLE_MAP_SCRIPT_ID
  );

  const {
    values,
    type,
    readOnly,
    report,
    selectedExpType,
    isNotEditable,
    itemIdx = 0,
    isGeneratedPreview,
    paymentMethodList,
    paymentMethodOptionList,
    onBackClick,
    setFieldValue,
    saveFormValues,
    saveItemValues,
    setValues,
    setTouched,
    onClickCloneRecord,
    openCCTransactionDialog,
    openICTransactionDialog,
    onClickVendorDetail,
    isRequest,
  } = props;

  const isRecordItemized = isItemizedRecord(values.items.length);
  const isParentItem = itemIdx === 0;

  const selectedPaymentMethod =
    paymentMethodList.find(({ id }) => id === values.paymentMethodId) ||
    ({} as PaymentMethod);

  const onSearchClick = () => {
    setFieldValue('recordId', values.recordId, false);
    saveFormValues(values);
    props.onClickSearchExpType();
  };

  const onSearchJob = () => {
    setFieldValue('items.0.jobName', values.items[0].jobName, false);
    onSaveFormOrItemValues(values);
    props.onClickSearchJob(values.recordDate);
  };

  const onSearchCostCenter = () => {
    setFieldValue(
      'items.0.costCenterName',
      values.items[0].costCenterName,
      false
    );
    onSaveFormOrItemValues(values);
    props.onClickSearchCostCenter(values.recordDate);
  };

  const onSaveFormOrItemValues = (values: Record) => {
    if (isParentItem) {
      saveFormValues(values);
    } else {
      const item = get(values, `items.${itemIdx}`);
      if (item) {
        saveItemValues(item);
      }
    }
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

  const onOpenReceiptLibrary = () => {
    saveFormValues(values);
    props.openReceiptLibrary();
  };

  const onMileageApply = () => {
    saveFormValues(values);
    props.onClickMileageApply(values);
  };

  const onOpenMileageMap = () => {
    saveFormValues(values);
    props.openMileageMap(values);
  };

  const openCCTransaction = () => openCCTransactionDialog(values);

  const openICTransaction = () => openICTransactionDialog(values);

  const onChangePaymentMethod = (
    e: SyntheticEvent<HTMLSelectElement, Event>
  ) => {
    const { removeInactivePaymentMethod } = props;
    const { value } = e.target as HTMLInputElement;
    removeInactivePaymentMethod(values.paymentMethodId);

    const updateValues = {
      paymentMethodId: value || null,
    };
    const isUnlinkCC = isUnlinkCCTrans(
      value || null,
      paymentMethodList,
      isCCRecord(values)
    );
    if (isUnlinkCC) {
      Object.assign(updateValues, {
        creditCardTransactionId: null,
      });
    }

    onChangeUpdateValues(updateValues);
  };

  const onChangeJctRegistrationNo = (value: string) => {
    const updateValues = {
      'items.0.jctRegistrationNumber': value,
    };
    onChangeUpdateValues(updateValues);
  };

  const onChangeSelectedJctInvoiceOption =
    (isRecordVendorVisible: boolean) => (optionValue: string) => {
      const expRecord = values;
      const isInvoiceOption = optionValue === JCT_NUMBER_INVOICE.Invoice;
      const vendorJctRegistrationNumber = get(
        expRecord,
        'items[0].vendorJctRegistrationNumber'
      );

      // update jctInvoiceOption
      const updateValues = {
        'items.0.jctInvoiceOption': optionValue,
      };

      // update jctRegistrationNumber if vendorJctRegistrationNumber exists and jctRegistrationNumber is empty
      if (
        isInvoiceOption &&
        vendorJctRegistrationNumber &&
        isRecordVendorVisible
      ) {
        Object.assign(updateValues, {
          'items.0.jctRegistrationNumber': vendorJctRegistrationNumber,
        });
      }

      onChangeUpdateValues(updateValues);
    };

  const onClickDeleteVendorButton = () => {
    const updateValues = {
      'items.0.vendorName': null,
      'items.0.vendorId': null,
      'items.0.vendorCode': null,
      'items.0.paymentDueDate': null,
      'items.0.paymentDueDateUsage': null,
      'items.0.vendorJctRegistrationNumber': null,
      'items.0.vendorIsJctQualifiedIssuer': false,
    };
    onChangeUpdateValues(updateValues);
  };

  const onClickVendorItem = (backType: string) => () => {
    props.saveFormValues(values);
    props.onClickSearchVendor(backType);
  };

  const renderAlert = () => {
    if (!isParentItem) return null;

    const { recordType } = values;
    const messages = [];
    const isSelectedPaymentMethodInvalid = isEmpty(selectedPaymentMethod);
    const isRequestNoPM = isRequest && paymentMethodList.length <= 0;
    const isShowICError =
      isRecordTypeIc &&
      isSelectedPaymentMethodInvalid &&
      !paymentMethodList.some(({ integrationService }) =>
        isICPaymentMethod(integrationService, recordType)
      ) &&
      !isRequestNoPM;
    const hasNoCCPaymentMethod =
      isRecordCC &&
      !paymentMethodList.some(({ integrationService }) =>
        isCCPaymentMethod(integrationService)
      );
    const isShowCCError =
      hasNoCCPaymentMethod ||
      (hasNoCCPaymentMethod && isSelectedPaymentMethodInvalid);
    if (isShowCCError)
      messages.push(msg().Exp_Err_ContactAdministratorForCCCardPaymentMethod);
    if (isShowICError)
      messages.push(msg().Exp_Err_ContactAdministratorForICCardPaymentMethod);

    return messages.length > 0 ? (
      <Alert variant="warning" message={messages} />
    ) : null;
  };

  const handleDateChange = async (
    e: React.FormEvent<HTMLElement>,
    data: any
  ) => {
    const formattedDate = moment(data.date).format('YYYY-MM-DD');
    const values = cloneDeep(props.values);
    values.items[itemIdx].recordDate = formattedDate;

    if (itemIdx > 0) {
      setValues(values);
      return;
    }

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
    const loadingId = props.startLoading();
    try {
      if (!isInRange && itemIdx === 0 && !isMileage) {
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
      } else {
        const {
          companyId,
          getTaxTypeList,
          getRateFromId,
          getMileageRates,
          currencyDecimalPlace,
          expRoundingSetting,
          taxRoundingSetting,
          currencyList,
        } = props;

        if (isRecordItemized) {
          const [parentItem, ...childItemList] = values.items;

          const expTypeList =
            (await props.searchExpTypesByParentRecord(
              formattedDate,
              parentItem.expTypeId
            )) || [];
          const updateExpTypeObj = updateChildItemExpType(
            childItemList,
            expTypeList.flat(),
            false
          );
          const updatedItemList = updateChildItemInfo(
            updateExpTypeObj,
            values.items
          );
          values.items = updatedItemList;
        }

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

            if (isItemizedRecord(values.items.length)) {
              const parentItem = values.items[0];
              const firstChildExchangeRate = get(
                values.items,
                '1.exchangeRate',
                0
              );
              const parentExchangeRate = parentItem.exchangeRate || 0;

              if (firstChildExchangeRate !== parentExchangeRate) {
                const updatedChildItemList = calculateFCChildItemListAmount(
                  currencyDecimalPlace,
                  expRoundingSetting,
                  values.items
                );
                values.items = [parentItem].concat(updatedChildItemList);
              }
            }
          }
          values.items[itemIdx].amount = amount;
        } else if (expType) {
          if (isMileage) {
            const mileageRatesResponse = await getMileageRates(
              companyId,
              formattedDate
            );
            const mileageRates = mileageRatesResponse[0];
            const mileageRateBaseId = values.items[0].mileageRateBaseId;
            const expMileageRateInfo: MileageRate | undefined = (
              mileageRates || []
            ).find((mR: MileageRate) => mR.id === mileageRateBaseId);
            const mileageRateHistoryId = get(expMileageRateInfo, 'historyId');
            const mileageRate = get(expMileageRateInfo, 'rate');
            const mileageRateName = get(expMileageRateInfo, 'name');
            values.items[0].mileageRateHistoryId = mileageRateHistoryId;
            values.items[0].mileageRate = mileageRate;
            values.items[0].mileageRateName = mileageRateName;
            const distance = values.items[0].mileageDistance || 0;
            const amount = calcAmountFromRate(
              mileageRate || 0,
              distance,
              props.baseCurrencyDecimal,
              ROUNDING_TYPE.RoundUp
            );
            // @ts-ignore
            values.items[itemIdx].amount = amount;
          }

          // if no exp type on record/item, skip tax update
          const tax = await getTaxTypeList(
            values.items[itemIdx].expTypeId,
            formattedDate
          );

          const taxList = get(tax, '0.payload', [{}]);

          /* Multi tax */
          const multiTaxUpdatedObj = (() => {
            const taxItems = values.items[0]?.taxItems;

            if (!taxItems || !taxList || taxList.length <= 0) {
              return undefined;
            }

            const updatedTaxItems = updateTaxItemRates({
              taxItems,
              taxTypeList: taxList,
              baseCurrencyDecimal: currencyDecimalPlace,
              taxRoundingSetting,
              isTaxIncludedMode:
                values.amountInputMode === AmountInputMode.TaxIncluded,
            });

            const { totalAmountInclTax, totalAmountExclTax, totalGstVat } =
              calculateTotalTaxes(updatedTaxItems, currencyDecimalPlace);

            const commonProps = {
              'items.0.taxItems': updatedTaxItems,
              'items.0.gstVat': totalGstVat,
            };

            if (values.amountInputMode === AmountInputMode.TaxExcluded) {
              return {
                ...commonProps,
                amount: totalAmountInclTax,
                amountPayable: totalAmountInclTax,
                withoutTax: values.withoutTax,
                'items.0.taxItems': updatedTaxItems,
                'items.0.amount': totalAmountInclTax,
                'items.0.withoutTax': values.withoutTax,
                'items.0.gstVat': totalGstVat,
              };
            }

            return {
              ...commonProps,
              amount: values.amount,
              amountPayable: values.amount,
              withoutTax: totalAmountExclTax,
              'items.0.taxItems': updatedTaxItems,
              'items.0.amount': values.amount,
              'items.0.withoutTax': totalAmountExclTax,
              'items.0.gstVat': totalGstVat,
            };
          })();

          const taxType =
            find(taxList, {
              historyId: values.items[itemIdx].taxTypeHistoryId,
            }) ||
            find(taxList, {
              baseId: values.items[itemIdx].taxTypeBaseId,
            }) ||
            taxList[0] ||
            {};
          const { rate = 0, baseId, historyId, name } = taxType;

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

          /* Multi tax */
          if (values.items[0]?.taxItems) {
            values.amount = multiTaxUpdatedObj.amount;
            values.withoutTax = multiTaxUpdatedObj.withoutTax;
            values.items[0].amount = multiTaxUpdatedObj['items.0.amount'];
            values.items[0].withoutTax =
              multiTaxUpdatedObj['items.0.withoutTax'];
            values.items[0].gstVat = multiTaxUpdatedObj['items.0.gstVat'];
            values.items[0].taxItems = multiTaxUpdatedObj['items.0.taxItems'];
          }

          if (isRecordItemized) {
            const [_, ...childItemList] = values.items;
            const taxTypeObj = await dispatch(
              searchChildItemTaxTypeList(childItemList, formattedDate)
            );
            const updateChildItemObj = calculateBCChildItemListAmount(
              values.amountInputMode,
              props.baseCurrencyDecimal,
              childItemList,
              formattedDate,
              props.taxRoundingSetting,
              taxTypeObj
            );
            const finalUpdatedItemList = updateChildItemInfo(
              updateChildItemObj,
              values.items
            );
            values.items = finalUpdatedItemList;
          }
        }
      }
      if (itemIdx === 0) {
        // get cc latest revised name
        const { costCenterHistoryId, recordDate } = values.items[0];
        const currentCCHistoryId =
          costCenterHistoryId || report.costCenterHistoryId;
        if (currentCCHistoryId) {
          const updateItemObj = await props.getItemLatestCostCenter(
            currentCCHistoryId,
            values.items,
            recordDate,
            true
          );
          const { values: updatedRecord } = updateValues(
            values,
            props.touched,
            updateItemObj
          );
          values.items = updatedRecord.items;
        }
      }
    } finally {
      props.endLoading(loadingId);
    }
    setValues(values);
    setTouched({ recordDate: true });
  };

  const handlePaymentDueDateChange = (date?: Date) => {
    let updatedValue = null;
    if (date) {
      updatedValue = moment(date).format('YYYY-MM-DD');
    }
    const updateValues = {
      'items.0.paymentDueDate': updatedValue,
    };
    onChangeUpdateValues(updateValues);
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

  const renderActionButtons = () => {
    const {
      baseCurrencyDecimal,
      isUnderApprovedPreRequest,
      reportDiscarded,
      reportClaimed,
      readOnly,
      onClickEditButton,
    } = props;

    const showEditBtn =
      !isUnderApprovedPreRequest &&
      !reportDiscarded &&
      !reportClaimed &&
      readOnly;
    const isEditMode = !readOnly && (!isMileage || isGeneratedPreview);
    const isTotalAmountMatch = getTotalAmountMatch(baseCurrencyDecimal, values);
    const itemizationSetting = get(
      selectedExpType,
      'itemizationSetting',
      ITEMIZATION_SETTING_TYPE.NotUsed
    );
    const hasItemizedRequiredErr =
      itemizationSetting === ITEMIZATION_SETTING_TYPE.Required &&
      !hasChildItems;
    const isDisableParentItemSave =
      isParentItem && (!isTotalAmountMatch || hasItemizedRequiredErr);
    const isDisableSave = isNotEditable || isDisableParentItemSave;

    return (
      <div className={`${ROOT}__actions`}>
        {showEditBtn && (
          <Button
            onClick={onClickEditButton}
            priority="secondary"
            variant="neutral"
            disabled={isNotEditable}
          >
            {msg().Com_Btn_Edit}
          </Button>
        )}

        {isEditMode && itemIdx > 0 && (
          <Button
            onClick={onClickDeleteItem}
            priority="primary"
            variant="alert"
          >
            {msg().Com_Btn_Delete}
          </Button>
        )}

        {isEditMode && (
          <Button
            onClick={onClickSave}
            priority="primary"
            variant="neutral"
            disabled={isDisableSave}
          >
            {msg().Com_Btn_Save + 'tesst 1'}
          </Button>
        )}
      </div>
    );
  };

  const renderDotBtn = () => {
    const {
      isUnderApprovedPreRequest,
      reportDiscarded,
      reportClaimed,
      readOnly,
    } = props;
    if (isUnderApprovedPreRequest || reportDiscarded || reportClaimed) {
      return [];
    } else if (readOnly && isParentItem) {
      return [
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
  const isRecordCC =
    isCCRecord(values) ||
    selectedPaymentMethod.integrationService ===
      INTEGRATION_SERVICES.CorporateCard;
  const useWithholdingTax = isUseWithholdingTax(values.withholdingTaxUsage);
  const isItem = !!itemIdx;
  const isItemizedParent = isRecordItemized && isParentItem;
  const isMileage = isMileageRecord(values.recordType);

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

  const onSaveChildItem = async () => {
    updateTouchedForItems();
    // save item value if no error for THIS item
    const errorsRes = await props.validateForm();
    const itemErrors = get(errorsRes, `items.${itemIdx}`);
    if (isEmpty(itemErrors)) {
      props.saveFormValues(values);
      props.clearItemValues();
      props.navigateToRecordPage();
    }
  };

  const onClickSave = async () => {
    await props.setFieldValue(
      'isCCPaymentMethod',
      isCCPaymentMethod(selectedPaymentMethod.integrationService),
      false
    );
    return itemIdx > 0 ? onSaveChildItem() : props.handleSubmit();
  };

  const onClickDeleteItem = () => {
    const record = cloneDeep(values);
    // remove this item
    record.items.splice(itemIdx, 1);
    props.saveFormValues(record);
    props.clearItemValues();
    props.navigateToRecordPage();
  };

  const renderBaseCurrencyArea = (isRecordTypeIc: boolean) => {
    const {
      allowTaxExcludedAmount,
      allowTaxAmountChange,
      currencyDecimalPlace,
      taxRoundingSetting,
      taxTypeList,
      currencySymbol,
      readOnly,
    } = props;

    const baseCurrencyAreaReadOnly =
      readOnly || (isRecordTypeIc && !isRequest) || isMileage;
    const isMultipleTax = values.items[itemIdx]?.taxItems?.length > 0;

    if (isMultipleTax) {
      return (
        <MultipleTaxEntriesForm
          values={values}
          onChangeUpdateValues={onChangeUpdateValues}
          currencySymbol={currencySymbol}
          readOnly={baseCurrencyAreaReadOnly}
          taxTypeList={taxTypeList}
          taxRoundingSetting={taxRoundingSetting}
          allowTaxExcludedAmount={allowTaxExcludedAmount}
          allowTaxAmountChange={allowTaxAmountChange}
          baseCurrencyDecimal={currencyDecimalPlace}
          getCustomHintProps={getCustomHintProps}
          errors={props.errors}
          isRecordCC={isCCRecord(values)}
        />
      );
    }

    return (
      <AmountArea
        rate={props.rate}
        setError={setError}
        values={values}
        itemIdx={itemIdx}
        onChangeUpdateValues={onChangeUpdateValues}
        currencyDecimalPlace={props.currencyDecimalPlace}
        currencySymbol={props.currencySymbol}
        readOnly={baseCurrencyAreaReadOnly}
        isRecordTypeIc={isRecordTypeIc}
        isRecordCC={isCCRecord(values)}
        useWithholdingTax={useWithholdingTax}
        taxTypeList={props.taxTypeList}
        taxRoundingSetting={props.taxRoundingSetting}
        setRate={props.setRate}
        allowTaxExcludedAmount={props.allowTaxExcludedAmount}
        allowTaxAmountChange={props.allowTaxAmountChange}
        baseCurrencyDecimal={props.currencyDecimalPlace}
        getCustomHintProps={getCustomHintProps}
      />
    );
  };

  const renderForeignCurrencyArea = () => (
    <ForeignCurrencyArea
      values={values}
      itemIdx={itemIdx}
      readOnly={props.readOnly}
      expRoundingSetting={props.expRoundingSetting}
      baseCurrencyDecimal={props.currencyDecimalPlace}
      baseCurrencySymbol={props.currencySymbol}
      currencyList={props.currencyList}
      exchangeRateMap={props.exchangeRateMap}
      onChangeUpdateValues={onChangeUpdateValues}
      getExchangeRate={props.getExchangeRate}
      setError={setError}
      getCustomHintProps={getCustomHintProps}
    />
  );

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

  const renderMileage = () => {
    return (
      <MileageForm
        readOnly={props.readOnly}
        rate={props.rate}
        currencySymbol={props.currencySymbol}
        baseCurrencyDecimal={props.baseCurrencyDecimal}
        taxRoundingSetting={props.taxRoundingSetting}
        isGeneratedPreview={isGeneratedPreview}
        values={props.values}
        errors={props.errors}
        mileageUnit={props.expMileageUnit}
        mileageRates={props.mileageRates}
        employeeId={props.employeeId}
        companyId={props.companyId}
        onClickMileageApply={onMileageApply}
        onClickMileageReset={props.onClickMileageReset}
        searchMileageRoute={props.searchMileageRoute}
        openMileageMap={onOpenMileageMap}
        setFieldValue={props.setFieldValue}
      />
    );
  };

  const isDisabledExpenseType =
    isEmpty(values.recordDate) ||
    readOnly ||
    isRecordTypeIc ||
    isRecordCC ||
    isItemizedParent ||
    !isNil(values.ocrAmount) ||
    isMileage;

  const isDisabledCcJob = isEmpty(values.recordDate) || readOnly;
  const expTypeNameErr = setError(`items.${itemIdx}.expTypeName`);
  const expTypeIdErr = setError(`items.${itemIdx}.expTypeId`);
  const expTypeErr = isEmpty(expTypeNameErr) ? expTypeIdErr : expTypeNameErr;

  const expType =
    itemIdx > 0 ? (
      <ChildExpTypeField
        values={values}
        itemIdx={itemIdx}
        isDisabled={readOnly}
        childExpTypes={props.childExpTypes}
        searchExpTypesByParentRecord={props.searchExpTypesByParentRecord}
        setValues={setValues}
        getTaxTypeList={props.getTaxTypeList}
        currencyDecimalPlace={props.currencyDecimalPlace}
        taxRoundingSetting={props.taxRoundingSetting}
        setFieldTouched={props.setFieldTouched}
        setRate={props.setRate}
        errors={expTypeErr}
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
  const { costCenterName, jobName } = getItemCCJobObj(itemIdx, values, report);

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
    ? msg().Exp_Lbl_ItemizationDetail
    : type !== 'new'
    ? msg().Exp_Lbl_Records
    : msg().Exp_Lbl_NewRecord;

  const linkICError = setError('transitIcRecordId');
  const linkCCError = setError('creditCardTransactionId');
  const linkICCCError = [linkICError[0] || linkCCError[0]];

  const itemizationSetting = get(
    selectedExpType,
    'itemizationSetting',
    ITEMIZATION_SETTING_TYPE.NotUsed
  );
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
  const { isRecordVendorVisible, isRecordVendorRequired } =
    getDisplayOfRecordVendor(props.selectedReportType);

  return (
    <WrapperWithPermission
      className={ROOT}
      hasPermissionError={props.hasPermissionError}
    >
      <Navigation
        backButtonLabel={
          isParentItem ? msg().Com_Lbl_Back : msg().Exp_Lbl_Records
        }
        onClickBack={renderBackButton(type, onBackClick, isItem)}
        title={title}
        actions={concat(renderDotBtn())}
      />
      <Form
        className={classNames('main-content', {
          'read-only-bg': readOnly,
        })}
      >
        {renderAlert()}
        <SFDateField
          required
          disabled={
            props.readOnly ||
            isRecordTypeIc ||
            (isRecordCC && itemIdx === 0) ||
            (isMileage && isGeneratedPreview)
          }
          label={msg().Exp_Clbl_Date}
          errors={setError(`items.${itemIdx}.recordDate`)}
          onChange={handleDateChange}
          value={values.items[itemIdx].recordDate}
          {...getCustomHintProps('recordDate')}
        />

        {!isNil(ocrDate) && isParentItem && (
          <div className={`input-feedback ${cssDateClass}`}>
            {isDateMatch && <CheckActive className="input-feedback-icon-ok" />}
            {dateMsg}
          </div>
        )}

        {expType}

        {isParentItem &&
          isShowPaymentMethodField(
            paymentMethodList,
            values,
            null,
            isRequest
          ) && (
            <>
              <SelectField
                disabled={props.readOnly}
                errors={setError('paymentMethodId')}
                label={msg().Exp_Clbl_PaymentMethod}
                options={paymentMethodOptionList}
                onChange={onChangePaymentMethod}
                required
                value={values.paymentMethodId}
                {...getCustomHintProps('recordPaymentMethod')}
              />
              {!isRequest && (
                <ICCCLinkButton
                  cssRoot={ROOT}
                  errors={linkICCCError}
                  expRecord={values}
                  isDisabled={props.readOnly}
                  isMobile
                  openCCTransactionDialog={openCCTransaction}
                  openICTransactionDialog={openICTransaction}
                  selectedExpenseType={selectedExpType}
                  selectedPaymentMethod={selectedPaymentMethod}
                  setFieldValue={setFieldValue}
                />
              )}
            </>
          )}

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

        {isMileage && !loading && renderMileage()}
        {(!isMileage || isGeneratedPreview) && (
          <>
            {isForeignCurrency
              ? renderForeignCurrencyArea()
              : renderBaseCurrencyArea(isRecordTypeIc)}

            {isRecordTypeIc && renderICField()}

            {costCenterHistoryId && (
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
            {jobId && (
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
              <AttachmentList
                receiptList={values.receiptList || []}
                selectedMetadatas={props.selectedMetadatas}
                useImageQualityCheck={props.useImageQualityCheck}
                readOnly={props.readOnly}
                getBase64files={props.getBase64files}
                uploadReceipts={props.uploadReceipts}
                onChangeUpdateValues={onChangeUpdateValues}
                openReceiptLibrary={onOpenReceiptLibrary}
                receiptConfig={values.fileAttachment}
                saveFileMetadatas={props.saveFileMetadatas}
                errors={setError('receiptList')}
                isRequest={isRequest}
                record={values}
              />
            )}

            {!isItem && isUseMerchant(values.merchantUsage) && (
              <RecordMerchant
                isRequired={isMerchantRequired}
                readOnly={props.readOnly}
                value={values.items[0].merchant || ''}
                onChangeValue={onChangeValue('items.0.merchant')}
                setError={setError}
                onClickSearchButton={onClickVendorItem(
                  BACK_TYPE.RECORD_MERCHANT
                )}
              />
            )}

            {isParentItem && isRecordVendorVisible && (
              <RecordVendor
                values={values}
                isVendorRequired={isRecordVendorRequired}
                onClickDeletePaymentDueDate={() => handlePaymentDueDateChange()}
                onClickDeleteVendorButton={onClickDeleteVendorButton}
                onClickVendorItem={onClickVendorItem(BACK_TYPE.RECORD_VENDOR)}
                setError={setError}
                handleDateChange={handlePaymentDueDateChange}
                readOnly={props.readOnly}
                useJctRegistrationNumber={props.jctInvoiceManagement}
                onClickVendorDetail={() => onClickVendorDetail(values)}
              />
            )}

            {isShowRecordInvoice && (
              <RecordInvoice
                jctRegistrationNumberUsage={jctRegistrationNumberUsage}
                disabled={readOnly}
                recordJctNumber={values.items[0].jctRegistrationNumber}
                onChangeJctNumber={onChangeJctRegistrationNo}
                onChangeRadio={onChangeSelectedJctInvoiceOption(
                  isRecordVendorVisible
                )}
                optionValue={values.items[0].jctInvoiceOption}
                isShowJctRegistrationNumber={isShowJctRegistrationNumber}
                values={values}
                hasRecordVendor={isRecordVendorVisible}
                {...getCustomHintProps('recordInvoice')}
              />
            )}

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

            <TextField
              disabled={readOnly}
              label={msg().Exp_Clbl_Summary}
              onChange={onChangeValue(`items.${itemIdx}.remarks`)}
              errors={setError(`items.${itemIdx}.remarks`)}
              value={values.items[itemIdx].remarks || ''}
              {...getCustomHintProps('recordSummary')}
            />

            {isParentItem && isShowItemizationTab(itemizationSetting) && (
              <ItemsArea
                isRequired={
                  itemizationSetting === ITEMIZATION_SETTING_TYPE.Required
                }
                navigateToItemizationPage={props.navigateToItemizationPage}
                readOnly={readOnly}
                values={values}
                hasChildItems={hasChildItems}
                currencyDecimalPlace={props.currencyDecimalPlace}
                currencySymbol={props.currencySymbol}
              />
            )}
          </>
        )}
        {renderActionButtons()}
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
