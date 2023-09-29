import DISPLAY_TYPE, { DisplayType } from '../../constants/displayType';
import FIELD_TYPE from '../../constants/fieldType';

import * as ConfigUtil from '../ConfigUtil';

// Arrange
const valueGatter = (key: string) => key === 'true';

describe('admin-pc/utils/ConfigUtil', () => {
  describe('flattern', () => {
    test('single', () => {
      // Arrange
      const configList: any = [
        {
          key: 'key1',
          type: FIELD_TYPE.FIELD_HIDDEN,
        },
        {
          section: 'section1',
          configList: [
            {
              key: 'key2',
              type: FIELD_TYPE.FIELD_HIDDEN,
            },
            {
              key: 'key3',
              type: FIELD_TYPE.FIELD_HIDDEN,
            },
            {
              section: 'section2',
              configList: [
                {
                  key: 'key4',
                  type: FIELD_TYPE.FIELD_HIDDEN,
                },
              ],
            },
          ],
        },
        {
          section: 'section3',
        },
        {
          key: 'key5',
          type: FIELD_TYPE.FIELD_HIDDEN,
        },
      ];

      const expected = [
        {
          key: 'key1',
          type: FIELD_TYPE.FIELD_HIDDEN,
        },
        {
          key: 'key2',
          type: FIELD_TYPE.FIELD_HIDDEN,
        },
        {
          key: 'key3',
          type: FIELD_TYPE.FIELD_HIDDEN,
        },
        {
          key: 'key4',
          type: FIELD_TYPE.FIELD_HIDDEN,
        },
        {
          key: 'key5',
          type: FIELD_TYPE.FIELD_HIDDEN,
        },
      ];

      // Run
      const result = ConfigUtil.flatten(configList);

      // Assert
      expect(result).toEqual(expected);
    });

    test('multiple', () => {
      // Arrange
      const configList1: any = [
        {
          key: 'key1',
          type: FIELD_TYPE.FIELD_HIDDEN,
        },
        {
          section: 'section1',
          configList: [
            {
              key: 'key2',
              type: FIELD_TYPE.FIELD_HIDDEN,
            },
          ],
        },
      ];
      const configList2: any = [
        {
          key: 'key3',
          type: FIELD_TYPE.FIELD_HIDDEN,
        },
        {
          section: 'section2',
          configList: [
            {
              key: 'key4',
              type: FIELD_TYPE.FIELD_HIDDEN,
            },
          ],
        },
      ];
      const expected = [
        {
          key: 'key1',
          type: FIELD_TYPE.FIELD_HIDDEN,
        },
        {
          key: 'key2',
          type: FIELD_TYPE.FIELD_HIDDEN,
        },
        {
          key: 'key3',
          type: FIELD_TYPE.FIELD_HIDDEN,
        },
        {
          key: 'key4',
          type: FIELD_TYPE.FIELD_HIDDEN,
        },
      ];

      // Run
      const result = ConfigUtil.flatten(configList1, configList2);

      // Assert
      expect(result).toEqual(expected);
    });
  });

  describe('isSatisfiedCondition', () => {
    test('had condition and return true', () => {
      // Arrange
      const config: any = {
        key: 'key1',
        type: FIELD_TYPE.FIELD_HIDDEN,
        condition: (baseValueGatter, historyValueGetter) =>
          baseValueGatter('true') && historyValueGetter('true'),
      };

      // Run
      const result = ConfigUtil.isSatisfiedCondition(
        config,
        valueGatter,
        valueGatter
      );

      // Assert
      expect(result).toEqual(true);
    });

    test('had condition and return false', () => {
      // Arrange
      const config: any = {
        key: 'key1',
        type: FIELD_TYPE.FIELD_HIDDEN,
        condition: (baseValueGatter, historyValueGetter) =>
          baseValueGatter('false') && historyValueGetter('false'),
      };

      // Run
      const result = ConfigUtil.isSatisfiedCondition(
        config,
        valueGatter,
        valueGatter
      );

      // Assert
      expect(result).toEqual(false);
    });

    test("don't had condition", () => {
      // Arrange
      const config: any = {
        key: 'key1',
        type: FIELD_TYPE.FIELD_HIDDEN,
      };

      // Run
      const result = ConfigUtil.isSatisfiedCondition(
        config,
        valueGatter,
        valueGatter
      );

      // Assert
      expect(result).toEqual(true);
    });
  });

  describe('isAllowedFunction', () => {
    test('empty', () => {
      expect(
        ConfigUtil.isAllowedFunction(
          {
            // @ts-ignore
            key: 'key1',
            type: FIELD_TYPE.FIELD_HIDDEN,
          },
          {
            useAttendance: true,
          }
        )
      ).toEqual(true);
    });

    test('has use function and has permisson', () => {
      expect(
        ConfigUtil.isAllowedFunction(
          {
            // @ts-ignore
            key: 'key1',
            type: FIELD_TYPE.FIELD_HIDDEN,
            useFunction: 'useAttendance',
          },
          {
            useAttendance: true,
          }
        )
      ).toEqual(true);
    });

    test("has use function and don't has permission", () => {
      expect(
        ConfigUtil.isAllowedFunction(
          {
            // @ts-ignore
            key: 'key1',
            type: FIELD_TYPE.FIELD_HIDDEN,
            useFunction: 'useAttendance',
          },
          {
            useAttendance: false,
          }
        )
      ).toEqual(false);
    });

    test('has use function and empty permission', () => {
      expect(
        ConfigUtil.isAllowedFunction(
          {
            // @ts-ignore
            key: 'key1',
            type: FIELD_TYPE.FIELD_HIDDEN,
            useFunction: 'useAttendance',
          },
          {}
        )
      ).toEqual(false);
    });
  });

  describe('isDisplayDetail', () => {
    test("don't has displayType", () => {
      expect(
        ConfigUtil.isDisplayDetail({
          key: 'key1',
          type: FIELD_TYPE.FIELD_HIDDEN,
        })
      ).toEqual(true);
    });
    test.each([
      ['DISPLAY_DETAIL', true],
      ['DISPLAY_LIST', false],
      ['DISPLAY_BOTH', true],
    ] as [keyof DisplayType, boolean][])(
      `%s: %p`,
      (key: keyof DisplayType, result: boolean) => {
        expect(
          ConfigUtil.isDisplayDetail({
            key: 'key1',
            type: FIELD_TYPE.FIELD_HIDDEN,
            display: DISPLAY_TYPE[key],
          })
        ).toEqual(result);
      }
    );
  });

  describe('isDisplayList', () => {
    test("don't has displayType", () => {
      expect(
        ConfigUtil.isDisplayList({
          key: 'key1',
          type: FIELD_TYPE.FIELD_HIDDEN,
        })
      ).toEqual(false);
    });
    test.each([
      ['DISPLAY_DETAIL', false],
      ['DISPLAY_LIST', true],
      ['DISPLAY_BOTH', true],
    ] as [keyof DisplayType, boolean][])(
      `%s: %p`,
      (key: keyof DisplayType, result: boolean) => {
        expect(
          ConfigUtil.isDisplayList({
            key: 'key1',
            type: FIELD_TYPE.FIELD_HIDDEN,
            display: DISPLAY_TYPE[key],
          })
        ).toEqual(result);
      }
    );
  });

  describe('checkCharType', () => {
    describe('has not charType', () => {
      test.each([undefined, false, null, '0', 0, '', 'abc'])('%p', (value) => {
        expect(
          ConfigUtil.checkCharType(
            {
              key: 'key1',
              type: FIELD_TYPE.FIELD_HIDDEN,
            },
            value
          )
        ).toEqual(true);
      });
    });

    describe.each([
      [
        'numeric',
        {
          false: [undefined, false, null, '', 'abc', '0', '123'],
          true: [0, 123],
        },
      ],
    ])('charType is %s', (charType, testTable) => {
      describe('return false', () => {
        test.each(testTable.false)('%p', (value) => {
          expect(
            ConfigUtil.checkCharType(
              {
                key: 'key1',
                type: FIELD_TYPE.FIELD_HIDDEN,
                charType,
              },
              value
            )
          ).toEqual(false);
        });
      });
      describe('return true', () => {
        test.each(testTable.true)('%p', (value) => {
          expect(
            ConfigUtil.checkCharType(
              {
                key: 'key1',
                type: FIELD_TYPE.FIELD_HIDDEN,
                charType,
              },
              value
            )
          ).toEqual(true);
        });
      });
    });
  });

  describe('getDefaultValue()', () => {
    const sfObjFieldValues = {
      props: [
        {
          value: 'prop1',
        },
        {
          value: 'prop2',
        },
        {
          value: 'prop3',
        },
      ],
    };
    const options = [
      {
        value: 'option1',
      },
      {
        value: 'option2',
      },
      {
        value: 'option3',
      },
    ];
    test('config has defaultValue', () => {
      expect(
        ConfigUtil.getDefaultValue(
          {
            key: 'key',
            type: FIELD_TYPE.FIELD_NONE,
            defaultValue: 'default',
          },
          sfObjFieldValues
        )
      ).toEqual('default');
    });
    test('type is not FIELD_SELECT', () => {
      expect(
        ConfigUtil.getDefaultValue(
          {
            key: 'key',
            type: FIELD_TYPE.FIELD_NONE,
          },
          sfObjFieldValues
        )
      ).toEqual('');
    });
    describe('type is FIELD_SELECT', () => {
      test.each([
        [
          {
            key: 'key',
            type: FIELD_TYPE.FIELD_SELECT,
          },
          '',
        ],
        [
          {
            key: 'key',
            type: FIELD_TYPE.FIELD_SELECT,
            multiple: true,
          },
          [],
        ],
        [
          {
            key: 'key',
            type: FIELD_TYPE.FIELD_SELECT,
            isRequired: true,
            multiple: true,
          },
          [],
        ],
        [
          {
            key: 'key',
            type: FIELD_TYPE.FIELD_SELECT,
            props: 'props',
            isRequired: true,
            multiple: true,
          },
          [],
        ],
        [
          {
            key: 'key',
            type: FIELD_TYPE.FIELD_SELECT,
            props: 'props',
          },
          '',
        ],
        [
          {
            key: 'key',
            type: FIELD_TYPE.FIELD_SELECT,
            props: 'props',
            isRequired: true,
          },
          'prop1',
        ],
        [
          {
            key: 'key',
            type: FIELD_TYPE.FIELD_SELECT,
            options,
          },
          '',
        ],
        [
          {
            key: 'key',
            type: FIELD_TYPE.FIELD_SELECT,
            isRequired: true,
            options,
          },
          'option1',
        ],
        [
          {
            key: 'key',
            type: FIELD_TYPE.FIELD_SELECT,
            isRequired: true,
            props: 'props',
            options,
          },
          'prop1',
        ],
        [
          {
            key: 'key',
            type: FIELD_TYPE.FIELD_SELECT,
            isRequired: true,
            defaultValue: 'default',
            props: 'props',
            options,
          },
          'default',
        ],
      ] as [ConfigUtil.Config, any][])(
        `config = %p, result = %p`,
        (config, result) => {
          expect(ConfigUtil.getDefaultValue(config, sfObjFieldValues)).toEqual(
            result
          );
        }
      );
    });
  });
});
