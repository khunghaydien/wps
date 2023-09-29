import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { FunctionTypeList } from '../../constants/functionType';

import { searchCurrency } from '../../actions/currency';
import { getConstantsExpenseType } from '../../actions/expenseType';
import { searchExpTypeGroup } from '../../actions/expTypeGroup';
import { searchExtendedItem } from '../../actions/extendedItem';
import { searchTaxType } from '../../actions/taxType';
import { searchMileageRate } from '@apps/admin-pc-v2/actions/mileageRate';

import { State } from '../../reducers';

import Component from '../../presentational-components/ExpenseType';

const mapStateToProps = (state: State) => ({
  isShowDetail: state.base.detailPane.ui.isShowDetail,
});

const ExpenseTypeContainer = (ownProps: {
  title: string;
  useFunction: FunctionTypeList;
}) => {
  const props = useSelector(mapStateToProps);
  const dispatch = useDispatch();
  const companyId = useSelector(
    (state: State) => state.base.menuPane.ui.targetCompanyId
  );

  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          searchCurrency,
          searchExtendedItem,
          searchTaxType,
          searchExpTypeGroup,
          searchMileageRate,
          getConstantsExpenseType,
        },
        dispatch
      ),
    [dispatch]
  );

  useEffect(() => {
    const param = { companyId };
    Actions.searchCurrency(param);
    Actions.searchExtendedItem(param);
    Actions.searchTaxType(param);
    Actions.searchExpTypeGroup(param);
    Actions.getConstantsExpenseType();
    Actions.searchMileageRate({ ...param, targetDate: '' });
  }, [companyId]);

  return <Component {...ownProps} {...props} />;
};

export default ExpenseTypeContainer;
