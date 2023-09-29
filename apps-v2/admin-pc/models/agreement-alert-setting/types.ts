export type AgreementAlertSetting = {
  id: string;
  code: string;
  name: string;
  // eslint-disable-next-line camelcase
  name_L0: string;
  // eslint-disable-next-line camelcase
  name_L1: string;
  // eslint-disable-next-line camelcase
  name_L2: string;
  companyId: string;
  validDateFrom: string;
  validDateTo: string;
  monthlyAgreementHourWarning1: number;
  monthlyAgreementHourWarning2: number;
  monthlyAgreementHourLimit: number;
  monthlyAgreementHourWarningSpecial1: number;
  monthlyAgreementHourWarningSpecial2: number;
  monthlyAgreementHourLimitSpecial: number;
};
