import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import fieldSize from '../fieldSize';

const { SIZE_MEDIUM } = fieldSize;

const base: ConfigList = [
  {
    key: 'monthlyOvertimeLimit',
    msgkey: 'Admin_Lbl_MonthlyOvertimeLimit',
    size: SIZE_MEDIUM,
  },
  {
    key: 'monthlyOvertimeWarning1',
    msgkey: 'Admin_Lbl_Warning1',
    size: SIZE_MEDIUM,
  },
  {
    key: 'monthlyOvertimeWarning2',
    msgkey: 'Admin_Lbl_Warning2',
    size: SIZE_MEDIUM,
  },
  {
    key: 'yearlyOvertimeLimit',
    msgkey: 'Admin_Lbl_YearlyOvertimeLimit',
    size: SIZE_MEDIUM,
  },
  {
    key: 'yearlyOvertimeWarning1',
    msgkey: 'Admin_Lbl_Warning1',
    size: SIZE_MEDIUM,
  },
  {
    key: 'yearlyOvertimeWarning2',
    msgkey: 'Admin_Lbl_Warning2',
    size: SIZE_MEDIUM,
  },
  {
    key: 'multiMonthOvertimeLimit',
    msgkey: 'Admin_Lbl_MultiMonthAverageLimit',
    size: SIZE_MEDIUM,
  },
  {
    key: 'multiMonthOvertimeWarning1',
    msgkey: 'Admin_Lbl_Warning1',
    size: SIZE_MEDIUM,
  },
  {
    key: 'multiMonthOvertimeWarning2',
    msgkey: 'Admin_Lbl_Warning2',
    size: SIZE_MEDIUM,
  },
];

const configList: ConfigListMap = { base };

export default configList;
