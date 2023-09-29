import DISPLAY_TYPE from '../../constants/displayType';
import FIELD_TYPE from '../../constants/fieldType';

import * as ConfigUtil from '../ConfigUtil';
import * as RecordUtil from '../RecordUtil';

describe('admin-pc/utils/RecordUtil', () => {
  describe('getter', () => {
    // Arrange
    const record = {
      key1: 'abc',
    };

    test('has value', () => {
      // Run
      const result = RecordUtil.getter(record)('key1');
      // Assert
      expect(result).toEqual('abc');
    });

    test("don't has value", () => {
      // Run
      const result = RecordUtil.getter(record)('key2');
      // Assert
      expect(result).toEqual(undefined);
    });
  });

  test('make', () => {
    // Arrange
    const configList: ConfigUtil.ConfigList = [
      {
        key: 'hidden',
        type: FIELD_TYPE.FIELD_HIDDEN,
      },
      {
        key: 'select',
        type: FIELD_TYPE.FIELD_SELECT,
        props: 'select',
      },
      {
        key: 'select-is-required',
        type: FIELD_TYPE.FIELD_SELECT,
        props: 'select-is-required',
        isRequired: true,
      },
      {
        key: 'select-is-required-no-props',
        type: FIELD_TYPE.FIELD_SELECT,
        isRequired: true,
      },
      {
        key: 'select-is-required-has-not-values',
        type: FIELD_TYPE.FIELD_SELECT,
        props: 'select-is-required-has-not-values',
        isRequired: true,
      },
      {
        key: 'select-is-required-multiple',
        type: FIELD_TYPE.FIELD_SELECT,
        props: 'select-is-required-multiple',
        isRequired: true,
        multiple: true,
      },
      {
        key: 'select-multiple',
        type: FIELD_TYPE.FIELD_SELECT,
        props: 'select-multiple',
        multiple: true,
      },
      {
        key: 'select-is-required-multiple',
        type: FIELD_TYPE.FIELD_SELECT,
        props: 'select-is-required-multiple',
        isRequired: true,
        multiple: true,
      },
      {
        key: 'defaultValue-0',
        defaultValue: 0,
        type: FIELD_TYPE.FIELD_HIDDEN,
      },
      {
        key: 'defaultValue-null',
        defaultValue: null,
        type: FIELD_TYPE.FIELD_HIDDEN,
      },
      {
        key: 'defaultValue-false',
        defaultValue: false,
        type: FIELD_TYPE.FIELD_HIDDEN,
      },
      {
        key: 'defaultValue-string-null',
        defaultValue: '',
        type: FIELD_TYPE.FIELD_HIDDEN,
      },
      {
        section: 'section',
        configList: [
          {
            key: 'section',
            type: FIELD_TYPE.FIELD_HIDDEN,
            defaultValue: 'section-value',
          },
        ],
      },
    ];
    const sfObjFieldValues = {
      select: [{ value: 'abc' }, { value: 'def' }],
      'select-is-required': [{ value: 'ghi' }, { value: 'jkl' }],
      'select-is-required-no-props': [{ value: 'abc' }, { value: 'def' }],
      'select-is-required-multiple': [{ value: 'mno' }, { value: 'pqr' }],
      'select-multiple': [{ value: 'stu' }, { value: 'vwx' }],
    };
    const expected = {
      hidden: '',
      select: '',
      'select-is-required': 'ghi',
      'select-is-required-no-props': '',
      'select-is-required-has-not-values': '',
      'select-is-required-multiple': [],
      'select-multiple': [],
      'defaultValue-0': 0,
      'defaultValue-null': null,
      'defaultValue-false': false,
      'defaultValue-string-null': '',
      section: 'section-value',
    };

    // Run
    const result = RecordUtil.make(configList, sfObjFieldValues);

    // Assert
    expect(result).toEqual(expected);
  });

  describe('isValueForRemote', () => {
    test("don't has display and useFunction", () => {
      expect(
        RecordUtil.isValueForRemote(
          {
            key: 'key1',
            type: FIELD_TYPE.FIELD_HIDDEN,
          },
          {
            useAttendance: true,
          } // () => true,
          // () => true
        )
      ).toEqual(true);
    });
    test('has dispalyType and useFunction', () => {
      expect(
        RecordUtil.isValueForRemote(
          {
            key: 'key1',
            type: FIELD_TYPE.FIELD_HIDDEN,
            display: DISPLAY_TYPE.DISPLAY_DETAIL,
            useFunction: 'useAttendance',
          },
          {
            useAttendance: true,
          } // () => true,
          // () => true
        )
      ).toEqual(true);
    });
    test("has dispalyType and don't has permission", () => {
      expect(
        RecordUtil.isValueForRemote(
          {
            key: 'key1',
            type: FIELD_TYPE.FIELD_HIDDEN,
            display: DISPLAY_TYPE.DISPLAY_DETAIL,
            useFunction: 'useAttendance',
          },
          {
            useAttendance: false,
          } // () => true,
          // () => true
        )
      ).toEqual(false);
    });
    // test("has dispalyType and don't is satisfied condition", () => {
    //   expect(
    //     RecordUtil.isValueForRemote(
    //       {
    //         key: 'key1',
    //         type: FIELD_TYPE.FIELD_HIDDEN,
    //         display: DISPLAY_TYPE.DISPLAY_DETAIL,
    //         condition: () => false,
    //       },
    //       {},
    //       () => true,
    //       () => true
    //     )
    //   ).toEqual(false);
    // });
    test("isn't DISPLAY_DETAIL and has useFunction", () => {
      expect(
        RecordUtil.isValueForRemote(
          {
            key: 'key1',
            type: FIELD_TYPE.FIELD_HIDDEN,
            display: DISPLAY_TYPE.DISPLAY_LIST,
            useFunction: 'useAttendance',
          },
          {
            useAttendance: true,
          } // () => true,
          // () => true
        )
      ).toEqual(false);
    });
    test("isn't DISPLAY_DETAIL and is satisfied condition", () => {
      expect(
        RecordUtil.isValueForRemote(
          {
            key: 'key1',
            type: FIELD_TYPE.FIELD_HIDDEN,
            display: DISPLAY_TYPE.DISPLAY_LIST,
            condition: () => true,
          },
          {} // () => true,
          // () => true
        )
      ).toEqual(false);
    });
  });

  describe('getFirstInvalidConfig', () => {
    // Arrange
    const record = {
      isRequired: 'abc',
      hasPermission: true,
      hasCondition: 0,
      hasAll: 'def',
    };
    const functionTypeList = {
      useAttendance: true,
      useExpense: false,
    };
    describe('no invaild values', () => {
      test.each(['abc', '0', 0, true, false])('value: %p', (value) => {
        // Arrange
        const configList = [
          {
            key: 'value',
            type: FIELD_TYPE.FIELD_HIDDEN,
            isRequired: true,
          },
        ];

        // Run
        const result = RecordUtil.getFirstInvalidConfig(
          configList,
          { value },
          functionTypeList,
          () => true,
          () => true
        );

        // Assert
        expect(result).toEqual(null);
      });
    });

    describe('invaild values', () => {
      test.each(['', undefined, null])('value: %p', (value) => {
        // Arrange
        const config = {
          key: 'value',
          type: FIELD_TYPE.FIELD_HIDDEN,
          isRequired: true,
        };
        const configList = [config];

        // Run
        const result = RecordUtil.getFirstInvalidConfig(
          configList,
          { value },
          functionTypeList,
          () => true,
          () => true
        );

        // Assert
        expect(result).toEqual(config);
      });
    });

    describe('multiple values (FIELD_TYPE.FIELD_TIME_START_END), both invalid', () => {
      test.each(['', undefined, null])('value: %p', (value) => {
        // Arrange
        const config = {
          key: 'startTime',
          subkey: 'endTime',
          type: FIELD_TYPE.FIELD_TIME_START_END,
          isRequired: true,
        };
        const configList = [config];

        // Run
        const result = RecordUtil.getFirstInvalidConfig(
          configList,
          { startTime: value, endTime: value },
          functionTypeList,
          () => true,
          () => true
        );

        // Assert
        expect(result).toEqual(config);
      });
    });

    describe('multiple values (FIELD_TYPE.FIELD_TIME_START_END), the startTime invalid', () => {
      test.each(['', undefined, null])('value: %p', (value) => {
        // Arrange
        const config = {
          key: 'startTime',
          subkey: 'endTime',
          type: FIELD_TYPE.FIELD_TIME_START_END,
          isRequired: true,
        };
        const configList = [config];

        const endTimeValue = '440';

        // Run
        const result = RecordUtil.getFirstInvalidConfig(
          configList,
          { startTime: value, endTime: endTimeValue },
          functionTypeList,
          () => true,
          () => true
        );

        // Assert
        expect(result).toEqual(config);
      });
    });

    describe('multiple values (FIELD_TYPE.FIELD_TIME_START_END), the endTime invalid', () => {
      test.each(['', undefined, null])('value: %p', (value) => {
        // Arrange
        const config = {
          key: 'startTime',
          subkey: 'endTime',
          type: FIELD_TYPE.FIELD_TIME_START_END,
          isRequired: true,
        };
        const configList = [config];

        const startTimeValue = '440';

        // Run
        const result = RecordUtil.getFirstInvalidConfig(
          configList,
          { startTime: startTimeValue, endTime: value },
          functionTypeList,
          () => true,
          () => true
        );

        // Assert
        expect(result).toEqual(config);
      });
    });

    test('no invaild config', () => {
      // Arrange
      const configList = [
        {
          key: 'isNotRequred',
          type: FIELD_TYPE.FIELD_HIDDEN,
        },
        {
          key: 'isRequired',
          type: FIELD_TYPE.FIELD_HIDDEN,
          isRequired: true,
        },
        {
          key: 'hasPermission',
          type: FIELD_TYPE.FIELD_HIDDEN,
          isRequired: true,
          useFunction: 'useAttendance',
        },
        {
          key: 'hasCondition',
          type: FIELD_TYPE.FIELD_HIDDEN,
          isRequired: true,
          condition: (_, __) => true,
        },
        {
          section: 'section',
          configList: [
            {
              key: 'hasAll',
              type: FIELD_TYPE.FIELD_HIDDEN,
              isRequired: true,
              useFunction: 'useAttendance',
              condition: (_, __) => true,
            },
          ],
        },
      ];

      // Run
      const result = RecordUtil.getFirstInvalidConfig(
        configList,
        record,
        functionTypeList,
        () => true,
        () => true
      );

      // Assert
      expect(result).toEqual(null);
    });

    describe('has invaild config', () => {
      test.each([
        [
          'noValue',
          {
            key: 'noValue',
            type: FIELD_TYPE.FIELD_HIDDEN,
            isRequired: true,
          },
        ],
        [
          'hasPermissionNoValue',
          {
            key: 'hasPermissionNoValue',
            type: FIELD_TYPE.FIELD_HIDDEN,
            isRequired: true,
            useFunction: 'useAttendance',
          },
        ],
        [
          'hasConditionNoValue',
          {
            key: 'hasConditionNoValue',
            type: FIELD_TYPE.FIELD_HIDDEN,
            isRequired: true,
            condition: (_, __) => true,
          },
        ],
      ])('%s', (_, config) => {
        // Arrange
        const configList = [
          { key: 'key1', type: FIELD_TYPE.FIELD_HIDDEN },
          config,
          { key: 'key2', type: FIELD_TYPE.FIELD_HIDDEN },
        ];

        // Run
        const result = RecordUtil.getFirstInvalidConfig(
          configList,
          record,
          functionTypeList,
          () => true,
          () => true
        );

        // Assert
        expect(result).toEqual(config);
      });
    });

    test('has invaild config in section', () => {
      // Arrange
      const config = {
        key: 'noValue',
        type: FIELD_TYPE.FIELD_HIDDEN,
        isRequired: true,
      };
      const configList = [
        {
          section: 'section',
          configList: [config],
        },
      ];

      // Run
      const result = RecordUtil.getFirstInvalidConfig(
        configList,
        record,
        functionTypeList,
        () => true,
        () => true
      );

      // Assert
      expect(result).toEqual(config);
    });

    test('has invaild config in section deep', () => {
      // Arrange
      const config = {
        key: 'noValue',
        type: FIELD_TYPE.FIELD_HIDDEN,
        isRequired: true,
      };
      const configList = [
        {
          section: 'section1',
          configList: [
            {
              section: 'section1-1',
              configList: [config],
            },
          ],
        },
      ];

      // Run
      const result = RecordUtil.getFirstInvalidConfig(
        configList,
        record,
        functionTypeList,
        () => true,
        () => true
      );

      // Assert
      expect(result).toEqual(config);
    });

    test('throw new TypeError', () => {
      // Arrange
      const configList = [{}];

      // Assert
      expect(() => {
        RecordUtil.getFirstInvalidConfig(
          configList,
          record,
          functionTypeList,
          () => true,
          () => true
        );
      }).toThrow();
    });
  });

  describe('makeForRemote', () => {
    describe('overwrite', () => {
      test.each(['abc', '0', 0, true, false])('value: %p', (value) => {
        // Arrange
        const configList = [
          {
            key: 'value',
            type: FIELD_TYPE.FIELD_HIDDEN,
          },
        ];
        const orgRecord = {};
        const edtRecord = {
          value,
        };
        const functionTypeList = {};
        const expected = { value };

        // Run
        const result = RecordUtil.makeForRemote(
          configList,
          orgRecord,
          edtRecord,
          functionTypeList,
          () => true,
          () => true
        );

        // Assert
        expect(result).toEqual(expected);
      });
    });

    describe('change', () => {
      test.each(['', null, undefined])('value: %p', (value) => {
        // Arrange
        const configList = [
          {
            key: 'value',
            type: FIELD_TYPE.FIELD_HIDDEN,
          },
        ];
        const orgRecord = {
          value: 'abc',
        };
        const edtRecord = {
          value,
        };
        const functionTypeList = {};
        const expected = {
          value: null,
        };

        // Run
        const result = RecordUtil.makeForRemote(
          configList,
          orgRecord,
          edtRecord,
          functionTypeList,
          () => true,
          () => true
        );

        // Assert
        expect(result).toEqual(expected);
      });
    });

    describe('change value by type', () => {
      test('should change value by type', () => {
        // Arrange
        const configList: ConfigUtil.ConfigList = [
          {
            // Normal
            key: 'key1',
            type: FIELD_TYPE.FIELD_HIDDEN,
          },
          {
            // FieldType is checkbox
            key: 'key2',
            type: FIELD_TYPE.FIELD_CHECKBOX,
          },
          {
            // Will be undefined
            key: 'key4',
            type: FIELD_TYPE.FIELD_HIDDEN,
            display: DISPLAY_TYPE.DISPLAY_LIST,
          },
          {
            // Will be nextRecordValue
            key: 'key5',
            type: FIELD_TYPE.FIELD_HIDDEN,
          },
          {
            section: 'section1',
            configList: [
              {
                key: 'key6',
                type: FIELD_TYPE.FIELD_HIDDEN,
              },
            ],
          },
        ];
        const functionTypeList = {};
        const orgRecord = {
          key1: 'orgKey1',
          key2: 'orgKey2',
          key4: 'orgKey4',
        };
        const edtRecord = {
          key1: 'edtKey1',
          key2: 'edtKey2',
          key4: 'edtKey4',
          key5: 'edtKey5',
          key6: 'edtKey6',
        };
        const expected = {
          key1: 'edtKey1',
          key2: true,
          key5: 'edtKey5',
          key6: 'edtKey6',
        };

        // Run
        const result = RecordUtil.makeForRemote(
          configList,
          orgRecord,
          edtRecord,
          functionTypeList,
          () => true,
          () => true
        );

        // Assert
        expect(result).toEqual(expected);
      });
    });
  });

  describe('convertForView', () => {
    test.each([undefined, null])("%p is be ''", (value) => {
      // Arrange
      const obj = {
        key: value,
      };
      // Run
      const result = RecordUtil.convertForView(obj);
      // Assert
      // @ts-ignore
      expect(result.key).toEqual('');
    });

    test.each(['', 0, [], 'abc', ['abc']])('%p is not changed', (value) => {
      // Arrange
      const obj = {
        key: value,
      };
      // Run
      const result = RecordUtil.convertForView(obj);
      // Assert
      // @ts-ignore
      expect(result.key).toEqual(value);
    });
  });
});
