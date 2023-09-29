import Api from '../../../commons/api';

export type Delegator = {
  id: string;
  code: string;
  department: {
    code?: string;
    name?: string;
  };
  name: string;
  photoUrl: string;
  title?: string;
};

export type Delegators = Array<Delegator>;

// eslint-disable-next-line import/prefer-default-export
export const getDelegatorList = (
  empBaseId: string,
  delegatedFor: string
): Promise<Delegators> => {
  return Api.invoke({
    path: '/delegated-application/delegator/list',
    param: {
      empBaseId,
      delegatedFor,
    },
  }).then((response) => {
    return response.delegators;
  });
};
