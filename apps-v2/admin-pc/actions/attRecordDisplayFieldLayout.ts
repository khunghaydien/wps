import * as base from './base';

const FUNC_NAME = 'att/record-display-field-layout';
export const SEARCH_RECORD_DISPLAY_FIELD_LAYOUT =
  'SEARCH_RECORD_DISPLAY_FIELD_LAYOUT';
export const SEARCH_RECORD_DISPLAY_FIELD_LAYOUT_ERROR =
  'SEARCH_RECORD_DISPLAY_FIELD_LAYOUT_ERROR';

export const searchRecordDisplayFieldLayout = (param = {}) => {
  return base.list(
    FUNC_NAME,
    param,
    SEARCH_RECORD_DISPLAY_FIELD_LAYOUT,
    SEARCH_RECORD_DISPLAY_FIELD_LAYOUT_ERROR
  );
};
