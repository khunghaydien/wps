import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import DateUtil from '@apps/commons/utils/DateUtil';
import msg from '@commons/languages';

import { Company, CompanyList } from '@apps/domain/models/common/Company';
import { EmployeeHistoryList } from '@apps/domain/models/common/Employee';
import { MasterEmployeeHistory } from '@apps/domain/models/organization/MasterEmployeeHistory';

export type SubRoleOption = {
  label: string;
  value: string;
  company: Company;
  position: any;
  department: { name: string; code?: string };
  primary: boolean;
  disabled?: boolean;
};

export const filterDate = (
  h: MasterEmployeeHistory,
  date: string
): MasterEmployeeHistory => {
  const { validDateFrom, validDateTo } = h;
  if (DateUtil.inRange(date, validDateFrom, validDateTo)) return h;
  return undefined;
};

const getSubRoleOptionsList = (
  allHistory: EmployeeHistoryList,
  allCompanies: CompanyList,
  date?: string // YYYY-MM-DD
): Array<SubRoleOption> => {
  const subRoleKeys = [];
  const subRoleOptions = [];
  allHistory
    .filter((h) => !h.isRemoved && (!isEmpty(date) ? filterDate(h, date) : h))
    .forEach((history) => {
      const { id } = history;
      if (subRoleKeys.indexOf(id) < 0) {
        subRoleKeys.push(id);
        const option = subRoleOptionCreator(
          history,
          allCompanies,
          history.primary,
          false
        );
        if (!isEmpty(option)) {
          subRoleOptions.push(option);
        }
      }
    });

  return sortRoles(subRoleOptions);
};

const getSubRoleOptionsCompanyMap = (
  allHistory: EmployeeHistoryList,
  allCompanies: CompanyList
): { [key: string]: Array<SubRoleOption> } => {
  if (!allHistory) return undefined;
  const companyExpiredRoleMap: { [key: string]: Array<SubRoleOption> } = {};
  const companyActiveRoleMap: { [key: string]: Array<SubRoleOption> } = {};
  const subRoleOptionsMap: { [key: string]: Array<SubRoleOption> } = {};
  const primaryHistory = allHistory.find((h) => h.primary);
  if (!isEmpty(primaryHistory)) {
    const { companyId } = primaryHistory;
    const option = subRoleOptionCreator(
      primaryHistory,
      allCompanies,
      true,
      false
    );
    if (companyActiveRoleMap[companyId])
      companyActiveRoleMap[companyId].push(option);
    else companyActiveRoleMap[companyId] = [option];
  }
  allHistory
    .filter(
      (h) =>
        !(h.id === primaryHistory.id) &&
        (DateUtil.isBeforeToday(h.validDateFrom) ||
          DateUtil.isToday(h.validDateFrom))
    )
    .forEach((history) => {
      // @ts-ignore
      const { companyId, validDateTo, isRemoved, active } = history;
      const option = subRoleOptionCreator(
        history,
        allCompanies,
        history.primary,
        false
      );
      if (DateUtil.isBeforeToday(validDateTo) || isRemoved || !active) {
        // Role was in past or removed or inactive
        if (companyExpiredRoleMap[companyId])
          companyExpiredRoleMap[companyId].push(option);
        else companyExpiredRoleMap[companyId] = [option];
      } else {
        // Role is in current period and active
        if (companyActiveRoleMap[companyId])
          companyActiveRoleMap[companyId].push(option);
        else companyActiveRoleMap[companyId] = [option];
      }
    });

  Object.keys(companyActiveRoleMap).forEach((companyId: string) => {
    const activeRoles: Array<SubRoleOption> = companyActiveRoleMap[companyId];
    let expiredRoles: Array<SubRoleOption> = [];
    subRoleOptionsMap[companyId] = [];
    if (companyExpiredRoleMap[companyId])
      expiredRoles = companyExpiredRoleMap[companyId];
    subRoleOptionsMap[companyId] = [...activeRoles, ...expiredRoles];
  });

  return subRoleOptionsMap;
};

export const getPrimaryRole = (
  histories: EmployeeHistoryList
): MasterEmployeeHistory | undefined => {
  if (!isEmpty(histories))
    return histories.find(
      (h) => !h.isRemoved && h.primary && filterDate(h, DateUtil.getToday())
    );
  return undefined;
};

const getFirstActiveRole = (
  subroleIds: Array<string>,
  allHistory: EmployeeHistoryList,
  isPrimaryCompany = false
): string | undefined => {
  if (isPrimaryCompany) {
    const primaryRole = getPrimaryRole(allHistory);
    return primaryRole?.id;
  }
  let id;
  if (allHistory && subroleIds) {
    subroleIds.some((subroleId) => {
      const roleInfo = allHistory.find((h) => h.id === subroleId);
      if (roleInfo && !roleInfo.isRemoved) id = roleInfo.id;
      return id;
    });
  }
  return id;
};

const getLabelPart = (str: string): string => {
  if (str && str.length > 0) return ` / ${str}`;
  return '';
};

const totalLength = 60;
const individualLength = 17;
const getTruncated = (str: string, length = individualLength): string => {
  if (!str) return '';
  else if (str.length < length) return str;
  return `${str.substr(0, length)}...`;
};
const getTruncatedLabel = (
  compName = '',
  deptName = '',
  posName = '',
  truncate?: boolean
): string => {
  const result = `${compName || ''}${getLabelPart(deptName)}${getLabelPart(
    posName
  )}`;
  if (!truncate || result.length <= totalLength) return result;

  let remLength = totalLength;
  const posFinal = getTruncated(posName);
  remLength = remLength - posFinal.length;

  const deptFinal = getTruncated(deptName);
  remLength = remLength - deptFinal.length;

  const compFinal = getTruncated(compName, remLength);
  return `${compFinal || ''}${getLabelPart(deptFinal)}${getLabelPart(
    posFinal
  )}`;
};

export const subRoleOptionCreator = (
  historyRecord: MasterEmployeeHistory,
  allCompanies: CompanyList,
  isPrimary?: boolean,
  truncate = true
): SubRoleOption | undefined => {
  if (!isEmpty(historyRecord) && !isEmpty(allCompanies)) {
    const { companyId, department, position, id } = historyRecord;
    const company = allCompanies.find(({ id }) => id === companyId);
    const positionText = get(position, 'name');
    const departmentText = get(department, 'name') || get(department, 'code');
    const prefix = isPrimary ? msg().Admin_Lbl_Primary : '';
    const label = `${prefix && `(${prefix})`} ${getTruncatedLabel(
      get(company, 'name'),
      departmentText,
      positionText,
      truncate
    )}`;
    return {
      label,
      value: id,
      company,
      position,
      department,
      primary: isPrimary,
    };
  }
  return undefined;
};

export const sortRoles = (
  subroles: Array<SubRoleOption>
): Array<SubRoleOption> => {
  const result = (subroles || []).sort((a) => (a.primary ? -1 : 1));
  return result;
};

export default {
  getPrimaryRole,
  getSubRoleOptionsList,
  getSubRoleOptionsCompanyMap,
  getFirstActiveRole,
  subRoleOptionCreator,
  sortRoles,
};
