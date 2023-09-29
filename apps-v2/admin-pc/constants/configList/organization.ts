import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import fieldType from '../fieldType';

const { FIELD_SELECT, FIELD_HIDDEN, FIELD_CHECKBOX } = fieldType;

const base: ConfigList = [
  {
    key: 'language0',
    msgkey: 'Admin_Lbl_Language0',
    title: 'Admin_Lbl_Language0',
    type: FIELD_SELECT,
    props: 'language',
    isRequired: true,
  },
  {
    key: 'language1',
    msgkey: 'Admin_Lbl_Language1',
    title: 'Admin_Lbl_Language1',
    type: FIELD_SELECT,
    props: 'language',
  }, //  { key: 'language2', msgkey: 'Admin_Lbl_Language2', title: 'Admin_Lbl_Language2', type: FIELD_SELECT, props: 'language' },
  {
    section: 'TransferSetting',
    msgkey: 'Admin_Lbl_RecordAccessTransferSetting',
    isExpandable: true,
    configList: [
      {
        key: 'remainAccessForPrevCompany',
        msgkey: 'Admin_Lbl_RAPrevCompany',
        type: FIELD_HIDDEN,
        help: 'Admin_Msg_RAPrevCompanyHelp',
        defaultValue: false,
      },
      {
        key: 'remainAccessForPrevDepartment',
        msgkey: 'Admin_Lbl_RAPrevDept',
        type: FIELD_CHECKBOX,
        help: 'Admin_Msg_RAPrevDeptHelp',
      },
      {
        key: 'remainAccessForPrevPosition',
        msgkey: 'Admin_Lbl_RAPrevPos',
        type: FIELD_CHECKBOX,
        help: 'Admin_Msg_RAPrevPosHelp',
      },
      // SP = Show Past
      {
        key: 'showPastDataForNewCompany',
        msgkey: 'Admin_Lbl_SPNewComp',
        type: FIELD_HIDDEN,
        help: 'Admin_Msg_SPNewCompHelp',
        defaultValue: false,
      },
      {
        key: 'showPastDataForNewDepartment',
        msgkey: 'Admin_Lbl_SPNewDept',
        type: FIELD_CHECKBOX,
        help: 'Admin_Msg_SPNewDeptHelp',
      },
      {
        key: 'showPastDataForNewPosition',
        msgkey: 'Admin_Lbl_SPNewPos',
        type: FIELD_CHECKBOX,
        help: 'Admin_Msg_SPNewPosHelp',
      },
    ],
  },
];

const configList: ConfigListMap = { base };

export default configList;
