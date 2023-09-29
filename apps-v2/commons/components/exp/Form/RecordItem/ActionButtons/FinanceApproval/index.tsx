import React from 'react';

import msg from '../../../../../../languages';
import Button from '../../../../../buttons/Button';

import '../index.scss';

const ROOT = 'ts-expenses__form-record-item__actions';

export type Props = {
  isDisabled: boolean;
  isEditMode: boolean;
  isSaveDisabled: boolean;
  onClickBackButton: () => void;
  onClickEditButton: () => void;
  onClickSaveButton: () => void;
};

export default class RecordItemActionButtonsFA extends React.Component<Props> {
  renderCancelButton = () => (
    <Button
      className={`${ROOT}__cancel`}
      data-testid={`${ROOT}__cancel`}
      onClick={this.props.onClickBackButton}
    >
      {msg().Com_Btn_Close}
    </Button>
  );

  render() {
    const { isEditMode } = this.props;

    return isEditMode ? (
      <div className={`${ROOT}`}>
        {this.renderCancelButton()}
        <Button
          className={`${ROOT}__save`}
          data-testid={`${ROOT}__save`}
          onClick={this.props.onClickSaveButton}
          disabled={this.props.isSaveDisabled}
          type="primary"
        >
          {msg().Com_Btn_Save}
        </Button>
      </div>
    ) : (
      <div className={`${ROOT}`}>
        {this.renderCancelButton()}
        <Button
          className={`${ROOT}__edit`}
          disabled={this.props.isDisabled}
          onClick={this.props.onClickEditButton}
        >
          {msg().Appr_Btn_Edit}
        </Button>
      </div>
    );
  }
}
