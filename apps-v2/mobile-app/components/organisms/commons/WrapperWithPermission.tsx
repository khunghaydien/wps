import * as React from 'react';

import classNames from 'classnames';

import { ErrorInfo } from '../../../../commons/utils/AppPermissionUtil';

import PermissionError from './PermissionError';

import './WrapperWithPermission.scss';

const ROOT = 'mobile-app-organisms-wrapper-with-permission';

export type Props = Readonly<{
  className?: string;
  children: React.ReactNode;
  hasPermissionError: ErrorInfo | null | undefined;
}>;

export default class WrapperWithPermission extends React.PureComponent<Props> {
  render() {
    const className = classNames(ROOT, this.props.className);
    const { hasPermissionError } = this.props;
    return (
      <div className={className}>
        {hasPermissionError ? (
          <PermissionError errorInfo={hasPermissionError} />
        ) : (
          this.props.children
        )}
      </div>
    );
  }
}
