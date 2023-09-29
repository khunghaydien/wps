import * as React from 'react';

import classNames from 'classnames';

import displayName from '../../../../../commons/concerns/displayName';

import Tab from './Tab';

import './Tabs.scss';

const ROOT = 'mobile-app-molecules-commons-tabs-tabs';

export type Props = Readonly<{
  className?: string;
  children: React.ReactElement<typeof Tab>[];
  position?: 'top' | 'bottom';
}>;

export default displayName('Tabs')((props: Props) => {
  return (
    <div
      className={classNames(ROOT, props.className, {
        [`${ROOT}--top`]: props.position === 'top',
        [`${ROOT}--bottom`]: props.position === 'bottom',
      })}
    >
      <div className={`${ROOT}__link-wrapper`}>
        {props.children.map((child, index) => (
          <React.Fragment key={index}>{child}</React.Fragment>
        ))}
      </div>
    </div>
  );
}) as React.ComponentType<{
  [key: string]: any;
}>;
