import React from 'react';

import './Comment.scss';

const ROOT = 'approvals-pc-tracking-detail-parts-comment';
type Props = {
  employeePhotoUrl?: string;
  value?: string;
  comment?: string;
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
        <p className={`${ROOT}__body`}>{this.props.value}</p>
      </div>
    );
  }
}
