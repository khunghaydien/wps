import * as React from 'react';
import { connect } from 'react-redux';

import {
  DynamicTestConditions,
  Permission,
  TotalTestConditions,
} from '../../domain/models/access-control/Permission';

import { State } from '../reducers';

import AccessControl, { Props } from '../components/AccessControl';

type Rest<A, B extends Partial<A>> = {
  [K in Exclude<keyof A, keyof B>]?: A[K];
};

type OwnProps = Rest<
  TotalTestConditions,
  { userPermission: Permission; isByDelegate: boolean }
> & {
  conditions?: DynamicTestConditions;
  children: React.ReactNode;
};

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

export default connect(mapStateToProps)(AccessControl);
