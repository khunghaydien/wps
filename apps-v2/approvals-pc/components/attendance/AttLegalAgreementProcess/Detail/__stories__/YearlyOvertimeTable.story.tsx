import React from 'react';

import * as dummy from '@attendance/domain/models/approval/__tests__/mocks/LegalAgreementRequest/YearlyLegalAgreementRequest';

import Component from '../YearlyOvertimeTable';

export default {
  title:
    'approvals-pc/attendance/AttLegalAgreementProcess/Detail/YearlyOverTimeTable',
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
  <Component
    overtime={dummy.defaultValueWithManager.request}
    showSpecial={false}
  />
);
