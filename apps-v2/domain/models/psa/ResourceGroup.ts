import Api from '@apps/commons/api';
/**
 * ResourceGroup represent PM List or RM List
 */
export type ResourceGroup = {
  code: string;
  companyId: string;
  id: string;
  name: string;
  parentName: string | null;
};
/**
 * Resource group used for resource screen filter
 */
export type RMResourceGroup = {
  code: string;
  companyId: string;
  id: string;
  isOwned?: boolean;
  members?: Array<any>;
  name: string;
  owners?: Array<any>;
  parentName: string | null;
};

export type RMResourceGroupArray = Array<RMResourceGroup>;

export type ResourceGroupSearchQuery = {
  companyId: string | null;
  types: Array<string> | null;
};
export const initialResourceGroupList = [];

export type ResourceGroupList = Array<ResourceGroup>;

export const getResourceGroupList = (
  companyId: string,
  ownerId?: string
): Promise<ResourceGroupList> => {
  return Api.invoke({
    path: '/psa/group/resource-group/list',
    param: { companyId, ownerId },
  }).then((response: ResourceGroupList) => response);
};
