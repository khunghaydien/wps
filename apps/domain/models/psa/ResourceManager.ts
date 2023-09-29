import Api from '../../../commons/api';

export type ResourceManager = {
  employeeCode: string;
  employeeId: string;
  employeeName: string;
  type: string;
};

export type ResourceManagerList = Array<ResourceManager>;

export const initialStateResourceManagerList = [];

export const getResourceManagerListByProjectManagerId = (
  projectManagerId: string
): Promise<ResourceManagerList> => {
  return Api.invoke({
    path: '/psa/group/get-manager',
    param: {
      id: projectManagerId,
    },
  }).then((response: ResourceManagerList) => response);
};
