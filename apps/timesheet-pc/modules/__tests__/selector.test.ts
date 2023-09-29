import DailyRequestConditions from '../../models/DailyRequestConditions';

import dummyState from '../../__tests__/mocks/state/normal';
import * as selectors from '../selectors';

describe('timesheet-pc/modules/entities/selector', () => {
  describe('buildDailyRequestConditionMap(state)', () => {
    const result = selectors.buildDailyRequestConditionMap(dummyState);

    describe('返却値', () => {
      test('日付をキーに持つマップであること', () => {
        expect(Object.keys(result)[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });

      test('マップの内容は、DailyRequestConditions型であること', () => {
        expect(result['2017-07-01']).toBeInstanceOf(DailyRequestConditions);
      });
    });
  });
});
