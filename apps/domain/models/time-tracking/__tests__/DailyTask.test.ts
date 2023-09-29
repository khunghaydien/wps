import STATUS from '../../approval/request/Status';
import { canEditTask } from '../DailyTask';

describe('domain/models/time-tracking/DailyTask', () => {
  describe('canEditTask', () => {
    it('should return false when Status is Approved.', () => {
      expect(canEditTask(STATUS.Approved)).toBeFalsy();
    });
    it('should return false when Status is Pending.', () => {
      expect(canEditTask(STATUS.Pending)).toBeFalsy();
    });
    it('should return true when Status is other than Approved and Pending.', () => {
      expect(canEditTask(STATUS.NotRequested)).toBeTruthy();
    });
  });
});
