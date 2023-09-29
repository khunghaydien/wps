import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import isFunction from 'lodash/isFunction';
import pickBy from 'lodash/pickBy';

import { init } from '../../action-dispatchers/feature-setting';
import * as attendanceFeatureSetting from '../../actions/attendanceFeatureSetting';
import { searchFeatureSettingOpsRecord } from '../../actions/attFeatureSettingOpsRecord';

import { Props as OwnProps } from '../../components/Admin/ContentsSelector';
import AttendanceFeatureSetting, {
  Props,
} from '../../presentational-components/AttendanceFeatureSetting';

const mapStateToProps = (_state) => ({});

const mapDispatchToProps = (dispatch) => {
  const actions = bindActionCreators(
    pickBy(
      Object.assign({}, attendanceFeatureSetting, {
        init,
        searchFeatureSettingOpsRecord,
      }),
      isFunction
    ),
    dispatch
  );
  return { actions };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AttendanceFeatureSetting) as React.ComponentType<
  Props & OwnProps
> as React.ComponentType<OwnProps>;
