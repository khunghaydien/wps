import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { AppDispatch } from '../action-dispatchers/AppThunk';
import * as psaWorkScheme from '../actions/psaWorkScheme';

import PsaWorkScheme from '../presentational-components/PsaWorkScheme';

const mapStateToProps = (state) => ({
  itemList: state.searchPsaWorkScheme,
  searchCompanySetting: state.searchCompany,
  editRecord: state.editRecord,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  actions: bindActionCreators(
    {
      search: psaWorkScheme.searchPsaWorkScheme,
      create: psaWorkScheme.createPsaWorkScheme,
      update: psaWorkScheme.updatePsaWorkScheme,
      delete: psaWorkScheme.deletePsaWorkScheme,
    },
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PsaWorkScheme) as React.ComponentType<Record<string, any>>;
