import React from 'react';

import './CommentHeader.scss';

const ROOT = 'approvals-pc-tracking-detail-name-comment';

type Props = {
  employeePhotoUrl: string;
  value: string;
  employeeName: string;
};

export default class Comment extends React.Component<Props> {
  render() {
    return (
      <div className={`${ROOT}`}>
        <img
          className={`${ROOT}__icon`}
          src={this.props.employeePhotoUrl}
          alt=""
        />

        <p className={`${ROOT}__body`}>
          <b>{this.props.employeeName}</b> <br /> {this.props.value}
        </p>
      </div>
    );
  }
}
