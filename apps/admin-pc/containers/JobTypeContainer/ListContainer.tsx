import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { JobType } from '../../models/job-type/JobType';

import * as jobTypeDetailActions from '../../action-dispatchers/job-type/Detail';
import * as jobTypeListActions from '../../action-dispatchers/job-type/List';

import { State } from '../../reducers';

import Component from '../../presentational-components/JobType/List';

const RECORD_LIMIT = 10000;
const RECORD_LIMIT_PER_PAGE = 100;
const INITIAL_PAGE_NUMBER = 1;

const mapStateToProps = (state: State) => ({
  records: state.jobType.entities.list,
  totalNum: state.jobType.entities.totalCount,
  searchCondition: state.jobType.ui.searchCondition,
  sortCondition: state.base.listPane.ui.sortCondition,
  currentPage: state.base.listPane.ui.paging.current,
  limit: RECORD_LIMIT,
  limitPerPage: RECORD_LIMIT_PER_PAGE,
  isOverLimit: state.base.listPane.ui.paging.isOverLimit,
  selectedRowIndex: state.base.listPane.ui.list.selectedRowIndex,
});

const ListContainer = (ownProps: { title: string }) => {
  const pagingCondition = useSelector(
    (state: State) => state.base.listPane.ui.paging
  );
  const ids = useSelector((state: State) => state.jobType.entities.ids);
  const companyId = useSelector(
    (state: State) => state.base.menuPane.ui.targetCompanyId
  );
  const searchQuery = useSelector(
    (state: State) => state.jobType.ui.searchQuery
  );
  const sfObjFieldValues = useSelector(
    (state: State) => state.sfObjFieldValues
  );
  const editRecord = useSelector((state: State) => state.editRecord);
  const props = useSelector(mapStateToProps);
  const dispatch = useDispatch();
  const JobTypeListActions = useMemo(
    () => bindActionCreators(jobTypeListActions, dispatch),
    [dispatch]
  );
  const JobTypeDetailActions = useMemo(
    () => bindActionCreators(jobTypeDetailActions, dispatch),
    [dispatch]
  );

  useEffect(() => {
    JobTypeListActions.initialize(companyId, {
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
    if (!editRecord || !records[selectedRowIndex]) {
      JobTypeListActions.setSelectedRowIndex(-1);
    } else if (editRecord.id !== records[selectedRowIndex].id) {
      JobTypeListActions.setSelectedRowIndex(
        records.findIndex((record) => record.id === editRecord.id)
      );
    }
  }, [props.records]);

  return (
    <Component
      {...ownProps}
      {...props}
      onClickCreateNewButton={() => {
        JobTypeListActions.setSelectedRowIndex(-1);
        JobTypeDetailActions.startEditingNewRecord(sfObjFieldValues);
      }}
      onChangeSearchValue={(key: string, value: string) => {
        JobTypeListActions.changeSearchField(key, value);
      }}
      onSubmitSearchValue={() => {
        JobTypeListActions.search(
          companyId,
          props.searchCondition,
          props.sortCondition,
          { ...pagingCondition, current: INITIAL_PAGE_NUMBER }
        );
      }}
      onClickListRow={(record: JobType, index: number) => {
        JobTypeListActions.setSelectedRowIndex(index);
        JobTypeDetailActions.showDetail(companyId, record);
      }}
      onClickRefreshButton={() => {
        JobTypeListActions.refreshSearchResult(searchQuery, pagingCondition);
      }}
      onClickListHeaderCell={(field: string) => {
        JobTypeListActions.sort(searchQuery, field, {
          ...pagingCondition,
          current: 1,
        });
      }}
      onClickPagerLink={(page: number) => {
        JobTypeListActions.fetchRecordsByPage(ids, {
          ...pagingCondition,
          current: page,
        });
      }}
    />
  );
};

export default ListContainer;
