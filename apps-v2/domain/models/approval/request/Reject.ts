import _ from 'lodash';

import Api from '../../../../commons/api';

/* eslint-disable import/prefer-default-export */
export const reject = (
  requestIdList: Array<string>,
  comment: string
): Promise<null> => {
  return Api.invoke({
    path: '/approval/request/reject',
    param: {
      requestIdList,
      comment,
    },
  }).then((res: any) => res);
};
