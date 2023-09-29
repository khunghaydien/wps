import { connect } from 'react-redux';

import {
  IAccessControlContainer,
  Props as OwnProps,
} from '@apps/commons/components/IAccessControlContainer';

import { State } from '../reducers';

import AccessControl, { Props } from '../components/AccessControl';

const mapStateToProps = (
  state: {
    common: State;
  },
  ownProps: OwnProps
): Props => ({
  ...ownProps,
  userPermission: state.common.accessControl.permission,
  isByDelegate:
    state.common.proxyEmployeeInfo &&
    state.common.proxyEmployeeInfo.isProxyMode,
});

export default connect(mapStateToProps)(
  AccessControl
) as IAccessControlContainer;
