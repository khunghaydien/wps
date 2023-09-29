import DateUtil from '@apps/commons/utils/DateUtil';

import * as DomainDRDFL from '@attendance/domain/models/DailyRecordDisplayFieldLayout';

export type LayoutList = {
  id: string;
  code: string;
  name: string;
  category: DomainDRDFL.LayoutCategory;
  type: DomainDRDFL.LayoutType;
  startDate: string;
  endDate: string;
  fieldList: DomainDRDFL.DailyRecordDisplayFieldLayoutItem[];
};

export type ValueMap = {
  [dailyRecordDate: string]: {
    [layoutItemId: string]: string;
  };
};

export const convertType = (
  type: string,
  value: string
): DomainDRDFL.DailyRecordDisplayFieldLayoutItemValue => {
  switch (type) {
    case DomainDRDFL.LAYOUT_ITEM_TYPE.ACTION:
      return null;
    case DomainDRDFL.LAYOUT_ITEM_TYPE.BOOLEAN:
      return {
        type,
        value: value === 'true',
      };
    case DomainDRDFL.LAYOUT_ITEM_TYPE.NUMBER:
      return {
        type,
        value: value ? parseFloat(value) : null,
        textValue: value,
        decimalPlaces:
          value && value.indexOf('.') !== -1
            ? value.length - value.indexOf('.') - 1
            : 0,
      };
    case DomainDRDFL.LAYOUT_ITEM_TYPE.DATE: {
      return {
        type,
        value,
      };
    }
    case DomainDRDFL.LAYOUT_ITEM_TYPE.DATE_TIME: {
      return {
        type,
        value,
      };
    }
    case DomainDRDFL.LAYOUT_ITEM_TYPE.STRING: {
      return {
        type,
        value,
      };
    }
    case DomainDRDFL.LAYOUT_ITEM_TYPE.TIME: {
      return {
        type,
        value,
      };
    }
    default: {
      return {
        type: DomainDRDFL.LAYOUT_ITEM_TYPE.STRING,
        value,
      };
    }
  }
};

export const convertValues = (
  valueMap: ValueMap,
  layouts: DomainDRDFL.DailyRecordDisplayFieldLayout[]
): DomainDRDFL.DailyRecordDisplayFieldLayoutTable['values'] => {
  const layoutByDate = {};
  const allDates = [];
  layouts.forEach((layout) => {
    const dates = DateUtil.getRangeDays(layout.startDate, layout.endDate);
    allDates.push(...dates);
    dates.forEach((date) => {
      layoutByDate[date] = layout.fields;
    });
  });
  const values = allDates.reduce<
    DomainDRDFL.DailyRecordDisplayFieldLayoutTable['values']
  >((values, date) => {
    values[date] = {};
    for (const key in valueMap[date]) {
      const type = layoutByDate[date].find((item) => item.id === key)?.type;
      const originalValue = valueMap[date][key];
      values[date][key] = convertType(type, originalValue);
    }
    return values;
  }, {});
  return values;
};
