import get from 'lodash/get';

import { withLoading } from '../../modules/commons/loading';

import { RecordItem } from '@apps/domain/models/exp/Record';

import { State } from '../../modules';
import { AppDispatch } from '../../modules/expense/AppThunk';
import {
  actions as childTaxTypeActions,
  TaxTypeByExpTypeId,
} from '../../modules/expense/entities/childTaxType';
import { actions as taxTypeActions } from '../../modules/expense/entities/taxType';
import { actions as taxTypeCacheActions } from '../../modules/expense/ui/tax/taxTypes';

/**
 * Get tax type list based on expense type and date
 * @deprecated
 * @param {string} expTypeId
 * @param {string} targetDate
 */
export const getTaxTypeList =
  (expTypeId: string, targetDate: string) => (dispatch: AppDispatch) =>
    dispatch(withLoading(taxTypeActions.list(expTypeId, targetDate)));

/**
 * Get and cache tax type list by expense type and date, for easier cache reuse
 *
 * @param {string} expTypeId
 * @param {string} targetDate
 */
export const searchTaxListByDateExpType =
  (expTypeId: string, targetDate: string) => (dispatch: AppDispatch) =>
    dispatch(withLoading(taxTypeCacheActions.search(expTypeId, targetDate)));

export const searchChildItemTaxTypeList =
  (childItemList: RecordItem[], parentRecordDate: string) =>
  async (
    dispatch: AppDispatch,
    getState: () => State
  ): Promise<TaxTypeByExpTypeId> => {
    let fetchTaxTypeList = [];
    const childTaxTypeObj = getState().expense.entities.childTaxType;

    if (parentRecordDate) {
      const selectedExpTypeIdList = childItemList.map(
        ({ expTypeId }) => expTypeId
      );
      const uniqSelectedExpTypeIdList = [
        ...new Set(selectedExpTypeIdList),
      ].filter((expTypeId) => !!expTypeId);

      fetchTaxTypeList = uniqSelectedExpTypeIdList.map(
        async (expTypeId: string) => {
          const taxTypeList = get(
            childTaxTypeObj,
            `${expTypeId}.${parentRecordDate}`
          );
          if (taxTypeList) return null;

          return await dispatch(
            childTaxTypeActions.search(expTypeId, parentRecordDate)
          );
        }
      );
    }
    const taxTypeResList = await Promise.all(fetchTaxTypeList);
    return Object.assign(childTaxTypeObj, ...taxTypeResList);
  };
