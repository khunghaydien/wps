import * as React from 'react';

import classNames from 'classnames';

import Button from '../../../../commons/components/buttons/Button';
import msg from '../../../../commons/languages';
import { compose } from '../../../../commons/utils/FnUtil';

import { MODE } from '../../../modules/base/detail-pane/ui';

import './DetailPaneHeader.scss';

const ROOT = 'admin-pc-contents-detail-pane__header';

type DetailPaneHeaderProps = {
  title?: string;
  className?: string;
  children?: React.ReactNode;
};

export default function DetailPaneHeader(props: DetailPaneHeaderProps) {
  return (
    <div className={classNames(ROOT, props.className)}>
      <div className={`${ROOT}-content slds-align-middle`}>
        <div className={`${ROOT}-content__title slds-align-middle`}>
          {props.title || ''}
        </div>
        <div className={`${ROOT}-content__button-area slds-align-middle`}>
          {props.children}
        </div>
      </div>
    </div>
  );
}

type ButtonEventProps = {
  onClickCancelButton?: (arg0: any) => any | null | undefined;
  onClickCloseButton?: (arg0: any) => any | null | undefined;
  onClickDeleteButton?: (arg0: any) => any | null | undefined;
  onClickEditButton?: (arg0: any) => any | null | undefined;
  onClickSaveButton?: (arg0: any) => any | null | undefined;
  onClickUpdateButton?: (arg0: any) => any | null | undefined;
  onClickCloneButton?: (arg0: any) => any | null | undefined;
};

type ButtonsProps = {
  isDeleteButtonDisabled?: boolean;
} & ButtonEventProps;

const Buttons: React.FC<ButtonsProps> = (props) => {
  return (
    <React.Fragment>
      {props.onClickCloneButton && (
        <Button onClick={props.onClickCloneButton}>
          {msg().Com_Lbl_Clone}
        </Button>
      )}
      {props.onClickDeleteButton && (
        <Button
          type="destructive"
          disabled={props.isDeleteButtonDisabled}
          onClick={props.onClickDeleteButton}
        >
          {msg().Com_Btn_Delete}
        </Button>
      )}
      {props.onClickEditButton && (
        <Button onClick={props.onClickEditButton}>
          {msg().Admin_Lbl_Edit}
        </Button>
      )}
      {props.onClickCloseButton && (
        <Button onClick={props.onClickCloseButton}>
          {msg().Com_Btn_Close}
        </Button>
      )}
      {props.onClickCancelButton && (
        <Button onClick={props.onClickCancelButton}>
          {msg().Com_Btn_Cancel}
        </Button>
      )}
      {props.onClickSaveButton && (
        <Button type="primary" onClick={props.onClickSaveButton}>
          {msg().Com_Btn_Submit}
        </Button>
      )}
      {props.onClickUpdateButton && (
        <Button type="primary" onClick={props.onClickUpdateButton}>
          {msg().Com_Btn_Save}
        </Button>
      )}
    </React.Fragment>
  );
};

type ButtonStatusProps = {
  mode: string;
  isSinglePane?: boolean;
  isDisplayCancelButton?: boolean;
  isDisplayCloseButton?: boolean;
  isDisplayDeleteButton?: boolean;
  isDisplayEditButton?: boolean;
  isDisplaySaveButton?: boolean;
  isDisplayUpdateButton?: boolean;
  isDisplayCloneButton?: boolean;
};

const bindButtonEvents = (WrappedComponent: React.ComponentType<any>) => {
  return class BindButtonEvents extends React.Component<
    ButtonStatusProps & ButtonEventProps
  > {
    render() {
      const {
        isDisplayCloneButton,
        isDisplayCancelButton,
        isDisplayCloseButton,
        isDisplayDeleteButton,
        isDisplayEditButton,
        isDisplaySaveButton,
        isDisplayUpdateButton,
        onClickCancelButton,
        onClickCloseButton,
        onClickDeleteButton,
        onClickEditButton,
        onClickSaveButton,
        onClickUpdateButton,
        onClickCloneButton,
        ...newProps
      } = this.props;

      return (
        <WrappedComponent
          {...newProps}
          onClickCloneButton={isDisplayCloneButton ? onClickCloneButton : null}
          onClickCancelButton={
            isDisplayCancelButton ? onClickCancelButton : null
          }
          onClickCloseButton={isDisplayCloseButton ? onClickCloseButton : null}
          onClickDeleteButton={
            isDisplayDeleteButton ? onClickDeleteButton : null
          }
          onClickEditButton={isDisplayEditButton ? onClickEditButton : null}
          onClickSaveButton={isDisplaySaveButton ? onClickSaveButton : null}
          onClickUpdateButton={
            isDisplayUpdateButton ? onClickUpdateButton : null
          }
        />
      );
    }
  };
};

const withDefaultButtonStatus = (
  WrappedComponent: React.ComponentType<any>
) => {
  return class WithDefaultButtonStatus extends React.Component<ButtonStatusProps> {
    render() {
      const { mode, isSinglePane, isDisplayCloneButton } = this.props;
      const { CUSTOM, NEW, EDIT, CLONE, ADD_SUB_ROLE } = MODE;
      const isNewRecord = mode === NEW || mode === CLONE;
      const isEditMode = mode === EDIT;
      const isCustomMode = mode === CUSTOM;
      const isAddSubRole = mode === ADD_SUB_ROLE;
      if (isSinglePane) {
        return (
          <WrappedComponent
            isDisplayCancelButton={isEditMode}
            isDisplayCloseButton={false}
            isDisplayDeleteButton={false}
            isDisplayEditButton={!mode}
            isDisplaySaveButton={false}
            isDisplayUpdateButton={isEditMode}
            {...this.props} // 既存の値でデフォルト値を上書きします。上記の値はあくまでもデフォルト値です。
            isDisplayCloneButton={false}
          />
        );
      } else {
        return (
          <WrappedComponent
            isDisplayCancelButton={!!mode && !isCustomMode && !isNewRecord}
            isDisplayCloseButton={!mode || isNewRecord || isCustomMode}
            isDisplayDeleteButton={!mode}
            isDisplayEditButton={!mode}
            isDisplaySaveButton={isNewRecord}
            isDisplayUpdateButton={isEditMode || isAddSubRole}
            {...this.props} // 既存の値でデフォルト値を上書きします。上記の値はあくまでもデフォルト値です。
            isDisplayCloneButton={!mode && isDisplayCloneButton}
          />
        );
      }
    }
  };
};

const ButtonHeader = (
  props: DetailPaneHeaderProps & ButtonsProps & ButtonStatusProps
) => {
  const { title, className, ...newProps } = props;
  return (
    <DetailPaneHeader title={title} className={className}>
      <Buttons {...newProps} />
    </DetailPaneHeader>
  );
};

export const DetailPaneButtonsHeader = compose(
  withDefaultButtonStatus,
  bindButtonEvents
)(ButtonHeader) as React.ComponentType<Record<string, any>>;
