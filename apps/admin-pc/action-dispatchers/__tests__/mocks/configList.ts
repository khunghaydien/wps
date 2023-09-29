import FIELD_TYPE from '../../../constants/fieldType';

import { ConfigList } from '../../../utils/ConfigUtil';

// @ts-ignore
export const require: ConfigList = [
  {
    key: 'key',
    type: FIELD_TYPE.FIELD_HIDDEN,
    isRequired: true,
  },
];

export const hasAction: ConfigList = [
  {
    key: 'key',
    type: FIELD_TYPE.FIELD_HIDDEN,
    action: 'actionName',
  },
];

export const simpleHistory: ConfigList = [
  {
    key: 'key',
    type: FIELD_TYPE.FIELD_HIDDEN,
  },
  {
    key: 'baseId',
    type: FIELD_TYPE.FIELD_HIDDEN,
  },
  {
    key: 'validDateFrom',
    type: FIELD_TYPE.FIELD_HIDDEN,
  },
];
