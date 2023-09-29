import { ResourceGroupList } from '@apps/domain/models/psa/ResourceGroup';

export const formatGroupList = (resourceGroupList: ResourceGroupList) => {
  return resourceGroupList && resourceGroupList.length > 0
    ? resourceGroupList.map((group) => ({
        code: group.code,
        value: group.id,
        name: group.name,
        text: `${group.name} - ${group.code}`,
      }))
    : resourceGroupList;
};
