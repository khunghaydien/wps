import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Vendor } from '../../../domain/models/exp/Vendor';

import * as vendorDetailActions from '../../action-dispatchers/vendor/Detail';
import * as vendorListActions from '../../action-dispatchers/vendor/List';

import { State } from '../../reducers';

import Component from '../../presentational-components/Vendor/List';

const RECORD_LIMIT = 10000;
const RECORD_LIMIT_PER_PAGE = 100;
const INITIAL_PAGE_NUMBER = 1;

const mapStateToProps = (state: State) => {
  return {
    records: state.vendor.entities.list,
    totalNum: state.vendor.entities.totalCount,
    searchCondition: state.vendor.ui.searchCondition,
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
  const ids = useSelector((state: State) => state.vendor.entities.ids);
  const searchQuery = useSelector(
    (state: State) => state.vendor.ui.searchQuery
  );
  const sfObjFieldValues = useSelector(
    (state: State) => state.sfObjFieldValues
  );
  const editRecord = useSelector((state: State) => state.editRecord);
  const props = useSelector(mapStateToProps);
  const dispatch = useDispatch();
  const VendorListActions = useMemo(
    () => bindActionCreators(vendorListActions, dispatch),
    [dispatch]
  );
  const VendorDetailActions = useMemo(
    () => bindActionCreators(vendorDetailActions, dispatch),
    [dispatch]
  );

  useEffect(() => {
    VendorListActions.initialize(companyId, {
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
      VendorListActions.setSelectedRowIndex(-1);
    } else if (!records[selectedRowIndex]) {
      VendorListActions.setSelectedRowIndex(-1);
    } else if (editRecord.id !== records[selectedRowIndex].id) {
      VendorListActions.setSelectedRowIndex(
        records.findIndex((record) => record.id === editRecord.id)
      );
    }
  }, [props.records]);

  return (
    <Component
      {...ownProps}
      {...props}
      onClickCreateNewButton={() => {
        VendorListActions.setSelectedRowIndex(-1);
        VendorDetailActions.startEditingNewRecord(sfObjFieldValues);
      }}
      onChangeSearchValue={(key: string, value: string) => {
        VendorListActions.changeSearchField(key, value);
      }}
      onSubmitSearchValue={() => {
        VendorListActions.search(
          companyId,
          props.searchCondition,
          props.sortCondition,
          { ...pagingCondition, current: INITIAL_PAGE_NUMBER }
        );
      }}
      onClickListRow={(record: Vendor, index: number) => {
        VendorListActions.setSelectedRowIndex(index);
        VendorDetailActions.showDetail(companyId, record.id);
      }}
      onClickRefreshButton={() => {
        VendorListActions.refreshSearchResult(searchQuery, pagingCondition);
      }}
      onClickListHeaderCell={(field: string) => {
        VendorListActions.sort(searchQuery, field, {
          ...pagingCondition,
          current: 1,
        });
      }}
      onClickPagerLink={(page: number) => {
        VendorListActions.fetchRecordsByPage(ids, {
          ...pagingCondition,
          current: page,
        });
      }}
    />
  );
};

export default ListContainer;
