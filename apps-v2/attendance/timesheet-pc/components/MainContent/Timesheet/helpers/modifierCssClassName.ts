import classNames from 'classnames';

import { TimesheetViewType } from '../TimesheetViewType';

export default (
  baseName: string,
  type: TimesheetViewType,
  {
    useFixDailyRequest,
  }: {
    useFixDailyRequest: boolean;
  } = {
    useFixDailyRequest: false,
  }
) =>
  classNames(`${baseName}--${type}`, {
    [`${baseName}--use-fix-daily-request`]: useFixDailyRequest,
  });
