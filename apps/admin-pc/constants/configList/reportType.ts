import {
  CUSTOM_REQUEST_LINK_USAGE_TYPE,
  FILE_ATTACHMENT_TYPE,
} from '../../../domain/models/exp/Report';

import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import ExpTypeLinkConfigComponent from '../../components/ExpenseTypeLinkConfig/ExpTypeLinkConfigComponent';
import ReportLinkExpGridComponent from '../../components/ExpenseTypeLinkConfig/ReportLinkExpGridComponent';
import EILayoutConfigAreaComponent from '../../components/ExtendedItemLayoutConfig/EILayoutConfigAreaComponent';
import EILayoutConfigComponent from '../../components/ExtendedItemLayoutConfig/EILayoutConfigComponent';

import displayType from '../displayType';
import fieldType from '../fieldType';
import { getExtendedItemList } from './extendedItemSetting';

const { FIELD_HIDDEN, FIELD_TEXT, FIELD_CHECKBOX, FIELD_SELECT, FIELD_CUSTOM } =
  fieldType;
const { DISPLAY_DETAIL, DISPLAY_LIST } = displayType;

const adminListBaseItem =
  'admin-pc-contents-detail-pane__body__item-list__base-item';

const fileAttachmentOptions = [
  {
    msgkey: 'Exp_Sel_Optional',
    value: FILE_ATTACHMENT_TYPE.Optional,
  },
  {
    msgkey: 'Exp_Sel_Required',
    value: FILE_ATTACHMENT_TYPE.Required,
  },
  {
    msgkey: 'Exp_Sel_NoUsed',
    value: FILE_ATTACHMENT_TYPE.NotUsed,
  },
];

const customRequestLinkUsageOptions = [
  {
    msgkey: 'Exp_Sel_Optional',
    value: CUSTOM_REQUEST_LINK_USAGE_TYPE.Optional,
  },
  {
    msgkey: 'Exp_Sel_Required',
    value: CUSTOM_REQUEST_LINK_USAGE_TYPE.Required,
  },
  {
    msgkey: 'Exp_Sel_NoUsed',
    value: CUSTOM_REQUEST_LINK_USAGE_TYPE.NotUsed,
  },
];

const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  { key: 'companyId', type: FIELD_HIDDEN, isRequired: true },
  {
    key: 'code',
    msgkey: 'Admin_Lbl_Code',
    type: FIELD_TEXT,
    isRequired: true,
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
    key: 'description_L0',
    msgkey: 'Admin_Lbl_Description',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'description_L1',
    msgkey: 'Admin_Lbl_Description',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'active',
    msgkey: 'Admin_Lbl_Active',
    label: 'Admin_Msg_Active',
    type: FIELD_CHECKBOX,
  },
  {
    key: 'requestRequired',
    msgkey: 'Admin_Lbl_RequestRequire',
    type: FIELD_CHECKBOX,
    display: DISPLAY_DETAIL,
    help: 'Admin_Help_RequestRequired',
  },
  {
    key: `costCenterUsedIn`,
    msgkey: `Admin_Lbl_ExpCostCenterUsedIn`,
    props: 'costCenterUsedOption',
    type: FIELD_SELECT,
    display: DISPLAY_DETAIL,
    multiLanguageValue: true,
  },
  {
    key: `costCenterRequiredFor`,
    msgkey: 'Admin_Lbl_ExpCostCenterRequiredFor',
    props: 'costCenterUsedOption',
    type: FIELD_SELECT,
    display: DISPLAY_DETAIL,
    multiLanguageValue: true,
  },
  {
    key: `jobUsedIn`,
    msgkey: `Admin_Lbl_JobUsedIn`,
    props: 'jobUsedOption',
    type: FIELD_SELECT,
    display: DISPLAY_DETAIL,
    multiLanguageValue: true,
  },
  {
    key: `jobRequiredFor`,
    msgkey: 'Admin_Lbl_JobRequiredFor',
    props: 'jobUsedOption',
    type: FIELD_SELECT,
    display: DISPLAY_DETAIL,
    multiLanguageValue: true,
  },
  {
    key: `vendorUsedIn`,
    msgkey: `Admin_Lbl_ExpVendorUsedIn`,
    props: 'vendorUsedOption',
    type: FIELD_SELECT,
    display: DISPLAY_DETAIL,
    multiLanguageValue: true,
  },
  {
    key: `vendorRequiredFor`,
    msgkey: 'Admin_Lbl_ExpVendorRequiredFor',
    props: 'vendorUsedOption',
    type: FIELD_SELECT,
    display: DISPLAY_DETAIL,
    multiLanguageValue: true,
  },
  {
    key: 'fileAttachment',
    msgkey: 'Admin_Lbl_UseFileAttachment',
    options: fileAttachmentOptions,
    type: FIELD_SELECT,
    isRequired: true,
    multiLanguageValue: true,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'customRequestLinkUsage',
    msgkey: 'Admin_Lbl_CustomRequestLinkUsage',
    options: customRequestLinkUsageOptions,
    type: FIELD_SELECT,
    isRequired: true,
    multiLanguageValue: true,
    display: DISPLAY_DETAIL,
    help: 'Admin_Help_CustomRequestLinkUsage',
  },
  {
    key: 'expenseConfig',
    class: 'admin-pc-contents-detail-pane__body__item-list__exp_config',
    msgkey: 'Admin_Lbl_ExpenseTypeConfig',
    type: FIELD_CUSTOM,
    useFunction: 'useExpense',
    Component: ExpTypeLinkConfigComponent,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'expTypeIds',
    class: `${adminListBaseItem}_expense_type_grid`,
    msgkey: 'Admin_Lbl_ExpenseTypeConfig',
    type: FIELD_CUSTOM,
    useFunction: 'useExpense',
    Component: ReportLinkExpGridComponent,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'eiLayoutConfig',
    class: `${adminListBaseItem}_ei_layout_config`,
    msgkey: 'Admin_Lbl_ExpenseEILayout',
    type: FIELD_CUSTOM,
    useFunction: 'useExpense',
    Component: EILayoutConfigComponent,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'fieldCustomLayout',
    class: `${adminListBaseItem}_ei_layout_area`,
    msgkey: 'Admin_Lbl_ExpenseEILayout',
    type: FIELD_CUSTOM,
    useFunction: 'useExpense',
    Component: EILayoutConfigAreaComponent,
    display: DISPLAY_DETAIL,
  },
  getExtendedItemList('Text'),
  getExtendedItemList('Picklist'),
  getExtendedItemList('Date'),
  getExtendedItemList('Lookup'),
];

const configList: ConfigListMap = { base };

export default configList;
