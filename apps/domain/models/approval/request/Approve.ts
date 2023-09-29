import _ from 'lodash';

import Api from '../../../../commons/api';

/* eslint-disable import/prefer-default-export */
export const approve = (
  requestIdList: Array<string>,
  comment: string
): Promise<null> => {
  return Api.invoke({
    path: '/approval/request/approve',
    param: {
      requestIdList,
      comment,
    },
  }).then((res: any) => res);
};
