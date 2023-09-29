import Api from '../../commons/api';

import { SearchConditions } from '../../domain/models/exp/FinanceApproval';

// eslint-disable-next-line import/prefer-default-export
export const getPersonalSetting = (): Promise<Array<SearchConditions>> => {
  return Api.invoke({
    path: '/personal-setting/get',
    param: {},
  }).then((res: { searchConditionList: Array<SearchConditions> }) => {
    return res.searchConditionList;
  });
};

// eslint-disable-next-line import/prefer-default-export
export const updatePersonalSetting = (
  searchConditionList?: Array<SearchConditions>
): Promise<any> => {
  return Api.invoke({
    path: '/personal-setting/update',
    param: { searchConditionList },
  }).catch((err) => {
    throw err;
  });
};
