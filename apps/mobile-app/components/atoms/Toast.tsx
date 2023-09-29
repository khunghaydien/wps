import * as React from 'react';
import { CSSTransition } from 'react-transition-group';

import classNames from 'classnames';

import './Toast.scss';

const ROOT = 'mobile-app-atoms-toast';

export type Props = Readonly<{
  className?: string;
  message: string;
  isShow: boolean;
}>;

export default class Toast extends React.PureComponent<Props> {
  render() {
    return (
      <CSSTransition
        in={this.props.isShow}
        mountOnEnter
        unmountOnExit
        appear
        timeout={1000}
        classNames={`${ROOT}__animation`}
      >
        <div className={classNames(ROOT, this.props.className)}>
          <div className={`${ROOT}__container`}>
            <p className={`${ROOT}__content`}>{this.props.message}</p>
          </div>
        </div>
      </CSSTransition>
    );
  }
}
