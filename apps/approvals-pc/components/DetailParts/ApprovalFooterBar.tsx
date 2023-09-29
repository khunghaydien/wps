import React from 'react';

import Button from '../../../commons/components/buttons/Button';
import CommentFooterField from '../../../commons/components/fields/CommentNarrowField';
import msg from '../../../commons/languages';

import './ApprovalFooterBar.scss';

const ROOT = 'approvals-pc-tracking-detail-parts-approve-footer';

type Props = {
  onClickApproveButton: () => void;
  onClickRejectButton: () => void;
  comment: string;
  onChangeApproveComment: (arg0: string) => void;
  userPhotoUrl: string;
};

export default class ApproveForm extends React.Component<Props> {
  onChangeApproveComment = (e: any) => {
    this.props.onChangeApproveComment(e.target.value);
  };

  render() {
    return (
      <div className={`${ROOT}`}>
        <div className={`${ROOT}__field`}>
          <CommentFooterField
            icon={this.props.userPhotoUrl}
            value={this.props.comment}
            onChange={this.props.onChangeApproveComment}
            maxLength={1000}
          />
        </div>

        <div className={`${ROOT}__buttons`}>
          <Button
            className={`${ROOT}__button`}
            data-testid={`${ROOT}__button-reject`}
            type="destructive"
            onClick={this.props.onClickRejectButton}
          >
            {msg().Appr_Btn_Reject}
          </Button>
          <Button
            className={`${ROOT}__button`}
            data-testid={`${ROOT}__button-approve`}
            type="primary"
            onClick={this.props.onClickApproveButton}
          >
            {msg().Appr_Btn_Approve}
          </Button>
        </div>
      </div>
    );
  }
}
