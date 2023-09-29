import {
  Summary,
  SUMMARY_NAME,
} from '@attendance/domain/models/BaseAttendanceSummary';

import { toGroup } from '../summaries';

describe('toGroup', () => {
  it('should do', () => {
    // Arrange
    const summaries: Summary[] = [
      {
        name: SUMMARY_NAME.DAYS_SUMMARY,
        items: [],
      },
      {
        name: SUMMARY_NAME.OVER_TIME_SUMMARY1,
        items: [],
      },
      {
        name: SUMMARY_NAME.ANNUAL_PAID_LEAVE_SUMMARY,
        items: [],
      },
    ];

    // Act
    const result = toGroup(summaries);

    // Assert
    expect(Array.from(result.keys())).toEqual(['left', 'center', 'right']);
    expect(result.get('left')).toHaveLength(1);
    expect(result.get('center')).toHaveLength(1);
    expect(result.get('right')).toHaveLength(1);
    expect(result.get('left')[0].name).toEqual(SUMMARY_NAME.DAYS_SUMMARY);
    expect(result.get('center')[0].name).toEqual(
      SUMMARY_NAME.OVER_TIME_SUMMARY1
    );
    expect(result.get('right')[0].name).toEqual(
      SUMMARY_NAME.ANNUAL_PAID_LEAVE_SUMMARY
    );
  });
  it('should do if summaries is []', () => {
    // Act
    const result = toGroup([]);

    // Assert
    expect(Array.from(result.keys())).toEqual(['left', 'center', 'right']);
    expect(result.get('left')).toHaveLength(0);
    expect(result.get('center')).toHaveLength(0);
    expect(result.get('right')).toHaveLength(0);
  });
});
