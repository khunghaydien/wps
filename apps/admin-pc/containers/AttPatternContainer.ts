import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import _ from 'lodash';

import { AppDispatch } from '../action-dispatchers/AppThunk';
import * as attPatternActions from '../actions/attPattern';

import AttPattern from '../presentational-components/AttPattern';

const mapStateToProps = (state) => ({
  searchAttPattern: state.searchAttPattern,
  value2msgkey: state.value2msgkey,
});

const mapDispatchToProps = (dispatch: AppDispatch) => {
  const actions = bindActionCreators(
    {
      search: attPatternActions.searchAttPattern,
      create: attPatternActions.createAttPattern,
      update: attPatternActions.updateAttPattern,
      delete: attPatternActions.deleteAttPattern,
      getConstantsAttPattern: attPatternActions.getConstantsAttPattern,
    },
    dispatch
  );
  return { actions };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AttPattern) as React.ComponentType<Record<string, any>>;
