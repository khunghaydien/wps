import Api from '../../../commons/api';

import {
  ILateArrivalReasonRepository,
  LateArrivalReason as DomainLateArrivalReason,
} from '@attendance/domain/models/LateArrivalReason';

type Response = Readonly<{
  lateArrivalReasons: DomainLateArrivalReason[];
}>;

const fetchList: ILateArrivalReasonRepository['fetchList'] = async ({
  targetDate,
  employeeId,
}) => {
  const response: Response = await Api.invoke({
    path: '/att/daily-late-arrival-reason/list',
    param: { targetDate, empId: employeeId },
  });
  return response.lateArrivalReasons;
};

export default fetchList;
