import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import displayType from '../displayType';
import fieldSize from '../fieldSize';
import fieldType from '../fieldType';

const {
  FIELD_HIDDEN,
  FIELD_TEXT,
  FIELD_TIME,
  FIELD_VALID_DATE,
  FIELD_SELECT,
  FIELD_SELECT_WITH_PLACEHOLDER,
} = fieldType;
const { SIZE_LARGE } = fieldSize;
const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;

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
    key: 'workSystem',
    msgkey: 'Admin_Lbl_WorkingTypeWorkSystem',
    type: FIELD_SELECT,
    props: 'workSystem',
    multiLanguageValue: true,
    isRequired: true,
    enableMode: 'new',
  },
  {
    key: 'reasonId',
    msgkey: 'Admin_Lbl_Reason',
    type: FIELD_SELECT_WITH_PLACEHOLDER,
    dependent: 'reason',
    props: 'reasonId',
    isRequired: true,
  },
];

const history: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  { key: 'baseId', type: FIELD_HIDDEN },
  {
    key: 'validDateFrom',
    msgkey: 'Admin_Lbl_ValidDate',
    type: FIELD_VALID_DATE,
    size: SIZE_LARGE,
    display: DISPLAY_DETAIL,
  },
  { key: 'validDateTo', type: FIELD_HIDDEN },
  {
    key: 'comment',
    msgkey: 'Admin_Lbl_ReasonForRevision',
    type: FIELD_TEXT,
    size: SIZE_LARGE,
    display: DISPLAY_DETAIL,
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
  }, // {
  //   section: 'AllowableTimeOfShortTimeWorkForFix',
  //   msgkey: 'Admin_Lbl_AllowableTimeOfShortTimeWork',
  //   descriptionKey: 'Admin_Msg_DescAllowableShortenTime',
  //   condition: (baseValueGetter) => baseValueGetter('workSystem') === 'JP:Fix',
  //   isExpandable: true,
  //   configList: [
  //     {
  //       key: 'allowableTimeOfShortWork',
  //       msgkey: 'Att_Lbl_Total',
  //       type: FIELD_TIME,
  //       display: DISPLAY_DETAIL,
  //       isRequired: true,
  //     },
  //     {
  //       key: 'allowableTimeOfLateArrival',
  //       msgkey: 'Att_Lbl_LateArrival',
  //       type: FIELD_TIME,
  //       display: DISPLAY_DETAIL,
  //       isRequired: true,
  //     },
  //     {
  //       key: 'allowableTimeOfEarlyLeave',
  //       msgkey: 'Att_Lbl_EarlyLeave',
  //       type: FIELD_TIME,
  //       display: DISPLAY_DETAIL,
  //       isRequired: true,
  //     },
  //     {
  //       key: 'allowableTimeOfIrregularRest',
  //       msgkey: 'Att_Lbl_BreakLost',
  //       type: FIELD_TIME,
  //       display: DISPLAY_DETAIL,
  //       isRequired: true,
  //     },
  //   ],
  // },
  // Below setting is for Flex.
  {
    section: 'AllowableTimeOfShortTimeWorkForFlex',
    msgkey: 'Admin_Lbl_AllowableTimeOfShortTimeWorkForFlex',
    condition: (baseValueGetter) => baseValueGetter('workSystem') === 'JP:Flex',
    isExpandable: true,
    configList: [
      {
        key: 'allowableTimeOfShortWork',
        msgkey: 'Admin_Lbl_PerDay',
        type: FIELD_TIME,
        display: DISPLAY_DETAIL,
        isRequired: true,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Flex',
      },
    ],
  },
  {
    section: 'AllowableTimeOfShortTimeWorkInCoreTime',
    msgkey: 'Admin_Lbl_AllowableTimeOfShortTimeWorkInCoreTime',
    descriptionKey: 'Admin_Msg_DescAllowableShortenTimeForFlex',
    condition: (baseValueGetter) => baseValueGetter('workSystem') === 'JP:Flex',
    isExpandable: true,
    configList: [
      {
        key: 'allowableTimeOfLateArrival',
        msgkey: 'Att_Lbl_LateArrival',
        type: FIELD_TIME,
        display: DISPLAY_DETAIL,
        isRequired: true,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Flex',
      },
      {
        key: 'allowableTimeOfEarlyLeave',
        msgkey: 'Att_Lbl_EarlyLeave',
        type: FIELD_TIME,
        display: DISPLAY_DETAIL,
        isRequired: true,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Flex',
      },
    ],
  }, // Below is for Fix and Modified work system.
  {
    section: 'AllowableTimeOfShortTimeWorkInCoreTime',
    msgkey: 'Admin_Lbl_AllowableTimeOfShortTimeWork',
    condition: (baseValueGetter) =>
      baseValueGetter('workSystem') === 'JP:Fix' ||
      baseValueGetter('workSystem') === 'JP:Modified',
    isExpandable: true,
    configList: [
      {
        key: 'allowableTimeOfShortWork',
        msgkey: 'Admin_Lbl_PerDay',
        type: FIELD_TIME,
        display: DISPLAY_DETAIL,
        isRequired: true,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Fix' ||
          baseValueGetter('workSystem') === 'JP:Modified',
      },
      {
        key: 'allowableTimeOfLateArrival',
        msgkey: 'Att_Lbl_LateArrival',
        type: FIELD_TIME,
        display: DISPLAY_DETAIL,
        isRequired: true,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Fix' ||
          baseValueGetter('workSystem') === 'JP:Modified',
      },
      {
        key: 'allowableTimeOfEarlyLeave',
        msgkey: 'Att_Lbl_EarlyLeave',
        type: FIELD_TIME,
        display: DISPLAY_DETAIL,
        isRequired: true,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Fix' ||
          baseValueGetter('workSystem') === 'JP:Modified',
      },
      {
        key: 'allowableTimeOfIrregularRest',
        msgkey: 'Att_Lbl_BreakLost',
        type: FIELD_TIME,
        display: DISPLAY_DETAIL,
        isRequired: true,
        condition: (baseValueGetter) =>
          baseValueGetter('workSystem') === 'JP:Fix' ||
          baseValueGetter('workSystem') === 'JP:Modified',
      },
    ],
  },
];

const configList: ConfigListMap = { base, history };

export default configList;
