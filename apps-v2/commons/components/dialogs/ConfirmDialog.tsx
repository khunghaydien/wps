import * as React from 'react';

import className from 'classnames';

import iconConfirm from '../../images/iconConfirm.png';
import msg from '../../languages';
import Button from '../buttons/Button';
import DialogFrame from './DialogFrame';

import './ConfirmDialog.scss';

const ROOT = 'commons-dialogs-confirm-dialog';

type Props = {
  onClickOk: () => void;
  onClickCancel: () => void;
  onClickHide?: () => void;
  children?: React.ReactNode;
  withoutCloseButton?: boolean;
  okButtonLabel?: string;
  cancelButtonLabel?: string;
  className?: string | Array<string>;
};

const ConfirmDialog = (props: Props) => {
  const children =
    Array.isArray(props.children) && typeof props.children[0] === 'string'
      ? props.children.join('\n')
      : props.children;

  return (
    <DialogFrame
      title={msg().Com_Lbl_Confirm}
      className={className(ROOT, props.className)}
      zIndex={5999999}
      initialFocus={`${ROOT}__cancel-button`}
      withoutCloseButton={props.withoutCloseButton}
      hide={props.onClickHide}
      footer={
        <DialogFrame.Footer>
          <Button
            data-testid={`${ROOT}__cancel-button`}
            id={`${ROOT}__cancel-button`}
            onClick={props.onClickCancel}
          >
            {props.cancelButtonLabel || msg().Com_Btn_Cancel}
          </Button>
          <Button
            data-testid={`${ROOT}__ok-button`}
            id={`${ROOT}__ok-button`}
            type="primary"
            onClick={props.onClickOk}
          >
            {props.okButtonLabel || msg().Com_Btn_Ok}
          </Button>
        </DialogFrame.Footer>
      }
    >
      <div className={`${ROOT}__message`}>
        <div className={`${ROOT}__icon`}>
          <img src={iconConfirm} alt="INFO" />
        </div>
        <div data-testid={`${ROOT}__content`} className={`${ROOT}__content`}>
          {typeof children === 'string' ? <p>{children}</p> : children}
        </div>
      </div>
    </DialogFrame>
  );
};

ConfirmDialog.defaultProps = {
  withoutCloseButton: true,
  onClickHide: () => {},
};

export default ConfirmDialog;

type ContentProps = {
  children: React.ReactNode;
  okButtonLabel?: string;
  cancelButtonLabel?: string;
  className?: string | Array<string>;
};

export const bindHandlerToConfirmDialog =
  (handlerProps: { onClickOk: () => void; onClickCancel: () => void }) =>
  (contentProps: ContentProps) => {
    return (
      <ConfirmDialog
        onClickOk={handlerProps.onClickOk}
        onClickCancel={handlerProps.onClickCancel}
        okButtonLabel={contentProps.okButtonLabel}
        cancelButtonLabel={contentProps.cancelButtonLabel}
        className={contentProps.className}
      >
        {contentProps.children}
      </ConfirmDialog>
    );
  };

export type CustomConfirmDialogComponent<TParams> = React.ComponentType<{
  ConfirmDialog: React.ComponentType<{
    className?: string;
    okButtonLabel?: string;
    children?: React.ReactNode;
  }>;
  params: TParams;
}>;
