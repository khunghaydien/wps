import { isDeletable, RestTimes } from '@attendance/domain/models/RestTime';

import helper from '../isDeletable';

jest.mock('@attendance/domain/models/RestTime', () => ({
  __esModules: true,
  isDeletable: jest.fn(() => jest.fn(() => true)),
}));

it('should call method', () => {
  const result = helper(
    'idx' as unknown as number,
    'restTimes' as unknown as RestTimes
  );
  expect(result).toBe(true);
  expect(isDeletable).toHaveBeenCalledWith('idx');
  expect((isDeletable as jest.Mock).mock.results[0].value).toHaveBeenCalledWith(
    'restTimes'
  );
});
