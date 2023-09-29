import React, { useMemo } from 'react';

import styled from 'styled-components';

import Button from '@apps/commons/components/buttons/Button';
import iconStatusApproved from '@apps/commons/images/iconStatusApprovedNoPhoto.png';
import iconStatusReject from '@apps/commons/images/iconStatusReject.png';
import iconStatusSubmit from '@apps/commons/images/iconStatusSubmit.png';
import iconAddBlue from '@apps/commons/images-pre-optimized/iconAddBlue.png';
import msg from '@apps/commons/languages';

import {
  STATUS,
  Status,
} from '@attendance/domain/models/LegalAgreementRequest';

type Props = Readonly<{
  status: Status;
  disabled?: boolean;
  onClick: () => void;
}>;

const RequestButton = styled(Button)`
  line-height: 27px;
  margin-right: 16px;
  span {
    color: #2782ed;
    max-width: 280px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &:disabled {
    span {
      color: #ccc;
    }
  }
`;

const Img = styled.img`
  display: block;
  float: left;
  margin-top: 6px;
  margin-right: 4px;
  width: 14px;
  height: 14px;
`;

const LegalAgreementRequestButton: React.FC<Props> = ({
  status,
  disabled = false,
  onClick,
}) => {
  const pickStatusIconProps = useMemo(() => {
    switch (status) {
      case STATUS.REMOVED:
        return {
          src: iconStatusReject,
          alt: msg().Att_Lbl_ReqStatRecalled,
        };
      case STATUS.CANCELED:
        return {
          src: iconStatusReject,
          alt: msg().Att_Lbl_ReqStatCanceled,
        };
      case STATUS.REJECTED:
        return {
          src: iconStatusReject,
          alt: msg().Att_Lbl_ReqStatRejected,
        };
      case STATUS.APPROVAL_IN:
        return {
          src: iconStatusSubmit,
          alt: msg().Att_Lbl_ReqStatPending,
        };
      case STATUS.APPROVED:
        return {
          src: iconStatusApproved,
          alt: msg().Att_Lbl_ReqStatApproved,
        };
      case STATUS.REAPPLYING:
        return {
          src: iconStatusSubmit,
          alt: msg().Att_Lbl_ReqStatPending,
        };
      default:
        return {
          src: iconAddBlue,
          alt: msg().Att_Lbl_NewRequest,
        };
    }
  }, [status]);

  return (
    <RequestButton
      title={msg().Admin_Lbl_AttLegalAgreementRequest}
      disabled={disabled}
      onClick={() => onClick()}
    >
      <Img src={pickStatusIconProps.src} alt={pickStatusIconProps.alt} />{' '}
      {msg().Admin_Lbl_AttLegalAgreementRequest}
    </RequestButton>
  );
};

export default LegalAgreementRequestButton;
