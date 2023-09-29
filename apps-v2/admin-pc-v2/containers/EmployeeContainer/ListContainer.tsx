import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import tabType from '@apps/commons/constants/tabType';

import { EmployeeV2 as Employee } from '@apps/repositories/organization/employee/EmployeeListRepository';

import * as employeeDetailActions from '@admin-pc-v2/action-dispatchers/employee/Detail';
import * as employeeListActions from '@admin-pc-v2/action-dispatchers/employee/List';

import { State } from '@admin-pc-v2/reducers';

import { mapStateToProps as mapStateToPropsV1 } from '@admin-pc/containers/EmployeeContainer/ListContainer';

import Component from '@admin-pc-v2/presentational-components/Employee/List';

const { useEffect, useMemo } = React;

const RECORD_LIMIT = 100;
const RECORD_LIMIT_PER_PAGE = 20;

const mapStateToProps = (state: State) => {
  // @ts-ignore State not match in v1 and v2
  const stateToPropsV1 = mapStateToPropsV1(state);
  const isOverallSetting =
    state.common.selectedTab === tabType.ADMIN_ORGANIZATION_REQUEST;
  return { ...stateToPropsV1, isOverallSetting };
};

const ListContainer = (ownProps: { title: string }) => {
  const props = useSelector(mapStateToProps);
  const pagingCondition = useSelector(
    (state: State) => state.base.listPane.ui.paging
  );
  const menuCompanyId = useSelector(
    (state: State) => state.base.menuPane.ui.targetCompanyId
  );
  const companyId = props.isOverallSetting ? null : menuCompanyId;
  const searchQuery = useSelector(
    (state: State) => state.employee.ui.searchQuery
  );
  const targetDate = useSelector(
    (state: State) => state.employee.ui.searchQuery.searchCondition.targetDate
  );
  const sfObjFieldValues = useSelector(
    (state: State) => state.sfObjFieldValues
  );
  const editRecord = useSelector(
    (state: State) => state.employee.entities.baseRecord
  );

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
    // @ts-ignore remove when detail panel is done
    <Component
      {...ownProps}
      {...props}
      onChangeSearchValue={(key: string, value: string) => {
        EmployeeListActions.changeSearchField(key, value);
      }}
      onSubmitSearchValue={() => {
        EmployeeDetailActions.hideDetail();
        // @ts-ignore props.searchCondition not match V1 and V2
        EmployeeListActions.search(props.searchCondition, props.sortCondition, {
          ...pagingCondition,
          current: 1,
        });
      }}
      onClickListRow={(record: Employee, index: number) => {
        EmployeeListActions.setSelectedRowIndex(index);
        EmployeeDetailActions.showDetail(record.id, targetDate);
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
          targetDate,
          companyId
        );
      }}
    />
  );
};

export default ListContainer;
