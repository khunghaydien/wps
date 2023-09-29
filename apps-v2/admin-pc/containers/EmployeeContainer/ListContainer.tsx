import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Employee } from '../../../repositories/organization/employee/EmployeeListRepository';

import * as employeeDetailActions from '../../action-dispatchers/employee/Detail';
import * as employeeListActions from '../../action-dispatchers/employee/List';

import { State } from '../../reducers';

import Component from '../../presentational-components/Employee/List';

const { useEffect, useMemo } = React;

const RECORD_LIMIT = 100;
const RECORD_LIMIT_PER_PAGE = 20;

export const mapStateToProps = (state: State) => {
  return {
    records: state.employee.entities.list,
    ids: state.employee.entities.ids,
    searchCondition: state.employee.ui.searchCondition,
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
  const searchQuery = useSelector(
    (state: State) => state.employee.ui.searchQuery
  );
  const targetDate = useSelector(
    (state: State) => state.employee.ui.searchQuery.targetDate
  );
  const sfObjFieldValues = useSelector(
    (state: State) => state.sfObjFieldValues
  );
  const editRecord = useSelector(
    (state: State) => state.employee.entities.baseRecord
  );
  const props = useSelector(mapStateToProps);
  const dispatch = useDispatch();
  const EmployeeListActions = useMemo(
    () => bindActionCreators(employeeListActions, dispatch),
    [dispatch]
  );
  const EmployeeDetailActions = useMemo(
    () => bindActionCreators(employeeDetailActions, dispatch),
    [dispatch]
  );

  useEffect(() => {
    EmployeeListActions.initialize(companyId, {
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
      EmployeeListActions.setSelectedRowIndex(-1);
    } else if (!records[selectedRowIndex]) {
      EmployeeListActions.setSelectedRowIndex(-1);
    } else if (editRecord.id !== records[selectedRowIndex].id) {
      EmployeeListActions.setSelectedRowIndex(
        records.findIndex((record) => record.id === editRecord.id)
      );
    }
  }, [props.records]);

  return (
    <Component
      {...ownProps}
      {...props}
      onChangeSearchValue={(key: string, value: string) => {
        EmployeeListActions.changeSearchField(key, value);
      }}
      onSubmitSearchValue={() => {
        EmployeeDetailActions.hideDetail();
        EmployeeListActions.search(
          companyId,
          props.searchCondition,
          props.sortCondition,
          { ...pagingCondition, current: 1 }
        );
      }}
      onClickListRow={(record: Employee, index: number) => {
        EmployeeListActions.setSelectedRowIndex(index);
        EmployeeDetailActions.showDetail(companyId, record.id, targetDate);
      }}
      onClickRefreshButton={() => {
        EmployeeListActions.refreshSearchResult(searchQuery, pagingCondition);
      }}
      onClickListHeaderCell={(field: string) => {
        EmployeeListActions.sort(searchQuery, field, {
          ...pagingCondition,
          current: 1,
        });
      }}
      onClickPagerLink={(page: number) => {
        EmployeeListActions.fetchRecordsByPage(targetDate, props.ids, {
          ...pagingCondition,
          current: page,
        });
      }}
      onClickCreateNewButton={() => {
        EmployeeListActions.setSelectedRowIndex(-1);
        EmployeeDetailActions.startEditingNewRecord(
          sfObjFieldValues,
          targetDate
        );
      }}
    />
  );
};

export default ListContainer;
