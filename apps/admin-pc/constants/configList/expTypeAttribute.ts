import { Config, ConfigList, ConfigListItem } from '../../utils/ConfigUtil';

import displayType from '../displayType';
import fieldSize from '../fieldSize';
import fieldType from '../fieldType';

const { FIELD_TEXT } = fieldType;
const { SIZE_MEDIUM } = fieldSize;
const { DISPLAY_DETAIL } = displayType;

const totalNumberOfAttribute = 5;

// eslint-disable-next-line import/prefer-default-export
export const getExpTypeAttributeList = (): ConfigListItem => {
  const attributeList: ConfigList = [];
  for (let i = 1; i <= totalNumberOfAttribute; i++) {
    const index = `0${i}`.slice(-2);
    const eItem: Config = {
      key: `attrText${index}`,
      msgkey: `Exp_Clbl_ExpTypeAttrText${index}`,
      type: FIELD_TEXT,
      size: SIZE_MEDIUM,
      display: DISPLAY_DETAIL,
    };
    attributeList.push(eItem);
  }
  return {
    section: `ExpTypeAttribute`,
    msgkey: `Exp_Clbl_ExpTypeAttrText`,
    isExpandable: true,
    configList: attributeList,
  };
};
