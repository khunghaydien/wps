import React from 'react';

import classNames from 'classnames';
import flatten from 'lodash/flatten';

import BodyCell from './BodyCell';
import BodyRow from './BodyRow';
import HeaderCell from './HeaderCell';
import HeaderRow from './HeaderRow';

import './index.scss';

const ROOT = 'commons-fixed-header-table';
type Props = {
  children: Array<React.ReactNode>;
  className?: string;
  fixedClass?: string;
  scrollableClass?: string;
};
export default class FixedHeaderTable extends React.Component<Props> {
  static defaultProps = {
    className: '',
    fixedClass: '',
    scrollableClass: '',
  };

  isHeader(el) {
    return el.type.role === 'HeaderRow';
  }

  isBody(el) {
    return el.type.role === 'BodyRow';
  }

  renderHeader() {
    return flatten(this.props.children).filter((el) => {
      return this.isHeader(el);
    });
  }

  renderBody() {
    return flatten(this.props.children).filter((el) => {
      return this.isBody(el);
    });
  }

  render() {
    const {
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
      children,
      className,
      fixedClass,
      scrollableClass,
      ...props
    } = this.props;

    const cssClass = classNames(ROOT, className);

    const fixedCssClass = classNames(`${ROOT}__fixed`, fixedClass);

    const scrollableCssClass = classNames(
      `${ROOT}__scrollable`,
      scrollableClass
    );

    return (
      <div className={cssClass} {...props} role="grid">
        <div className={fixedCssClass}>{this.renderHeader()}</div>

        <div className={scrollableCssClass}>{this.renderBody()}</div>
      </div>
    );
  }
}

export { HeaderRow, HeaderCell, BodyRow, BodyCell };
