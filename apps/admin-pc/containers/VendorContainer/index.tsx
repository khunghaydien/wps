import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { FunctionTypeList } from '../../constants/functionType';

import { searchIsoCurrencyCode } from '../../actions/currency';
import * as vendor from '../../actions/vendor';

import { State } from '../../reducers';

import Component from '../../presentational-components/Vendor';

const { useEffect, useMemo } = React;

const mapStateToProps = (state: State) => {
  return {
    isShowDetail: state.base.detailPane.ui.isShowDetail,
    searchCompany: state.searchCompany,
  };
};

const VendorContainer = (ownProps: {
  title: string;
  useFunction: FunctionTypeList;
}) => {
  const props = useSelector(mapStateToProps);
  const dispatch = useDispatch();
  const Actions = useMemo(
    () =>
      bindActionCreators(
        {
          getConstantsBankAccountType: vendor.getConstantsBankAccountType,
          searchIsoCurrencyCode,
        },
        dispatch
      ),
    [dispatch]
  );

  useEffect(() => {
    Actions.getConstantsBankAccountType();
    Actions.searchIsoCurrencyCode();
  }, []);

  return <Component {...ownProps} {...props} />;
};

export default VendorContainer;
