import fieldType from '../../constants/fieldType';

const {
  FIELD_HIDDEN,
  FIELD_TEXT,
  FIELD_TEXTAREA,
  FIELD_SELECT,
  FIELD_DATE,
  FIELD_CHECKBOX,
  FIELD_USER_NAME,
  FIELD_VALID_DATE,
  FIELD_TIME,
  FIELD_TIME_START_END,
  FIELD_SELECT_WITH_PLACEHOLDER,
  FIELD_NUMBER,
  FIELD_RADIO,
} = fieldType;

export const getFieldTypeName = (type) => Object.keys(fieldType)[type - 1];

export const configList = {
  base: [
    {
      key: 'test1',
      type: FIELD_HIDDEN,
    },
    {
      key: 'test2',
      type: FIELD_TEXT,
    },
    {
      key: 'test3',
      type: FIELD_TEXTAREA,
    },
    {
      key: 'test4',
      type: FIELD_SELECT,
    },
    {
      key: 'test5',
      type: FIELD_DATE,
    },
    {
      key: 'test6',
      type: FIELD_CHECKBOX,
    },
    {
      key: 'test7',
      type: FIELD_USER_NAME,
    },
    {
      key: 'test8',
      type: FIELD_VALID_DATE,
    },
    {
      key: 'test9',
      type: FIELD_TIME,
    },
    {
      key: 'test10',
      type: FIELD_TIME_START_END,
    },
    {
      key: 'test11',
      type: FIELD_SELECT_WITH_PLACEHOLDER,
    },
    {
      key: 'test13',
      type: FIELD_NUMBER,
    },
    {
      key: 'test14',
      type: FIELD_RADIO,
    },
  ],
};

export const mandatoryConfigList = {
  base: configList.base.map((x) => ({ ...x, isRequired: true })),
};

export const conditionalConfigList = {
  base: [
    {
      key: 'condition',
      type: FIELD_DATE,
      isRequired: true,
      condition: (_x, _y) => true,
    },
  ],
};

export const invalidConditionalConfigList = {
  base: [
    {
      key: 'condition',
      type: FIELD_DATE,
      isRequired: true,
      condition: 'AAAA',
    },
  ],
};

export const emptyRecord = configList.base.reduce(
  (acc, config) => ({
    ...acc,
    [config.key]: '',
  }),
  {}
);

export const record = configList.base.reduce(
  (acc, config) => ({
    ...acc,
    [config.key]: 'ANY VALUE',
  }),
  {}
);
