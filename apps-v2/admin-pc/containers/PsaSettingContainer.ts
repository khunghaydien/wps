import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as psaSettingActions from '../actions/psaSetting';
import { searchPsaWorkScheme } from '@admin-pc/actions/psaWorkScheme';
import { searchCalendar } from '@apps/admin-pc/actions/calendar';

import PsaSetting from '../presentational-components/PsaSetting';

const mapStateToProps = (state) => ({
  settings: state.searchPsaSetting,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      search: psaSettingActions.getPsaSetting,
      update: psaSettingActions.savePsaSetting,
      searchCalendar,
      searchPsaWorkScheme,
    },
    dispatch
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(PsaSetting);
