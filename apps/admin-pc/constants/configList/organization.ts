import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import fieldType from '../fieldType';

const { FIELD_SELECT } = fieldType;

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
];

const configList: ConfigListMap = { base };

export default configList;
