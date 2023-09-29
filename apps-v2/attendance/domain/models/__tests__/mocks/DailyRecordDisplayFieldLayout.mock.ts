import {
  DailyRecordDisplayFieldLayoutTable,
  LAYOUT_CATEGORY,
  LAYOUT_ITEM_TYPE,
  LAYOUT_ITEM_VIEW_TYPE,
  LAYOUT_TYPE,
  SYSTEM_ITEM_NAME,
  SYSTEM_NAME,
} from '../../DailyRecordDisplayFieldLayout';

export const editableTimesheet: DailyRecordDisplayFieldLayoutTable = {
  layouts: [
    {
      id: 'LAYOUT_ID_0001',
      code: 'LAYOUT_CODE_0001',
      name: 'Layout 0001 Name',
      category: LAYOUT_CATEGORY.TIMESHEET,
      type: LAYOUT_TYPE.EDIT,
      startDate: '2022-12-01',
      endDate: '2022-12-03',
      fields: [
        // 保存ボタン
        {
          id: '00001',
          objectName: SYSTEM_NAME,
          objectItemName: SYSTEM_ITEM_NAME.SAVE_BUTTON,
          name: '保存',
          type: LAYOUT_ITEM_TYPE.ACTION,
          viewType: null,
          editable: false,
          order: 1,
        },
        // 日次勤務確定ボタン
        {
          id: '00002',
          objectName: SYSTEM_NAME,
          objectItemName: SYSTEM_ITEM_NAME.DAILY_FIX_REQUEST_BUTTON,
          name: '日次勤務確定',
          type: LAYOUT_ITEM_TYPE.ACTION,
          viewType: null,
          editable: false,
          order: 2,
        },
        // 勤怠明細
        {
          id: '00003',
          objectName: 'AttRecord__c',
          objectItemName: 'Locked__c',
          name: 'ロック済み',
          type: LAYOUT_ITEM_TYPE.BOOLEAN,
          viewType: null,
          editable: false,
          order: 3,
        },
        {
          id: '00004',
          objectName: 'AttRecord__c',
          objectItemName: 'DayType__c',
          name: '日タイプ',
          type: LAYOUT_ITEM_TYPE.STRING,
          viewType: null,
          editable: false,
          order: 4,
        },
        {
          id: '00005',
          objectName: 'AttRecord__c',
          objectItemName: 'PatternId__c',
          name: 'パターンID',
          type: LAYOUT_ITEM_TYPE.STRING,
          viewType: null,
          editable: false,
          order: 5,
        },
        {
          id: '00006',
          objectName: 'AttRecord__c',
          objectItemName: 'InpStartStampTime__c',
          name: '出勤打刻時刻',
          type: LAYOUT_ITEM_TYPE.NUMBER,
          viewType: LAYOUT_ITEM_VIEW_TYPE.ATT_TIME,
          editable: false,
          order: 6,
        },
        {
          id: '00007',
          objectName: 'AttRecord__c',
          objectItemName: 'InpLastUpdateTime__c',
          name: '入力更新時刻',
          type: LAYOUT_ITEM_TYPE.DATE_TIME,
          viewType: null,
          editable: false,
          order: 7,
        },
        {
          id: '00008',
          objectName: 'AttRecord__c',
          objectItemName: 'Date__c',
          name: '勤怠明細日',
          type: LAYOUT_ITEM_TYPE.DATE,
          viewType: null,
          editable: false,
          order: 8,
        },
        {
          id: '00009',
          objectName: 'AttRecord__c',
          objectItemName: 'SummaryId__r.SummaryName__c',
          name: 'サマリー名',
          type: LAYOUT_ITEM_TYPE.STRING,
          viewType: null,
          editable: false,
          order: 9,
        },
        {
          id: '00010',
          objectName: 'AttRecord__c',
          objectItemName: 'SummaryId__r.WorkingTypeHistoryId__r.Name_L0__c',
          name: '勤務体系名',
          type: LAYOUT_ITEM_TYPE.STRING,
          viewType: null,
          editable: false,
          order: 10,
        },
        // 客観ログ
        {
          id: '00011',
          objectName: 'AttDailyObjectivelyEventLog__c',
          objectItemName: 'EnteringTime1__c',
          name: '入館時刻1',
          type: LAYOUT_ITEM_TYPE.NUMBER,
          viewType: null,
          editable: false,
          order: 11,
        },
        {
          id: '00012',
          objectName: 'AttDailyObjectivelyEventLog__c',
          objectItemName: 'EnteringEventLogId1__r.ImportStatus__c',
          name: '客観ログ連携状態1',
          type: LAYOUT_ITEM_TYPE.STRING,
          viewType: null,
          editable: false,
          order: 12,
        },
        // 運用サマリー
        {
          id: '00013',
          objectName: 'AttOpsRecord__c',
          objectItemName: 'AggregateField01__c',
          name: '運用項目1',
          type: LAYOUT_ITEM_TYPE.STRING,
          viewType: null,
          editable: false,
          order: 13,
        },
        // 給与サマリー
        {
          id: '00014',
          objectName: 'AttSummaryForPayroll__c',
          objectItemName: 'AggregateField01__c',
          name: '給与項目1',
          type: LAYOUT_ITEM_TYPE.STRING,
          viewType: null,
          editable: false,
          order: 14,
        },
        // 拡張項目
        {
          id: '00015',
          objectName: 'AttRecord__c',
          objectItemName: 'AttRecordEntendedItem__r.ExtendedItemText01Value__c',
          name: '拡張項目テキスト1',
          type: LAYOUT_ITEM_TYPE.STRING,
          viewType: null,
          editable: true,
          order: 15,
        },
        {
          id: '00016',
          objectName: 'AttRecord__c',
          objectItemName:
            'AttRecordEntendedItem__r.ExtendedItemNumeric01Value__c',
          name: '拡張項目数値1',
          type: LAYOUT_ITEM_TYPE.NUMBER,
          viewType: null,
          editable: true,
          order: 16,
        },
        {
          id: '00017',
          objectName: 'AttRecord__c',
          objectItemName:
            'AttRecordEntendedItem__r.ExtendedItemPickList01Value__c',
          name: '拡張項目選択項目1',
          type: LAYOUT_ITEM_TYPE.STRING,
          viewType: null,
          pickList: [
            {
              label: 'リンゴ1111111111111リンゴ111',
              value: 'Apple',
            },
            {
              label: 'バナナ222222222222リンゴ22222',
              value: 'Banana',
            },
            {
              label: 'ミカン33333333333リンゴ3333',
              value: 'Orange',
            },
          ],
          editable: true,
          order: 17,
        },
        {
          id: '00018',
          objectName: 'AttRecord__c',
          objectItemName: 'AttRecordEntendedItem__r.ExtendedItemDate01Value__c',
          name: '拡張項目日付1',
          type: LAYOUT_ITEM_TYPE.DATE,
          viewType: null,
          editable: true,
          order: 18,
        },
        {
          id: '00019',
          objectName: 'AttRecord__c',
          objectItemName: 'AttRecordEntendedItem__r.ExtendedItemTime01Value__c',
          name: '拡張項目時間1',
          type: LAYOUT_ITEM_TYPE.NUMBER,
          viewType: LAYOUT_ITEM_VIEW_TYPE.ATT_TIME,
          editable: true,
          order: 19,
        },
        {
          id: '00021',
          objectName: 'AttRecord__c',
          objectItemName:
            'AttRecordEntendedItem__r.ExtendedItemPickList02Value__c',
          name: '拡張項目選択項目1',
          type: LAYOUT_ITEM_TYPE.STRING,
          viewType: null,
          pickList: [
            {
              label: 'チョコレート',
              value: 'Chocorate',
            },
            {
              label: 'キャンディー',
              value: 'Candy',
            },
            {
              label: 'ミルク',
              value: 'Milk',
            },
          ],
          editable: true,
          order: 20,
        },
      ],
    },
    // 月中勤務体系変更でレイアウト変更
    {
      id: 'LAYOUT_ID_0002',
      code: 'LAYOUT_CODE_0002',
      name: 'Layout 0002 Name',
      category: LAYOUT_CATEGORY.TIMESHEET,
      type: LAYOUT_TYPE.EDIT,
      startDate: '2022-12-05',
      endDate: '2022-12-07',
      fields: [
        {
          id: '00020',
          objectName: 'AttRecord__c',
          objectItemName: 'Locked__c',
          name: 'ロック済み',
          type: LAYOUT_ITEM_TYPE.BOOLEAN,
          viewType: null,
          editable: false,
          order: 1,
        },
      ],
    },
    // 月中勤務体系変更で同じレイアウト
    {
      id: 'LAYOUT_ID_0002',
      code: 'LAYOUT_CODE_0002',
      category: LAYOUT_CATEGORY.TIMESHEET,
      name: 'Layout 0002 Name',
      type: LAYOUT_TYPE.EDIT,
      startDate: '2022-12-08',
      endDate: '2022-12-10',
      fields: [
        {
          id: '00020',
          objectName: 'AttRecord__c',
          objectItemName: 'Locked__c',
          name: 'ロック済み',
          type: LAYOUT_ITEM_TYPE.BOOLEAN,
          viewType: null,
          editable: false,
          order: 1,
        },
      ],
    },
    {
      id: 'LAYOUT_ID_0003',
      code: 'LAYOUT_CODE_0003',
      category: LAYOUT_CATEGORY.TIMESHEET,
      name: 'Layout 0003 Name',
      type: LAYOUT_TYPE.EDIT,
      startDate: '2022-12-11',
      endDate: '2022-12-15',
      fields: [
        {
          id: '00023',
          objectName: 'AttRecord__c',
          objectItemName: 'Locked__c',
          name: 'ロック済み',
          type: LAYOUT_ITEM_TYPE.BOOLEAN,
          viewType: null,
          editable: false,
          order: 1,
        },
      ],
    },
  ],
  values: {
    '2022-12-01': {
      '00001': null,
      '00002': null,
      '00003': {
        type: LAYOUT_ITEM_TYPE.BOOLEAN,
        value: true,
      },
      '00004': {
        type: LAYOUT_ITEM_TYPE.STRING,
        value: 'WorkDay',
      },
      '00005': {
        type: LAYOUT_ITEM_TYPE.STRING,
        value: 'PATTERN_ID',
      },
      '00006': {
        type: LAYOUT_ITEM_TYPE.NUMBER,
        value: 536,
        textValue: '536',
        decimalPlaces: 0,
      },
      '00007': {
        type: LAYOUT_ITEM_TYPE.DATE_TIME,
        value: '2022-12-02 12:47:23',
      },
      '00008': {
        type: LAYOUT_ITEM_TYPE.DATE,
        value: '2022-12-01',
      },
      '00009': {
        type: LAYOUT_ITEM_TYPE.STRING,
        value: '2022-12 Aさんの勤怠サマリー',
      },
      '00010': {
        type: LAYOUT_ITEM_TYPE.STRING,
        value: '固定労働制',
      },
      '00011': {
        type: LAYOUT_ITEM_TYPE.NUMBER,
        value: 536,
        textValue: '536',
        decimalPlaces: 0,
      },
      '00012': {
        type: LAYOUT_ITEM_TYPE.STRING,
        value: 'Complete',
      },
      '00013': {
        type: LAYOUT_ITEM_TYPE.STRING,
        value: '100',
      },
      '00014': {
        type: LAYOUT_ITEM_TYPE.STRING,
        value: '200',
      },
      '00015': {
        type: LAYOUT_ITEM_TYPE.STRING,
        value: 'テキスト',
      },
      '00016': {
        type: LAYOUT_ITEM_TYPE.NUMBER,
        value: 0.3,
        textValue: '0.30',
        decimalPlaces: 2,
      },
      '00017': {
        type: LAYOUT_ITEM_TYPE.STRING,
        value: 'Banana',
      },
      '00018': {
        type: LAYOUT_ITEM_TYPE.DATE,
        value: '2022-11-15',
      },
      '00019': {
        type: LAYOUT_ITEM_TYPE.NUMBER,
        value: 1112,
        textValue: '1112',
        decimalPlaces: 0,
      },
      '00021': {
        type: LAYOUT_ITEM_TYPE.STRING,
        value: 'Apple',
      },
    },
    '2022-12-02': {
      '00001': null,
      '00002': null,
      '00003': {
        type: LAYOUT_ITEM_TYPE.BOOLEAN,
        value: true,
      },
      '00004': {
        type: LAYOUT_ITEM_TYPE.STRING,
        value: 'WorkDay',
      },
      '00005': {
        type: LAYOUT_ITEM_TYPE.STRING,
        value: 'PATTERN_ID',
      },
      '00006': {
        type: LAYOUT_ITEM_TYPE.NUMBER,
        value: 536,
        textValue: '536',
        decimalPlaces: 0,
      },
      '00007': {
        type: LAYOUT_ITEM_TYPE.DATE_TIME,
        value: '2022-12-02 12:47:23',
      },
      '00008': {
        type: LAYOUT_ITEM_TYPE.DATE,
        value: '2022-12-01',
      },
      '00009': {
        type: LAYOUT_ITEM_TYPE.STRING,
        value: '2022-12 Aさんの勤怠サマリー',
      },
      '00010': {
        type: LAYOUT_ITEM_TYPE.STRING,
        value: '固定労働制',
      },
      '00011': {
        type: LAYOUT_ITEM_TYPE.NUMBER,
        value: 536,
        textValue: '536',
        decimalPlaces: 0,
      },
      '00012': {
        type: LAYOUT_ITEM_TYPE.STRING,
        value: 'Complete',
      },
      '00013': {
        type: LAYOUT_ITEM_TYPE.STRING,
        value: '100',
      },
      '00014': {
        type: LAYOUT_ITEM_TYPE.STRING,
        value: '200',
      },
      '00015': {
        type: LAYOUT_ITEM_TYPE.STRING,
        value: 'テキスト',
      },
      '00016': {
        type: LAYOUT_ITEM_TYPE.NUMBER,
        value: 0.3,
        textValue: '0.30',
        decimalPlaces: 2,
      },
      '00017': {
        type: LAYOUT_ITEM_TYPE.STRING,
        value: 'Banana',
      },
      '00018': {
        type: LAYOUT_ITEM_TYPE.DATE,
        value: '2022-11-15',
      },
      '00019': {
        type: LAYOUT_ITEM_TYPE.NUMBER,
        value: 1112,
        textValue: '1112',
        decimalPlaces: 0,
      },
      '00021': {
        type: LAYOUT_ITEM_TYPE.STRING,
        value: 'Apple',
      },
    },
    '2022-12-03': {
      '00001': null,
      '00002': null,
      '00003': {
        type: LAYOUT_ITEM_TYPE.BOOLEAN,
        value: true,
      },
      '00004': {
        type: LAYOUT_ITEM_TYPE.STRING,
        value: 'WorkDay',
      },
      '00005': {
        type: LAYOUT_ITEM_TYPE.STRING,
        value: 'PATTERN_ID',
      },
      '00006': {
        type: LAYOUT_ITEM_TYPE.NUMBER,
        value: 536,
        textValue: '536',
        decimalPlaces: 0,
      },
      '00007': {
        type: LAYOUT_ITEM_TYPE.DATE_TIME,
        value: '2022-12-02 12:47:23',
      },
      '00008': {
        type: LAYOUT_ITEM_TYPE.DATE,
        value: '2022-12-01',
      },
      '00009': {
        type: LAYOUT_ITEM_TYPE.STRING,
        value: '2022-12 Aさんの勤怠サマリー',
      },
      '00010': {
        type: LAYOUT_ITEM_TYPE.STRING,
        value: '固定労働制',
      },
      '00011': {
        type: LAYOUT_ITEM_TYPE.NUMBER,
        value: 536,
        textValue: '536',
        decimalPlaces: 0,
      },
      '00012': {
        type: LAYOUT_ITEM_TYPE.STRING,
        value: 'Complete',
      },
      '00013': {
        type: LAYOUT_ITEM_TYPE.STRING,
        value: '100',
      },
      '00014': {
        type: LAYOUT_ITEM_TYPE.STRING,
        value: '200',
      },
      '00015': {
        type: LAYOUT_ITEM_TYPE.STRING,
        value: 'テキスト',
      },
      '00016': {
        type: LAYOUT_ITEM_TYPE.NUMBER,
        value: 0.3,
        textValue: '0.30',
        decimalPlaces: 2,
      },
      '00017': {
        type: LAYOUT_ITEM_TYPE.STRING,
        value: 'Banana',
      },
      '00018': {
        type: LAYOUT_ITEM_TYPE.DATE,
        value: '2022-11-15',
      },
      '00019': {
        type: LAYOUT_ITEM_TYPE.NUMBER,
        value: 1112,
        textValue: '1112',
        decimalPlaces: 0,
      },
      '00021': {
        type: LAYOUT_ITEM_TYPE.STRING,
        value: 'Apple',
      },
    },
    '2022-12-04': null,
    '2022-12-05': {
      '00020': {
        type: LAYOUT_ITEM_TYPE.BOOLEAN,
        value: true,
      },
    },
    '2022-12-06': {
      '00020': {
        type: LAYOUT_ITEM_TYPE.BOOLEAN,
        value: false,
      },
    },
    '2022-12-07': {
      '00020': {
        type: LAYOUT_ITEM_TYPE.BOOLEAN,
        value: false,
      },
    },
    '2022-12-08': {
      '00020': {
        type: LAYOUT_ITEM_TYPE.BOOLEAN,
        value: false,
      },
    },
    '2022-12-09': {
      '00020': {
        type: LAYOUT_ITEM_TYPE.BOOLEAN,
        value: false,
      },
    },
    '2022-12-10': {
      '00020': {
        type: LAYOUT_ITEM_TYPE.BOOLEAN,
        value: false,
      },
    },
    '2022-12-11': {
      '00023': {
        type: LAYOUT_ITEM_TYPE.BOOLEAN,
        value: true,
      },
    },
    '2022-12-12': {
      '00023': {
        type: LAYOUT_ITEM_TYPE.BOOLEAN,
        value: true,
      },
    },
    '2022-12-13': {
      '00023': {
        type: LAYOUT_ITEM_TYPE.BOOLEAN,
        value: true,
      },
    },
    '2022-12-14': {
      '00023': {
        type: LAYOUT_ITEM_TYPE.BOOLEAN,
        value: true,
      },
    },
    '2022-12-15': {
      '00023': {
        type: LAYOUT_ITEM_TYPE.BOOLEAN,
        value: true,
      },
    },
    '2022-12-16': null,
    '2022-12-17': null,
    '2022-12-18': null,
    '2022-12-19': null,
    '2022-12-20': null,
    '2022-12-21': null,
    '2022-12-22': null,
    '2022-12-23': null,
    '2022-12-24': null,
    '2022-12-25': null,
    '2022-12-26': null,
    '2022-12-27': null,
    '2022-12-28': null,
    '2022-12-29': null,
    '2022-12-30': null,
    '2022-12-31': null,
  },
};

export const minimumTable: DailyRecordDisplayFieldLayoutTable = {
  layouts: [
    {
      id: 'LAYOUT_ID_0001',
      code: 'LAYOUT_CODE_0001',
      name: 'Layout 0001 Name',
      category: LAYOUT_CATEGORY.TIMESHEET,
      type: LAYOUT_TYPE.EDIT,
      startDate: '2022-12-01',
      endDate: '2022-12-03',
      fields: [
        // 保存ボタン
        {
          id: '00001',
          objectName: SYSTEM_NAME,
          objectItemName: SYSTEM_ITEM_NAME.SAVE_BUTTON,
          name: '保存',
          type: LAYOUT_ITEM_TYPE.ACTION,
          viewType: null,
          editable: false,
          order: 1,
        },
        // 日次勤務確定ボタン
        {
          id: '00002',
          objectName: SYSTEM_NAME,
          objectItemName: SYSTEM_ITEM_NAME.DAILY_FIX_REQUEST_BUTTON,
          name: '日次勤務確定',
          type: LAYOUT_ITEM_TYPE.ACTION,
          viewType: null,
          editable: false,
          order: 2,
        },
      ],
    },
  ],
  values: {
    '2022-12-01': {
      '00001': null,
      '00002': null,
    },
    '2022-12-02': {
      '00001': null,
      '00002': null,
    },
    '2022-12-16': null,
    '2022-12-17': null,
    '2022-12-18': null,
    '2022-12-19': null,
    '2022-12-20': null,
    '2022-12-21': null,
    '2022-12-22': null,
    '2022-12-23': null,
    '2022-12-24': null,
    '2022-12-25': null,
    '2022-12-26': null,
    '2022-12-27': null,
    '2022-12-28': null,
    '2022-12-29': null,
    '2022-12-30': null,
    '2022-12-31': null,
  },
};
