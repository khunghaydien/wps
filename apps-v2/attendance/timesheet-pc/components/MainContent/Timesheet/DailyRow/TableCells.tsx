import React from 'react';

import { DailyRecordDisplayFieldLayoutItem } from '@attendance/domain/models/DailyRecordDisplayFieldLayout';

import { DailyRecordDisplayFieldLayoutItemValueForUI } from '@attendance/timesheet-pc/modules/ui/dailyRecordDisplayFieldLayout';

import {
  DisplayFieldLayoutItem as Cell,
  ItemProps as ChildProps,
} from '../DisplayFieldLayoutItemRow';

type Props = Omit<ChildProps, 'item' | 'value'> & {
  row: DailyRecordDisplayFieldLayoutItem[];
  values: Record<string, DailyRecordDisplayFieldLayoutItemValueForUI>;
};

const TableCells: React.FC<Props> = ({ row, values, ...props }) => {
  if (!row) {
    return null;
  }

  return (
    <>
      {row?.map((item) => (
        <Cell
          key={item.id}
          item={item}
          value={
            values && values[item.id]
              ? values[item.id]
              : {
                  existing: false,
                  value: null,
                  field: null,
                }
          }
          {...props}
        />
      ))}
      {/* 余白用 */}
      <td></td>
    </>
  );
};

export default TableCells;
