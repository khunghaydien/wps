import { withLoading } from '../../modules/commons/loading';

import { AppDispatch } from '../../modules/expense/AppThunk';
import { actions as exchangeRateActions } from '../../modules/expense/entities/exchangeRate';
import { actions as currencyActions } from '../../modules/expense/entities/foreignCurrency';

/**
 * Get exchange rate based on currency and date
 *
 * @param {string} companyId
 * @param {string} currencyId
 * @param {string} [recordDate]
 */
export const getRateFromId =
  (companyId: string, currencyId: string, recordDate?: string) =>
  (dispatch: AppDispatch) =>
    dispatch(
      withLoading(exchangeRateActions.search(companyId, currencyId, recordDate))
    );

export const searchCurrencyList = (companyId: string) =>
  currencyActions.search(companyId);
