import React from 'react';

import msg from '../../../../../languages';
import Button from '../../../../buttons/Button';
import DialogFrame from '../../../../dialogs/DialogFrame';
import TextField from '../../../../fields/TextField';

import './index.scss';

const ROOT = 'ts-expenses-modal-approval';

/**
 * 申請ダイアログ
 * Dialogコンポーネントからimportして使われる
 */
export type Props = {
  comment: string;
  // onClickMainButton: () => void,
  inputError: string;
  selectedConditionName: string;
  title: string;
  onChangeName: (arg0: string) => Record<string, unknown>;
  onClickHideDialogButton: () => void;
  onClickSaveNewButton: () => void;
  onClickSaveOverwriteButton: () => void;
};

export default class SearchCondition extends React.Component<Props> {
  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChangeName(e.target.value);
  };

  render() {
    const isDisabledSaveNewButton =
      this.props.comment === this.props.selectedConditionName;
    const isDisabledSaveOverWriteButton =
      this.props.selectedConditionName ===
        msg().Exp_Lbl_SearchConditionApprovelreRuestList ||
      this.props.selectedConditionName ===
        msg().Exp_Lbl_SearchConditionApprovedRequestList;

    return (
      <DialogFrame
        title={this.props.title}
        hide={this.props.onClickHideDialogButton}
        className={`${ROOT}__dialog-frame`}
        footer={
          <DialogFrame.Footer>
            <Button type="default" onClick={this.props.onClickHideDialogButton}>
              {msg().Com_Btn_Cancel}
            </Button>
            <Button
              type="primary"
              onClick={this.props.onClickSaveOverwriteButton}
              disabled={isDisabledSaveOverWriteButton}
            >
              {msg().Com_Btn_Save_Overwrite}
            </Button>
            <Button
              type="primary"
              onClick={this.props.onClickSaveNewButton}
              disabled={isDisabledSaveNewButton}
            >
              {msg().Com_Btn_Save_New}
            </Button>
          </DialogFrame.Footer>
        }
      >
        <div className={`${ROOT}__inner`}>
          <TextField onChange={this.onChange} value={this.props.comment} />
        </div>
        {this.props.inputError && (
          <div className={`${ROOT}__error`}>{this.props.inputError}</div>
        )}
      </DialogFrame>
    );
  }
}
