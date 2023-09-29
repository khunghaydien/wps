import Api from '@apps/commons/api';

import {
  IRestTimeReasonRepository,
  RestTimeReason,
} from '@attendance/domain/models/RestTimeReason';

export type Response = {
  restReasons: RestTimeReason[];
};

const fetchList: IRestTimeReasonRepository['fetchList'] = async ({
  employeeId,
  targetDate,
}): Promise<RestTimeReason[]> => {
  const response: Response = await Api.invoke({
    path: '/att/daily-rest/list',
    param: {
      empId: employeeId,
      targetDate,
    },
  });
  return response.restReasons;
};

export default fetchList;
