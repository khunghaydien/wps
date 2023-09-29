import { ConfigList, ConfigListMap } from '../../utils/ConfigUtil';

import fieldSize from '../fieldSize';

const { SIZE_MEDIUM } = fieldSize;

const base: ConfigList = [
  {
    key: 'specialMonthlyOvertimeLimit',
    msgkey: 'Admin_Lbl_MonthlyOvertimeLimit',
    size: SIZE_MEDIUM,
  },
  {
    key: 'specialMonthlyOvertimeWarning1',
    msgkey: 'Admin_Lbl_Warning1',
    size: SIZE_MEDIUM,
  },
  {
    key: 'specialMonthlyOvertimeWarning2',
    msgkey: 'Admin_Lbl_Warning2',
    size: SIZE_MEDIUM,
  },
  {
    key: 'specialYearlyOvertimeLimit',
    msgkey: 'Admin_Lbl_YearlyOvertimeLimit',
    size: SIZE_MEDIUM,
  },
  {
    key: 'specialYearlyOvertimeWarning1',
    msgkey: 'Admin_Lbl_Warning1',
    size: SIZE_MEDIUM,
  },
  {
    key: 'specialYearlyOvertimeWarning2',
    msgkey: 'Admin_Lbl_Warning2',
    size: SIZE_MEDIUM,
  },
  {
    key: 'specialMultiMonthOvertimeLimit',
    msgkey: 'Admin_Lbl_MultiMonthAverageLimit',
    size: SIZE_MEDIUM,
  },
  {
    key: 'specialMultiMonthOvertimeWarning1',
    msgkey: 'Admin_Lbl_Warning1',
    size: SIZE_MEDIUM,
  },
  {
    key: 'specialMultiMonthOvertimeWarning2',
    msgkey: 'Admin_Lbl_Warning2',
    size: SIZE_MEDIUM,
  },
  {
    key: 'specialExtensionCountLimit',
    msgkey: 'Admin_Lbl_ExtensionCountLimit',
    size: SIZE_MEDIUM,
  },
  {
    key: 'specialExtensionCountWarning1',
    msgkey: 'Admin_Lbl_Warning1',
    size: SIZE_MEDIUM,
  },
  {
    key: 'specialExtensionCountWarning2',
    msgkey: 'Admin_Lbl_Warning2',
    size: SIZE_MEDIUM,
  },
];

const configList: ConfigListMap = { base };

export default configList;
