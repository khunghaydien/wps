import Api from '../../commons/api';

export const LIMIT_NUMBER = 100;

export type User = {
  userName: string;
  profileId: string;
  profile: {
    name: string;
  };
  name: string;
  id: string;
};

// eslint-disable-next-line import/prefer-default-export
export const search = (param: {
  name: string;
  userName: string;
}): Promise<User[]> => {
  return Api.invoke({
    path: '/user/search',
    param: {
      ...param,
      limitNumber: LIMIT_NUMBER + 1,
    },
  }).then((result: { records: Array<User> }) => {
    return result.records;
  });
};
