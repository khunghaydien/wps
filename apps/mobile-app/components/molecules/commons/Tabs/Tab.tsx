import * as React from 'react';

import classNames from 'classnames';

import displayName from '../../../../../commons/concerns/displayName';

import TextButton from '../../../atoms/TextButton';

import './Tab.scss';

const ROOT = 'mobile-app-molecules-commons-tabs-tab';

export type Props = Readonly<{
  active?: boolean;
  label: string;
  onClick: () => void;
}>;

export default displayName('Tab')((props: Props) => {
  return (
    <TextButton
      className={classNames(`${ROOT}__list-link`, {
        [`${ROOT}__list-link--active`]: props.active,
      })}
      onClick={(_: React.SyntheticEvent<Element>) => props.onClick()}
      disabled={props.active}
    >
      {props.label}
    </TextButton>
  );
}) as React.ComponentType<Props>;
