import get from 'lodash/get';

import Api from '../../../commons/api';
import msg from '../../../commons/languages';
import DateUtil from '../../../commons/utils/DateUtil';

// 期間検索 / expense accounting period
/* eslint-disable camelcase */
export type AccountingPeriod = {
  id: string;
  active: boolean;
  code: string;
  companyId: string;
  name: string;
  name_L0: string;
  name_L1?: string;
  name_L2?: string;
  recordingDate: string;
  validDateFrom: string;
  validDateTo: string;
};

export type AccountingPeriodList = Array<AccountingPeriod>;

export type AccountingPeriodOption = {
  id: string;
  active: boolean;
  label: string;
  recordDate: string;
  value: string;
};

export type AccountingPeriodOptionList = Array<AccountingPeriodOption>;

export type AccountingPeriodConvert = {
  endDate: string;
  recordDate: string;
  startDate: string;
};

export const makeAPOptionList = (
  list: AccountingPeriodList,
  selectedAccountingPeriodId: string
): AccountingPeriodOptionList => {
  return (
    list
      .filter((item) => item.active || item.id === selectedAccountingPeriodId)
      .map((item) => ({
        value: item.id,
        label: `${
          !item.active ? msg().Exp_Lbl_Inactive.concat(' - ') : ''
        } ${DateUtil.dateFormat(item.validDateFrom)} - ${DateUtil.dateFormat(
          item.validDateTo
        )}`,
        recordDate: item.recordingDate,
        active: item.active,
        id: item.id,
      }))
      // selected inactive accounting period will appear at the top
      .sort((a, b) => {
        if (a.active > b.active) return 1;
        else if (a.active < b.active) return -1;
        return 0;
      })
  );
};
export const convertAccountingDateId = (
  accountingPeriodId: string,
  accountingPeriodList: AccountingPeriodOptionList
): AccountingPeriodConvert => {
  const selectedAccountingPeriod = accountingPeriodList.find(
    (ap) => ap.id === accountingPeriodId
  );
  const startDate = get(selectedAccountingPeriod, 'validDateFrom') || '';
  const endDate = get(selectedAccountingPeriod, 'validDateTo') || '';
  const recordDate = get(selectedAccountingPeriod, 'recordingDate') || '';
  return {
    startDate,
    endDate,
    recordDate,
  };
};

// eslint-disable-next-line import/prefer-default-export
export const searchAccountingPeriod = (
  companyId: string
): Promise<{ records: AccountingPeriodList }> => {
  return Api.invoke({
    path: '/exp/accounting-period/search',
    param: { companyId, isNotMaster: true },
  });
};
