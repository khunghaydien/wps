import { bindActionCreators } from 'redux';

import {
  catchApiError,
  loadingEnd,
  loadingStart,
} from '@apps/commons/actions/app';
import msg from '@apps/commons/languages';
import TextUtil from '@apps/commons/utils/TextUtil';

import WorkingTypeRepository, {
  ORDER_TYPE,
  SortOrder,
} from '@apps/repositories/organization/workingType/WorkingTypeRepository';

import {
  actions as listActions,
  initialState,
} from '@admin-pc/modules/workingType/ui/list';
import { actions as PagingActions } from '@admin-pc/modules/workingType/ui/paging';
import {
  actions as searchActions,
  Condition,
  initCondition as $initCondition,
  WORK_SYSTEM_TYPE,
} from '@admin-pc/modules/workingType/ui/searchCondition';
import {
  actions as workingTypeDialogActions,
  WorkingType,
} from '@admin-pc-v2/modules/employee/ui/workingTypeDialog';

import { AppDispatch } from '@admin-pc/action-dispatchers/AppThunk';
import {
  SEARCH_WORKING_TYPE,
  searchWorkingType,
} from '@admin-pc/actions/workingType';

type SearchCondition = Condition & { companyId: string };

const convertCondition = (searchCondition: SearchCondition) => {
  const { code, ...condition } = searchCondition;
  return {
    ...condition,
    id: null,
    codes: code ? [code] : [],
    isSearchCodeForPartialMatch: true,
  };
};

export const convertWorkSystem = (workSystem) => {
  if (workSystem === WORK_SYSTEM_TYPE.JP_Flex_Without_Core) {
    return WORK_SYSTEM_TYPE.JP_Flex;
  }
  return workSystem;
};

interface PatternListService {
  init: (companyId: string, targetDate: string, chunkSize: number) => void;
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
  onClickRow: (workingType: WorkingType) => void;
  openDialog: (targetDate: string, companyId: string) => void;
  closeDiaglog: () => void;
  resetWorkingType: () => void;
}

export default (dispatch: AppDispatch): PatternListService => {
  const searchCondition = bindActionCreators(searchActions, dispatch);
  const list = bindActionCreators(listActions, dispatch);
  const paging = bindActionCreators(PagingActions, dispatch);
  const workingTypeDialog = bindActionCreators(
    workingTypeDialogActions,
    dispatch
  );

  const conditionIsNull = (value: string, name: string): boolean => {
    if (!value || value === '') {
      dispatch(
        catchApiError(
          {
            name: 'conditionIsNull',
            message: TextUtil.template(msg().Com_Err_Specify, name),
          },
          { isContinuable: true }
        )
      );
      return true;
    }
    return false;
  };

  return {
    init: (companyId: string, targetDate: string, chunkSize: number) => {
      const initCondition = {
        ...$initCondition,
        companyId,
        targetDate,
      };

      searchCondition.initialize({
        origin: initCondition,
        new: initCondition,
      });
      list.initialize();

      dispatch(loadingStart());
      const condition = convertCondition(initCondition);
      WorkingTypeRepository.searchOffsetCodes({
        condition,
        sortOrder: initialState.sortOrder,
        chunkSize,
      })
        .then(({ total, offsetCodes, hasMoreRecords }) => {
          dispatch(loadingEnd());
          list.setOffsetCodes(total, offsetCodes, hasMoreRecords);
          if (total > 0) {
            paging.setCurrent(1);
          }
        })
        .catch((err) => {
          dispatch(loadingEnd());
          dispatch(catchApiError(err, { isContinuable: true }));
        });

      dispatch(
        searchWorkingType({
          condition,
          sortOrder: initialState.sortOrder,
          chunkSize,
          offsetCode: null,
        })
      );
    },
    search: async (
      searchCondition: SearchCondition,
      sortOrder: SortOrder,
      chunkSize: number,
      changeSort: boolean
    ) => {
      let $sortOrder = sortOrder;

      if (
        conditionIsNull(searchCondition.targetDate, msg().Admin_Lbl_TargetDate)
      ) {
        return;
      }

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
      const condition = {
        ...convertCondition(searchCondition),
        workSystem: convertWorkSystem(searchCondition.workSystem),
      };
      await WorkingTypeRepository.searchOffsetCodes({
        condition,
        sortOrder: $sortOrder,
        chunkSize,
      })
        .then(({ total, offsetCodes, hasMoreRecords }) => {
          dispatch(loadingEnd());
          list.setOffsetCodes(total, offsetCodes, hasMoreRecords);
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
        searchWorkingType({
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
        searchWorkingType({
          condition,
          sortOrder,
          chunkSize,
          offsetCode,
        })
      );
      dispatch(paging.setCurrent(currentPage));
    },
    setSearchCondition: searchCondition.setNew,
    saveCondition: searchCondition.setOrigin,
    onClickRow: workingTypeDialog.setSelectedWorkingType,
    openDialog: (targetDate: string, companyId: string) => {
      if (
        conditionIsNull(targetDate, msg().Admin_Lbl_ValidDateFrom) ||
        conditionIsNull(companyId, msg().Admin_Lbl_Company)
      ) {
        return;
      }

      workingTypeDialog.show();
    },
    closeDiaglog: () => {
      workingTypeDialog.hide();
      searchCondition.initialize({
        origin: $initCondition,
        new: $initCondition,
      });
      paging.reset();
      list.initialize();
      dispatch({ type: SEARCH_WORKING_TYPE, payload: [] });
      workingTypeDialog.resetSelectedWorkingType();
    },
    resetWorkingType: () => {
      dispatch({ type: SEARCH_WORKING_TYPE, payload: [] });
    },
  };
};
