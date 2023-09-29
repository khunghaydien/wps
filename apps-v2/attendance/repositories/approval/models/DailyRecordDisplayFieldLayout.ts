import {
  convertValues,
  LayoutList as BaseLayoutList,
  ValueMap,
} from '../../models/DailyRecordDisplayFieldLayout';
import * as DomainDRDFL from '@attendance/domain/models/DailyRecordDisplayFieldLayout';

type LayoutList = Omit<BaseLayoutList, 'category' | 'type'>;

export type Response = {
  layoutList: LayoutList[];
  valueMap: ValueMap;
};

export const convert = (
  response: Response
): DomainDRDFL.DailyRecordDisplayFieldLayoutTable => {
  const layouts =
    response.layoutList?.map((layout) => ({
      id: layout.id,
      code: layout.code,
      name: layout.name,
      category: null,
      type: DomainDRDFL.LAYOUT_TYPE.VIEW,
      startDate: layout.startDate,
      endDate: layout.endDate,
      fields: layout.fieldList.sort((a, b) => a.order - b.order),
    })) ?? [];

  return {
    layouts,
    values: convertValues(response.valueMap, layouts),
  };
};
