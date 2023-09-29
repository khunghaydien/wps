import React from 'react';

import imgBtnPlus from '../../../../../commons/images/btnPlus.png';
import iconStatusApproved from '../../../../../commons/images/iconStatusApprovedNoPhoto.png';
import iconStatusReject from '../../../../../commons/images/iconStatusReject.png';
import iconStatusSubmit from '../../../../../commons/images/iconStatusSubmit.png';
import msg from '../../../../../commons/languages';

import STATUS from '../../../../../domain/models/approval/request/Status';
import DailyRequestConditions from '../../../models/DailyRequestConditions';

import './RequestButtonWithStatus.scss';

const ROOT = 'timesheet-pc-main-content-timesheet-request-button-with-status';

type Props = Readonly<{
  requestConditions: DailyRequestConditions;
  onClick: (requestConditions: DailyRequestConditions) => void;
}>;

export default class RequestButtonWithStatus extends React.Component<Props> {
  pickStatusIconProps() {
    const { requestConditions } = this.props;

    switch (requestConditions.remarkableRequestStatus) {
      case STATUS.Canceled:
        return {
          src: iconStatusReject,
          alt: msg().Att_Lbl_ReqStatCanceled,
        };

      case STATUS.Recalled:
        return {
          src: iconStatusReject,
          alt: msg().Att_Lbl_ReqStatRecalled,
        };

      case STATUS.Rejected:
        return {
          src: iconStatusReject,
          alt: msg().Att_Lbl_ReqStatRejected,
        };

      case STATUS.ApprovalIn:
        return {
          src: iconStatusSubmit,
          alt: msg().Att_Lbl_ReqStatPending,
        };

      case STATUS.Approved:
        return {
          src: iconStatusApproved,
          alt: msg().Att_Lbl_ReqStatApproved,
        };

      case STATUS.Reapplying:
        return {
          src: iconStatusSubmit,
          alt: msg().Att_Lbl_ReqStatPending,
        };

      default:
        if (requestConditions.isAvailableToEntryNewRequest) {
          return {
            src: imgBtnPlus,
            alt: msg().Att_Lbl_NewRequest,
          };
        } else {
          return null;
        }
    }
  }

  renderBadge() {
    const count = this.props.requestConditions.availableRequestCount;
    return count ? <span className={`${ROOT}__badge`}>{count}</span> : null;
  }

  render() {
    const { requestConditions, onClick } = this.props;
    const pickStatusIconProps = this.pickStatusIconProps();

    if (!pickStatusIconProps) {
      return null;
    }

    return (
      <button className={ROOT} onClick={() => onClick(requestConditions)}>
        <img
          className={`${ROOT}__icon`}
          src={pickStatusIconProps.src}
          alt={pickStatusIconProps.alt}
        />
        {this.renderBadge()}
      </button>
    );
  }
}
