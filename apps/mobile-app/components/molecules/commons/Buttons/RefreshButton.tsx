import * as React from 'react';

import classNames from 'classnames';

import displayName from '../../../../../commons/concerns/displayName';

import IconButton from '../../../atoms/IconButton';

import colors from '../../../../styles/variables/_colors.scss';

const ROOT = 'mobile-app-components-molecules-commons-buttons-refresh-button';

type Props = Readonly<{
  className?: string;
  testId?: string;
  type?: 'submit';
  disabled?: boolean;
  onClick: (arg0: React.SyntheticEvent<Element>) => void;
}>;

export default displayName('RefreshButton')((props: Props) => (
  <div className={classNames(ROOT, props.className)}>
    <IconButton
      testId={props.testId}
      onClick={props.onClick}
      type={props.type}
      color={colors.blue800}
      disabled={props.disabled}
      icon="refresh-copy"
    />
  </div>
)) as React.ComponentType<{
  [key: string]: any;
}>;
