import {
  FETCH_EMP_INFO_START,
  FETCH_EMP_INFO_SUCCESS,
} from '../actions/empInfo';

/**
 * 0(Sunday) to 6(Saturday)
 * @type {Number}
 */
const START_DAY_OF_THE_WEEK = 0; // TODO: 週の開始曜日をサーバーから返す。empInfoで渡される想定。

export default function empInfoReducer(
  state = {
    isFetching: false,
    didInvalidate: false,
    record: {},
    startDayOfTheWeek: START_DAY_OF_THE_WEEK,
  },
  action
) {
  switch (action.type) {
    case FETCH_EMP_INFO_START:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false,
        record: {},
      });
    case FETCH_EMP_INFO_SUCCESS:
      window.empInfo = action.record;
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        record: action.record,
      });
    default:
      return state;
  }
}
