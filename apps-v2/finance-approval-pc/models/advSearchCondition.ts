import Api from '../../commons/api';

import {
  FAExpSearchConditionList,
  FAPersonalSettingResponse,
  FAReqSearchConditionList,
} from '../../domain/models/exp/FinanceApproval';

// eslint-disable-next-line import/prefer-default-export
export const getPersonalSetting = (): Promise<FAPersonalSettingResponse> => {
  return Api.invoke({
    path: '/personal-setting/get',
    param: {},
  }).then(
    ({
      expReportSearchConditionList,
      expRequestSearchConditionList,
    }: FAPersonalSettingResponse) => {
      return { expReportSearchConditionList, expRequestSearchConditionList };
    }
  );
};

// eslint-disable-next-line import/prefer-default-export
export const updatePersonalSetting = (
  param?: FAReqSearchConditionList | FAExpSearchConditionList
): Promise<any> => {
  return Api.invoke({
    path: '/personal-setting/update',
    param,
  }).catch((err) => {
    throw err;
  });
};
