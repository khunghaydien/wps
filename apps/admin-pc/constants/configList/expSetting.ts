import { ROUNDING_TYPE } from '../../../domain/models/exp/foreign-currency/Currency';
import { TAX_DETAILS_TYPE } from '@apps/domain/models/exp/TaxType';

import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import fieldSize from '../fieldSize';
import fieldType from '../fieldType';

const { FIELD_HIDDEN, FIELD_SELECT, FIELD_RADIO, FIELD_TEXT, FIELD_CHECKBOX } =
  fieldType;

const { SIZE_SMALL, SIZE_MEDIUM } = fieldSize;

const roundingSettingOptions = [
  {
    msgkey: 'Admin_Lbl_ExpRoundingSettingRound',
    value: ROUNDING_TYPE.Round,
  },
  {
    msgkey: 'Admin_Lbl_ExpRoundingSettingRoundUp',
    value: ROUNDING_TYPE.RoundUp,
  },
  {
    msgkey: 'Admin_Lbl_ExpRoundingSettingRoundDown',
    value: ROUNDING_TYPE.RoundDown,
  },
];

const displayTaxDetailsOptions = [
  {
    msgkey: 'Admin_Lbl_DisplayTaxDetailsNotUse',
    value: TAX_DETAILS_TYPE.NotUsed,
  },
  {
    msgkey: 'Admin_Lbl_DisplayTaxDetailsIncludedAmount',
    value: TAX_DETAILS_TYPE.IncludedAmount,
  },
  {
    msgkey: 'Admin_Lbl_DisplayTaxDetailsExcludedAmount',
    value: TAX_DETAILS_TYPE.ExcludedAmount,
  },
];

const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  {
    section: 'MasterCurrencySetting',
    msgkey: 'Admin_Lbl_MasterCurrencySetting',
    isExpandable: true,
    configList: [
      {
        key: 'currencyId',
        msgkey: 'Admin_Lbl_CurrencyCode',
        type: FIELD_SELECT,
        props: 'currencyId',
        size: SIZE_SMALL,
      },
    ],
  },
  {
    section: 'FunctionalControl',
    msgkey: 'Admin_Lbl_FunctionalControl',
    isExpandable: true,
    configList: [
      {
        key: 'useReceiptScan',
        msgkey: 'Admin_Lbl_ReceiptScan',
        type: FIELD_CHECKBOX,
        label: 'Admin_Lbl_Use',
        help: 'Admin_Msg_UseReceiptScan',
      },
      {
        key: 'useImageQualityCheck',
        msgkey: 'Admin_Lbl_DisplayImageQuality',
        type: FIELD_CHECKBOX,
        label: 'Admin_Lbl_Use',
        help: 'Admin_Msg_DisplayImageQuality',
      },
      {
        key: 'expAttendanceValidation',
        msgkey: 'Admin_Lbl_ExpAttendanceValidation',
        type: FIELD_CHECKBOX,
        label: 'Admin_Lbl_Use',
        help: 'Admin_Msg_UseExpAttendanceValidation',
      },
      {
        key: 'useTransitMgr',
        msgkey: 'Admin_Lbl_ExpIcCardIntegration',
        type: FIELD_CHECKBOX,
        label: 'Admin_Lbl_Use',
        help: 'Admin_Msg_UseIcCardIntegration',
      },
      {
        key: 'salesId',
        msgkey: 'Admin_Lbl_UserId1',
        type: FIELD_TEXT,
        size: SIZE_MEDIUM,
        isRequired: true,
        condition: (baseValueGetter) => baseValueGetter('useTransitMgr'),
      },
      {
        key: 'customerId',
        msgkey: 'Admin_Lbl_UserId2',
        type: FIELD_TEXT,
        size: SIZE_MEDIUM,
        isRequired: true,
        condition: (baseValueGetter) => baseValueGetter('useTransitMgr'),
      },
      {
        key: 'apiKey',
        msgkey: 'Admin_Lbl_ApiPrivateKey',
        type: FIELD_TEXT,
        size: SIZE_MEDIUM,
        isRequired: true,
        condition: (baseValueGetter) => baseValueGetter('useTransitMgr'),
      },
      {
        key: 'allowLinkedFileDelete',
        msgkey: 'Admin_Lbl_AllowLinkedFileDelete',
        type: FIELD_CHECKBOX,
        label: 'Admin_Lbl_Use',
        help: 'Admin_Msg_AllowLinkedFileDelete',
      },
      {
        key: 'expDisplayTaxDetailsSetting',
        msgkey: 'Admin_Lbl_DisplayTaxDetails',
        options: displayTaxDetailsOptions,
        type: FIELD_SELECT,
        multiLanguageValue: true,
        help: 'Admin_Msg_DisplayTaxDetails',
      },
    ],
  },
  {
    section: 'Admin_Lbl_ExpDANotificationSetting',
    msgkey: 'Admin_Lbl_ExpDANotificationSetting',
    isExpandable: true,
    configList: [
      {
        key: 'useExpDANotificationWhenAssigned',
        msgkey: 'Admin_Lbl_ExpDANotificationSettingWhenAssigned',
        type: FIELD_CHECKBOX,
        label: 'Admin_Lbl_ReceiveNotification',
        help: 'Admin_Msg_UseDANotificationWhenAssigned',
      },
      {
        key: 'useExpDANotificationWhenGetRequest',
        msgkey: 'Admin_Lbl_ExpDANotificationSettingWhenGetRequest',
        type: FIELD_CHECKBOX,
        label: 'Admin_Lbl_ReceiveNotification',
        help: 'Admin_Msg_UseDANotificationWhenGetRequest',
      },
    ],
  },
  {
    section: 'TaxSetting',
    msgkey: 'Admin_Lbl_TaxSetting',
    isExpandable: true,
    configList: [
      {
        key: 'allowTaxAmountChange',
        msgkey: 'Admin_Lbl_AllowTaxAmountChange',
        type: FIELD_CHECKBOX,
        help: 'Admin_Msg_AllowTaxAmountChange',
      },
      {
        key: 'allowTaxExcludedAmountInput',
        msgkey: 'Admin_Lbl_AllowTaxExcludedAmountInput',
        type: FIELD_CHECKBOX,
        help: 'Admin_Msg_AllowTaxExcludedAmountInput',
      },
      {
        key: 'jctInvoiceManagement',
        msgkey: 'Admin_Lbl_JCTInvoiceManagement',
        type: FIELD_CHECKBOX,
        help: 'Admin_Msg_JCTInvoiceManagement',
      },
      {
        key: 'nonInvoiceWarning',
        msgkey: 'Admin_Lbl_NonInvoiceWarning',
        type: FIELD_CHECKBOX,
        help: 'Admin_Msg_NonInvoiceWarning',
      },
    ],
  }, // {
  //   section: 'MasterTaxTypeSetting',
  //   msgkey: 'Admin_Lbl_MasterTaxTypeSetting',
  //   isExpandable: true,
  //   configList: [
  //     {
  //       key: 'useCompanyTaxMaster',
  //       msgkey: 'Admin_Lbl_UseCompanyTaxMaster',
  //       type: FIELD_CHECKBOX,
  //       props: 'useCompanyTaxMaster',
  //     },
  //   ],
  // },
  {
    key: 'useCompanyTaxMaster',
    msgkey: 'Admin_Lbl_UseCompanyTaxMaster',
    type: FIELD_HIDDEN,
    defaultValue: true,
    props: 'useCompanyTaxMaster',
  },
  {
    section: 'CalculationControl',
    msgkey: 'Admin_Lbl_CalculationControl',
    isExpandable: true,
    configList: [
      {
        key: 'expTaxRoundingSetting',
        msgkey: 'Admin_Lbl_ExpTaxRoundingSetting',
        options: roundingSettingOptions,
        type: FIELD_SELECT,
        multiLanguageValue: true,
        isRequired: true,
      },
      {
        key: 'expRoundingSetting',
        msgkey: 'Admin_Lbl_ExpRoundingSetting',
        options: roundingSettingOptions,
        type: FIELD_SELECT,
        multiLanguageValue: true,
        isRequired: true,
      },
    ],
  },
  {
    section: 'JorudanSearchOption',
    msgkey: 'Admin_Lbl_JorudanSearchOption',
    isExpandable: true,
    configList: [
      {
        key: 'jorudanFareType',
        msgkey: 'Admin_Lbl_JorudanFareType',
        type: FIELD_RADIO,
        props: 'jorudanFareType',
      },
      {
        key: 'jorudanAreaPreference',
        msgkey: 'Admin_Lbl_JorudanAreaPreference',
        type: FIELD_SELECT,
        props: 'jorudanAreaPreference',
        multiLanguageValue: true,
        size: SIZE_SMALL,
      },
      {
        key: 'jorudanUseChargedExpress',
        msgkey: 'Admin_Lbl_JorudanUseChargedExpress',
        type: FIELD_RADIO,
        props: 'jorudanUseChargedExpress',
      },
      {
        key: 'jorudanChargedExpressDistance',
        msgkey: 'Admin_Lbl_JorudanChargedExpressDistance',
        type: FIELD_TEXT,
        charType: 'numeric',
        size: SIZE_SMALL,
      },
      {
        key: 'jorudanSeatPreference',
        msgkey: 'Admin_Lbl_JorudanSeatPreference',
        type: FIELD_RADIO,
        props: 'jorudanSeatPreference',
      },
      {
        key: 'jorudanRouteSort',
        msgkey: 'Admin_Lbl_JorudanRouteSort',
        type: FIELD_RADIO,
        props: 'jorudanRouteSort',
      },
      {
        key: 'jorudanHighwayBus',
        msgkey: 'Admin_Lbl_JorudanHighwayBus',
        type: FIELD_RADIO,
        props: 'jorudanHighwayBus',
      },
      {
        key: 'jorudanUseExReservation',
        msgkey: 'Admin_Lbl_JorudanUseExReservation',
        type: FIELD_RADIO,
        props: 'jorudanUseExReservation',
      },
    ],
  },
  {
    section: 'CreditCardOption',
    msgkey: 'Admin_Lbl_CreditCardOption',
    isExpandable: true,
    configList: [
      {
        key: 'id',
        msgkey: 'Admin_Lbl_CreditCardCompanyId',
        type: FIELD_TEXT,
        size: SIZE_SMALL,
        readOnly: true,
        help: 'Admin_Msg_CreditCardSetting',
      },
    ],
  },
];

const configList: ConfigListMap = { base };

export default configList;
