import * as LeaveRequest from '@attendance/domain/models/AttDailyRequest/LeaveRequest';

import Factory from '../ForReadOnly';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('convertForReadOnly', () => {
  it('should execute', async () => {
    const result = Factory().create({} as unknown as LeaveRequest.LeaveRequest);
    expect(result).toEqual({});
  });
});
