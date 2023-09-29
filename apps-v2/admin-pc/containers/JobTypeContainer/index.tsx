import * as React from 'react';
import { useSelector } from 'react-redux';

import { FunctionTypeList } from '../../constants/functionType';

import { State } from '../../reducers';

import Component from '../../presentational-components/JobType';

const mapStateToProps = (state: State) => ({
  isShowDetail: state.base.detailPane.ui.isShowDetail,
});

const JobTypeContainer = (ownProps: {
  title: string;
  useFunction: FunctionTypeList;
}) => {
  const props = useSelector(mapStateToProps);

  return <Component {...ownProps} {...props} />;
};

export default JobTypeContainer;
