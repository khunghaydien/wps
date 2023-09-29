import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import configList from '../../constants/configList/workingType';
import { FunctionTypeList } from '../../constants/functionType';

import { actions as UIListActions } from '../../modules/base/list-pane/ui/list';
import {
  actions as listActions,
  initialState as listInitState,
} from '../../modules/workingType/ui/list';
import {
  actions as searchConditionActions,
  initialState as conditionInitState,
} from '../../modules/workingType/ui/searchCondition';

import { startEditingNewRecord } from '../../action-dispatchers/working-type/detail';
import {
  init,
  search,
  turnPage,
} from '../../action-dispatchers/working-type/list';
import { openDetailPanel } from '../../action-dispatchers/working-type/panel';

import { State } from '../../reducers';

import Component from '../../presentational-components/WorkingType/MainContents/ListPane';

import NotificationContainer from './NotificationContainer';

const RECORD_LIMIT = 5000;
export const RECORD_LIMIT_PER_PAGE = 200;

const ListContainer = (ownProps: {
  title: string;
  useFunction: FunctionTypeList;
}) => {
  const dispatch = useDispatch();
  const Actions = React.useMemo(
    () =>
      bindActionCreators(
        {
          init,
          startEditingNewRecord,
          openDetailPanel,
          setSearchCondition: searchConditionActions.setNew,
          saveCondition: searchConditionActions.setOrigin,
          search,
          turnPage,
          setSelectedRowIndex: UIListActions.setSelectedRowIndex,
          resetSelectedCode: listActions.resetSelectedCode,
        },
        dispatch
      ),
    [dispatch]
  );

  const {
    companyId,
    selectedCode,
    itemList,
    selectedRowIndex,
    searchCondition,
    value2msgkey,
    sfObjFieldValues,
    limit,
    limitPerPage,
    currentPage,
    total,
    offsetCodes,
    isOverLimit,
    sortCondition,
  } = useSelector((state: State) => ({
    companyId: state.base.menuPane.ui.targetCompanyId,
    selectedCode: state.workingType.ui.list.selectedCode,
    itemList: state.searchWorkingType,
    selectedHistoryId: state.workingType.ui.detail.selectedHistoryId,
    searchCondition: state.workingType.ui.searchCondition,
    selectedRowIndex: state.base.listPane.ui.list.selectedRowIndex,
    value2msgkey: state.value2msgkey,
    sfObjFieldValues: state.sfObjFieldValues,
    limit: RECORD_LIMIT,
    limitPerPage: RECORD_LIMIT_PER_PAGE,
    currentPage: state.base.listPane.ui.paging.current,
    total: state.workingType.ui.list.total,
    sortCondition: state.workingType.ui.list.sortOrder,
    offsetCodes: state.workingType.ui.list.offsetCodes,
    isOverLimit: state.workingType.ui.list.hasMoreRecords,
  }));

  const [originalCondition, newCondition] = React.useMemo(
    () => [searchCondition.origin, searchCondition.new],
    [searchCondition]
  );

  const pageCondition = React.useMemo(
    () => ({
      currentPage,
      limitPerPage,
      limit,
      total,
      isOverLimit,
    }),
    [currentPage, isOverLimit, limit, limitPerPage, total]
  );

  const onClickCreateNewButton = React.useCallback(() => {
    Actions.setSelectedRowIndex(-1);
    Actions.startEditingNewRecord(companyId, sfObjFieldValues);
  }, [Actions, companyId, sfObjFieldValues]);

  const onChangeHistoryTargetDate = React.useCallback(
    (value: string) => {
      Actions.setSearchCondition('targetDate', value);
    },
    [Actions]
  );

  const onClickSearchButton = React.useCallback(() => {
    Actions.saveCondition(newCondition);
    Actions.search(
      { ...newCondition, companyId },
      sortCondition,
      limitPerPage,
      isOverLimit,
      false,
      false,
      true
    );
  }, [
    Actions,
    newCondition,
    companyId,
    sortCondition,
    limitPerPage,
    isOverLimit,
  ]);

  const onClickPagerLink = React.useCallback(
    (currentPage: number) => {
      const offsetCode = offsetCodes[currentPage - 1];
      Actions.turnPage(
        { ...originalCondition, companyId },
        sortCondition,
        limitPerPage,
        offsetCode,
        currentPage
      );
    },
    [
      offsetCodes,
      Actions,
      originalCondition,
      companyId,
      sortCondition,
      limitPerPage,
    ]
  );

  const onClickListHeaderCell = React.useCallback(
    (field: string) => {
      Actions.search(
        { ...originalCondition, companyId },
        {
          ...sortCondition,
          field,
        },
        limitPerPage,
        isOverLimit,
        true,
        false,
        true
      );
    },
    [
      Actions,
      originalCondition,
      companyId,
      sortCondition,
      limitPerPage,
      isOverLimit,
    ]
  );

  const onClickListRow = React.useCallback(
    (
      selectedRow: {
        [key: string]: any;
      },
      index: number
    ) => {
      Actions.setSelectedRowIndex(index);
      Actions.openDetailPanel(selectedRow);
    },
    [Actions]
  );

  const initRecord = React.useCallback(() => {
    Actions.init(
      { ...conditionInitState.origin, companyId },
      listInitState.sortOrder,
      limitPerPage
    );
  }, [Actions, companyId, limitPerPage]);

  React.useEffect(() => {
    initRecord();
    Actions.setSelectedRowIndex(-1);
    Actions.resetSelectedCode();
  }, [companyId]);

  return (
    <React.Fragment>
      <Component
        configList={configList}
        title={ownProps.title}
        useFunction={ownProps.useFunction}
        selectedCode={selectedCode}
        itemList={itemList}
        historyTargetDate={searchCondition.new.targetDate}
        value2msgkey={value2msgkey}
        onChangeHistoryTargetDate={onChangeHistoryTargetDate}
        onClickCreateNewButton={onClickCreateNewButton}
        onClickSearchButton={onClickSearchButton}
        onClickListRow={onClickListRow}
        selectedRowIndex={selectedRowIndex}
        searchCondition={newCondition}
        sortCondition={sortCondition}
        pageCondition={pageCondition}
        onChangeSearchValue={Actions.setSearchCondition}
        onClickPagerLink={onClickPagerLink}
        onClickListHeaderCell={onClickListHeaderCell}
      />
      <NotificationContainer />
    </React.Fragment>
  );
};

export default ListContainer;
