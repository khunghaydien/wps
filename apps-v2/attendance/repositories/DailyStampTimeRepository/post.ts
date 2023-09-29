import Api from '@apps/commons/api';

import { IDailyStampTimeRepository } from '@attendance/domain/models/DailyStampTime';

const post: IDailyStampTimeRepository['post'] = (param) => {
  return Api.invoke({
    path: '/att/daily-time/stamp',
    param: {
      clockType: param.clockType,
      source: param.source,
      comment: param.comment || '',
      ...(param.location ? param.location : {}),
      ...(param.commuteCount
        ? {
            commuteForwardCount: param.commuteCount.forwardCount,
            commuteBackwardCount: param.commuteCount.backwardCount,
          }
        : {}),
    },
  });
};

export default post;
