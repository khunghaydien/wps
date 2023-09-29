// @TODO Integrate with Core (Design System) componments
import * as React from 'react';
import { CSSTransition } from 'react-transition-group';

import ImgIconAttention from '../../core/assets/icons/attention.svg';

import ImgIconCheck from '../images/icons/check.svg';
import ImgIconClose from '../images/icons/close.svg';
import msg from '../languages';
import IconButton from './buttons/IconButton';

import './Toast.scss';

const ROOT = 'commons-toast';

export type Props = Readonly<{
  variant?: 'success' | 'warning' | 'error';
  message: React.ReactNode;
  children?: React.ReactNode;
  isShow: boolean;
  handleUndo?: () => void;
  onClick: () => void;
  onExit: () => void;
}>;

const Icons = {
  success: ImgIconCheck,
  warning: ImgIconAttention,
  error: ImgIconAttention,
};

export default class Toast extends React.PureComponent<Props> {
  render() {
    const { children, handleUndo } = this.props;
    const variant = this.props.variant || 'success';
    const Icon = Icons[variant];
    return (
      <CSSTransition
        in={this.props.isShow}
        mountOnEnter
        unmountOnExit
        appear
        timeout={1000}
        classNames={`${ROOT}__animation`}
        onExited={() => this.props.onExit()}
      >
        <div className={`${ROOT} ${ROOT}--${variant}`}>
          <div className={`${ROOT}__content`}>
            <div className={`${ROOT}__icon`}>
              <Icon width="24" height="24" />
            </div>
            <div className={`${ROOT}__info`}>
              <span className={`${ROOT}__message`}>{this.props.message}</span>
              {children}
            </div>
            {handleUndo && (
              <span className={`${ROOT}__undo`} onClick={handleUndo}>
                {msg().Com_Lbl_Undo}
              </span>
            )}
            <div className={`${ROOT}__close_button_container`}>
              <IconButton
                srcType="svg"
                src={ImgIconClose}
                onClick={this.props.onClick}
              />
            </div>
          </div>
        </div>
      </CSSTransition>
    );
  }
}
