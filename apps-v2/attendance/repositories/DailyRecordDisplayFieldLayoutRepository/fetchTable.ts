import Api from '@apps/commons/api';

import {
  convertValues,
  LayoutList,
  ValueMap,
} from '@attendance/repositories/models/DailyRecordDisplayFieldLayout';

import {
  DailyRecordDisplayFieldLayoutTable as DomainDailyRecordDisplayFieldLayoutTable,
  IDailyRecordDisplayFieldLayoutRepository,
  LAYOUT_CATEGORY,
} from '@attendance/domain/models/DailyRecordDisplayFieldLayout';

export type Response = {
  layoutList: LayoutList[];
  valueMap: ValueMap;
};

export const convert = (
  response: Response
): DomainDailyRecordDisplayFieldLayoutTable => {
  const layouts =
    response.layoutList
      ?.filter((layout) => layout.category === LAYOUT_CATEGORY.TIMESHEET)
      .map((layout) => ({
        id: layout.id,
        code: layout.code,
        name: layout.name,
        category: layout.category,
        type: layout.type,
        startDate: layout.startDate,
        endDate: layout.endDate,
        fields: layout.fieldList.sort((a, b) => a.order - b.order),
      })) ?? [];

  return {
    layouts,
    values: convertValues(response.valueMap, layouts),
  };
};

const fetchList: IDailyRecordDisplayFieldLayoutRepository['fetchTable'] =
  async ({ employeeId, startDate, endDate }) => {
    const result: Response = await Api.invoke({
      path: '/att/record-display-fields/get',
      param: {
        empId: employeeId,
        startDate,
        endDate,
      },
    });
    return convert(result);
  };

export default fetchList;
