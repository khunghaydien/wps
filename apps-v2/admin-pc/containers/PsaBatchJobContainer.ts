import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getPsaBatchJob, runPsaBatchJob } from '../actions/psaBatchJob';

import PsaBatchJob from '../presentational-components/PsaBatchJob';

const mapStateToProps = (state) => ({
  itemList: state.getPsaBatchJob,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      getPsaBatchJob,
      runPsaBatchJob,
    },
    dispatch
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(PsaBatchJob);
