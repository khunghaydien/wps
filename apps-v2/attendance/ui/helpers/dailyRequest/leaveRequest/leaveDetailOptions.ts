import msg from '@commons/languages';

import * as LeaveRequest from '@attendance/domain/models/AttDailyRequest/LeaveRequest';

export default (request: LeaveRequest.LeaveRequest) => {
  const selectedLeave = LeaveRequest.getLeave(request);
  if (!selectedLeave || !selectedLeave.details || !selectedLeave.details.size) {
    return;
  }
  return [
    { label: msg().Com_Lbl_None, value: null },
    ...(Array.from(selectedLeave.details.values() || []).map((leaveDetail) => ({
      label: leaveDetail.name,
      value: leaveDetail.code,
    })) || []),
  ];
};
