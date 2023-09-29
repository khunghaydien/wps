import * as HolidayWorkRequest from '@attendance/domain/models/AttDailyRequest/HolidayWorkRequest';
import { IAttPatternRepository } from '@attendance/domain/models/AttPattern';
import { WorkingType } from '@attendance/domain/models/WorkingType';

export default ({
    AttPatternRepository,
  }: {
    AttPatternRepository: IAttPatternRepository;
  }) =>
  (workingType: WorkingType) =>
  async ({
    employeeId,
    ignoredId,
    targetDate,
  }: {
    employeeId?: string;
    ignoredId?: string;
    targetDate?: string;
  }) => {
    const attPatterns = workingType?.useHolidayWorkPatternApply
      ? (
          await AttPatternRepository.fetch({
            employeeId,
            ignoredId,
            targetDate,
          })
        )?.patterns || []
      : [];
    return (request: HolidayWorkRequest.HolidayWorkRequest) => ({
      ...request,
      patterns: attPatterns,
    });
  };
