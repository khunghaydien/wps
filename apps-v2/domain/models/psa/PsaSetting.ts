import Api from '../../../commons/api';

export type PsaSetting = {
  allowCrossGroupSearch: boolean;
  defaultWorkTime: number;
  id: string;
  useExistingJobCode: boolean;
  enableProjectFinance: boolean;
  enableExpIntegration: boolean;
  useAttForCapacity: boolean;
};

export type GetPsaSettingResponse = {
  setting: PsaSetting;
};

export const initialState = null;

export const getPsaSetting = (companyId: string): Promise<PsaSetting> => {
  return Api.invoke({
    path: '/psa/setting/get',
    param: { companyId },
  }).then((response: GetPsaSettingResponse) => response.setting);
};
