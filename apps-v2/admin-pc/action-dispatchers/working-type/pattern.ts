import { bindActionCreators } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';

import AttPatternListRepository, {
  ORDER_TYPE,
  SearchCondition as InitCondition,
  SortOrder,
} from '@apps/repositories/organization/attPattern/AttPatternListRepository';

import {
  actions as listActions,
  initialState,
} from '../../modules/pattern/ui/list';
import { actions as PagingActions } from '../../modules/pattern/ui/paging';
import {
  actions as searchActions,
  initCondition,
} from '../../modules/pattern/ui/searchCondition';
import {
  actions as selectedPatternActions,
  Pattern,
} from '../../modules/workingType/ui/pattern/selectedPattern';
import { actions as selectedTableActions } from '../../modules/workingType/ui/pattern/selectedTable';
import {
  actions as tabActions,
  OptionValue,
} from '../../modules/workingType/ui/pattern/tab';

import { SEARCH_ATT_PATTERN, searchAttPattern } from '../../actions/attPattern';

import { AppDispatch } from '../AppThunk';
import {
  convertCondition,
  convertWorkSystem,
  SearchCondition,
} from '../pattern/list';

export type ListPattern = Pattern & { checkbox: boolean };

interface PatternListService {
  initDetail: (condition: InitCondition, sortOrder: SortOrder) => void;
  initDialog: (
    companyId: string,
    workSystem: SearchCondition['workSystem'],
    chunkSize: number,
    detailSelectedPattern: Pattern[]
  ) => void;
  search: (
    searchCondition: SearchCondition,
    sortOrder: SortOrder,
    chunkSize: number,
    changeSort: boolean
  ) => void;
  turnPage: (
    searchCondition: SearchCondition,
    sortOrder: SortOrder,
    chunkSize: number,
    offsetCode: string,
    currentPage: number
  ) => void;
  setSearchCondition: (key: string, value: string) => void;
  saveCondition: (condition: SearchCondition) => void;
  sortSelectedTable: (sortOrder: SortOrder) => void;
  onClickRow: (pattern: ListPattern) => void;
  savePattern: (patterns: Pattern[]) => void;
  resetDialog: () => void;
  setTabValue: (value: OptionValue) => void;
}

export default (dispatch: AppDispatch): PatternListService => {
  const search = bindActionCreators(searchActions, dispatch);
  const list = bindActionCreators(listActions, dispatch);
  const paging = bindActionCreators(PagingActions, dispatch);
  const selectedPattern = bindActionCreators(selectedPatternActions, dispatch);
  const selectedTable = bindActionCreators(selectedTableActions, dispatch);
  const tab = bindActionCreators(tabActions, dispatch);

  return {
    initDetail: (condition: InitCondition, sortOrder: SortOrder) => {
      dispatch(loadingStart());
      AttPatternListRepository.searchPatterns({
        condition,
        sortOrder,
        chunkSize: null,
        offsetCode: null,
      })
        .then(({ records }) => {
          dispatch(loadingEnd());
          selectedPattern.init(records);
        })
        .catch((err) => {
          dispatch(loadingEnd());
          dispatch(catchApiError(err, { isContinuable: true }));
        });
      dispatch({ type: SEARCH_ATT_PATTERN, payload: [] });
    },
    initDialog: (
      companyId: string,
      workSystem: SearchCondition['workSystem'],
      chunkSize: number,
      detailSelectedPattern: Pattern[]
    ) => {
      search.initialize();
      list.initialize();

      dispatch(loadingStart());
      const condition = convertCondition({
        ...initCondition,
        companyId,
        workSystem,
      });
      AttPatternListRepository.searchOffsetCodes({
        condition,
        sortOrder: initialState.sortOrder,
        chunkSize,
      })
        .then(({ total, offsetCodes, hasMoreRecords }) => {
          dispatch(loadingEnd());
          list.set(total, offsetCodes, hasMoreRecords);
          if (total > 0) {
            paging.setCurrent(1);
          }
        })
        .catch((err) => {
          dispatch(loadingEnd());
          dispatch(catchApiError(err, { isContinuable: true }));
        });

      dispatch(
        searchAttPattern({
          condition,
          sortOrder: initialState.sortOrder,
          chunkSize,
          offsetCode: null,
        })
      );
      selectedTable.setSelectedPattern(detailSelectedPattern);
    },
    search: async (
      searchCondition: SearchCondition,
      sortOrder: SortOrder,
      chunkSize: number,
      changeSort: boolean
    ) => {
      const condition = {
        ...convertCondition(searchCondition),
        workSystem: convertWorkSystem(searchCondition.workSystem),
      };

      let $sortOrder = sortOrder;

      if (changeSort) {
        $sortOrder = {
          field: $sortOrder.field,
          order:
            $sortOrder.order === ORDER_TYPE.ASC
              ? ORDER_TYPE.DESC
              : ORDER_TYPE.ASC,
        };
        list.setSortOrder($sortOrder);
      } else {
        $sortOrder = {
          field: $sortOrder.field,
          order: ORDER_TYPE.ASC,
        };
        list.resetSortOrder();
      }

      dispatch(loadingStart());
      await AttPatternListRepository.searchOffsetCodes({
        condition,
        sortOrder: $sortOrder,
        chunkSize,
      })
        .then(({ total, offsetCodes, hasMoreRecords }) => {
          dispatch(loadingEnd());
          list.set(total, offsetCodes, hasMoreRecords);
          if (total > 0) {
            paging.setCurrent(1);
          } else {
            paging.setCurrent(0);
          }
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
          offsetCode: null,
        })
      );
    },
    turnPage: (
      searchCondition: SearchCondition,
      sortOrder: SortOrder,
      chunkSize: number,
      offsetCode: string,
      currentPage: number
    ) => {
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
    sortSelectedTable: (sortOrder: SortOrder) => {
      const $sortOrder = {
        field: sortOrder.field,
        order:
          sortOrder.order === ORDER_TYPE.ASC ? ORDER_TYPE.DESC : ORDER_TYPE.ASC,
      };
      selectedTable.setSortOrder($sortOrder);
    },
    onClickRow: (pattern: ListPattern) => {
      if (pattern.checkbox === true) {
        selectedTable.deleteSelectedPattern(pattern.code);
      } else {
        selectedTable.addSelectedPattern(pattern);
      }
    },
    savePattern: (patterns: Pattern[]) => {
      selectedPattern.setSelectedPattern(patterns);
    },
    resetDialog: () => {
      search.initialize();
      paging.reset();
      list.initialize();
      selectedTable.reset();
      tab.reset();
      dispatch({ type: SEARCH_ATT_PATTERN, payload: [] });
    },
    setTabValue: (value: OptionValue) => {
      tab.set(value);
    },
  };
};
