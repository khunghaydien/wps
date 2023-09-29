import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import fieldType from '../fieldType';

const { FIELD_NONE, FIELD_CHECKBOX, FIELD_HIDDEN } = fieldType;

const base: ConfigList = [
  { key: 'companyId', type: FIELD_HIDDEN, isRequired: true },
  {
    section: 'CalendarAccess',
    msgkey: 'Admin_Lbl_CalendarAccess',
    descriptionKey: 'Admin_Msg_CalendarAccessOffice365',
    isExpandable: true,
    configList: [
      {
        key: 'useCalendarAccess',
        msgkey: 'Admin_Lbl_CalendarAccessFunction',
        title: 'Admin_Lbl_CalendarAccessFunction',
        label: 'Admin_Lbl_CalendarAccessEnable',
        type: FIELD_CHECKBOX,
      },
      {
        key: 'authStatus',
        msgkey: 'Admin_Lbl_CalendarAccessAuthorization',
        title: 'Admin_Lbl_CalendarAccessAuthorization',
        enableMode: '',
        type: FIELD_NONE,
      },
    ],
  },
];

const configList: ConfigListMap = { base };

export default configList;
