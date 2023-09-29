import {
  AttSummaryPeriodList,
  findPeriodByName,
} from '../../../../domain/models/team/AttSummaryPeriodList';

type State = {
  options: {
    text: string;
    value: string;
  }[];
  current: string;
  next: string;
  prev: string;
};

const ACTION_TYPES = {
  FETCH_SUCCESS: 'TEAM_PC/UI/PERIODS/FETCH_SUCCESS',
  CLEAR: 'TEAM_PC/UI/PERIODS/CLEAR',
};

export const actions = {
  fetchSuccess: (
    targetName: string,
    attSummaryPeriodList: AttSummaryPeriodList
  ) => ({
    type: ACTION_TYPES.FETCH_SUCCESS,
    payload: {
      targetName,
      attSummaryPeriodList,
    },
  }),
  clear: () => ({
    type: ACTION_TYPES.CLEAR,
  }),
};

const initialState: State = {
  options: [],
  current: '',
  next: '',
  prev: '',
};

export default (state: State = initialState, action: any): State => {
  const { type, payload } = action;
  switch (type) {
    case ACTION_TYPES.FETCH_SUCCESS: {
      const { targetName, attSummaryPeriodList } = payload;
      const { periods } = attSummaryPeriodList;

      const options = periods.map(({ name, label }) => ({
        text: label,
        value: name,
      }));

      const targetPeriod = findPeriodByName(targetName, attSummaryPeriodList);

      if (!targetPeriod) {
        return initialState;
      }

      const currentValue = targetPeriod.name;
      const currentIdx = options.findIndex(
        ({ value }) => value === currentValue
      );

      const current = currentIdx === -1 ? '' : options[currentIdx].value;
      const prev =
        currentIdx + 1 >= options.length ? '' : options[currentIdx + 1].value;
      const next = currentIdx - 1 <= -1 ? '' : options[currentIdx - 1].value;

      return {
        options,
        current,
        prev,
        next,
      };
    }
    case ACTION_TYPES.CLEAR:
      return initialState;
    default:
      return state;
  }
};
