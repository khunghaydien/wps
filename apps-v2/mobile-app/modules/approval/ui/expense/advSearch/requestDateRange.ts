import { Reducer } from 'redux';

import { DateRangeOption } from '@apps/commons/components/fields/DropdownDateRange';
import { OptionProps as Option } from '@apps/commons/components/fields/SearchableDropdown';
import msg from '@apps/commons/languages';
import DateUtil from '@apps/commons/utils/DateUtil';

export enum RequestDateEnum {
  DAY = '1',
  WEEK = '2',
  FORTNIGHT = '3',
  MONTH = '4',
  MANUAL = '5',
}

export const requestDateOptions = (): Array<Option> => [
  { label: msg().Appr_Lbl_PastDay, value: RequestDateEnum.DAY },
  { label: msg().Appr_Lbl_PastWeek, value: RequestDateEnum.WEEK },
  { label: msg().Appr_Lbl_PastFortnight, value: RequestDateEnum.FORTNIGHT },
  { label: msg().Appr_Lbl_PastMonth, value: RequestDateEnum.MONTH },
  { label: msg().Appr_Lbl_SelectDate, value: RequestDateEnum.MANUAL },
];

export const requestDateConverter = (selected: string): DateRangeOption => {
  const today = DateUtil.getToday();
  let startDate = null;
  let endDate = today;
  switch (selected) {
    case RequestDateEnum.DAY:
      startDate = DateUtil.addInDate(today, -1, 'days');
      break;
    case RequestDateEnum.WEEK:
      startDate = DateUtil.addInDate(today, -7, 'days');
      break;
    case RequestDateEnum.FORTNIGHT:
      startDate = DateUtil.addInDate(today, -14, 'days');
      break;
    case RequestDateEnum.MONTH:
      startDate = DateUtil.addInDate(today, -1, 'months');
      break;
    case RequestDateEnum.MANUAL:
    default:
      startDate = Date.parse(selected as string);
      endDate = null;
  }
  return { startDate: DateUtil.fromDate(startDate), endDate };
};

export const ACTIONS = {
  SET: 'MODULES/APPROVAL/UI/EXPENSE/ADV_SEARCH/SUBMIT_DATE_RANGE/SET',
  CLEAR: 'MODULES/APPROVAL/UI/EXPENSE/ADV_SEARCH/SUBMIT_DATE_RANGE/CLEAR',
};

type SetAction = {
  type: string;
  payload: string;
};

type ClearAction = {
  type: string;
};

export const actions = {
  set: (selectedValue: string): SetAction => ({
    type: ACTIONS.SET,
    payload: selectedValue,
  }),
  clear: (): ClearAction => ({
    type: ACTIONS.CLEAR,
  }),
};

// Reducer
export const initialState = RequestDateEnum.MONTH;

export default ((state: string = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET:
      return action.payload;
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
}) as Reducer<string, any>;
