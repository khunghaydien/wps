import * as React from 'react';

import classNames from 'classnames';

import clickable, { ClickableProps } from '../../../commons/concerns/clickable';
import displayName from '../../../commons/concerns/displayName';

import { compose } from '../../../commons/utils/FnUtil';

import './ListHeader.scss';

const ROOT = 'mobile-app-atoms-list-header';

type Props = Readonly<
  ClickableProps & {
    className?: string;
    children?: React.ReactNode;
  }
>;

class ListHeader extends React.PureComponent<Props> {
  render() {
    const className = classNames(ROOT, this.props.className);

    return (
      <div className={className} onClick={this.props.onClick}>
        {this.props.children}
      </div>
    );
  }
}

export default compose(
  displayName('ListHeader'),
  clickable
)(ListHeader) as React.ComponentType<{
  [key: string]: any;
}>;
