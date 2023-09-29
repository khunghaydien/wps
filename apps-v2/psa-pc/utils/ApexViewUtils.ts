import UrlUtil from '@apps/commons/utils/UrlUtil';

export const getApexViewParams = () => {
  const urlParams = UrlUtil.getUrlQuery();
  const projectId = urlParams?.projectId || '';
  const availabilityId = urlParams?.availabilityId || '';
  return { projectId, availabilityId };
};
