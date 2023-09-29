import * as base from '@admin-pc/actions/base';

const FUNC_NAME = 'exp/print-page/layout';
export const SEARCH_PRINT_PAGE_LAYOUT = 'SEARCH_PRINT_PAGE_LAYOUT';
export const SEARCH_PRINT_PAGE_LAYOUT_ERROR = 'SEARCH_PRINT_PAGE_LAYOUT_ERROR';

interface ISearchPrintPageLayoutRequestParam {
  active?: boolean;
}

export const searchPrintPageLayout = (
  customParams: ISearchPrintPageLayoutRequestParam
) => {
  const defaultParams = {
    active: true,
  };

  const params = {
    ...defaultParams,
    ...customParams,
  };

  return base.search(
    FUNC_NAME,
    params,
    SEARCH_PRINT_PAGE_LAYOUT,
    SEARCH_PRINT_PAGE_LAYOUT_ERROR
  );
};
