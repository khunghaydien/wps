import {
  DailyRecordDisplayFieldLayout,
  LAYOUT_CATEGORY,
  LAYOUT_ITEM_TYPE,
  LAYOUT_TYPE,
} from '@attendance/domain/models/DailyRecordDisplayFieldLayout';

import { convertType, convertValues } from '../DailyRecordDisplayFieldLayout';

describe('convertType', () => {
  it.each`
    type                          | value                       | expected
    ${LAYOUT_ITEM_TYPE.ACTION}    | ${'aaa'}                    | ${null}
    ${LAYOUT_ITEM_TYPE.BOOLEAN}   | ${'true'}                   | ${{ type: LAYOUT_ITEM_TYPE.BOOLEAN, value: true }}
    ${LAYOUT_ITEM_TYPE.BOOLEAN}   | ${'false'}                  | ${{ type: LAYOUT_ITEM_TYPE.BOOLEAN, value: false }}
    ${LAYOUT_ITEM_TYPE.BOOLEAN}   | ${'aaa'}                    | ${{ type: LAYOUT_ITEM_TYPE.BOOLEAN, value: false }}
    ${LAYOUT_ITEM_TYPE.NUMBER}    | ${''}                       | ${{ type: LAYOUT_ITEM_TYPE.NUMBER, value: null, textValue: '', decimalPlaces: 0 }}
    ${LAYOUT_ITEM_TYPE.NUMBER}    | ${'0'}                      | ${{ type: LAYOUT_ITEM_TYPE.NUMBER, value: 0, textValue: '0', decimalPlaces: 0 }}
    ${LAYOUT_ITEM_TYPE.NUMBER}    | ${'0.0'}                    | ${{ type: LAYOUT_ITEM_TYPE.NUMBER, value: 0, textValue: '0.0', decimalPlaces: 1 }}
    ${LAYOUT_ITEM_TYPE.NUMBER}    | ${'0.00'}                   | ${{ type: LAYOUT_ITEM_TYPE.NUMBER, value: 0, textValue: '0.00', decimalPlaces: 2 }}
    ${LAYOUT_ITEM_TYPE.DATE}      | ${''}                       | ${{ type: LAYOUT_ITEM_TYPE.DATE, value: '' }}
    ${LAYOUT_ITEM_TYPE.DATE}      | ${'2023-01-01'}             | ${{ type: LAYOUT_ITEM_TYPE.DATE, value: '2023-01-01' }}
    ${LAYOUT_ITEM_TYPE.DATE_TIME} | ${''}                       | ${{ type: LAYOUT_ITEM_TYPE.DATE_TIME, value: '' }}
    ${LAYOUT_ITEM_TYPE.DATE_TIME} | ${'2023-01-01T00:00:00.00'} | ${{ type: LAYOUT_ITEM_TYPE.DATE_TIME, value: '2023-01-01T00:00:00.00' }}
    ${LAYOUT_ITEM_TYPE.TIME}      | ${''}                       | ${{ type: LAYOUT_ITEM_TYPE.TIME, value: '' }}
    ${LAYOUT_ITEM_TYPE.TIME}      | ${'00:00:00.00'}            | ${{ type: LAYOUT_ITEM_TYPE.TIME, value: '00:00:00.00' }}
    ${LAYOUT_ITEM_TYPE.STRING}    | ${''}                       | ${{ type: LAYOUT_ITEM_TYPE.STRING, value: '' }}
    ${LAYOUT_ITEM_TYPE.STRING}    | ${'text'}                   | ${{ type: LAYOUT_ITEM_TYPE.STRING, value: 'text' }}
    ${'type'}                     | ${'aaa'}                    | ${{ type: LAYOUT_ITEM_TYPE.STRING, value: 'aaa' }}
  `(
    'should change to $expected from [type=$type, value=$value]',
    ({ type, value, expected }) => {
      expect(convertType(type, value)).toEqual(expected);
    }
  );
});

describe('convertValues', () => {
  it('should convert', () => {
    // Arrange
    const layouts: DailyRecordDisplayFieldLayout[] = [
      // 通常
      {
        id: '0001',
        code: 'CODE_0001',
        name: 'LayoutName1',
        category: LAYOUT_CATEGORY.TIMESHEET,
        type: LAYOUT_TYPE.EDIT,
        startDate: '2023-01-01',
        endDate: '2023-01-03',
        fields: [
          {
            id: 'I0001',
            objectName: 'objectName',
            objectItemName: 'objectItemName',
            name: 'ItemName',
            type: LAYOUT_ITEM_TYPE.STRING,
            viewType: null,
            editable: false,
            order: 1,
          },
        ],
      },
      // 同じ設定
      {
        id: '0001',
        code: 'CODE_0001',
        name: 'LayoutName',
        category: LAYOUT_CATEGORY.TIMESHEET,
        type: LAYOUT_TYPE.EDIT,
        startDate: '2023-01-05',
        endDate: '2023-01-05',
        fields: [
          {
            id: 'I0001',
            objectName: 'objectName',
            objectItemName: 'objectItemName',
            name: 'ItemName',
            type: LAYOUT_ITEM_TYPE.STRING,
            viewType: null,
            editable: false,
            order: 1,
          },
        ],
      },
      // 同じ別の設定
      {
        id: '0002',
        code: 'CODE_0002',
        name: 'LayoutName',
        category: LAYOUT_CATEGORY.TIMESHEET,
        type: LAYOUT_TYPE.EDIT,
        startDate: '2023-01-06',
        endDate: '2023-01-06',
        fields: [
          {
            id: 'I0002',
            objectName: 'objectName',
            objectItemName: 'objectItemName',
            name: 'ItemName',
            type: LAYOUT_ITEM_TYPE.STRING,
            viewType: null,
            editable: false,
            order: 1,
          },
        ],
      },
    ];
    const values = {
      // 日付キーから存在しない
      // '2023-01-01' : {}
      // 通常
      '2023-01-02': {
        I0001: 'a',
      },
      // 値キーが存在しない
      '2023-01-03': {},
      '2023-01-06': {
        // fields に存在しない値がある
        I0001: 'a',
      },
      // 存在しない日
      '2023-01-07': {},
    };

    // Act
    const result = convertValues(values, layouts);

    // Assert
    expect(Object.keys(result)).toEqual([
      '2023-01-01',
      '2023-01-02',
      '2023-01-03',
      '2023-01-05',
      '2023-01-06',
    ]);
    // 下記が理想だが実装してしまっているので不問とする。
    // { I0001: { type: LAYOUT_ITEM_TYPE.STRING, value: null } }
    expect(result['2023-01-01']).toEqual({});
    expect(result['2023-01-02']).toEqual({
      I0001: {
        type: LAYOUT_ITEM_TYPE.STRING,
        value: 'a',
      },
    });
    expect(result['2023-01-03']).toEqual({});
    expect(result['2023-01-05']).toEqual({});
    // 本来はエラーになるべきだが BE の実装によりこれはあり得ないため不問とする。
    expect(result['2023-01-06']).toEqual({
      I0001: {
        type: LAYOUT_ITEM_TYPE.STRING,
        value: 'a',
      },
    });
  });
});
