import UrlUtil from '@apps/commons/utils/UrlUtil';

import { TABS } from '../modules/ui/FinanceApproval/tabs';

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
        return TABS.REQUESTS;
      default:
        return '';
    }
  })();

  // TODO keep only one id after modify email template
  const requestId = urlParams?.id || '';

  return { tab, requestId };
};
