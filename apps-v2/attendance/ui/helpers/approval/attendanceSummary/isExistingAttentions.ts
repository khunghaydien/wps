import { FixDailyRequest } from '@attendance/domain/models/approval/FixDailyRequest';

export default ({
  attention,
}: {
  attention: FixDailyRequest['attention'];
}): boolean => Object.values(attention).some((v) => v > 0);
