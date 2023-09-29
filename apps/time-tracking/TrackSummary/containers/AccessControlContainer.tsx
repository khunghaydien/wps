import * as React from 'react';
import { useSelector } from 'react-redux';

import AccessControl from '../../../commons/components/AccessControl';

import {
  Permission,
  TotalTestConditions,
} from '../../../domain/models/access-control/Permission';

import { State } from '../modules';

type OwnProps = {
  children: React.ReactNode;
} & Omit<TotalTestConditions, 'userPermission' | 'isByDelegate'>;

const AccessControlContainer: React.FC<OwnProps> = (ownProps: OwnProps) => {
  const userPermission = useSelector<State, Permission>(
    // @ts-ignore
    (state) => state.common.accessControl.permission
  );
  const isDelegated = useSelector<State, boolean>(
    (state) => state.entities.user.isDelegated
  );
  return (
    <AccessControl
      {...ownProps}
      userPermission={userPermission}
      isByDelegate={isDelegated}
    />
  );
};

export default AccessControlContainer;
