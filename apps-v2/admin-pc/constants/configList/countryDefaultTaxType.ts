import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import displayType from '../displayType';
import fieldSize from '../fieldSize';
import fieldType from '../fieldType';

const { FIELD_HIDDEN, FIELD_TEXT, FIELD_SELECT, FIELD_VALID_DATE } = fieldType;
const { SIZE_LARGE } = fieldSize;
const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;

const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  { key: 'code', msgkey: 'Admin_Lbl_Code', type: FIELD_TEXT, isRequired: true },
  {
    key: 'countryId',
    msgkey: 'Admin_Lbl_Country',
    type: FIELD_SELECT,
    props: 'countryId',
    dependent: 'country',
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
  },
  {
    key: 'rate',
    msgkey: 'Admin_Lbl_TaxRate',
    type: FIELD_TEXT,
    charType: 'numeric',
    isRequired: true,
  },
];

const configList: ConfigListMap = { base, history };

export default configList;
