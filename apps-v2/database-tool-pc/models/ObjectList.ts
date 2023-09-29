import Api from '../../commons/api';

export type sObj = {
  name: string;
  localName: string;
  label: string;
  labelPlural: string;
  keyPrefix: string;
  isAccessible: boolean;
  isCreatable: boolean;
  isCustom: boolean;
  isCustomSetting: boolean;
  isDeletable: boolean;
  isDeprecatedAndHidden: boolean;
  isFeedEnabled: boolean;
  isMergeable: boolean;
  isQueryable: boolean;
  isSearchable: boolean;
  isUndeletable: boolean;
  isUpdatable: boolean;
};

export type sObjList = {
  [key: string]: sObj;
};

export type sObjListRes = { records: sObjList };

// eslint-disable-next-line import/prefer-default-export
export const getObjectList = (): Promise<sObjListRes> => {
  return Api.invoke({
    path: '/db-tool/sobject/list',
  })
    .then((response: sObjListRes) => response)
    .catch((err) => {
      throw err;
    });
};
