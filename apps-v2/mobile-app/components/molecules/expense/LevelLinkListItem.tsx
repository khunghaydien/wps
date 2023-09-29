import * as React from 'react';

import classNames from 'classnames';

import CircleOutlineShapeIcon from '../commons/ShapeIcons/CircleOutlineShapeIcon';

import './LevelLinkListItem.scss';

const ROOT = 'mobile-app-molecules-expense-level-link-list-item';

type ClickEventHandler = (event: React.MouseEvent<Element>) => void;

type Props = Readonly<{
  className?: string;
  children?: React.ReactNode;
  onClickBody?: ClickEventHandler;
  onClickIcon?: ClickEventHandler;
}>;

export default class LevelLinkListItem extends React.PureComponent<Props> {
  render() {
    const className = classNames(ROOT, this.props.className);
    return (
      <div className={className}>
        <div className={`${ROOT}__body`} onClick={this.props.onClickBody}>
          {this.props.children}
        </div>
        {this.props.onClickIcon && (
          <button className={`${ROOT}__icon`} onClick={this.props.onClickIcon}>
            <CircleOutlineShapeIcon type="chevronright" size="medium" />
          </button>
        )}
      </div>
    );
  }
}
