import Api from '../../../commons/api';

import { IEarlyLeaveReasonRepository } from '@attendance/domain/models/EarlyLeaveReason';

type Response = Readonly<{
  earlyLeaveReasons: {
    id: string; // 早退理由id
    code: string; // 早退理由コード
    name: string; // 早退理由名
    earlyLeaveEndTime: number | null; // 終了時間
  }[];
}>;

const fetchList: IEarlyLeaveReasonRepository['fetchList'] = async ({
  targetDate,
  employeeId,
}) => {
  const response: Response = await Api.invoke({
    path: '/att/daily-early-leave-reason/list',
    param: { targetDate, empId: employeeId },
  });
  return response.earlyLeaveReasons;
};

export default fetchList;
