import * as React from 'react';
import { useSelector } from 'react-redux';

// import { bindActionCreators } from 'redux';
// import * as workCategory from '../../actions/workCategory';
import { FunctionTypeList } from '../../constants/functionType';

import { State } from '../../reducers';

import Component from '../../presentational-components/WorkCategory';

const mapStateToProps = (state: State) => {
  return {
    isShowDetail: state.base.detailPane.ui.isShowDetail,
  };
};

const WorkCategoryContainer = (ownProps: {
  title: string;
  useFunction: FunctionTypeList;
}) => {
  const props = useSelector(mapStateToProps);
  return <Component {...ownProps} {...props} />;
};

export default WorkCategoryContainer;
