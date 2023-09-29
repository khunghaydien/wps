import React from 'react';

import Button from '../../../commons/components/buttons/Button';
import CommentNarrowField from '../../../commons/components/fields/CommentNarrowField';
import msg from '../../../commons/languages';

import './ApproveForm.scss';

const ROOT = 'approvals-pc-tracking-detail-parts-approve-form';

type Props = {
  onClickApproveButton: (arg0) => void;
  onClickRejectButton: (arg0) => void;
  comment?: string;
  onChangeApproveComment?: Function;
  userPhotoUrl?: string;
  onChangeComment?: any;
};
export default class ApproveForm extends React.Component<Props> {
  onChangeApproveComment = (e: any) => {
    this.props.onChangeApproveComment(e.target.value, e);
  };

  render() {
    return (
      <div className={`${ROOT}`}>
        <div className={`${ROOT}__field`}>
          <CommentNarrowField
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
