import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Department } from '@apps/repositories/organization/department/DepartmentListRepository';

import * as departmentDetailActions from '@admin-pc-v2/action-dispatchers/department/Detail';
import * as departmentListActions from '@admin-pc-v2/action-dispatchers/department/List';

import { State } from '@admin-pc-v2/reducers';

import Component from '@admin-pc-v2/presentational-components/Department/List';

const RECORD_LIMIT = 100;
const RECORD_LIMIT_PER_PAGE = 20;

const mapStateToProps = (state: State) => {
  return {
    records: state.department.entities.list,
    ids: state.department.entities.ids,
    searchCondition: state.department.ui.searchCondition,
    sortCondition: state.base.listPane.ui.sortCondition,
    currentPage: state.base.listPane.ui.paging.current,
    limit: state.base.listPane.ui.paging.limit,
    limitPerPage: state.base.listPane.ui.paging.limitPerPage,
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
  const searchQuery = useSelector(
    (state: State) => state.department.ui.searchQuery
  );
  const targetDate = useSelector(
    (state: State) => state.department.ui.searchQuery.targetDate
  );
  const sfObjFieldValues = useSelector(
    (state: State) => state.sfObjFieldValues
  );
  const editRecord = useSelector(
    (state: State) => state.department.entities.baseRecord
  );
  const props = useSelector(mapStateToProps);
  const dispatch = useDispatch();
  const DepartmentListActions = useMemo(
    () => bindActionCreators(departmentListActions, dispatch),
    [dispatch]
  );
  const DepartmentDetailActions = useMemo(
    () => bindActionCreators(departmentDetailActions, dispatch),
    [dispatch]
  );

  useEffect(() => {
    DepartmentListActions.initialize(companyId, {
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
      DepartmentListActions.setSelectedRowIndex(-1);
    } else if (!records[selectedRowIndex]) {
      DepartmentListActions.setSelectedRowIndex(-1);
    } else if (editRecord.id !== records[selectedRowIndex].id) {
      DepartmentListActions.setSelectedRowIndex(
        records.findIndex((record) => record.id === editRecord.id)
      );
    }
  }, [props.records]);

  return (
    <Component
      {...ownProps}
      {...props}
      onChangeSearchValue={(key: string, value: string) => {
        DepartmentListActions.changeSearchField(key, value);
      }}
      onSubmitSearchValue={() => {
        DepartmentDetailActions.hideDetail();
        DepartmentListActions.search(
          companyId,
          props.searchCondition,
          props.sortCondition,
          { ...pagingCondition, current: 1 }
        );
      }}
      onClickListRow={(record: Department, index: number) => {
        DepartmentListActions.setSelectedRowIndex(index);
        DepartmentDetailActions.showDetail(companyId, record.id, targetDate);
      }}
      onClickRefreshButton={() => {
        DepartmentListActions.refreshSearchResult(searchQuery, pagingCondition);
      }}
      onClickListHeaderCell={(field: string) => {
        DepartmentListActions.sort(searchQuery, field, {
          ...pagingCondition,
          current: 1,
        });
      }}
      onClickPagerLink={(page: number) => {
        DepartmentListActions.fetchRecordsByPage(targetDate, props.ids, {
          ...pagingCondition,
          current: page,
        });
      }}
      onClickCreateNewButton={() => {
        DepartmentListActions.setSelectedRowIndex(-1);
        DepartmentDetailActions.startEditingNewRecord(
          sfObjFieldValues,
          targetDate
        );
      }}
    />
  );
};

export default ListContainer;
