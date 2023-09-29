import Api from '@apps/commons/api';

export type clientSearchQuery = {
  name: string;
  recordsLimit?: number;
  searchEmptyName?: boolean;
};

export type Client = {
  id: string;
  name: string;
  code: string;
};

export type ClientList = Array<Client>;

export type ClientResponse = {
  records: ClientList;
};
export const initialClientList = [];

export const getClientList = (param: clientSearchQuery): Promise<any> => {
  return Api.invoke({
    path: '/account/list/min',
    param,
  }).then((response: any) => response);
};
