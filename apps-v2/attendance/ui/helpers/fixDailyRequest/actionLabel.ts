import msg from '@apps/commons/languages';

import {
  ACTIONS_FOR_FIX,
  ActionsForFix,
} from '@attendance/domain/models/AttFixSummaryRequest';

export default (type: ActionsForFix): string => {
  switch (type) {
    case ACTIONS_FOR_FIX.Submit:
      return msg().Att_Btn_Request;
    case ACTIONS_FOR_FIX.CancelRequest:
      return msg().Com_Btn_RequestCancel;
    case ACTIONS_FOR_FIX.CancelApproval:
      return msg().Com_Btn_ApprovalCancel;
    default:
      return '';
  }
};
