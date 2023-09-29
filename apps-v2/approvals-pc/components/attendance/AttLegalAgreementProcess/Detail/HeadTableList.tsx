import React from 'react';

import * as LegalAgreementRequest from '@attendance/domain/models/approval/LegalAgreementRequest';
import {
  WORK_SYSTEM as LEGAL_AGREEMENT_WORK_SYSTEM,
  WorkSystem as LegalAgreementWorkSystem,
} from '@attendance/domain/models/LegalAgreementOvertime';
import { CODE } from '@attendance/domain/models/LegalAgreementRequestType';

import MonthlyOvertimeTable from './MonthlyOverTimeTable';
import YearlyOvertimeTable from './YearlyOvertimeTable';

type Props = {
  request: LegalAgreementRequest.LegalAgreementRequest['request'];
  legalAgreementWorkSystem: LegalAgreementWorkSystem | null;
};

const HeadTableList: React.FC<Props> = ({
  request,
  legalAgreementWorkSystem,
}) => {
  const showSpecial =
    legalAgreementWorkSystem &&
    legalAgreementWorkSystem !== LEGAL_AGREEMENT_WORK_SYSTEM.MANAGER;
  switch (request.type) {
    case CODE.MONTHLY:
      return (
        <MonthlyOvertimeTable overtime={request} showSpecial={showSpecial} />
      );
    case CODE.YEARLY:
      return (
        <YearlyOvertimeTable overtime={request} showSpecial={showSpecial} />
      );
    default:
      return null;
  }
};

export default HeadTableList;
