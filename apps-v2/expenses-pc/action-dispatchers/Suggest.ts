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
 * @param {string} targetDate for jorudan record is record date
 * @param {?string} [category=null]
 */
// eslint-disable-next-line import/prefer-default-export
export const getStation =
  (
    searchString: string,
    targetDate: string,
    category: string = null,
    empHistoryId?: string
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(loadingStart());
    let station = {};
    return getSuggestion(searchString, targetDate, category, empHistoryId)
      .then((result) => {
        station = result;
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => {
        dispatch(loadingEnd());
        return station;
      });
  };
