import { parseIntOrNull } from '../../../commons/utils/NumberUtil';

export type TimeRange = {
  startTime: number | null;
  endTime: number | null;
};

export const create = <T extends Partial<TimeRange>>(
  timeRange?: T
): TimeRange => ({
  startTime: timeRange?.startTime ?? null,
  endTime: timeRange?.endTime ?? null,
});

export const convert = (
  timeRange: {
    startTime: any;
    endTime: any;
  } = {
    startTime: null,
    endTime: null,
  }
): TimeRange => ({
  startTime: parseIntOrNull(timeRange.startTime),
  endTime: parseIntOrNull(timeRange.endTime),
});

export const hasTimes = (timeRange: TimeRange) =>
  timeRange.startTime !== null || timeRange.endTime !== null;
