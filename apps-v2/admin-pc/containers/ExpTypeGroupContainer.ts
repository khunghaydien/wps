import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import _ from 'lodash';

import * as expTypeGroup from '../actions/expTypeGroup';

import ExpTypeGroup from '../presentational-components/ExpTypeGroup';

const mapStateToProps = (state) => {
  return {
    searchExpTypeGroup: state.searchExpTypeGroup,
    searchParentExpTypeGroup: state.searchParentExpTypeGroup,
  };
};

const mapDispatchToProps = (dispatch) => {
  const alias = {
    create: expTypeGroup.createExpTypeGroup,
    update: expTypeGroup.updateExpTypeGroup,
    delete: expTypeGroup.deleteExpTypeGroup,
    search: expTypeGroup.searchExpTypeGroup,
  };

  const actions = bindActionCreators(
    _.pickBy(Object.assign({}, alias, expTypeGroup), _.isFunction),
    dispatch
  );
  return { actions };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExpTypeGroup);
