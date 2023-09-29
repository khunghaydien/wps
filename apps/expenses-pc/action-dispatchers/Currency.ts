import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';

import { searchCurrencyCodeList } from '../../domain/models/exp/foreign-currency/Currency';

import { AppDispatch } from '../modules/AppThunk';
import { actions as currencyActions } from '../modules/ui/expenses/recordItemPane/foreignCurrency/currency';
import { actions as exchangeRateActions } from '../modules/ui/expenses/recordItemPane/foreignCurrency/exchangeRate';
import { actions as taxActions } from '../modules/ui/expenses/recordItemPane/tax';

/* Base Currency */

export const searchTaxTypeList =
  (
    expTypeId: string,
    targetDate: string,
    loadingArea?: string,
    loadInBackground?: boolean
  ) =>
  (dispatch: AppDispatch) => {
    dispatch(taxActions.set(expTypeId, targetDate, []));
    if (!loadInBackground) {
      const payload = loadingArea ? { areas: loadingArea } : null;
      dispatch(loadingStart(payload));
    }
    let taxTypeList;
    return dispatch(taxActions.list(expTypeId, targetDate))
      .then((result) => {
        taxTypeList = result;
      })
      .catch((err) => dispatch(catchApiError(err, { isContinuable: true })))
      .then(() => {
        if (!loadInBackground) {
          dispatch(loadingEnd(loadingArea));
        }
        return taxTypeList;
      });
  };

/* Foerign Currency */

/**
 * Get exchange rate based on currency id and date
 *
 * @param {string} companyId
 * @param {string} currencyId
 * @param {string} recordDate
 * @returns {*} rate without %
 */
export const getRateFromId = (
  companyId: string,
  currencyId: string,
  recordDate: string,
  loadingArea?: string,
  loadInBackground?: boolean
): any =>
  exchangeRateActions.search(
    companyId,
    currencyId,
    recordDate,
    loadingArea,
    loadInBackground
  );

export const searchCurrencyList = (
  companyId: string,
  loadInbackground?: boolean
) => currencyActions.search(companyId, loadInbackground);

export const searchCurrencyCode = () => searchCurrencyCodeList();
