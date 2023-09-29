import { bindActionCreators } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';

import AttPatternListRepository, {
  ORDER_TYPE,
  SortOrder,
} from '@apps/repositories/organization/attPattern/AttPatternListRepository';

import { actions as UIListActions } from '../../modules/base/list-pane/ui/list';
import { actions as PagingActions } from '../../modules/base/list-pane/ui/paging';
import { actions as listActions } from '../../modules/pattern/ui/list';
import {
  actions as searchActions,
  Condition,
  WORK_SYSTEM_TYPE,
} from '../../modules/pattern/ui/searchCondition';

import {
  getConstantsAttPattern,
  searchAttPattern,
} from '../../actions/attPattern';

import { AppDispatch } from '../AppThunk';
import PanelActions from './panel';

export const convertWorkSystem = (workSystem) => {
  if (workSystem === WORK_SYSTEM_TYPE.JP_Flex_Without_Core) {
    return WORK_SYSTEM_TYPE.JP_Flex;
  }
  return workSystem;
};

export const convertCondition = (searchCondition: SearchCondition) => {
  const { code, ...condition } = searchCondition;
  return {
    ...condition,
    codes: code ? [code] : [],
    isSearchCodeForPartialMatch: true,
  };
};

export type SearchCondition = Condition & { companyId: string };

interface PatternListService {
  getConstantsAttPattern: () => void;
  init: (
    searchCondition: SearchCondition,
    sortOrder: SortOrder,
    chunkSize: number
  ) => void;
  search: (
    searchCondition: SearchCondition,
    sortOrder: SortOrder,
    chunkSize: number,
    isOverLimit: boolean,
    changeSort: boolean,
    staySort: boolean,
    pagingConditon?: { offsetCode: string; currentPage: number }
  ) => void;
  turnPage: (
    searchCondition: SearchCondition,
    sortOrder: SortOrder,
    chunkSize: number,
    offsetCode: string,
    currentPage: number
  ) => void;
  setSearchCondition: (key: string, value: string) => void;
  saveCondition: (condition: Condition) => void;
  setSelectedRowIndex: (index: number) => void;
}

export default (dispatch: AppDispatch): PatternListService => {
  const search = bindActionCreators(searchActions, dispatch);
  const list = bindActionCreators(listActions, dispatch);
  const uiList = bindActionCreators(UIListActions, dispatch);
  const paging = bindActionCreators(PagingActions, dispatch);
  const panel = PanelActions(dispatch);
  return {
    getConstantsAttPattern: () => {
      dispatch(getConstantsAttPattern());
    },
    init: (
      searchCondition: SearchCondition,
      sortOrder: SortOrder,
      chunkSize: number
    ) => {
      list.resetSelectedCode();
      list.resetSortOrder();
      list.reset();
      search.initialize();
      paging.initialize(
        {
          current: 1,
          limitPerPage: chunkSize,
        },
        false
      );

      dispatch(loadingStart());
      const condition = convertCondition(searchCondition);
      AttPatternListRepository.searchOffsetCodes({
        condition,
        sortOrder,
        chunkSize,
      })
        .then(({ total, offsetCodes, hasMoreRecords }) => {
          dispatch(loadingEnd());
          list.set(total, offsetCodes, hasMoreRecords);
        })
        .catch((err) => {
          dispatch(loadingEnd());
          dispatch(catchApiError(err, { isContinuable: true }));
        });

      dispatch(
        searchAttPattern({
          condition,
          sortOrder,
          chunkSize,
          offsetCode: null,
        })
      );
    },
    search: async (
      searchCondition: SearchCondition,
      sortOrder: SortOrder,
      chunkSize: number,
      isOverLimit: boolean,
      changeSort: boolean,
      staySort: boolean,
      pagingConditon?: { offsetCode: string; currentPage: number }
    ) => {
      panel.closeDetailPanel();

      const condition = {
        ...convertCondition(searchCondition),
        workSystem: convertWorkSystem(searchCondition.workSystem),
      };

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
      list.setSortOrder($sortOrder);

      dispatch(loadingStart());
      await AttPatternListRepository.searchOffsetCodes({
        condition,
        sortOrder: $sortOrder,
        chunkSize,
      })
        .then(({ total, offsetCodes, hasMoreRecords }) => {
          dispatch(loadingEnd());
          list.set(total, offsetCodes, hasMoreRecords);
        })
        .catch((err) => {
          dispatch(loadingEnd());
          dispatch(catchApiError(err, { isContinuable: true }));
        });
      dispatch(
        searchAttPattern({
          condition,
          sortOrder: $sortOrder,
          chunkSize,
          offsetCode: pagingConditon?.offsetCode || null,
        })
      );
      paging.initialize(
        {
          current: pagingConditon?.currentPage || 1,
          limitPerPage: chunkSize,
        },
        isOverLimit
      );
    },
    turnPage: (
      searchCondition: SearchCondition,
      sortOrder: SortOrder,
      chunkSize: number,
      offsetCode: string,
      currentPage: number
    ) => {
      panel.closeDetailPanel();

      const condition = {
        ...convertCondition(searchCondition),
        workSystem: convertWorkSystem(searchCondition.workSystem),
      };

      dispatch(
        searchAttPattern({
          condition,
          sortOrder,
          chunkSize,
          offsetCode,
        })
      );
      dispatch(paging.setCurrent(currentPage));
    },
    setSearchCondition: search.setNew,
    saveCondition: search.setOrigin,
    setSelectedRowIndex: uiList.setSelectedRowIndex,
  };
};
