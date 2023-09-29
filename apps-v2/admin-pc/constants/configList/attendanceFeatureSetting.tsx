import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import OpsRecordAggregateListContainer from '../../containers/AttendanceFeatureSettingContainer/OpsRecordAggregateListContainer';

import { DailyRestCountLimit } from '../../presentational-components/AttendanceFeatureSetting/DailyRestCountLimit';

import displayType from '../displayType';
import fieldSize from '../fieldSize';
import fieldType from '../fieldType';

const { FIELD_HIDDEN, FIELD_TEXT, FIELD_CHECKBOX, FIELD_CUSTOM } = fieldType;
const { SIZE_SMALL } = fieldSize;
const { DISPLAY_DETAIL } = displayType;
const adminListBaseItem =
  'admin-pc-contents-detail-pane__body__item-list__base-item';
const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  {
    key: 'code',
    msgkey: 'Admin_Lbl_Code',
    type: FIELD_TEXT,
    enableMode: '',
  },
  {
    key: 'dailyRestCountLimit',
    msgkey: 'Att_Lbl_DailyRestCountLimit',
    type: FIELD_CUSTOM,
    Component: DailyRestCountLimit,
    display: DISPLAY_DETAIL,
    help: 'Admin_Help_DailyRestCountLimit',
  },
  {
    key: 'useMaximumLeaveCountPerDaySetting',
    msgkey: 'Att_Lbl_MaximumLeaveCountPerDay',
    type: FIELD_CHECKBOX,
    defaultValue: false,
    label: 'Admin_Lbl_SetTo10',
    display: DISPLAY_DETAIL,
    size: SIZE_SMALL,
    help: 'Admin_Help_MaximumLeaveCountPerDay',
  },
  {
    key: 'sendApprovalCancelEmail',
    msgkey: 'Att_Lbl_ApprovalCancelEmail',
    type: FIELD_CHECKBOX,
    defaultValue: true,
    label: 'Att_Lbl_Send',
    display: DISPLAY_DETAIL,
    size: SIZE_SMALL,
    help: 'Admin_Help_AttSetToSendApprovalCancelEmail',
  },
];

const history: ConfigList = [
  { key: 'baseId', type: FIELD_HIDDEN },
  {
    key: 'validDateFrom',
    type: FIELD_HIDDEN,
  },
  {
    key: 'historyComment',
    type: FIELD_HIDDEN,
  },
  {
    section: 'FunctionalControl',
    msgkey: 'Admin_Lbl_FunctionalControl',
    isExpandable: false,
    configList: [
      {
        key: 'useChangeWorkingTypeDuringMonth',
        msgkey: 'Att_Lbl_UseChangeWorkingTypeDuringMonth',
        type: FIELD_CHECKBOX,
        defaultValue: false,
        label: 'Admin_Lbl_Utilizing',
        display: DISPLAY_DETAIL,
        size: SIZE_SMALL,
      },
    ],
  },
  {
    section: 'AttOperationRecordAggregateSetting',
    msgkey: 'Admin_Lbl_AttOperationRecordAggregateSetting',
    isExpandable: false,
    configList: [
      {
        key: 'useAttOpsRecordAggregate',
        msgkey: 'Att_Lbl_UseAttOperationRecordAggregate',
        type: FIELD_CHECKBOX,
        defaultValue: false,
        label: 'Admin_Lbl_Utilizing',
        display: DISPLAY_DETAIL,
        size: SIZE_SMALL,
        help: 'Admin_Help_UseAttOperationRecordAggregate',
      },
      {
        key: 'opsRecordAggregateSetting',
        type: FIELD_CUSTOM,
        Component: OpsRecordAggregateListContainer,
        class: `${adminListBaseItem}_no_label`,
        display: DISPLAY_DETAIL,
      },
    ],
  },
];

const configList: ConfigListMap = { base, history };

export default configList;
