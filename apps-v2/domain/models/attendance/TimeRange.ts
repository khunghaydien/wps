import { parseIntOrNull } from '../../../commons/utils/NumberUtil';

export type TimeRange = {
  startTime: number | null;
  endTime: number | null;
};

export const create = (
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
