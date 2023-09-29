import React from 'react';

import { Report } from '../../../../../../domain/models/exp/Report';

import msg from '../../../../../languages';
import Button from '../../../../buttons/Button';
import DialogFrame from '../../../../dialogs/DialogFrame';
import CommentNarrowField from '../../../../fields/CommentNarrowField';
import MessageArea from '../../MessageArea';

import './index.scss';

const ROOT = 'ts-expenses-modal-approval';

/**
 * 申請ダイアログ
 * Dialogコンポーネントからimportして使われる
 */
export type Props = {
  comment: string;
  errors: Record<string, any>;
  expReport: Report;
  mainButtonTitle: string;
  photoUrl: string;
  title: string;
  onChangeComment: (arg0: string) => Record<string, unknown>;
  onClickHideDialogButton: () => void;
  onClickMainButton: () => void;
};

export default class ApprovalDialog extends React.Component<Props> {
  render() {
    return (
      <DialogFrame
        title={this.props.title}
        hide={this.props.onClickHideDialogButton}
        className={`${ROOT}__dialog-frame`}
        footer={
          <DialogFrame.Footer>
            <Button
              type="default"
              data-testid={`${ROOT}-cancel`}
              onClick={this.props.onClickHideDialogButton}
            >
              {msg().Com_Btn_Cancel}
            </Button>
            <Button
              type="primary"
              data-testid={`${ROOT}-main`}
              onClick={this.props.onClickMainButton}
            >
              {this.props.mainButtonTitle}
            </Button>
          </DialogFrame.Footer>
        }
      >
        <MessageArea
          expReport={this.props.expReport}
          errors={this.props.errors}
          isAlwaysOpen
        />
        <div className={`${ROOT}__inner`}>
          <CommentNarrowField
            onChange={this.props.onChangeComment}
            value={this.props.comment}
            maxLength={1000}
            icon={this.props.photoUrl}
          />
        </div>
      </DialogFrame>
    );
  }
}
