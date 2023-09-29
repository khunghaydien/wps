import React from 'react';

import Button from '../../../../commons/components/buttons/Button';
import CommentNarrowField from '../../../../commons/components/fields/CommentNarrowField';
import msg from '../../../../commons/languages';

import './Approve.scss';

const ROOT = 'approvals-pc-tracking-process-list-pane-detail-approve';

type Props = {
  requestId: string;
  comment: string;
  userPhotoUrl: string;
  approve: Function;
  reject: Function;
  editComment: Function;
};

export default class Approve extends React.Component<Props> {
  onChangeComment = (value) => {
    this.props.editComment(value);
  };

  onClickApproveButton = () => {
    this.props.approve([this.props.requestId], this.props.comment);
  };

  onClickRejectButton = () => {
    this.props.reject([this.props.requestId], this.props.comment);
  };

  render() {
    return (
      <div className={`${ROOT}`}>
        <div className={`${ROOT}__field`}>
          <CommentNarrowField
            icon={this.props.userPhotoUrl}
            value={this.props.comment}
            onChange={this.props.editComment}
            maxLength={1000}
          />
        </div>

        <div className={`${ROOT}__buttons`}>
          <Button
            className={`${ROOT}__button`}
            type="destructive"
            onClick={this.onClickRejectButton}
          >
            {msg().Appr_Btn_Reject}
          </Button>
          <Button
            className={`${ROOT}__button`}
            type="primary"
            onClick={this.onClickApproveButton}
          >
            {msg().Appr_Btn_Approve}
          </Button>
        </div>
      </div>
    );
  }
}
