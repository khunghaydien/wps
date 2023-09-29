import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Job } from '../../../domain/models/organization/Job';

import * as jobDetailActions from '../../action-dispatchers/job/Detail';
import * as jobListActions from '../../action-dispatchers/job/List';

import { State } from '../../reducers';

import Component from '../../presentational-components/Job/List';

const RECORD_LIMIT = 10000;
const RECORD_LIMIT_PER_PAGE = 100;
const INITIAL_PAGE_NUMBER = 1;

const mapStateToProps = (state: State) => {
  return {
    records: state.job.entities.list,
    totalNum: state.job.entities.totalCount,
    searchCondition: state.job.ui.searchCondition,
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
  const ids = useSelector((state: State) => state.job.entities.ids);
  const searchQuery = useSelector((state: State) => state.job.ui.searchQuery);
  const targetDate = useSelector(
    (state: State) => state.job.ui.searchQuery.targetDate
  );
  const sfObjFieldValues = useSelector(
    (state: State) => state.sfObjFieldValues
  );
  const editRecord = useSelector((state: State) => state.editRecord);
  const props = useSelector(mapStateToProps);
  const dispatch = useDispatch();
  const JobListActions = useMemo(
    () => bindActionCreators(jobListActions, dispatch),
    [dispatch]
  );
  const JobDetailActions = useMemo(
    () => bindActionCreators(jobDetailActions, dispatch),
    [dispatch]
  );

  useEffect(() => {
    JobListActions.initialize(companyId, {
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
      JobListActions.setSelectedRowIndex(-1);
    } else if (!records[selectedRowIndex]) {
      JobListActions.setSelectedRowIndex(-1);
    } else if (editRecord.id !== records[selectedRowIndex].id) {
      JobListActions.setSelectedRowIndex(
        records.findIndex((record) => record.id === editRecord.id)
      );
    }
  }, [props.records]);

  return (
    <Component
      {...ownProps}
      {...props}
      onClickCreateNewButton={() => {
        JobListActions.setSelectedRowIndex(-1);
        JobDetailActions.startEditingNewRecord(sfObjFieldValues, targetDate);
      }}
      onChangeSearchValue={(key: string, value: string) => {
        JobListActions.changeSearchField(key, value);
      }}
      onSubmitSearchValue={() => {
        JobListActions.search(
          companyId,
          props.searchCondition,
          props.sortCondition,
          { ...pagingCondition, current: INITIAL_PAGE_NUMBER }
        );
      }}
      onClickListRow={(record: Job, index: number) => {
        JobListActions.setSelectedRowIndex(index);
        JobDetailActions.showDetail(companyId, record, targetDate);
      }}
      onClickRefreshButton={() => {
        JobListActions.refreshSearchResult(searchQuery, pagingCondition);
      }}
      onClickListHeaderCell={(field: string) => {
        JobListActions.sort(searchQuery, field, {
          ...pagingCondition,
          current: 1,
        });
      }}
      onClickPagerLink={(page: number) => {
        JobListActions.fetchRecordsByPage(ids, {
          ...pagingCondition,
          current: page,
        });
      }}
    />
  );
};

export default ListContainer;
