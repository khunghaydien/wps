import * as React from 'react';

import Button from '../../atoms/Button';
import Modal from '../../atoms/Modal';

import './Dialog.scss';

const ROOT = 'mobile-app-molecules-commons-dialog';

type Props = Readonly<{
  title?: string;
  persistent?: boolean;
  isOpened?: boolean;
  content: React.ReactNode;
  leftButtonLabel?: string;
  onClickLeftButton?: (event: React.SyntheticEvent<Element>) => void;
  rightButtonLabel?: string;
  rightButtonDisabled?: boolean;
  onClickRightButton?: (event: React.SyntheticEvent<Element>) => void;
  centerButtonLabel?: string;
  centerButtonDisabled?: boolean;
  onClickCenterButton?: (event: React.SyntheticEvent<Element>) => void;
  onClickCloseButton?: () => void;
}>;

export default class Dialog extends React.Component<Props> {
  render() {
    return (
      <Modal
        className={`${ROOT} dark`}
        onClickCloseButton={this.props.onClickCloseButton}
        persistent={this.props.persistent}
        isOpened={this.props.isOpened}
      >
        {this.props.title ? (
          <div className={`${ROOT}__title`}>{this.props.title}</div>
        ) : null}
        <div className={`${ROOT}__content`}>{this.props.content}</div>
        <div className={`${ROOT}__buttons`}>
          {this.props.centerButtonLabel ? (
            <Button
              className={`${ROOT}__button-center`}
              priority="primary"
              variant="neutral"
              onClick={this.props.onClickCenterButton}
              disabled={this.props.centerButtonDisabled}
            >
              {this.props.centerButtonLabel}
            </Button>
          ) : (
            <>
              <button
                className={`${ROOT}__button-left`}
                onClick={this.props.onClickLeftButton}
              >
                {this.props.leftButtonLabel}
              </button>
              <button
                className={`${ROOT}__button-right`}
                onClick={this.props.onClickRightButton}
                disabled={this.props.rightButtonDisabled}
              >
                {this.props.rightButtonLabel}
              </button>
            </>
          )}
        </div>
      </Modal>
    );
  }
}
