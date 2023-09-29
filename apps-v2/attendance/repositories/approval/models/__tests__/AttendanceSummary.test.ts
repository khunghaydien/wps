import snapshotDiff from 'snapshot-diff';

import { convert } from '../AttendanceSummary';
import { defaultValue } from './mocks/AttendanceSummary.mock';

it('should do', () => {
  // Act
  const result = convert(defaultValue);

  // Assert
  expect(snapshotDiff(defaultValue, result)).toMatchSnapshot();
});
