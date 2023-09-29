/**
 * 勤怠明細表示項目レイアウト ViewModel
 *
 * これは ViewModel です。
 * State と Component、それを繋ぐ Container 以外では使用しないでください。
 */
import flatten from 'lodash/flatten';
import uniqBy from 'lodash/uniqBy';

import DateUtil from '@commons/utils/DateUtil';

import * as DomainDRDFL from '@attendance/domain/models/DailyRecordDisplayFieldLayout';

export const LAYOUT_ITEM_TYPE = DomainDRDFL.LAYOUT_ITEM_TYPE;

export const LAYOUT_ITEM_VIEW_TYPE = DomainDRDFL.LAYOUT_ITEM_VIEW_TYPE;

export type LayoutItemNumberValue = DomainDRDFL.LayoutItemNumberValue;

export type LayoutItemViewModel = DomainDRDFL.DailyRecordDisplayFieldLayoutItem;

export type LayoutItemValueViewModel = {
  existing: boolean;
  value: DomainDRDFL.DailyRecordDisplayFieldLayoutItemValue;
};

export type LayoutDailyValuesViewModel = {
  [date: string]: {
    [itemId: string]: LayoutItemValueViewModel;
  };
};

export type DailyRecordDisplayFieldLayoutTableViewModel = {
  layoutRow: LayoutItemViewModel[];
  layoutValues: LayoutDailyValuesViewModel;
};

export const convert = (
  layoutTable: DomainDRDFL.DailyRecordDisplayFieldLayoutTable
): DailyRecordDisplayFieldLayoutTableViewModel => {
  const { layouts, values } = layoutTable;
  const layoutsUniqByCode = uniqBy(layouts, 'code');
  const layoutsWithDates = layoutsUniqByCode.map(({ code, fields }) => {
    const dates = layouts
      .filter((item) => item.code === code)
      .map(({ startDate, endDate }) => ({
        startDate,
        endDate,
      }));
    return {
      code,
      fields,
      dates,
    };
  });
  const layoutRow = flatten(layoutsWithDates.map((item) => item.fields));
  const layoutValues = {};
  layoutsWithDates.forEach((layout) => {
    layout.dates.forEach((date) => {
      const dates = DateUtil.getRangeDays(date.startDate, date.endDate);
      dates.forEach((date) => {
        layoutValues[date] = {};
        layoutRow.forEach((item) => {
          if (layout.fields.includes(item)) {
            layoutValues[date][item.id] = {
              existing: true,
              value:
                values && values[date] && values[date][item.id]
                  ? values[date][item.id]
                  : null,
            };
          } else {
            layoutValues[date][item.id] = {
              existing: false,
              value: null,
            };
          }
        });
      });
    });
  });
  return {
    layoutRow,
    layoutValues,
  };
};
