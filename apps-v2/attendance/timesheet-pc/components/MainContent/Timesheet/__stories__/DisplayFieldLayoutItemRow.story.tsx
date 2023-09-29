import React from 'react';

import DisplayFieldLayoutItemRow from '../DisplayFieldLayoutItemRow';
import attRecordList from './mock-data/attRecordList';
import dailyRequestConditionsMap from './mock-data/dailyRequestConditionsMap';
import {
  layoutRow,
  layoutValues,
} from './mock-data/displayFieldLayoutItemList';

export default {
  title:
    'attendance/timesheet-pc/MainContent/Timesheet/DisplayFieldLayoutItemRow',
};

export const Default = () => (
  <DisplayFieldLayoutItemRow
    requestConditions={dailyRequestConditionsMap['2020-02-02']}
    attRecord={attRecordList[1]}
    row={layoutRow}
    values={layoutValues['2020-02-02']}
  />
);

export const Holiday = () => (
  <DisplayFieldLayoutItemRow
    requestConditions={dailyRequestConditionsMap['2020-02-01']}
    attRecord={attRecordList[0]}
    row={layoutRow}
    values={layoutValues['2020-02-01']}
  />
);

export const LegalHoliday = () => (
  <DisplayFieldLayoutItemRow
    requestConditions={dailyRequestConditionsMap['2020-02-04']}
    attRecord={attRecordList[3]}
    row={layoutRow}
    values={layoutValues['2020-02-01']}
  />
);
