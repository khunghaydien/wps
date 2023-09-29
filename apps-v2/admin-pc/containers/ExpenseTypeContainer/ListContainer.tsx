import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import _ from 'lodash';

import fieldValues from '../../constants/fieldValues/expenseType';

import msg from '../../../commons/languages';

import { ExpenseType } from '../../../domain/models/exp/ExpenseType';

import * as expenseTypeDetailActions from '../../action-dispatchers/expense-type/Detail';
import * as expenseTypeListActions from '../../action-dispatchers/expense-type/List';

import { State } from '../../reducers';

import Component from '../../presentational-components/ExpenseType/List';

const RECORD_LIMIT = 10000;
const RECORD_LIMIT_PER_PAGE = 100;
const INITIAL_PAGE_NUMBER = 1;

const mapStateToProps = (state: State) => {
  return {
    records: state.expenseType.entities.list,
    totalNum: state.expenseType.entities.totalCount,
    searchCondition: state.expenseType.ui.searchCondition,
    sortCondition: state.base.listPane.ui.sortCondition,
    currentPage: state.base.listPane.ui.paging.current,
    limit: RECORD_LIMIT,
    limitPerPage: RECORD_LIMIT_PER_PAGE,
    isOverLimit: state.base.listPane.ui.paging.isOverLimit,
    selectedRowIndex: state.base.listPane.ui.list.selectedRowIndex,
    companyList: state.searchCompany,
  };
};

const ListContainer = (ownProps: { title: string }) => {
  const props = useSelector(mapStateToProps);
  const dispatch = useDispatch();

  const pagingCondition = useSelector(
    (state: State) => state.base.listPane.ui.paging
  );
  const companyId = useSelector(
    (state: State) => state.base.menuPane.ui.targetCompanyId
  );
  const ids = useSelector((state: State) => state.expenseType.entities.ids);
  const searchQuery = useSelector(
    (state: State) => state.expenseType.ui.searchQuery
  );
  const sfObjFieldValues = useSelector(
    (state: State) => state.sfObjFieldValues
  );
  const editRecord = useSelector(
    (state: State) => state.expenseType.entities.baseRecord
  );
  const ExpenseTypeListActions = useMemo(
    () => bindActionCreators(expenseTypeListActions, dispatch),
    [dispatch]
  );
  const ExpenseTypeDetailActions = useMemo(
    () => bindActionCreators(expenseTypeDetailActions, dispatch),
    [dispatch]
  );

  useEffect(() => {
    ExpenseTypeListActions.initialize(companyId, {
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
      ExpenseTypeListActions.setSelectedRowIndex(-1);
    } else if (!records[selectedRowIndex]) {
      ExpenseTypeListActions.setSelectedRowIndex(-1);
    } else if (editRecord.id !== records[selectedRowIndex].id) {
      ExpenseTypeListActions.setSelectedRowIndex(
        records.findIndex((record) => record.id === editRecord.id)
      );
    }
  }, [props.records]);

  const setKeyword = (curValue, valueObj) => {
    if (!curValue) {
      return '';
    }
    const obj =
      valueObj.find(
        (x) =>
          msg()[x.label] &&
          msg()[x.label].toLowerCase().includes(curValue.toLowerCase())
      ) || {};
    return obj.value || curValue;
  };

  const formatFields = (searchCondition) => {
    const {
      recordType: rt,
      foreignCurrencyUsage: fcu,
      fileAttachment: fa,
    } = fieldValues;
    const { recordType, foreignCurrencyUsage, receiptSetting } =
      searchCondition;
    return {
      ...searchCondition,
      recordType: setKeyword(recordType, rt),
      foreignCurrencyUsage: setKeyword(foreignCurrencyUsage, fcu),
      receiptSetting: setKeyword(receiptSetting, fa),
    };
  };

  const isBaseCurrencySet = () => {
    const company = _.find(props.companyList, { id: companyId }) || {};
    return company.currencyField && company.currencyField.code;
  };

  return (
    <Component
      {...ownProps}
      {...props}
      onClickCreateNewButton={() => {
        if (!isBaseCurrencySet()) {
          ExpenseTypeListActions.showBaseCurrencyValidationErr();
          return;
        }
        ExpenseTypeListActions.setSelectedRowIndex(-1);
        ExpenseTypeDetailActions.startEditingNewRecord(sfObjFieldValues);
      }}
      onChangeSearchValue={(key: string, value: string) => {
        ExpenseTypeListActions.changeSearchField(key, value);
      }}
      onSubmitSearchValue={() => {
        const searchCondition = formatFields(props.searchCondition);
        ExpenseTypeListActions.search(
          companyId,
          searchCondition,
          props.sortCondition,
          { ...pagingCondition, current: INITIAL_PAGE_NUMBER }
        );
      }}
      onClickListRow={(record: ExpenseType, index: number) => {
        ExpenseTypeListActions.setSelectedRowIndex(index);
        ExpenseTypeDetailActions.showDetail(record.id);
      }}
      onClickRefreshButton={() => {
        ExpenseTypeListActions.refreshSearchResult(
          searchQuery,
          pagingCondition
        );
      }}
      onClickListHeaderCell={(field: string) => {
        ExpenseTypeListActions.sort(searchQuery, field, {
          ...pagingCondition,
          current: 1,
        });
      }}
      onClickPagerLink={(page: number) => {
        ExpenseTypeListActions.fetchRecordsByPage(ids, {
          ...pagingCondition,
          current: page,
        });
      }}
    />
  );
};

export default ListContainer;
