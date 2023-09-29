import React from 'react';

import classNames from 'classnames';

import CircleShapeIcon from './ShapeIcons/CircleShapeIcon';

import CSS from './EmptyIcon.scss';

const ROOT = 'mobile-app-molecules-empty-icon';

type Props = {
  message?: string;
  className?: string;
};

export default class EmptyIcon extends React.Component<Props> {
  render() {
    const className = classNames(ROOT, this.props.className);
    return (
      <div className={className}>
        <CircleShapeIcon
          backgroundColor={CSS.blue100}
          color={CSS.blue300}
          type="check-copy"
          size="x-large"
        />
        <div className={`${ROOT}__message`}>{this.props.message}</div>
      </div>
    );
  }
}
