import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import _ from 'lodash';

import * as group from '../actions/employeeGroup';
import { searchReportType } from '../actions/reportType';

import Group from '../presentational-components/EmployeeGroup';

const mapStateToProps = (state) => ({
  searchGroup: state.searchEmployeeGroup,
});

const mapDispatchToProps = (dispatch) => {
  const alias = {
    search: group.searchEmployeeGroup,
    create: group.createEmployeeGroup,
    update: group.updateEmployeeGroup,
    delete: group.deleteEmployeeGroup,
  };
  const actions = bindActionCreators(
    _.pickBy(
      Object.assign({}, alias, group, { searchReportType }),
      _.isFunction
    ),
    dispatch
  );
  return { actions };
};

export default connect(mapStateToProps, mapDispatchToProps)(Group);
