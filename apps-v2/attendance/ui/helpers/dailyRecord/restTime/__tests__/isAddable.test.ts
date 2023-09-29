import { isAddable, RestTimes } from '@attendance/domain/models/RestTime';

import helper from '../isAddable';

jest.mock('@attendance/domain/models/RestTime', () => ({
  __esModules: true,
  isAddable: jest.fn(() => jest.fn(() => jest.fn(() => true))),
}));

it('should call method', () => {
  const result = helper(
    'idx' as unknown as number,
    'restTimes' as unknown as RestTimes,
    'maxLength' as unknown as number
  );
  expect(result).toBe(true);
  expect(isAddable).toHaveBeenCalledWith('maxLength');
  expect((isAddable as jest.Mock).mock.results[0].value).toHaveBeenCalledWith(
    'idx'
  );
  expect(
    ((isAddable as jest.Mock).mock.results[0].value as jest.Mock).mock
      .results[0].value
  ).toHaveBeenCalledWith('restTimes');
});
