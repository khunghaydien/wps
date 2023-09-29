import { bindActionCreators } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../commons/actions/app';
import DateUtil from '../../../commons/utils/DateUtil';
import * as PagingUtil from '../../../commons/utils/PagingUtil';

import Repository, {
  Order,
} from '../../../repositories/organization/job/JobListRepository';

import { Job } from '../../../domain/models/organization/Job';

import { actions as UIListActions } from '../../modules/base/list-pane/ui/list';
import { actions as PagingActions } from '../../modules/base/list-pane/ui/paging';
import {
  actions as SortConditionActions,
  getOrder,
  State as SortCondition,
} from '../../modules/base/list-pane/ui/sortCondition';
import { actions as IdsActions } from '../../modules/job/entities/ids';
import { actions as ListActions } from '../../modules/job/entities/list';
import { actions as TotalCountActions } from '../../modules/job/entities/totalCount';
import {
  actions as SearchConditionActions,
  initialState as searchConditionInitialState,
  State as SearchCondition,
} from '../../modules/job/ui/searchCondition';
import {
  actions as SearchQueryActions,
  State as SearchQuery,
} from '../../modules/job/ui/searchQuery';

import { AppDispatch } from '../AppThunk';

const App = (dispatch: AppDispatch) =>
  bindActionCreators({ loadingStart, loadingEnd, catchApiError }, dispatch);

const fetchRecordsEachPage = async (
  ids: string[],
  paging: PagingUtil.PagingOptions
): Promise<Job[]> => {
  if (!ids.length) {
    return [];
  }
  const $ids = PagingUtil.getRecordsEachPage(ids, paging);
  if (!$ids.length) {
    return [];
  }
  const records = await Repository.getRecords($ids);
  return records;
};

export const changeSearchField =
  (key: string, value: string) => (dispatch: AppDispatch) => {
    dispatch(SearchConditionActions.set(key, value));
  };

export const search =
  (
    companyId: string,
    params: SearchCondition,
    sortCondition: SortCondition,
    pagingOptions: PagingUtil.PagingOptions
  ) =>
  async (dispatch: AppDispatch) => {
    const app = App(dispatch);
    try {
      app.loadingStart();

      const targetDate = params.targetDate || DateUtil.getToday();
      const searchQuery: SearchQuery = {
        ...params,
        companyId,
        sortCondition,
        targetDate,
        limitNumber: pagingOptions.limit,
      };

      const { ids, isOverLimit, totalCount } = await Repository.searchIds(
        searchQuery
      );
      const $pagingOptions = {
        ...pagingOptions,
        current: PagingUtil.roundPage(
          ids.length,
          pagingOptions.current,
          pagingOptions.limitPerPage
        ),
      };
      const result = await fetchRecordsEachPage(ids, $pagingOptions);
      dispatch(IdsActions.fetch(ids));
      dispatch(ListActions.fetch(result));
      dispatch(TotalCountActions.set(totalCount));
      dispatch(PagingActions.initialize($pagingOptions, isOverLimit));

      dispatch(SearchQueryActions.save(searchQuery));
      dispatch(
        SortConditionActions.set(sortCondition.field, sortCondition.order)
      );
    } catch (err) {
      app.catchApiError(err);
    } finally {
      app.loadingEnd();
    }
  };

export const sort =
  (
    searchQuery: SearchQuery,
    field: string,
    pagingOptions: PagingUtil.PagingOptions
  ) =>
  async (dispatch: AppDispatch) => {
    const app = App(dispatch);
    try {
      app.loadingStart();

      const sortCondition = searchQuery.sortCondition || {};
      const $sortCondition: { field: string; order: Order } = {
        field,
        order: getOrder(
          {
            // @ts-ignore
            field: sortCondition.field || '',
            // @ts-ignore
            order: sortCondition.order || 'ASC',
          },
          field
        ),
      };

      const $searchQuery = {
        ...searchQuery,
        sortCondition: $sortCondition,
      };

      const { ids, isOverLimit } = await Repository.searchIds($searchQuery);
      const $pagingOptions = {
        ...pagingOptions,
        current: PagingUtil.roundPage(
          ids.length,
          pagingOptions.current,
          pagingOptions.limitPerPage
        ),
      };
      const result = await fetchRecordsEachPage(ids, $pagingOptions);

      dispatch(IdsActions.fetch(ids));
      dispatch(ListActions.fetch(result));
      dispatch(PagingActions.initialize($pagingOptions, isOverLimit));
      dispatch(SearchQueryActions.save($searchQuery));
      dispatch(
        SortConditionActions.set($sortCondition.field, $sortCondition.order)
      );
    } catch (err) {
      app.catchApiError(err);
    } finally {
      app.loadingEnd();
    }
  };

/**
 * This method is used to search Job IDs
 * with the same SearchQuery as that when used search() method
 * and fetch Job Records.
 *
 * @param {*} searchQuery
 * @param {*} pagingOptions
 */
export const refreshSearchResult =
  (searchQuery: SearchQuery, pagingOptions: PagingUtil.PagingOptions) =>
  async (dispatch: AppDispatch) => {
    const app = App(dispatch);
    try {
      app.loadingStart();

      const { ids, isOverLimit, totalCount } = await Repository.searchIds(
        searchQuery
      );
      const $pagingOptions = {
        ...pagingOptions,
        current: PagingUtil.roundPage(
          ids.length,
          pagingOptions.current,
          pagingOptions.limitPerPage
        ),
      };
      const result = await fetchRecordsEachPage(ids, $pagingOptions);

      dispatch(IdsActions.fetch(ids));
      dispatch(ListActions.fetch(result));
      dispatch(TotalCountActions.set(totalCount));
      dispatch(PagingActions.initialize($pagingOptions, isOverLimit));

      const { sortCondition } = searchQuery;
      if (sortCondition) {
        dispatch(
          SortConditionActions.set(sortCondition.field, sortCondition.order)
        );
      }
    } catch (err) {
      app.catchApiError(err);
    } finally {
      app.loadingEnd();
    }
  };

export const fetchRecordsByPage =
  (ids: string[], pagingOptions: PagingUtil.PagingOptions) =>
  async (dispatch: AppDispatch) => {
    const app = App(dispatch);
    try {
      app.loadingStart();

      const $pagingOptions = {
        ...pagingOptions,
        current: PagingUtil.roundPage(
          ids.length,
          pagingOptions.current,
          pagingOptions.limitPerPage
        ),
      };
      const result = await fetchRecordsEachPage(ids, $pagingOptions);

      dispatch(ListActions.fetch(result));
      dispatch(PagingActions.setCurrent($pagingOptions.current));
    } catch (err) {
      app.catchApiError(err);
    } finally {
      app.loadingEnd();
    }
  };

export const setSelectedRowIndex =
  (index: number) => (dispatch: AppDispatch) => {
    dispatch(UIListActions.setSelectedRowIndex(index));
  };

export const initialize =
  (companyId: string, pagingOptions: PagingUtil.PagingOptions) =>
  (dispatch: AppDispatch) => {
    const searchCondition = {
      ...searchConditionInitialState,
    };
    const sortCondition: SortCondition = {
      field: 'code',
      order: 'ASC',
    };

    dispatch(SearchConditionActions.initialize(searchCondition));
    dispatch(
      SortConditionActions.set(sortCondition.field, sortCondition.order)
    );

    dispatch(search(companyId, searchCondition, sortCondition, pagingOptions));
  };
