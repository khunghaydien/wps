import Api from '../../../commons/api';

export type MobileSetting = {
  readonly requireLocationAtMobileStamp: boolean;
};

export const fetch = (param: { companyId: string }): Promise<MobileSetting> =>
  Api.invoke({
    path: '/company/mobile-setting/get',
    param,
  });

export const save = (
  companyId: string,
  mobileSetting: MobileSetting
): Promise<void> =>
  Api.invoke({
    path: '/company/mobile-setting/save',
    param: {
      companyId,
      ...mobileSetting,
    },
  });

export default {
  fetch,
  save,
};
