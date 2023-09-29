import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import ExtendedItemCode from '../../presentational-components/AttRecordExtendedItemSet/ExtendItemComponent';

import displayType from '../displayType';
import fieldType from '../fieldType';

const { FIELD_HIDDEN, FIELD_TEXT, FIELD_CHECKBOX, FIELD_CUSTOM } = fieldType;
const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;

const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  { key: 'code', msgkey: 'Admin_Lbl_Code', type: FIELD_TEXT, isRequired: true },
  { key: 'companyId', type: FIELD_HIDDEN, isRequired: true },
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
    section: 'ExtendedItemText',
    msgkey: 'Admin_Lbl_AttExtendedItemText',
    isExpandable: true,
    configList: [
      {
        key: 'extendedItemText01Code',
        msgkey: 'Admin_Lbl_AttExtendedItemText01',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemText01Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemText01Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemText01Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemText01Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemText02Code',
        msgkey: 'Admin_Lbl_AttExtendedItemText02',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemText02Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemText02Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemText02Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemText02Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemText03Code',
        msgkey: 'Admin_Lbl_AttExtendedItemText03',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemText03Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemText03Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemText03Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemText03Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemText04Code',
        msgkey: 'Admin_Lbl_AttExtendedItemText04',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemText04Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemText04Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemText04Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemText04Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemText05Code',
        msgkey: 'Admin_Lbl_AttExtendedItemText05',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemText05Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemText05Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemText05Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemText05Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemText06Code',
        msgkey: 'Admin_Lbl_AttExtendedItemText06',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemText06Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemText06Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemText06Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemText06Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemText07Code',
        msgkey: 'Admin_Lbl_AttExtendedItemText07',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemText07Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemText07Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemText07Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemText07Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemText08Code',
        msgkey: 'Admin_Lbl_AttExtendedItemText08',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemText08Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemText08Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemText08Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemText08Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemText09Code',
        msgkey: 'Admin_Lbl_AttExtendedItemText09',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemText09Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemText09Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemText09Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemText09Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemText10Code',
        msgkey: 'Admin_Lbl_AttExtendedItemText10',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemText10Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemText10Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemText10Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemText10Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
    ],
  },
  {
    section: 'ExtendedItemNumeric',
    msgkey: 'Admin_Lbl_AttExtendedItemNumeric',
    isExpandable: true,
    configList: [
      {
        key: 'extendedItemNumeric01Code',
        msgkey: 'Admin_Lbl_AttExtendedItemNumeric01',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemNumeric01Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemNumeric01Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemNumeric01Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemNumeric01Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemNumeric02Code',
        msgkey: 'Admin_Lbl_AttExtendedItemNumeric02',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemNumeric02Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemNumeric02Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemNumeric02Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemNumeric02Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemNumeric03Code',
        msgkey: 'Admin_Lbl_AttExtendedItemNumeric03',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemNumeric03Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemNumeric03Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemNumeric03Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemNumeric03Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemNumeric04Code',
        msgkey: 'Admin_Lbl_AttExtendedItemNumeric04',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemNumeric04Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemNumeric04Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemNumeric04Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemNumeric04Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemNumeric05Code',
        msgkey: 'Admin_Lbl_AttExtendedItemNumeric05',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemNumeric05Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemNumeric05Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemNumeric05Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemNumeric05Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemNumeric06Code',
        msgkey: 'Admin_Lbl_AttExtendedItemNumeric06',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemNumeric06Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemNumeric06Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemNumeric06Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemNumeric06Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemNumeric07Code',
        msgkey: 'Admin_Lbl_AttExtendedItemNumeric07',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemNumeric07Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemNumeric07Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemNumeric07Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemNumeric07Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemNumeric08Code',
        msgkey: 'Admin_Lbl_AttExtendedItemNumeric08',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemNumeric08Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemNumeric08Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemNumeric08Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemNumeric08Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemNumeric09Code',
        msgkey: 'Admin_Lbl_AttExtendedItemNumeric09',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemNumeric09Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemNumeric09Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemNumeric09Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemNumeric09Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemNumeric10Code',
        msgkey: 'Admin_Lbl_AttExtendedItemNumeric10',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemNumeric10Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemNumeric10Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemNumeric10Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemNumeric10Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
    ],
  },
  {
    section: 'ExtendedItemPickList',
    msgkey: 'Admin_Lbl_AttExtendedItemPickList',
    isExpandable: true,
    configList: [
      {
        key: 'extendedItemPickList01Code',
        msgkey: 'Admin_Lbl_AttExtendedItemPickList01',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemPickList01Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemPickList01Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemPickList01Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemPickList01Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemPickList02Code',
        msgkey: 'Admin_Lbl_AttExtendedItemPickList02',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemPickList02Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemPickList02Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemPickList02Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemPickList02Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemPickList03Code',
        msgkey: 'Admin_Lbl_AttExtendedItemPickList03',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemPickList03Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemPickList03Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemPickList03Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemPickList03Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemPickList04Code',
        msgkey: 'Admin_Lbl_AttExtendedItemPickList04',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemPickList04Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemPickList04Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemPickList04Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemPickList04Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemPickList05Code',
        msgkey: 'Admin_Lbl_AttExtendedItemPickList05',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemPickList05Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemPickList05Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemPickList05Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemPickList05Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemPickList06Code',
        msgkey: 'Admin_Lbl_AttExtendedItemPickList06',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemPickList06Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemPickList06Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemPickList06Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemPickList06Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemPickList07Code',
        msgkey: 'Admin_Lbl_AttExtendedItemPickList07',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemPickList07Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemPickList07Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemPickList07Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemPickList07Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemPickList08Code',
        msgkey: 'Admin_Lbl_AttExtendedItemPickList08',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemPickList08Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemPickList08Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemPickList08Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemPickList08Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemPickList09Code',
        msgkey: 'Admin_Lbl_AttExtendedItemPickList09',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemPickList09Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemPickList09Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemPickList09Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemPickList09Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemPickList10Code',
        msgkey: 'Admin_Lbl_AttExtendedItemPickList10',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemPickList10Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemPickList10Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemPickList10Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemPickList10Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
    ],
  },
  {
    section: 'ExtendedItemDate',
    msgkey: 'Admin_Lbl_AttExtendedItemDate',
    isExpandable: true,
    configList: [
      {
        key: 'extendedItemDate01Code',
        msgkey: 'Admin_Lbl_AttExtendedItemDate01',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemDate01Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemDate01Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemDate01Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemDate01Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemDate02Code',
        msgkey: 'Admin_Lbl_AttExtendedItemDate02',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemDate02Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemDate02Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemDate02Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemDate02Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemDate03Code',
        msgkey: 'Admin_Lbl_AttExtendedItemDate03',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemDate03Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemDate03Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemDate03Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemDate03Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemDate04Code',
        msgkey: 'Admin_Lbl_AttExtendedItemDate04',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemDate04Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemDate04Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemDate04Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemDate04Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemDate05Code',
        msgkey: 'Admin_Lbl_AttExtendedItemDate05',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemDate05Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemDate05Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemDate05Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemDate05Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemDate06Code',
        msgkey: 'Admin_Lbl_AttExtendedItemDate06',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemDate06Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemDate06Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemDate06Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemDate06Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemDate07Code',
        msgkey: 'Admin_Lbl_AttExtendedItemDate07',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemDate07Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemDate07Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemDate07Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemDate07Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemDate08Code',
        msgkey: 'Admin_Lbl_AttExtendedItemDate08',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemDate08Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemDate08Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemDate08Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemDate08Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemDate09Code',
        msgkey: 'Admin_Lbl_AttExtendedItemDate09',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemDate09Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemDate09Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemDate09Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemDate09Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemDate10Code',
        msgkey: 'Admin_Lbl_AttExtendedItemDate10',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemDate10Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemDate10Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemDate10Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemDate10Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
    ],
  },
  {
    section: 'ExtendedItemTime',
    msgkey: 'Admin_Lbl_AttExtendedItemTime',
    isExpandable: true,
    configList: [
      {
        key: 'extendedItemTime01Code',
        msgkey: 'Admin_Lbl_AttExtendedItemTime01',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemTime01Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemTime01Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemTime01Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemTime01Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemTime02Code',
        msgkey: 'Admin_Lbl_AttExtendedItemTime02',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemTime02Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemTime02Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemTime02Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemTime02Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemTime03Code',
        msgkey: 'Admin_Lbl_AttExtendedItemTime03',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemTime03Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemTime03Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemTime03Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemTime03Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemTime04Code',
        msgkey: 'Admin_Lbl_AttExtendedItemTime04',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemTime04Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemTime04Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemTime04Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemTime04Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemTime05Code',
        msgkey: 'Admin_Lbl_AttExtendedItemTime05',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemTime05Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemTime05Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemTime05Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemTime05Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemTime06Code',
        msgkey: 'Admin_Lbl_AttExtendedItemTime06',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemTime06Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemTime06Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemTime06Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemTime06Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemTime07Code',
        msgkey: 'Admin_Lbl_AttExtendedItemTime07',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemTime07Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemTime07Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemTime07Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemTime07Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemTime08Code',
        msgkey: 'Admin_Lbl_AttExtendedItemTime08',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemTime08Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemTime08Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemTime08Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemTime08Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemTime09Code',
        msgkey: 'Admin_Lbl_AttExtendedItemTime09',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemTime09Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemTime09Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemTime09Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemTime09Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
      {
        key: 'extendedItemTime10Code',
        msgkey: 'Admin_Lbl_AttExtendedItemTime10',
        type: FIELD_CUSTOM,
        Component: ExtendedItemCode,
        display: DISPLAY_DETAIL,
      },
      {
        key: 'extendedItemTime10Name_L0',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemTime10Name_L1',
        msgkey: 'Admin_Lbl_ItemName',
        type: FIELD_TEXT,
        display: DISPLAY_DETAIL,
      },

      {
        key: 'extendedItemTime10Name_L2',
        display: DISPLAY_DETAIL,
        type: FIELD_HIDDEN,
      },

      {
        key: 'extendedItemTime10Required',
        msgkey: 'Com_Lbl_Required',
        type: FIELD_CHECKBOX,
        display: DISPLAY_DETAIL,
        defaultValue: false,
      },
    ],
  },
];

const configList: ConfigListMap = { base };

export default configList;
