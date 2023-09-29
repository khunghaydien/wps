import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

// NOTE
// "Mobile" menu are hidden when "useAttendance" is false.
// You can find the reason in companySetting.js
import fieldType from '../fieldType';

const { FIELD_CHECKBOX, FIELD_HIDDEN } = fieldType;

const base: ConfigList = [
  { key: 'companyId', type: FIELD_HIDDEN, isRequired: true },
  {
    key: 'requireLocationAtMobileStamp',
    msgkey: 'Admin_Lbl_RequireLocationAtMobileStamp',
    title: 'Admin_Lbl_RequireLocationAtMobileStamp',
    help: 'Admin_Help_RequireLocationAtMobileStamp',
    type: FIELD_CHECKBOX,
  },
  {
    key: 'useManageCommuteCountAtMobileStamp',
    msgkey: 'Admin_Lbl_UseManageCommuteCountAtMobileStamp',
    title: 'Admin_Lbl_UseManageCommuteCountAtMobileStamp',
    type: FIELD_CHECKBOX,
  },
  {
    key: 'useDailyFixRequestAtMobileStamp',
    msgkey: 'Admin_Lbl_UseDailyFixRequestAtMobileStamp',
    title: 'Admin_Lbl_UseDailyFixRequestAtMobileStamp',
    type: FIELD_CHECKBOX,
  },
];

const configList: ConfigListMap = { base };

export default configList;
