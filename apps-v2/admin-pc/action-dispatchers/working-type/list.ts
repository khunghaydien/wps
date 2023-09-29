import { Dispatch } from 'redux';

import isNil from 'lodash/isNil';
import moment from 'moment';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';

import WorkingTypeListRepository, {
  ORDER_TYPE,
  SortOrder,
} from '@apps/repositories/organization/workingType/WorkingTypeRepository';

import { actions as PagingActions } from '../../modules/base/list-pane/ui/paging';
import { actions as listActions } from '../../modules/workingType/ui/list';
import {
  actions as SearchConditionActions,
  Condition,
} from '../../modules/workingType/ui/searchCondition';

import { searchWorkingType } from '../../actions/workingType';

import { closeDetailPanel } from './panel';

const convertCondition = (searchCondition: SearchCondition) => {
  const { code, targetDate, ...condition } = searchCondition;
  return {
    ...condition,
    id: null,
    codes: code ? [code] : [],
    targetDate:
      isNil(targetDate) || targetDate === ''
        ? moment().format('YYYY-MM-DD')
        : targetDate,
    isSearchCodeForPartialMatch: true,
  };
};

export type SearchCondition = Condition & { companyId: string };

export const search =
  (
    searchCondition: SearchCondition,
    sortOrder: SortOrder,
    chunkSize: number,
    isOverLimit: boolean,
    changeSort: boolean,
    staySort: boolean,
    closeDetail: boolean,
    pagingConditon?: { offsetCode: string; currentPage: number }
  ) =>
  async (dispatch: Dispatch<any>) => {
    if (closeDetail) {
      dispatch(closeDetailPanel());
    }
    const condition = convertCondition(searchCondition);
    let $sortOrder = sortOrder;
    if (!staySort) {
      if (changeSort) {
        $sortOrder = {
          field: $sortOrder.field,
          order:
            $sortOrder.order === ORDER_TYPE.ASC
              ? ORDER_TYPE.DESC
              : ORDER_TYPE.ASC,
        };
      } else {
        $sortOrder = {
          field: $sortOrder.field,
          order: ORDER_TYPE.ASC,
        };
      }
    }
    dispatch(listActions.setSortOrder($sortOrder));
    dispatch(loadingStart());
    await WorkingTypeListRepository.searchOffsetCodes({
      condition,
      sortOrder: $sortOrder,
      chunkSize,
    })
      .then(({ total, offsetCodes, hasMoreRecords }) => {
        dispatch(loadingEnd());
        dispatch(
          listActions.setOffsetCodes(total, offsetCodes, hasMoreRecords)
        );
      })
      .catch((err) => {
        dispatch(loadingEnd());
        dispatch(catchApiError(err, { isContinuable: true }));
      });
    dispatch(
      searchWorkingType({
        condition,
        sortOrder: $sortOrder,
        chunkSize,
        offsetCode: pagingConditon?.offsetCode || null,
      })
    );
    dispatch(
      PagingActions.initialize(
        {
          current: pagingConditon?.currentPage || 1,
          limitPerPage: chunkSize,
        },
        isOverLimit
      )
    );
  };

export const init =
  (searchCondition: SearchCondition, sortOrder: SortOrder, chunkSize: number) =>
  (dispatch: Dispatch<any>) => {
    dispatch(listActions.resetSelectedCode());
    dispatch(listActions.resetSortOrder());
    dispatch(listActions.resetOffsetCodes());
    dispatch(
      PagingActions.initialize(
        {
          current: 1,
          limitPerPage: chunkSize,
        },
        false
      )
    );
    dispatch(SearchConditionActions.initialize());
    dispatch(loadingStart());
    const condition = convertCondition(searchCondition);
    WorkingTypeListRepository.searchOffsetCodes({
      condition,
      sortOrder,
      chunkSize,
    })
      .then(({ total, offsetCodes, hasMoreRecords }) => {
        dispatch(loadingEnd());
        dispatch(
          listActions.setOffsetCodes(total, offsetCodes, hasMoreRecords)
        );
      })
      .catch((err) => {
        dispatch(loadingEnd());
        dispatch(catchApiError(err, { isContinuable: true }));
      });
    dispatch(
      searchWorkingType({
        condition,
        sortOrder,
        chunkSize,
        offsetCode: null,
      })
    );
  };

export const turnPage =
  (
    searchCondition: SearchCondition,
    sortOrder: SortOrder,
    chunkSize: number,
    offsetCode: string,
    currentPage: number
  ) =>
  (dispatch: Dispatch<any>) => {
    dispatch(closeDetailPanel());
    const condition = convertCondition(searchCondition);
    dispatch(
      searchWorkingType({
        condition,
        sortOrder,
        chunkSize,
        offsetCode,
      })
    );
    dispatch(PagingActions.setCurrent(currentPage));
  };
