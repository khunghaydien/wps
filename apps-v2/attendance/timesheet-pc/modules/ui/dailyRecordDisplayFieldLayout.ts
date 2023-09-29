import flatten from 'lodash/flatten';
import uniqBy from 'lodash/uniqBy';

import DateUtil from '@apps/commons/utils/DateUtil';

import {
  DailyRecordDisplayFieldLayoutItem,
  DailyRecordDisplayFieldLayoutItemValue,
  DailyRecordDisplayFieldLayoutTable,
  getFieldByDateAndFieldId,
  LAYOUT_ITEM_TYPE,
} from '@attendance/domain/models/DailyRecordDisplayFieldLayout';

import ROOT from './actionType';

export type DailyRecordDisplayFieldLayoutItemValueForUI = {
  existing: boolean;
  value: DailyRecordDisplayFieldLayoutItemValue;
  field: DailyRecordDisplayFieldLayoutItem;
};

export type DailyValues = {
  [date: string]: {
    [itemId: string]: DailyRecordDisplayFieldLayoutItemValueForUI;
  };
};

export type DailyRecordDisplayFieldLayoutTableForUI = {
  layoutRow: DailyRecordDisplayFieldLayoutItem[];
  layoutValues: DailyValues;
};

export type UpdateValue = {
  date: string;
  key: string;
  value: number | string | boolean;
};

export const convertDailyFieldLayout = (
  layoutTable: DailyRecordDisplayFieldLayoutTable
): DailyRecordDisplayFieldLayoutTableForUI => {
  const { layouts, values } = layoutTable;
  const layoutsUniqByCode = uniqBy(layouts, 'code');
  const layoutsWithDates = layoutsUniqByCode.map(({ code, fields }) => {
    const sortedFields = fields?.sort((a, b) => a.order - b.order);
    const dates = layouts
      .filter((item) => item.code === code)
      .map(({ startDate, endDate }) => ({
        startDate,
        endDate,
      }));
    return {
      code,
      fields: sortedFields,
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
          const field = getFieldByDateAndFieldId(layouts, date, item.id);
          if (layout.fields.includes(item)) {
            layoutValues[date][item.id] = {
              existing: true,
              value:
                values && values[date] && values[date][item.id]
                  ? values[date][item.id]
                  : null,
              field,
            };
          } else {
            layoutValues[date][item.id] = {
              existing: false,
              value: null,
              field,
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

type State = DailyRecordDisplayFieldLayoutTableForUI & {
  isLoading: boolean;
  catchError: boolean;
  layoutTempValues: DailyValues;
};

const initialState: State = {
  isLoading: false,
  catchError: false,
  layoutRow: null,
  layoutValues: null,
  layoutTempValues: null,
};

const ACTION_TYPE_ROOT = `${ROOT}/DAILY_FILED_LAYOUT` as const;

const ACTION_TYPE = {
  START_LOADING: `${ACTION_TYPE_ROOT}/START_LOADING`,
  END_LOADING: `${ACTION_TYPE_ROOT}/END_LOADING`,
  SET: `${ACTION_TYPE_ROOT}/SET`,
  RESET: `${ACTION_TYPE_ROOT}/RESET`,
  UPDATE_FIELD: `${ACTION_TYPE_ROOT}/UPDATE_FIELD`,
  CATCH_ERROR: `${ACTION_TYPE_ROOT}/CATCH_ERROR`,
} as const;

type StartLoading = {
  type: typeof ACTION_TYPE.START_LOADING;
};

type EndLoading = {
  type: typeof ACTION_TYPE.END_LOADING;
};

type Set = {
  type: typeof ACTION_TYPE.SET;
  payload: DailyRecordDisplayFieldLayoutTable;
};

type Reset = {
  type: typeof ACTION_TYPE.RESET;
};

type UpdateField = {
  type: typeof ACTION_TYPE.UPDATE_FIELD;
  payload: UpdateValue;
};

type CatchError = {
  type: typeof ACTION_TYPE.CATCH_ERROR;
};

type Action =
  | StartLoading
  | EndLoading
  | Set
  | Reset
  | UpdateField
  | CatchError;

export const actions = {
  startLoading: (): StartLoading => ({
    type: ACTION_TYPE.START_LOADING,
  }),
  endLoading: (): EndLoading => ({
    type: ACTION_TYPE.END_LOADING,
  }),
  set: (table: DailyRecordDisplayFieldLayoutTable): Set => ({
    type: ACTION_TYPE.SET,
    payload: table,
  }),
  reset: (): Reset => ({
    type: ACTION_TYPE.RESET,
  }),
  updateField: (payload: UpdateValue): UpdateField => ({
    type: ACTION_TYPE.UPDATE_FIELD,
    payload,
  }),
  catchError: (): CatchError => ({
    type: ACTION_TYPE.CATCH_ERROR,
  }),
};

export default function reducer(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case ACTION_TYPE.START_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case ACTION_TYPE.END_LOADING:
      return {
        ...state,
        isLoading: false,
      };
    case ACTION_TYPE.SET: {
      const { layoutRow, layoutValues } = convertDailyFieldLayout({
        ...(action as Set).payload,
      });
      return {
        ...state,
        layoutRow,
        layoutValues,
        layoutTempValues: layoutValues,
      };
    }
    case ACTION_TYPE.RESET:
      return {
        ...initialState,
      };
    case ACTION_TYPE.UPDATE_FIELD: {
      const { date, key, value } = (action as UpdateField).payload;
      const tempValue = state.layoutTempValues;
      let newValue = {
        ...tempValue[date][key].value,
        value,
      };

      const { type } = tempValue[date][key].value;
      if (type === LAYOUT_ITEM_TYPE.NUMBER) {
        const textValue = value.toString();
        const newFieldValue = textValue && parseFloat(textValue);
        const decimalPlaces =
          textValue && textValue.indexOf('.') !== -1
            ? textValue.length - textValue.indexOf('.') - 1
            : 0;
        newValue = {
          type,
          value: newFieldValue,
          textValue,
          decimalPlaces,
        };
      }

      return {
        ...state,
        layoutTempValues: {
          ...tempValue,
          [date]: {
            ...tempValue[date],
            [key]: {
              ...tempValue[date][key],
              value: newValue,
            },
          },
        } as State['layoutTempValues'],
      };
    }
    case ACTION_TYPE.CATCH_ERROR:
      return {
        ...state,
        catchError: true,
      };
    default:
      return state;
  }
}
