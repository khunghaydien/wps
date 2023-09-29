import React from 'react';

import msg from '../../../../../../languages';
import Button from '../../../../../buttons/Button';

import '../index.scss';

const ROOT = 'ts-expenses__form-record-item__actions';

export type Props = {
  isLoading: boolean;
  isRecordLoading: boolean;
  isSaveDisabled: boolean;
  onClickBackButton: () => void;
  onClickSaveButton: () => void;
};

export default class RecordItemFAActionButtons extends React.Component<Props> {
  render() {
    return (
      <div className={`${ROOT}`}>
        <Button
          className={`${ROOT}__cancel`}
          data-testid={`${ROOT}__cancel`}
          onClick={this.props.onClickBackButton}
          disabled={this.props.isLoading || this.props.isRecordLoading}
          type="default"
        >
          {msg().Com_Btn_Cancel}
        </Button>
        <Button
          className={`${ROOT}__save`}
          data-testid={`${ROOT}__save`}
          onClick={this.props.onClickSaveButton}
          disabled={this.props.isSaveDisabled || this.props.isLoading}
          type="primary"
        >
          {msg().Com_Btn_Save}
        </Button>
      </div>
    );
  }
}
