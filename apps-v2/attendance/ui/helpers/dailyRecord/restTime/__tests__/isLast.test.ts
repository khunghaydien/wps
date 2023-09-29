import { isLast, RestTimes } from '@attendance/domain/models/RestTime';

import helper from '../isLast';

jest.mock('@attendance/domain/models/RestTime', () => ({
  __esModules: true,
  isLast: jest.fn(() => jest.fn(() => true)),
}));

it('should call method', () => {
  const result = helper(
    'idx' as unknown as number,
    'restTimes' as unknown as RestTimes
  );
  expect(result).toBe(true);
  expect(isLast).toHaveBeenCalledWith('idx');
  expect((isLast as jest.Mock).mock.results[0].value).toHaveBeenCalledWith(
    'restTimes'
  );
});
