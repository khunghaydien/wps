import { Timesheet } from '@attendance/domain/models/Timesheet';

type State = {
  current: string;
  next: string;
  prev: string;
  pages: Array<{
    value: string;
    label: string;
  }>;
};

const ACTIONS = {
  FETCH_SUCCESS:
    'MOBILE_APP/MODULES/ATTENDANCE/TIMESHEET/UI/PAGING/FETCH_SUCCESS',
  CLEAR: 'MOBILE_APP/MODELES/ATTENDANCE/TIMESHEET/UI/PAGING/CLEAR',
};

export const actions = {
  fetchSuccess: (value: Timesheet) => ({
    type: ACTIONS.FETCH_SUCCESS,
    payload: value,
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

const initialState: State = {
  current: '',
  prev: '',
  next: '',
  pages: [],
};

export default (state: State = initialState, action: any): State => {
  const { type, payload } = action;
  switch (type) {
    case ACTIONS.FETCH_SUCCESS:
      const pages = payload.periods.map(({ name, startDate }) => ({
        label: name,
        value: startDate,
      }));
      const currentIdx = pages.findIndex(
        ({ value }) => value === payload.startDate
      );
      const current = currentIdx === -1 ? '' : pages[currentIdx].value;
      const prev =
        currentIdx + 1 >= pages.length ? '' : pages[currentIdx + 1].value;
      const next = currentIdx - 1 <= -1 ? '' : pages[currentIdx - 1].value;
      return {
        current,
        prev,
        next,
        pages,
      };
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
};
