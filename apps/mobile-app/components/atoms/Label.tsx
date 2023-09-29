import * as React from 'react';

import classNames from 'classnames';

// NOTE
// In principle, atoms should not depend on atoms, but here it relies on them to use info icon.
import Icon from './Icon';

import './Label.scss';
import colors from '../../styles/variables/_colors.scss';

const ROOT = 'mobile-app-atoms-label';

type Props = Readonly<{
  className?: string;
  htmlFor?: string;
  text: string;
  marked?: boolean;
  emphasis?: boolean;
  children?: React.ReactNode;
  hintMsg?: string;
  onClickHint?: () => void;
}>;

export default class Label extends React.PureComponent<Props> {
  render() {
    const className = classNames(ROOT, this.props.className, {
      [`${ROOT}--emphasis`]: this.props.emphasis,
    });

    return (
      <label className={className} htmlFor={this.props.htmlFor}>
        <div className={`${ROOT}__text`}>
          {this.props.marked ? (
            <div className={`${ROOT}__marker`}>*</div>
          ) : null}
          {this.props.text}
          {this.props.hintMsg && (
            <span onClick={this.props.onClickHint} className={`${ROOT}__hint`}>
              <Icon type="info-copy" size="medium" color={colors.brand} />
            </span>
          )}
        </div>
        <div className={`${ROOT}__control`}>{this.props.children}</div>
      </label>
    );
  }
}
