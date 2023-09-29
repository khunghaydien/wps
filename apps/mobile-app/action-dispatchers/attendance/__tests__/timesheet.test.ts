import snapshotDiff from 'snapshot-diff';

import dummyTimesheet from '../../../../repositories/__tests__/mocks/response/timesheet-get--fixed-time';

import ApiMock from '../../../../../__tests__/mocks/ApiMock';
import * as actions from '../timesheet';

describe('loading', () => {
  it('should execute', async () => {
    // Arrange
    ApiMock.invoke.mockResolvedValueOnce(dummyTimesheet);

    // Act
    const result = await actions.loadTimesheet(`2020-10-15`);

    // Assert
    expect(snapshotDiff(result, dummyTimesheet)).toMatchSnapshot();
  });
});
