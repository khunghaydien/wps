export type FieldType = Readonly<{
  FIELD_NONE: 17;
  FIELD_HIDDEN: 1;
  FIELD_TEXT: 2;
  FIELD_TEXTAREA: 3;
  FIELD_SELECT: 4;
  FIELD_DATE: 5;
  FIELD_CHECKBOX: 6;
  FIELD_USER_NAME: 7;
  FIELD_VALID_DATE: 8;
  FIELD_TIME: 9;
  FIELD_TIME_START_END: 10;
  FIELD_SELECT_WITH_PLACEHOLDER: 11;
  FIELD_NUMBER: 13;
  FIELD_RADIO: 14;
  FIELD_CUSTOM: 15;
  FIELD_AUTOSUGGEST_TEXT: 16;
}>;

const fieldType: FieldType = {
  FIELD_NONE: 17,
  FIELD_HIDDEN: 1,
  FIELD_TEXT: 2,
  FIELD_TEXTAREA: 3,
  FIELD_SELECT: 4,
  FIELD_DATE: 5,
  FIELD_CHECKBOX: 6,
  FIELD_USER_NAME: 7,
  FIELD_VALID_DATE: 8,
  FIELD_TIME: 9,
  FIELD_TIME_START_END: 10,
  FIELD_SELECT_WITH_PLACEHOLDER: 11,
  FIELD_NUMBER: 13,
  FIELD_RADIO: 14,
  FIELD_CUSTOM: 15,
  FIELD_AUTOSUGGEST_TEXT: 16,
};

export default fieldType;
