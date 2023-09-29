import * as React from 'react';

import classNames from 'classnames';

import clickable, { ClickableProps } from '../../../commons/concerns/clickable';
import displayName from '../../../commons/concerns/displayName';

import { compose } from '../../../commons/utils/FnUtil';

import Icon from './Icon';

import './LinkListItem.scss';

const ROOT = 'mobile-app-atoms-link-list-item';

type Props = Readonly<
  ClickableProps & {
    className?: string;
    children?: React.ReactNode;
    noIcon?: boolean;
  }
>;

class LinkListItem extends React.PureComponent<Props> {
  render() {
    const className = classNames(ROOT, this.props.className);
    return (
      <div className={className} onClick={this.props.onClick}>
        <div className={`${ROOT}__item`}>{this.props.children}</div>
        {!this.props.noIcon && (
          <div className={`${ROOT}__icon`}>
            <Icon type="chevronright" size="medium" />
          </div>
        )}
      </div>
    );
  }
}

export default compose(
  displayName('LinkListItem'),
  clickable
)(LinkListItem) as React.ComponentType<{
  [key: string]: any;
}>;
