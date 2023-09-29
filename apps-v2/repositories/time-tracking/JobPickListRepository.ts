import Api from '@apps/commons/api';

import { JobPickListItem } from '@apps/domain/models/time-tracking/Job';

export default {
  getJobPickList: (targetDate: string): Promise<JobPickListItem[]> =>
    Api.invoke({
      path: '/planner/job-picklist/get',
      param: { targetDate },
    }).then((result) => {
      return result.activeJobList;
    }),
};
