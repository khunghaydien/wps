import React from 'react';

import classNames from 'classnames';

import SquareShapeIcon from './ShapeIcons/SquareShapeIcon';

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
        <SquareShapeIcon
          backgroundColor={CSS.blue100}
          color={CSS.blue300}
          type="image"
          size="x-large"
        />
        <div className={`${ROOT}__message`}>{this.props.message}</div>
      </div>
    );
  }
}
