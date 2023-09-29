import msg from '@commons/languages';

import {
  CODE,
  Code,
} from '@attendance/domain/models/LegalAgreementRequestType';

export default (type: Code): string => {
  switch (type) {
    case CODE.MONTHLY:
      return msg().Appr_Lbl_Monthly;
    case CODE.YEARLY:
      return msg().Appr_Lbl_Yearly;
    default:
      return '';
  }
};
