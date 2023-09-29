import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import _ from 'lodash';

import { FunctionTypeList } from '../../constants/functionType';

import { ExpenseType } from '../../../domain/models/exp/ExpenseType';

import { setSelectedExp } from '../../modules/expTypeLinkConfig/ui';
import { actions as amountListActions } from '../../modules/fixedAllowanceList';

import * as expenseTypeDetailActions from '../../action-dispatchers/expense-type/Detail';
import * as expenseTypeListActions from '../../action-dispatchers/expense-type/List';
import * as expenseTypeBaseActions from '../../actions/expenseType';

import { State } from '../../reducers';

import { getter as RecordGetter } from '../../utils/RecordUtil';

import Component from '../../presentational-components/ExpenseType/Detail';

const mapStateToProps = (state: State) => {
  return {
    editRecord: state.expenseType.entities.baseRecord,
    tmpEditRecord: state.expenseType.ui.detail.baseRecord,
    getOrganizationSetting: state.getOrganizationSetting,
    modeBase: state.base.detailPane.ui.modeBase,
    sfObjFieldValues: state.sfObjFieldValues,
    companyList: state.searchCompany,
  };
};

const DetailContainer = ({
  useFunction,
}: {
  useFunction: FunctionTypeList;
}) => {
  const props = useSelector(mapStateToProps);
  const dispatch = useDispatch();

  const pagingCondition = useSelector(
    (state: State) => state.base.listPane.ui.paging
  );
  const baseRecord = useSelector(
    (state: State) => state.expenseType.ui.detail.baseRecord
  );
  const { expTypeChildIds, id: selectedId } = baseRecord;

  const companyId = useSelector(
    (state: State) => state.base.menuPane.ui.targetCompanyId
  );
  const searchQuery = useSelector(
    (state: State) => state.expenseType.ui.searchQuery
  );

  const sfObjFieldValues = useSelector(
    (state: State) => state.sfObjFieldValues
  );

  const ExpenseTypeListActions = useMemo(
    () => bindActionCreators(expenseTypeListActions, dispatch),
    [dispatch]
  );
  const ExpenseTypeDetailActions = useMemo(
    () => bindActionCreators(expenseTypeDetailActions, dispatch),
    [dispatch]
  );

  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          search: expenseTypeBaseActions.searchMinimalExpenseTypes,
          setSelectedExp,
          resetAmountList: amountListActions.reset,
        },
        dispatch
      ),
    [dispatch]
  );

  useEffect(() => {
    for (let i = 1; i <= 3; i++) {
      const taxTypeId = baseRecord[`taxType${i}Id`];

      if (
        taxTypeId &&
        !sfObjFieldValues.taxTypeId.map((e) => e.id).includes(taxTypeId)
      ) {
        // If the tax type list retrieved doesn't have the selected tax type,
        // set first one as well as the screen dose.
        if (sfObjFieldValues.taxTypeId.length > 0) {
          ExpenseTypeDetailActions.changeBaseRecordValue(
            // @ts-ignore
            `taxType${i}Id`,
            sfObjFieldValues.taxTypeId[0].id
          );
        }
      }
    }
    if (!_.isEmpty(expTypeChildIds)) {
      // @ts-ignore
      Actions.search({ ids: expTypeChildIds }).then((res) => {
        const expenseType = _.get(res, 'records', []);
        Actions.setSelectedExp(expTypeChildIds, expenseType);
      });
    }
  }, [selectedId]);

  const isBaseCurrencySet = () => {
    const company = _.find(props.companyList, { id: companyId }) || {};
    return company.currencyField && company.currencyField.code;
  };

  return (
    <Component
      {...props}
      useFunction={useFunction}
      onClickCreateButton={() => {
        (async () => {
          const baseValueGetter = RecordGetter(baseRecord);
          const result = await ExpenseTypeDetailActions.createRecord(
            companyId,
            {
              ...props.editRecord,
            },
            {
              ...baseRecord,
            },
            baseValueGetter,
            useFunction
          );
          if (!result) {
            return;
          }
          ExpenseTypeListActions.setSelectedRowIndex(-1);
          await ExpenseTypeListActions.refreshSearchResult(
            searchQuery,
            pagingCondition
          );
        })();
      }}
      onClickUpdateBaseButton={() => {
        (async () => {
          const baseValueGetter = RecordGetter(baseRecord);
          const result = await ExpenseTypeDetailActions.updateBase(
            companyId,
            props.editRecord,
            baseRecord,
            baseValueGetter,
            useFunction
          );
          if (!result) {
            return;
          }
          await ExpenseTypeListActions.refreshSearchResult(
            searchQuery,
            pagingCondition
          );
          ExpenseTypeListActions.setSelectedRowIndex(-1);
        })();
      }}
      onClickDeleteButton={() => {
        (async () => {
          const result = await ExpenseTypeDetailActions.removeBase(
            props.editRecord.id
          );
          if (!result) {
            return;
          }
          ExpenseTypeListActions.setSelectedRowIndex(-1);
          await ExpenseTypeListActions.refreshSearchResult(
            searchQuery,
            pagingCondition
          );
        })();
      }}
      onChangeDetailItem={(
        key: keyof ExpenseType,
        value: ExpenseType[keyof ExpenseType]
      ) => {
        ExpenseTypeDetailActions.changeBaseRecordValue(key, value);
      }}
      onClickCloseButton={() => {
        ExpenseTypeListActions.setSelectedRowIndex(-1);
        ExpenseTypeDetailActions.hideDetail();
      }}
      onClickCancelEditButton={() => {
        ExpenseTypeDetailActions.cancelEditing(props.editRecord);
      }}
      onClickStartEditingBaseButton={() => {
        if (!isBaseCurrencySet()) {
          ExpenseTypeListActions.showBaseCurrencyValidationErr();
          return;
        }
        ExpenseTypeDetailActions.startEditingBase();
      }}
      onClickCloneButton={() => {
        if (!isBaseCurrencySet()) {
          ExpenseTypeListActions.showBaseCurrencyValidationErr();
          return;
        }
        const cloneRecord = _.cloneDeep(baseRecord);
        cloneRecord.id = null;
        cloneRecord.code = '';
        if (!_.isEmpty(cloneRecord.fixedAllowanceOptionList)) {
          cloneRecord.fixedAllowanceOptionList.forEach((option) => {
            option.id = null;
          });
          Actions.resetAmountList(cloneRecord.fixedAllowanceOptionList);
        }
        ExpenseTypeDetailActions.startEditingClonedRecord(cloneRecord);
      }}
    />
  );
};

export default DetailContainer;
