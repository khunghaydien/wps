import displayType from '@admin-pc/constants/displayType';
import fieldType from '@admin-pc/constants/fieldType';

import { INTEGRATION_SERVICE_LABELS } from '@apps/domain/models/exp/PaymentMethod';

import { ConfigList, ConfigListMap } from '@admin-pc/utils/ConfigUtil';

const { FIELD_CHECKBOX, FIELD_HIDDEN, FIELD_SELECT, FIELD_TEXT } = fieldType;
const { DISPLAY_DETAIL, DISPLAY_LIST } = displayType;

const base: ConfigList = [
  {
    key: 'id',
    type: FIELD_HIDDEN,
  },
  {
    key: 'companyId',
    type: FIELD_HIDDEN,
  },
  {
    key: 'code',
    msgkey: 'Admin_Lbl_Code',
    type: FIELD_TEXT,
    display: DISPLAY_LIST,
    maxLength: 20,
  },
  {
    key: 'name',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
    display: DISPLAY_LIST,
    maxLength: 80,
  },
  {
    key: 'active',
    msgkey: 'Admin_Lbl_Active',
    label: 'Admin_Lbl_Active',
    type: FIELD_CHECKBOX,
    display: DISPLAY_LIST,
  },
  {
    key: 'code',
    msgkey: 'Admin_Lbl_Code',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    isRequired: true,
    maxLength: 20,
  },
  {
    key: 'name_L0',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    isRequired: true,
    maxLength: 80,
  },
  {
    key: 'name_L1',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    maxLength: 80,
  },
  {
    key: 'name_L2',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    maxLength: 80,
  },
  {
    key: 'description_L0',
    msgkey: 'Admin_Lbl_Description',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    maxLength: 1024,
  },
  {
    key: 'description_L1',
    msgkey: 'Admin_Lbl_Description',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    maxLength: 1024,
  },
  {
    key: 'description_L2',
    msgkey: 'Admin_Lbl_Description',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    maxLength: 1024,
  },
  {
    key: 'active',
    msgkey: 'Admin_Lbl_Active',
    label: 'Admin_Lbl_Active',
    type: FIELD_CHECKBOX,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'reimbursement',
    msgkey: 'Admin_Lbl_Reimbursement',
    type: FIELD_CHECKBOX,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'integrationService',
    msgkey: 'Admin_Lbl_IntegrationService',
    help: 'Admin_Help_IntegrationService',
    type: FIELD_SELECT,
    display: DISPLAY_DETAIL,
    options: Object.keys(INTEGRATION_SERVICE_LABELS).map((key) => ({
      msgkey: INTEGRATION_SERVICE_LABELS[key],
      value: key,
    })),
    isRequired: true,
  },
  {
    key: 'accountCode',
    msgkey: 'Admin_Lbl_AccountCode',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    maxLength: 20,
    isRequired: true,
    condition: (baseValueGetter) => !baseValueGetter('reimbursement'),
  },
  {
    key: 'accountName',
    msgkey: 'Admin_Lbl_AccountName',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    maxLength: 80,
    condition: (baseValueGetter) => !baseValueGetter('reimbursement'),
  },
  {
    key: 'subAccountCode',
    msgkey: 'Admin_Lbl_SubAccountCode',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    maxLength: 20,
    condition: (baseValueGetter) => !baseValueGetter('reimbursement'),
  },
  {
    key: 'subAccountName',
    msgkey: 'Admin_Lbl_SubAccountName',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    maxLength: 80,
    condition: (baseValueGetter) => !baseValueGetter('reimbursement'),
  },
];

const configList: ConfigListMap = {
  base,
};

export default configList;
