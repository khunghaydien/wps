import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import isFunction from 'lodash/isFunction';
import pickBy from 'lodash/pickBy';

import * as objectivelyEventLogSetting from '../actions/objectivelyEventLogSetting';

import ObjectivelyEventLogSetting from '../presentational-components/ObjectivelyEventLogSetting';

const mapStateToProps = (state) => {
  return {
    editRecord: state.editRecord,
    searchObjectivelyEventLogSetting: state.searchObjectivelyEventLogSetting,
    value2msgkey: state.value2msgkey,
  };
};

const mapDispatchToProps = (dispatch) => {
  const alias = {
    create: objectivelyEventLogSetting.createObjectivelyEventLogSetting,
    update: objectivelyEventLogSetting.updateObjectivelyEventLogSetting,
    delete: objectivelyEventLogSetting.deleteObjectivelyEventLogSetting,
    search: objectivelyEventLogSetting.searchObjectivelyEventLogSetting,
  };

  const actions = bindActionCreators(
    pickBy(Object.assign({}, alias, objectivelyEventLogSetting), isFunction),
    dispatch
  );
  return { actions };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ObjectivelyEventLogSetting);
