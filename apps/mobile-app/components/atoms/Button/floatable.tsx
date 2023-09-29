import * as React from 'react';

import classNames from 'classnames';
import { $ReadOnly, $Shape } from 'utility-types';

import './floatable.scss';

const ROOT = 'mobile-app-atoms-button-floatable';

export type FloatableProps = $ReadOnly<{
  floating?: 'top' | 'bottom';
  className?: string;
}>;

export default <T extends $Shape<FloatableProps>>(
  WrappedComponent: React.ComponentType<T>
) => {
  return class extends React.PureComponent<T> {
    render() {
      const className = classNames(ROOT, this.props.className, {
        [`${ROOT}__floating`]: this.props.floating,
        [`${ROOT}__floating--top`]: this.props.floating === 'top',
        [`${ROOT}__floating--bottom`]: this.props.floating === 'bottom',
      });

      return <WrappedComponent {...this.props} className={className} />;
    }
  };
};
