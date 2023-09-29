import * as LeaveRange from '../LeaveRange';

describe('sort()', () => {
  it('should return null', () => {
    expect(LeaveRange.sort(null)).toEqual(null);
  });
  it('should sort one to true order', () => {
    expect(LeaveRange.sort([LeaveRange.LEAVE_RANGE.AM])).toEqual([
      LeaveRange.LEAVE_RANGE.AM,
    ]);
  });
  it('should sort all to true order', () => {
    expect(
      LeaveRange.sort([
        LeaveRange.LEAVE_RANGE.AM,
        LeaveRange.LEAVE_RANGE.Day,
        LeaveRange.LEAVE_RANGE.Half,
        LeaveRange.LEAVE_RANGE.PM,
        LeaveRange.LEAVE_RANGE.Time,
      ])
    ).toEqual(LeaveRange.ORDER_OF_RANGE_TYPES);
  });
});
