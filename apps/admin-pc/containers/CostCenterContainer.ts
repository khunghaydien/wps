import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import _ from 'lodash';

import { actions as ccSelectActions } from '../../commons/modules/costCenterDialog/ui/list';

import * as costCenter from '../actions/costCenter';

import CostCenter from '../presentational-components/CostCenter';

const mapStateToProps = (state) => {
  return {
    searchCostCenter: state.searchCostCenter,
  };
};

const mapDispatchToProps = (dispatch) => {
  const alias = {
    search: costCenter.searchCostCenter,
    create: costCenter.createCostCenter,
    update: costCenter.updateCostCenter,
    delete: costCenter.deleteCostCenter,
    createHistory: costCenter.createHistoryCostCenter,
    searchHistory: costCenter.searchHistoryCostCenter,
    updateHistory: costCenter.updateHistoryCostCenter,
    deleteHistory: costCenter.deleteHistoryCostCenter,
    resetCostCenterSelect: ccSelectActions.clear,
  };

  const actions = bindActionCreators(
    _.pickBy(Object.assign({}, alias, costCenter), _.isFunction),
    dispatch
  );
  return { actions };
};

export default connect(mapStateToProps, mapDispatchToProps)(CostCenter);
