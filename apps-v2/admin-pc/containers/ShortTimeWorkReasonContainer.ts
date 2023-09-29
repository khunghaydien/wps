import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { AppDispatch } from '../action-dispatchers/AppThunk';
import * as shortTimeWorkReason from '../actions/shortTimeWorkReason';

import ShortTimeWorkReason from '../presentational-components/ShortTimeWorkReason';

const mapStateToProps = (state) => ({
  searchShortTimeWorkReason: state.searchShortTimeWorkReason,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  actions: bindActionCreators(
    {
      search: shortTimeWorkReason.searchShortTimeWorkReason,
      create: shortTimeWorkReason.createShortTimeWorkReason,
      update: shortTimeWorkReason.updateShortTimeWorkReason,
      delete: shortTimeWorkReason.deleteShortTimeWorkReason,
    },
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShortTimeWorkReason) as React.ComponentType<Record<string, any>>;
