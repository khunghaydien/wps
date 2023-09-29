import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import displayType from '../displayType';
import fieldSize from '../fieldSize';
import fieldType from '../fieldType';

const { FIELD_NONE, FIELD_HIDDEN, FIELD_TEXT, FIELD_SELECT, FIELD_CHECKBOX } =
  fieldType;
const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;
const { SIZE_SMALL } = fieldSize;

const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  {
    key: 'code',
    msgkey: 'Admin_Lbl_Code',
    type: FIELD_TEXT,
    isRequired: true,
    enableMode: 'new',
  },
  {
    key: 'name',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
    display: DISPLAY_LIST,
  },
  {
    key: 'name_L0',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    isRequired: true,
  },
  {
    key: 'name_L1',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'name_L2',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'countryId',
    msgkey: 'Admin_Lbl_Country',
    type: FIELD_SELECT,
    props: 'countryId',
    dependent: 'country',
    isRequired: true,
  },
  {
    key: 'language',
    msgkey: 'Admin_Lbl_DefaultLanguage',
    type: FIELD_SELECT,
    props: 'defaultLanguage',
    isRequired: true,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'languageName',
    msgkey: 'Admin_Lbl_DefaultLanguage',
    type: FIELD_NONE,
    display: DISPLAY_LIST,
  }, // Temporary implementation for Planner Default View
  // TODO Move these items to Company Setting
  // TODO Remove the translations used here
  {
    section: 'AppearanceSetting',
    msgkey: 'Admin_Lbl_PlannerSetting',
    isExpandable: true,
    configList: [
      {
        key: 'plannerDefaultView',
        msgkey: 'Admin_Lbl_PlannerDefaultView',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
      },
    ],
  },
  {
    section: 'BaseCurrencySetting',
    msgkey: 'Admin_Lbl_MasterCurrencySetting',
    isExpandable: true,
    configList: [
      {
        key: 'currencyId',
        msgkey: 'Admin_Lbl_CurrencyCode',
        type: FIELD_SELECT,
        props: 'currencyId',
        display: DISPLAY_DETAIL,
        size: SIZE_SMALL,
      },
    ],
  },
];

const configList: ConfigListMap = { base };

export default configList;
