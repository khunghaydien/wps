import isNumber from 'lodash/fp/isNumber';

import * as DomainCommuteCount from '@attendance/domain/models/CommuteCount';

export const convert = ({
  commuteForwardCount,
  commuteBackwardCount,
}: {
  commuteForwardCount: number;
  commuteBackwardCount: number;
}): DomainCommuteCount.CommuteCount => {
  if (commuteForwardCount === null && commuteBackwardCount === null) {
    return {
      forwardCount: null,
      backwardCount: null,
    };
  } else if (isNumber(commuteForwardCount) && isNumber(commuteBackwardCount)) {
    return {
      forwardCount: commuteForwardCount,
      backwardCount: commuteBackwardCount,
    };
  } else {
    return null;
  }
};
