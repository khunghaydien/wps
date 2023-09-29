import { bindActionCreators } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../commons/actions/app';
import DateUtil from '../../../commons/utils/DateUtil';
import * as PagingUtil from '../../../commons/utils/PagingUtil';

import Repository, {
  Department,
} from '../../../repositories/organization/department/DepartmentListRepository';

import { actions as IdsActions } from '@admin-pc-v2/modules/department/entities/ids';
import { actions as ListActions } from '@admin-pc-v2/modules/department/entities/list';
import {
  actions as SearchConditionActions,
  initialState as searchConditionInitialState,
  State as SearchCondition,
} from '@admin-pc-v2/modules/department/ui/searchCondition';
import {
  actions as SearchQueryActions,
  State as SearchQuery,
} from '@admin-pc-v2/modules/department/ui/searchQuery';
import { actions as UIListActions } from '@admin-pc/modules/base/list-pane/ui/list';
import { actions as PagingActions } from '@admin-pc/modules/base/list-pane/ui/paging';
import {
  actions as SortConditionActions,
  getOrder,
  State as SortCondition,
} from '@admin-pc/modules/base/list-pane/ui/sortCondition';

import { AppDispatch } from '@admin-pc/action-dispatchers/AppThunk';

const App = (dispatch: AppDispatch) =>
  bindActionCreators({ loadingStart, loadingEnd, catchApiError }, dispatch);

const fetchRecordsEachPage = async (
  targetDate: string,
  ids: string[],
  paging: PagingUtil.PagingOptions
): Promise<Department[]> => {
  if (!ids.length) {
    return [];
  }
  const $ids = PagingUtil.getRecordsEachPage(ids, paging);
  if (!$ids.length) {
    return [];
  }
  const records = await Repository.getRecords($ids, targetDate);
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
        targetDate,
        companyId,
        sortCondition,
        limitNumber: pagingOptions.limit,
      };

      const { ids, isOverLimit } = await Repository.searchIds(searchQuery);
      const $pagingOptions = {
        ...pagingOptions,
        current: PagingUtil.roundPage(
          ids.length,
          pagingOptions.current,
          pagingOptions.limitPerPage
        ),
      };
      const records = await fetchRecordsEachPage(
        targetDate,
        ids,
        $pagingOptions
      );

      dispatch(IdsActions.fetch(ids));
      dispatch(ListActions.fetch(records));
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

      const { targetDate } = searchQuery;
      if (!targetDate) {
        return;
      }
      const sortCondition = searchQuery.sortCondition || {};
      const $sortCondition = {
        field,
        order: getOrder(
          {
            field: sortCondition.field || '',
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
      const records = await fetchRecordsEachPage(
        targetDate,
        ids,
        $pagingOptions
      );

      dispatch(IdsActions.fetch(ids));
      dispatch(ListActions.fetch(records));
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
 * This method is used to search Department IDs
 * with the same SearchQuery as that when used search() method
 * and fetch Department Records.
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

      const { targetDate } = searchQuery;
      if (!targetDate) {
        return;
      }

      const { ids, isOverLimit } = await Repository.searchIds(searchQuery);
      const $pagingOptions = {
        ...pagingOptions,
        current: PagingUtil.roundPage(
          ids.length,
          pagingOptions.current,
          pagingOptions.limitPerPage
        ),
      };
      const records = await fetchRecordsEachPage(
        targetDate,
        ids,
        $pagingOptions
      );

      dispatch(IdsActions.fetch(ids));
      dispatch(ListActions.fetch(records));
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
  (
    targetDate: string,
    ids: string[],
    pagingOptions: PagingUtil.PagingOptions
  ) =>
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
      const records = await fetchRecordsEachPage(
        targetDate,
        ids,
        $pagingOptions
      );

      dispatch(ListActions.fetch(records));
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
