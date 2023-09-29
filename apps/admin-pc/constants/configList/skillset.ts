import { RATING_TYPE } from '../../../domain/models/psa/Skillset';

import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import displayType from '../displayType';
import fieldType from '../fieldType';

const { FIELD_HIDDEN, FIELD_TEXT, FIELD_TEXTAREA, FIELD_SELECT } = fieldType;
const { DISPLAY_LIST, DISPLAY_DETAIL } = displayType;

const ratingTypeOptions = [
  {
    msgkey: 'Admin_Lbl_PsaRatingSettingNone',
    value: RATING_TYPE.None,
  },
  {
    msgkey: 'Admin_Lbl_PsaRatingSettingScore',
    value: RATING_TYPE.Score,
  },
  {
    msgkey: 'Admin_Lbl_PsaRatingSettingGrade',
    value: RATING_TYPE.Grade,
  },
];

const base: ConfigList = [
  { key: 'id', type: FIELD_HIDDEN },
  { key: 'companyId', type: FIELD_HIDDEN, isRequired: true },
  {
    key: 'code',
    class: 'psa__skillset__code',
    msgkey: 'Admin_Lbl_Code',
    type: FIELD_TEXT,
    isRequired: true,
  },
  {
    key: 'name',
    msgkey: 'Admin_Lbl_Name',
    class: 'psa__skillset__name',
    type: FIELD_TEXT,
    display: DISPLAY_LIST,
  },
  {
    key: 'categoryName',
    msgkey: 'Psa_Lbl_SkillsetCategory',
    class: 'psa__skillset__category-name',
    type: FIELD_TEXT,
    display: DISPLAY_LIST,
  },
  {
    key: 'ratingType',
    msgkey: 'Admin_Lbl_RatingType',
    class: 'psa__skillset__rating-type',
    type: FIELD_SELECT,
    multiLanguageValue: true,
    display: DISPLAY_LIST,
  },
  {
    key: 'name_L0',
    msgkey: 'Admin_Lbl_Name',
    class: 'psa__skillset__name--us',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    isRequired: true,
  },
  {
    key: 'name_L1',
    msgkey: 'Admin_Lbl_Name',
    class: 'psa__skillset__name--ja',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'name_L2',
    msgkey: 'Admin_Lbl_Name',
    class: 'psa__skillset__name',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'categoryId',
    msgkey: 'Admin_Lbl_Category',
    type: FIELD_SELECT,
    props: 'categoryId',
    action: 'searchCategory',
    isRequired: true,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'ratingType',
    msgkey: 'Admin_Lbl_RatingType',
    type: FIELD_SELECT,
    options: ratingTypeOptions,
    multiLanguageValue: true,
    isRequired: true,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'grades',
    msgkey: 'Admin_Lbl_PsaRatingSettingGrade',
    type: FIELD_TEXTAREA,
    condition: (baseValueGetter) =>
      baseValueGetter('ratingType') === RATING_TYPE.Grade,
    isRequired: true,
    display: DISPLAY_DETAIL,
    help: 'Admin_Help_PsaGrade',
  },
];

const configList: ConfigListMap = { base };

export default configList;
