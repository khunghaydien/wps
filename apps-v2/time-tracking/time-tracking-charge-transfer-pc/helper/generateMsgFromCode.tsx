import msg from '@apps/commons/languages';

import { DateResult } from '@apps/repositories/time-tracking/SummaryRepository';

type Code = DateResult['reason'];

const mapCodeToMsg: { [key in Code]: string } = {
  INVALID_JOB_IN_TIME_TRACKING: msg().Trac_Err_InvalidJobWithDate,
  INVALID_TERM_IN_JOB: msg().Trac_Err_InvalidJobWithDate,
  INVALID_TERM_IN_JOB_ASSIGN: msg().Trac_Err_InvalidJobWithDate,
  INVALID_TERM_IN_WORK_CATEGORY: msg().Trac_Err_OutOfValidWorkCategoryWithDate,
  NOT_LINKED_WORK_CATEGORY: msg().Trac_Err_UnLinkedWorkCategoryWithDate,
  NOT_FOUND_TIME_RECORD_ITEM: msg().Trac_Err_NotFoundTransferTarget,
  SUCCESS: msg().Trac_Msg_SuccessTransfer,
};

export const generateMsgFromCode = (code: Code): string => {
  return mapCodeToMsg[code];
};
