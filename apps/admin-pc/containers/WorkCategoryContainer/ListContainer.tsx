import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { WorkCategory } from '../../../domain/models/time-tracking/WorkCategory';

import * as workCategoryDetailActions from '../../action-dispatchers/work-category/Detail';
import * as workCategoryListActions from '../../action-dispatchers/work-category/List';

import { State } from '../../reducers';

import Component from '../../presentational-components/WorkCategory/List';

const RECORD_LIMIT = 10000;
const RECORD_LIMIT_PER_PAGE = 100;
const INITIAL_PAGE_NUMBER = 1;

const mapStateToProps = (state: State) => {
  return {
    records: state.workCategory.entities.list,
    totalNum: state.workCategory.entities.totalCount,
    searchCondition: state.workCategory.ui.searchCondition,
    sortCondition: state.base.listPane.ui.sortCondition,
    currentPage: state.base.listPane.ui.paging.current,
    limit: RECORD_LIMIT,
    limitPerPage: RECORD_LIMIT_PER_PAGE,
    isOverLimit: state.base.listPane.ui.paging.isOverLimit,
    selectedRowIndex: state.base.listPane.ui.list.selectedRowIndex,
  };
};

const ListContainer = (ownProps: { title: string }) => {
  const pagingCondition = useSelector(
    (state: State) => state.base.listPane.ui.paging
  );
  const companyId = useSelector(
    (state: State) => state.base.menuPane.ui.targetCompanyId
  );
  const ids = useSelector((state: State) => state.workCategory.entities.ids);
  const searchQuery = useSelector(
    (state: State) => state.workCategory.ui.searchQuery
  );
  const sfObjFieldValues = useSelector(
    (state: State) => state.sfObjFieldValues
  );
  const editRecord = useSelector((state: State) => state.editRecord);
  const props = useSelector(mapStateToProps);
  const dispatch = useDispatch();
  const WorkCategoryListActions = useMemo(
    () => bindActionCreators(workCategoryListActions, dispatch),
    [dispatch]
  );
  const WorkCategoryDetailActions = useMemo(
    () => bindActionCreators(workCategoryDetailActions, dispatch),
    [dispatch]
  );

  useEffect(() => {
    WorkCategoryListActions.initialize(companyId, {
      current: 1,
      limitPerPage: RECORD_LIMIT_PER_PAGE,
      limit: RECORD_LIMIT,
    });
  }, [companyId]);

  useEffect(() => {
    const { selectedRowIndex, records } = props;
    if (selectedRowIndex === -1) {
      return;
    }
    if (!editRecord) {
      WorkCategoryListActions.setSelectedRowIndex(-1);
    } else if (!records[selectedRowIndex]) {
      WorkCategoryListActions.setSelectedRowIndex(-1);
    } else if (editRecord.id !== records[selectedRowIndex].id) {
      WorkCategoryListActions.setSelectedRowIndex(
        records.findIndex((record) => record.id === editRecord.id)
      );
    }
  }, [props.records]);

  return (
    <Component
      {...ownProps}
      {...props}
      onClickCreateNewButton={() => {
        WorkCategoryListActions.setSelectedRowIndex(-1);
        WorkCategoryDetailActions.startEditingNewRecord(sfObjFieldValues);
      }}
      onChangeSearchValue={(key: string, value: string) => {
        WorkCategoryListActions.changeSearchField(key, value);
      }}
      onSubmitSearchValue={() => {
        WorkCategoryListActions.search(
          companyId,
          props.searchCondition,
          props.sortCondition,
          { ...pagingCondition, current: INITIAL_PAGE_NUMBER }
        );
      }}
      onClickListRow={(record: WorkCategory, index: number) => {
        WorkCategoryListActions.setSelectedRowIndex(index);
        WorkCategoryDetailActions.showDetail(companyId, record);
      }}
      onClickRefreshButton={() => {
        WorkCategoryListActions.refreshSearchResult(
          searchQuery,
          pagingCondition
        );
      }}
      onClickListHeaderCell={(field: string) => {
        WorkCategoryListActions.sort(searchQuery, field, {
          ...pagingCondition,
          current: 1,
        });
      }}
      onClickPagerLink={(page: number) => {
        WorkCategoryListActions.fetchRecordsByPage(ids, {
          ...pagingCondition,
          current: page,
        });
      }}
    />
  );
};

export default ListContainer;
