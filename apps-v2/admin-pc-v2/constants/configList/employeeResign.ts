import displayType from '@admin-pc/constants/displayType';
import fieldSize from '@admin-pc/constants/fieldSize';
import fieldType from '@admin-pc/constants/fieldType';

import { ConfigList, ConfigListMap } from '@admin-pc/utils/ConfigUtil';

import { base, revisionTypes } from './employee';

const { FIELD_HIDDEN, FIELD_TEXT, FIELD_DATE, FIELD_SELECT_WITH_PLACEHOLDER } =
  fieldType;
const { SIZE_LARGE } = fieldSize;
const { DISPLAY_DETAIL } = displayType;

const history: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  { key: 'baseId', type: FIELD_HIDDEN },
  {
    key: 'primary',
    type: FIELD_HIDDEN,
    defaultValue: false,
  },
  { key: 'companyId', type: FIELD_HIDDEN, isRequired: true },
  { key: 'departmentId', type: FIELD_HIDDEN, isRequired: true },
  { key: 'positionId', type: FIELD_HIDDEN },
  {
    key: 'revisionType',
    msgkey: 'Admin_Lbl_Status',
    type: FIELD_SELECT_WITH_PLACEHOLDER,
    props: 'revisionType',
    display: DISPLAY_DETAIL,
    isRequired: true,
    options: revisionTypes,
    enableMode: ['revision'],
    multiLanguageValue: true,
    disableReset: true,
  },
  {
    key: 'resignationDate',
    msgkey: 'Admin_Lbl_ResignationDate',
    type: FIELD_DATE,
    display: DISPLAY_DETAIL,
    isRequired: true,
    enableMode: ['new', 'add_sub_role', 'revision'],
    condition: (baseValueGetter, historyValueGetter) =>
      historyValueGetter('primary') === true,
  },
  {
    key: 'resignationDate',
    msgkey: 'Admin_Lbl_EndDate',
    type: FIELD_DATE,
    display: DISPLAY_DETAIL,
    isRequired: true,
    enableMode: ['new', 'add_sub_role', 'revision'],
    condition: (baseValueGetter, historyValueGetter) =>
      !historyValueGetter('primary'),
  },
  { key: 'validDateTo', type: FIELD_HIDDEN },
  {
    key: 'comment',
    msgkey: 'Admin_Lbl_ReasonForRevision',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    size: SIZE_LARGE,
    enableMode: ['new', 'add_sub_role', 'revision'],
  },
];

const configList: ConfigListMap = { base, history };

export default configList;
