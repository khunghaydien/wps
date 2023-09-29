import * as React from 'react';
import { useSelector } from 'react-redux';

import { FunctionTypeList } from '@admin-pc/constants/functionType';

import { State } from '@admin-pc-v2/reducers';

import Department from '@admin-pc-v2/presentational-components/Department';

const mapStateToProps = (state: State) => ({
  companyId: state.base.menuPane.ui.targetCompanyId,
  isShowDetail: state.base.detailPane.ui.isShowDetail,
});

const DepartmentContainer = (ownProps: {
  title: string;
  useFunction: FunctionTypeList;
}) => {
  const props = useSelector(mapStateToProps);
  return <Department {...ownProps} {...props} />;
};

export default DepartmentContainer;
