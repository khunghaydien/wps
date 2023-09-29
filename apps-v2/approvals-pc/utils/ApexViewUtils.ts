import UrlUtil from '@apps/commons/utils/UrlUtil';

import { tabType as TABS } from '../modules/ui/tabs';

export const getApexViewParams = () => {
  const urlParams = UrlUtil.getUrlQuery();

  const tab = (() => {
    if (urlParams?.tab) {
      return urlParams.tab;
    }

    switch (urlParams?.type) {
      case 'exp':
        return TABS.EXPENSES;
      case 'req':
        return TABS.EXP_PRE_APPROVAL;
      case 'CR':
        return TABS.CUSTOM_REQUEST;
      // case 'time':
      //   return TABS.TRACKING;
      // case 'attFixD':
      //   return TABS.ATT_FIX_DAILY;
      // case 'attDaily':
      //   return TABS.ATT_DAILY;
      // case 'attFixM':
      //   return TABS.ATT_FIX_MONTHLY;
      default:
        return '';
    }
  })();

  // TODO keep only one id after modify email template
  const requestId = urlParams?.requestId || urlParams?.id || '';
  const recordTypeId = urlParams?.recordTypeId ?? '';

  return { tab, requestId, recordTypeId };
};
