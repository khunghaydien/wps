import * as React from 'react';

import classNames from 'classnames';

import closable, { ClosableProps } from '../../../commons/concerns/closable';
import displayName from '../../../commons/concerns/displayName';

import { compose } from '../../../commons/utils/FnUtil';

import './Modal.scss';

const ROOT = 'mobile-app-atoms-modal';

export type Props = {
  className?: string;
  persistent?: boolean;
  children?: React.ReactNode;
  theme: ('default' | null | undefined) | 'dark' | 'light';
} & ClosableProps;

const ModalPresentation = class extends React.PureComponent<Props> {
  render() {
    const theme = this.props.theme
      ? `${this.props.theme}-theme`
      : 'default-theme';
    const className = classNames(ROOT, this.props.className, theme);

    return (
      <div className={className}>
        {this.props.persistent ? null : (
          <button
            data-test-id={`${ROOT}__close-button`}
            className="close-button"
            onClick={this.props.onClickCloseButton}
          />
        )}
        <div className="content">{this.props.children}</div>
      </div>
    );
  }
};

export default compose(
  displayName('Modal'),
  closable
)(ModalPresentation) as React.ComponentType<{
  [key: string]: any;
}>;
