import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import _ from 'lodash';

import * as position from '@admin-pc-v2/actions/position';

import Position from '@admin-pc-v2/presentational-components/Position';

const mapStateToProps = (state) => {
  return {
    searchPosition: state.searchPosition,
  };
};

const mapDispatchToProps = (dispatch) => {
  const alias = {
    create: position.createPosition,
    update: position.updatePosition,
    delete: position.deletePosition,
    search: position.searchPosition,
  };
  const actions = bindActionCreators(alias, dispatch);
  return { actions };
};

export default connect(mapStateToProps, mapDispatchToProps)(Position);
