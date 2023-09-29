import React, { ReactNode } from 'react';

import classNames from 'classnames';

import Label from '../../atoms/Label';

import './ViewItem.scss';

const ROOT = 'mobile-app-molecules-commons-view-item';

type Props = Readonly<{
  className?: string;
  emphasis?: boolean;
  marked?: boolean;
  label: string;
  children: ReactNode | null | undefined;
  align?: 'left' | 'right' | 'center';
}>;

export default class ViewItem extends React.PureComponent<Props> {
  render() {
    const className = classNames(ROOT, this.props.className);
    const alignCss = this.props.align
      ? `${ROOT}__body--${this.props.align}`
      : '';
    const bodyCss = classNames(`${ROOT}__body`, alignCss);

    return (
      <div className={className}>
        <Label
          className={`${ROOT}__label`}
          text={this.props.label}
          emphasis={this.props.emphasis}
          marked={this.props.marked}
        >
          <div className={bodyCss}>{this.props.children}</div>
        </Label>
      </div>
    );
  }
}
