import { AttendanceSummary } from '@attendance/domain/models/AttendanceSummary';

export const colSpanNumber = (
  workingType: AttendanceSummary['workingType'],
  colSpanDefaultNumber: number
): number =>
  Object.keys(workingType)
    .filter((name) => name !== 'useRestReason')
    .reduce(
      (prev, name) => (workingType[name] ? prev + 1 : prev),
      colSpanDefaultNumber
    );
