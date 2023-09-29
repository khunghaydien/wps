import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../commons/actions/app';

import { searchCurrencyCodeList } from '../../domain/models/exp/foreign-currency/Currency';
import { RecordItem } from '@apps/domain/models/exp/Record';
import { ExpTaxByExpType } from '@apps/domain/models/exp/TaxType';

import { State } from '../modules';
import { AppDispatch } from '../modules/AppThunk';
import { actions as currencyActions } from '../modules/ui/expenses/recordItemPane/foreignCurrency/currency';
import { actions as exchangeRateActions } from '../modules/ui/expenses/recordItemPane/foreignCurrency/exchangeRate';
import {
  actions as taxActions,
  SearchSuccess as TaxSearchSuccess,
} from '../modules/ui/expenses/recordItemPane/tax';

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

export const searchChildItemTaxTypeList =
  (
    childItemList: RecordItem[],
    parentRecordDate: string,
    loadInBackground?: boolean
  ) =>
  async (
    dispatch: AppDispatch,
    getState: () => State
  ): Promise<ExpTaxByExpType> => {
    let fetchTaxTypeList = [];
    const taxTypeObj = getState().ui.expenses.recordItemPane.tax;

    if (parentRecordDate) {
      const selectedExpTypeIdList = childItemList.map(
        ({ expTypeId }) => expTypeId
      );
      const uniqSelectedExpTypeIdList = [...new Set(selectedExpTypeIdList)];

      fetchTaxTypeList = uniqSelectedExpTypeIdList.map(
        async (expTypeId: string) => {
          const taxTypeList = get(
            taxTypeObj,
            `${expTypeId}.${parentRecordDate}`
          );
          if (taxTypeList || !expTypeId) return null;

          return await dispatch(
            searchTaxTypeList(expTypeId, parentRecordDate, '', loadInBackground)
          );
        }
      );
    }

    const taxTypeResList = await Promise.all(fetchTaxTypeList);
    const taxTypeResObj = taxTypeResList.reduce(
      (obj: ExpTaxByExpType, item: TaxSearchSuccess | null) => {
        return item ? Object.assign(obj, { ...item.payload }) : obj;
      },
      {}
    );
    const clonedTaxTypeObj = cloneDeep(taxTypeObj);
    return Object.assign(clonedTaxTypeObj, taxTypeResObj);
  };

/* Foreign Currency */

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
  recordDate?: string,
  loadingArea?: string,
  loadInbackground?: boolean
): any =>
  exchangeRateActions.search(
    companyId,
    currencyId,
    recordDate,
    loadingArea,
    loadInbackground
  );

export const searchCurrencyList = (
  companyId: string,
  loadInbackground?: boolean
) => currencyActions.search(companyId, loadInbackground);

export const searchCurrencyCode = () => searchCurrencyCodeList();
