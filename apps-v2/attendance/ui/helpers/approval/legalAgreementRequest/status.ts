import msg from '@apps/commons/languages';

import {
  STATUS,
  Status,
} from '@attendance/domain/models/approval/LegalAgreementRequest';

export default (status: Status | ''): string => {
  if (!status) {
    return '';
  }
  switch (status) {
    case STATUS.PENDING:
      return msg().Att_Lbl_ReqStatPending;
    case STATUS.APPROVED:
      return msg().Att_Lbl_ReqStatApproved;
    case STATUS.CANCELED:
      return msg().Att_Lbl_ReqStatCanceled;
    case STATUS.REAPPLYING:
      return msg().Att_Lbl_ReqStatPending;
    case STATUS.REAPPLIED:
      return msg().Att_Lbl_ReqStatApproved;
    case STATUS.REJECTED:
      return msg().Att_Lbl_ReqStatRejected;
    case STATUS.REMOVED:
      return msg().Att_Lbl_ReqStatRecalled;
    default:
      return '';
  }
};
