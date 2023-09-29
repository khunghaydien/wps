import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import _ from 'lodash';

import * as department from '../actions/department';
import { searchEmployee } from '../actions/employee';

import Department from '../presentational-components/Department';

const mapStateToProps = (state) => {
  return {
    searchDepartment: state.searchDepartment,
  };
};

const mapDispatchToProps = (dispatch) => {
  const alias = {
    search: department.searchDepartment,
    create: department.createDepartment,
    update: department.updateDepartment,
    delete: department.deleteDepartment,
    createHistory: department.createHistoryDepartment,
    searchHistory: department.searchHistoryDepartment,
    updateHistory: department.updateHistoryDepartment,
    deleteHistory: department.deleteHistoryDepartment,
  };

  const actions = bindActionCreators(
    _.pickBy(
      Object.assign({}, alias, department, { searchEmployee }),
      _.isFunction
    ),
    dispatch
  );
  return { actions };
};

export default connect(mapStateToProps, mapDispatchToProps)(Department);
