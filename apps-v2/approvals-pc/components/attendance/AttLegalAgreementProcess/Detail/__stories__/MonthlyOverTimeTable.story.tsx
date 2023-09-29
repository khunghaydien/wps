import React from 'react';

import * as dummy from '@attendance/domain/models/approval/__tests__/mocks/LegalAgreementRequest/MonthlyLegalAgreementRequest';

import Component from '../MonthlyOverTimeTable';

export default {
  title:
    'approvals-pc/attendance/AttLegalAgreementProcess/Detail/MonthlyOverTimeTable',
};

export const Default = () => (
  <Component overtime={dummy.defaultValue.request} showSpecial={true} />
);

export const AllEmpty = () => (
  <Component overtime={dummy.allEmpty.request} showSpecial={true} />
);

export const AllZero = () => (
  <Component overtime={dummy.allZero.request} showSpecial={true} />
);

export const DefaultNoSpecial = () => (
  <Component overtime={dummy.allZero.request} showSpecial={false} />
);
