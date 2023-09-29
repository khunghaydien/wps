import * as React from 'react';

import {
  DynamicTestConditions,
  isPermissionSatisfied,
  TotalTestConditions,
} from '../../domain/models/access-control/Permission';

export type Props = TotalTestConditions & {
  // FIXME: <AccessControl {...conditions}> で済ませたい／Flowの型エラーを解決できず別のpropにした
  conditions?: DynamicTestConditions;
  children: React.ReactNode;
};

const AccessControl: React.FC<Props> = (props: Props) => {
  const {
    children: _children,
    conditions: conditionsHash,
    ...totalConditions
  } = props;
  return (
    <React.Fragment>
      {isPermissionSatisfied({ ...totalConditions, ...(conditionsHash || {}) })
        ? props.children
        : null}
    </React.Fragment>
  );
};

export default AccessControl;
