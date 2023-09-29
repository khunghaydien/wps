import * as base from './base';

const FUNC_NAME = 'extended-item-custom';
export const SEARCH_EXTENDED_ITEM_CUSTOM = 'SEARCH_EXTENDED_ITEM_CUSTOM';
export const SEARCH_EXTENDED_ITEM_CUSTOM_ERROR =
  'SEARCH_EXTENDED_ITEM_CUSTOM_ERROR';

export const searchExtendedItemCustom = (param = {}) => {
  return base.search(
    FUNC_NAME,
    param,
    SEARCH_EXTENDED_ITEM_CUSTOM,
    SEARCH_EXTENDED_ITEM_CUSTOM_ERROR
  );
};
