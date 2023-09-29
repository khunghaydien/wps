import values from 'lodash/values';

import { ACTIONS_FOR_FIX } from '@attendance/domain/models/AttFixSummaryRequest';

import actionLabel from '../actionLabel';

it('return string', () => {
  values(ACTIONS_FOR_FIX).forEach((type) => {
    expect(actionLabel(type)).not.toBeNull();
  });
});
