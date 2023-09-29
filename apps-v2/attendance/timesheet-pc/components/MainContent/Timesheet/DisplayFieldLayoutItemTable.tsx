import React from 'react';

import AttRecordModel from '@attendance/timesheet-pc/models/AttRecord';
import DailyRequestConditionsModel from '@attendance/timesheet-pc/models/DailyRequestConditions';

import { DailyRecordDisplayFieldLayoutTableForUI } from '@attendance/timesheet-pc/modules/ui/dailyRecordDisplayFieldLayout';

import DisplayFieldLayoutItemHeader from './DisplayFieldLayoutItemHeader';
import DisplayFieldLayoutItemRow from './DisplayFieldLayoutItemRow';

import './DisplayFieldLayoutItemTable.scss';

const ROOT =
  'timesheet-pc-main-content-timesheet-display-field-layout-item-table';

export type Props = {
  attRecordList: AttRecordModel[];
  isManHoursGraphOpened: boolean;
  dailyRequestConditionsMap: {
    [key: string]: DailyRequestConditionsModel;
  };
};

type OwnProps = DailyRecordDisplayFieldLayoutTableForUI & {
  isLoading: boolean;
};

/**
 * @deprecated
 * 実装には使われていない。
 * VRT用に残している。
 * いずれ削除予定。
 */
const DisplayFieldLayoutItemTable: React.FC<Props & OwnProps> = ({
  attRecordList,
  isManHoursGraphOpened,
  dailyRequestConditionsMap,
  isLoading,
  layoutRow,
  layoutValues,
}) => {
  if (isLoading || !layoutValues) {
    return null;
  }

  return (
    <table
      className={ROOT}
      style={{ height: `${attRecordList?.length * 32.5 + 20}px` }}
    >
      <thead>
        <DisplayFieldLayoutItemHeader layoutHead={layoutRow} />
      </thead>
      <tbody>
        {attRecordList.map((attRecord) => (
          <DisplayFieldLayoutItemRow
            key={attRecord.id}
            row={layoutRow}
            values={layoutValues[attRecord.recordDate]}
            isManHoursGraphOpened={isManHoursGraphOpened}
            requestConditions={dailyRequestConditionsMap[attRecord.recordDate]}
            attRecord={attRecord}
          />
        ))}
      </tbody>
    </table>
  );
};

export default DisplayFieldLayoutItemTable;
