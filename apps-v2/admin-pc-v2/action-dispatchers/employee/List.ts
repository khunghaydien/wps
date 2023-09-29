import { bindActionCreators } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '../../../commons/actions/app';
import DateUtil from '../../../commons/utils/DateUtil';
import * as PagingUtil from '../../../commons/utils/PagingUtil';

import Repository, {
  EmployeeV2 as Employee,
  Order,
} from '../../../repositories/organization/employee/EmployeeListRepository';

import { actions as IdsActions } from '@admin-pc-v2/modules/employee/entities/ids';
import { actions as ListActions } from '@admin-pc-v2/modules/employee/entities/list';
import {
  actions as SearchConditionActions,
  initialState as searchConditionInitialState,
  State as SearchCondition,
} from '@admin-pc-v2/modules/employee/ui/searchCondition';
import {
  actions as SearchQueryActions,
  State as SearchQuery,
} from '@admin-pc-v2/modules/employee/ui/searchQuery';
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
): Promise<Employee[]> => {
  if (!ids.length) {
    return [];
  }
  const $ids = PagingUtil.getRecordsEachPage(ids, paging);
  if (!$ids.length) {
    return [];
  }
  const records = await Repository.getRecordsV2($ids, targetDate);
  return records;
};

export const changeSearchField =
  (key: string, value: string) => (dispatch: AppDispatch) => {
    dispatch(SearchConditionActions.set(key, value));
  };

export const search =
  (
    params: SearchCondition,
    sortCondition: SortCondition,
    pagingOptions: PagingUtil.PagingOptions
  ) =>
  async (dispatch: AppDispatch) => {
    const app = App(dispatch);
    try {
      app.loadingStart();

      const targetDate = params.targetDate || DateUtil.getToday();
      const searchCondition = { ...params, targetDate };
      const searchQuery: SearchQuery = {
        searchCondition,
        sortCondition,
        numberOfRecordsToRetrieve: pagingOptions.limit,
      };

      const { ids, isOverLimit } = await Repository.searchIdsV2(searchQuery);
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

      const { targetDate } = searchQuery.searchCondition;
      if (!targetDate) {
        return;
      }
      const sortCondition = searchQuery.sortCondition || {
        field: undefined,
        order: undefined,
      };
      const $sortCondition = {
        field,
        order: getOrder(
          {
            field: sortCondition.field || '',
            order: sortCondition.order || 'ASC',
          },
          field
        ) as Order,
      };

      const $searchQuery: SearchQuery = {
        ...searchQuery,
        sortCondition: $sortCondition,
      };

      const { ids, isOverLimit } = await Repository.searchIdsV2($searchQuery);
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
 * This method is used to search Employee IDs
 * with the same SearchQuery as that when used search() method
 * and fetch Employee Records.
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

      const { targetDate } = searchQuery.searchCondition;
      if (!targetDate) {
        return;
      }

      const { ids, isOverLimit } = await Repository.searchIdsV2(searchQuery);
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
      companyId,
      primary: true,
    };

    const sortCondition: SortCondition = {
      field: 'code',
      order: 'ASC',
    };

    dispatch(SearchConditionActions.initialize(searchCondition));
    dispatch(
      SortConditionActions.set(sortCondition.field, sortCondition.order)
    );

    dispatch(search(searchCondition, sortCondition, pagingOptions));
  };

export const resetSearchConditions = () => (dispatch: AppDispatch) => {
  dispatch(SearchConditionActions.initialize(searchConditionInitialState));
  dispatch(SearchQueryActions.initialize());
};
