import React from 'react';

import Button from '../../../commons/components/buttons/Button';
import BtnDelete from '../../../commons/images/btnDelete.svg';

import './ClearableField.scss';

const ROOT = 'admin-pc-common-clearable-field';

type Props = {
  disabled: boolean;
  isDialogOpen: boolean;
  // @ts-ignore
  dialog: React.DOM;
  dialogProps?: Record<string, any>;
  label: string;
  labelSelectBtn: string;
  openDialog: () => void;
  onClickClearBtn: () => void;
};

const ClearableField = (props: Props) => {
  const { label } = props;
  const isCleared = !label;

  const renderSelectBtn = () => {
    const btn = (
      <Button
        type="default"
        className={`${ROOT}__select`}
        onClick={props.openDialog}
        disabled={props.disabled}
      >
        {props.labelSelectBtn}
      </Button>
    );

    return isCleared && btn;
  };

  const renderClearBtn = () => {
    const clearBtn = (
      <BtnDelete
        aria-hidden="true"
        className={`${ROOT}__clear slds-button__icon`}
        onClick={props.onClickClearBtn}
      />
    );
    return !isCleared && !props.disabled && clearBtn;
  };

  const Dialog = props.dialog;

  return (
    <div>
      <span className={`${ROOT}__text`}>{props.label}</span>
      {renderClearBtn()}
      {renderSelectBtn()}
      {props.isDialogOpen && <Dialog {...props.dialogProps} />}
    </div>
  );
};
export default ClearableField;
