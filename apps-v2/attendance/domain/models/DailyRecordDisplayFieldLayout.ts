import getWithinRange from '@attendance/libraries/utils/Records/getWithinRange';

export const LAYOUT_TYPE = {
  EDIT: 'edit',
  VIEW: 'view', // 勤務表では未実装
} as const;

export const LAYOUT_CATEGORY = {
  TIMESHEET: 'timesheet',
} as const;

export const LAYOUT_ITEM_TYPE = {
  DATE: 'date',
  DATE_TIME: 'dateTime',
  TIME: 'time',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  STRING: 'string',
  ACTION: 'action',
} as const;

export const LAYOUT_ITEM_VIEW_TYPE = {
  ATT_TIME: 'attTime',
} as const;

export const SYSTEM_NAME = '__system__' as const;

export const SYSTEM_ITEM_NAME = {
  DAILY_FIX_REQUEST_BUTTON: 'DailyFixRequestButton',
  SAVE_BUTTON: 'SaveButton',
} as const;

export type LayoutType = Value<typeof LAYOUT_TYPE>;

export type LayoutCategory = Value<typeof LAYOUT_CATEGORY>;

export type LayoutItemType = Value<typeof LAYOUT_ITEM_TYPE>;

export type LayoutItemViewType = Value<typeof LAYOUT_ITEM_VIEW_TYPE>;

export type LayoutPickList = Array<{
  label: string;
  value: string;
}>;

type LayoutItemCommon = {
  id: string;
  objectName: string;
  objectItemName: string;
  name: string;
  type: LayoutItemType;
  viewType: LayoutItemViewType | null;
  editable: boolean;
  order: number;
};

type LayoutItemValueCommon = {
  type: LayoutItemType;
  value: unknown;
};

type LayoutItemBase<T extends Partial<LayoutItemCommon>> = Omit<
  LayoutItemCommon,
  keyof T
> &
  T;

type LayoutItemValueBase<T extends Partial<LayoutItemValueCommon>> = Omit<
  LayoutItemValueCommon,
  keyof T
> &
  T;

export type LayoutItemDate = LayoutItemBase<{
  type: typeof LAYOUT_ITEM_TYPE['DATE'];
  viewType: null;
}>;

export type LayoutItemDateValue = LayoutItemValueBase<{
  type: typeof LAYOUT_ITEM_TYPE['DATE'];
  value: string;
}>;

export type LayoutItemDateTime = LayoutItemBase<{
  type: typeof LAYOUT_ITEM_TYPE['DATE_TIME'];
  viewType: null;
}>;

export type LayoutItemDateTimeValue = LayoutItemValueBase<{
  type: typeof LAYOUT_ITEM_TYPE['DATE_TIME'];
  value: string;
}>;

export type LayoutItemTime = LayoutItemBase<{
  type: typeof LAYOUT_ITEM_TYPE['TIME'];
  viewType: null;
  editable: false;
}>;

export type LayoutItemTimeValue = LayoutItemValueBase<{
  type: typeof LAYOUT_ITEM_TYPE['TIME'];
  value: string;
}>;

export type LayoutItemNumber = LayoutItemBase<{
  type: typeof LAYOUT_ITEM_TYPE['NUMBER'];
  viewType: typeof LAYOUT_ITEM_VIEW_TYPE['ATT_TIME'] | null;
}>;

export type LayoutItemNumberValue = LayoutItemValueBase<{
  type: typeof LAYOUT_ITEM_TYPE['NUMBER'];
  value: number;
  textValue: string;
  decimalPlaces: number;
}>;

export type LayoutItemBoolean = LayoutItemBase<{
  type: typeof LAYOUT_ITEM_TYPE['BOOLEAN'];
  viewType: null;
}>;

export type LayoutItemBooleanValue = LayoutItemValueBase<{
  type: typeof LAYOUT_ITEM_TYPE['BOOLEAN'];
  value: boolean;
}>;

export type LayoutItemString = LayoutItemBase<{
  type: typeof LAYOUT_ITEM_TYPE['STRING'];
  viewType: null;
  pickList?: LayoutPickList;
}>;

export type LayoutItemStringValue = LayoutItemValueBase<{
  type: typeof LAYOUT_ITEM_TYPE['STRING'];
  value: string;
}>;

export type LayoutItemAction = LayoutItemBase<{
  objectName: typeof SYSTEM_NAME;
  objectItemName: Value<typeof SYSTEM_ITEM_NAME>;
  type: typeof LAYOUT_ITEM_TYPE['ACTION'];
  viewType: null;
  editable: false;
}>;

export type DailyRecordDisplayFieldLayoutItem =
  | LayoutItemAction
  | LayoutItemBoolean
  | LayoutItemDate
  | LayoutItemDateTime
  | LayoutItemNumber
  | LayoutItemString
  | LayoutItemTime;

export type DailyRecordDisplayFieldLayoutItemValue =
  | LayoutItemBooleanValue
  | LayoutItemDateValue
  | LayoutItemDateTimeValue
  | LayoutItemNumberValue
  | LayoutItemStringValue
  | LayoutItemTimeValue;

export type DailyRecordDisplayFieldLayout = {
  id: string;
  code: string;
  name: string;
  category?: LayoutCategory;
  type: LayoutType;
  startDate: string;
  endDate: string;
  fields: DailyRecordDisplayFieldLayoutItem[];
};

export type DailyRecordDisplayFieldLayoutTable = {
  layouts: DailyRecordDisplayFieldLayout[];
  values: {
    [dailyRecordDate: string]: {
      [layoutItemId: string]: DailyRecordDisplayFieldLayoutItemValue;
    };
  };
};

export const getFieldByDateAndFieldId = (
  layouts: DailyRecordDisplayFieldLayoutTable['layouts'],
  targetDate: string,
  fieldId: string
) =>
  getWithinRange(targetDate, layouts)?.fields?.find(({ id }) => id === fieldId);

export type IDailyRecordDisplayFieldLayoutRepository = {
  fetchTable: (param?: {
    employeeId?: string;
    startDate?: string;
    endDate?: string;
  }) => Promise<DailyRecordDisplayFieldLayoutTable>;
};
