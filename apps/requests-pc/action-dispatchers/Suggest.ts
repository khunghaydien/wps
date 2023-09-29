import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';

import { getSuggestion } from '../../domain/models/exp/jorudan/Station';

import { AppDispatch } from '../modules/AppThunk';

/**
 * Search station by keyword
 *
 * @param {string} searchString
 * @param {string} targetDate
 * @param {?string} [category=null]
 */
// eslint-disable-next-line import/prefer-default-export
export const getStation =
  (searchString: string, targetDate: string, category: string = null) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    let station = {};
    return getSuggestion(searchString, targetDate, category)
      .then((result) => {
        station = result;
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => {
        dispatch(loadingEnd());
        return station;
      });
  };
