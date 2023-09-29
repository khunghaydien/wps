import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import _ from 'lodash';

import * as timeSetting from '../actions/timeSetting';

import TimeSetting from '../presentational-components/TimeSetting';

const mapStateToProps = (state) => {
  return {
    getTimeSettingSetting: state.getTimeSettingSetting,
    searchTimeSetting: state.searchTimeSetting,
  };
};

const mapDispatchToProps = (dispatch) => {
  const alias = {
    search: timeSetting.searchTimeSetting,
    create: timeSetting.createTimeSetting,
    update: timeSetting.updateTimeSetting,
    delete: timeSetting.deleteTimeSetting,
    createHistory: timeSetting.createHistoryTimeSetting,
    searchHistory: timeSetting.searchHistoryTimeSetting,
    updateHistory: timeSetting.updateHistoryTimeSetting,
    deleteHistory: timeSetting.deleteHistoryTimeSetting,
  };

  const actions = bindActionCreators(
    _.pickBy(Object.assign({}, alias, timeSetting), _.isFunction),
    dispatch
  );
  return { actions };
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeSetting);
