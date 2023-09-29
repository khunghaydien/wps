import {
  LAYOUT_ITEM_TYPE,
  LAYOUT_ITEM_VIEW_TYPE,
  SYSTEM_ITEM_NAME,
  SYSTEM_NAME,
} from '@apps/attendance/domain/models/DailyRecordDisplayFieldLayout';

import { DailyRecordDisplayFieldLayoutTableForUI } from '@attendance/timesheet-pc/modules/ui/dailyRecordDisplayFieldLayout';

export const layoutRow: DailyRecordDisplayFieldLayoutTableForUI['layoutRow'] = [
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
    objectItemName: 'AttRecordEntendedItem__r.ExtendedItemNumeric01Value__c',
    name: '拡張項目数値1',
    type: LAYOUT_ITEM_TYPE.NUMBER,
    viewType: null,
    editable: true,
    order: 16,
  },
  {
    id: '00017',
    objectName: 'AttRecord__c',
    objectItemName: 'AttRecordEntendedItem__r.ExtendedItemPickList01Value__c',
    name: '拡張項目選択項目1',
    type: LAYOUT_ITEM_TYPE.STRING,
    viewType: null,
    pickList: [
      {
        label: 'リンゴ',
        value: 'Apple',
      },
      {
        label: 'バナナ',
        value: 'Banana',
      },
      {
        label: 'ミカン',
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
    objectItemName: 'AttRecordEntendedItem__r.ExtendedItemPickList02Value__c',
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
];

const getField = (fieldId: string) =>
  layoutRow.find(({ id }) => id === fieldId);

export const layoutValues: DailyRecordDisplayFieldLayoutTableForUI['layoutValues'] =
  {
    '2020-02-01': {
      '00001': {
        existing: true,
        value: null,
        field: getField('00001'),
      },
      '00002': {
        existing: true,
        value: null,
        field: getField('00002'),
      },
      '00003': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.BOOLEAN,
          value: true,
        },
        field: getField('00003'),
      },
      '00004': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.STRING,
          value: 'WorkDay',
        },
        field: getField('00004'),
      },
      '00005': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.STRING,
          value: 'PATTERN_ID',
        },
        field: getField('00005'),
      },
      '00006': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.NUMBER,
          value: 536,
          textValue: '536',
          decimalPlaces: 0,
        },
        field: getField('00006'),
      },
      '00007': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.DATE_TIME,
          value: '2020-02-02 12:47:23',
        },
        field: getField('00007'),
      },
      '00008': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.DATE,
          value: '2020-02-01',
        },
        field: getField('00008'),
      },
      '00009': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.STRING,
          value: '2020-02 Aさんの勤怠サマリー',
        },
        field: getField('00009'),
      },
      '00010': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.STRING,
          value: '固定労働制',
        },
        field: getField('00010'),
      },
      '00011': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.NUMBER,
          value: 536,
          textValue: '536',
          decimalPlaces: 0,
        },
        field: getField('00011'),
      },
      '00012': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.STRING,
          value: 'Complete',
        },
        field: getField('00012'),
      },
      '00013': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.STRING,
          value: '100',
        },
        field: getField('00013'),
      },
      '00014': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.STRING,
          value: '200',
        },
        field: getField('00014'),
      },
      '00015': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.STRING,
          value: 'テキスト',
        },
        field: getField('00015'),
      },
      '00016': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.NUMBER,
          value: 0.3,
          textValue: '0.30',
          decimalPlaces: 2,
        },
        field: getField('00016'),
      },
      '00017': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.STRING,
          value: 'Banana',
        },
        field: getField('00017'),
      },
      '00018': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.DATE,
          value: '2022-11-15',
        },
        field: getField('00018'),
      },
      '00019': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.NUMBER,
          value: 1112,
          textValue: '1112',
          decimalPlaces: 0,
        },
        field: getField('00019'),
      },
      '00021': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.STRING,
          value: 'Apple',
        },
        field: getField('00021'),
      },
      '00020': {
        existing: false,
        value: null,
        field: getField('00020'),
      },
      '00023': {
        existing: false,
        value: null,
        field: getField('00023'),
      },
    },
    '2020-02-02': {
      '00001': {
        existing: true,
        value: null,
        field: getField('00001'),
      },
      '00002': {
        existing: true,
        value: null,
        field: getField('00002'),
      },
      '00003': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.BOOLEAN,
          value: true,
        },
        field: getField('00003'),
      },
      '00004': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.STRING,
          value: 'WorkDay',
        },
        field: getField('00004'),
      },
      '00005': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.STRING,
          value: 'PATTERN_ID',
        },
        field: getField('00005'),
      },
      '00006': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.NUMBER,
          value: 536,
          textValue: '536',
          decimalPlaces: 0,
        },
        field: getField('00006'),
      },
      '00007': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.DATE_TIME,
          value: '2020-02-02 12:47:23',
        },
        field: getField('00007'),
      },
      '00008': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.DATE,
          value: '2020-02-01',
        },
        field: getField('00008'),
      },
      '00009': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.STRING,
          value: '2020-02 Aさんの勤怠サマリー',
        },
        field: getField('00009'),
      },
      '00010': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.STRING,
          value: '固定労働制',
        },
        field: getField('00010'),
      },
      '00011': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.NUMBER,
          value: 536,
          textValue: '536',
          decimalPlaces: 0,
        },
        field: getField('00011'),
      },
      '00012': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.STRING,
          value: 'Complete',
        },
        field: getField('00012'),
      },
      '00013': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.STRING,
          value: '100',
        },
        field: getField('00013'),
      },
      '00014': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.STRING,
          value: '200',
        },
        field: getField('00014'),
      },
      '00015': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.STRING,
          value: 'テキスト',
        },
        field: getField('00015'),
      },
      '00016': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.NUMBER,
          value: 0.32,
          textValue: '0.320',
          decimalPlaces: 3,
        },
        field: getField('00016'),
      },
      '00017': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.STRING,
          value: 'Banana',
        },
        field: getField('00017'),
      },
      '00018': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.DATE,
          value: '2022-11-15',
        },
        field: getField('00018'),
      },
      '00019': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.NUMBER,
          value: 1112,
          textValue: '1112',
          decimalPlaces: 0,
        },
        field: getField('00019'),
      },
      '00021': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.STRING,
          value: 'Apple',
        },
        field: getField('00021'),
      },
      '00020': {
        existing: false,
        value: null,
        field: getField('00020'),
      },
      '00023': {
        existing: false,
        value: null,
        field: getField('00023'),
      },
    },
    '2020-02-03': {
      '00001': {
        existing: true,
        value: null,
        field: getField('00001'),
      },
      '00002': {
        existing: true,
        value: null,
        field: getField('00002'),
      },
      '00003': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.BOOLEAN,
          value: true,
        },
        field: getField('00003'),
      },
      '00004': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.STRING,
          value: 'WorkDay',
        },
        field: getField('00004'),
      },
      '00005': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.STRING,
          value: 'PATTERN_ID',
        },
        field: getField('00005'),
      },
      '00006': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.NUMBER,
          value: 536,
          textValue: '536',
          decimalPlaces: 0,
        },
        field: getField('00006'),
      },
      '00007': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.DATE_TIME,
          value: '2020-02-02 12:47:23',
        },
        field: getField('00007'),
      },
      '00008': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.DATE,
          value: '2020-02-01',
        },
        field: getField('00008'),
      },
      '00009': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.STRING,
          value: '2020-02 Aさんの勤怠サマリー',
        },
        field: getField('00009'),
      },
      '00010': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.STRING,
          value: '固定労働制',
        },
        field: getField('00010'),
      },
      '00011': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.NUMBER,
          value: 536,
          textValue: '536',
          decimalPlaces: 0,
        },
        field: getField('00011'),
      },
      '00012': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.STRING,
          value: 'Complete',
        },
        field: getField('00012'),
      },
      '00013': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.STRING,
          value: '100',
        },
        field: getField('00013'),
      },
      '00014': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.STRING,
          value: '200',
        },
        field: getField('00014'),
      },
      '00015': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.STRING,
          value: 'テキスト',
        },
        field: getField('00015'),
      },
      '00016': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.NUMBER,
          value: 0.3,
          textValue: '0.30',
          decimalPlaces: 2,
        },
        field: getField('00016'),
      },
      '00017': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.STRING,
          value: 'Banana',
        },
        field: getField('00017'),
      },
      '00018': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.DATE,
          value: '2022-11-15',
        },
        field: getField('00018'),
      },
      '00019': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.NUMBER,
          value: 1112,
          textValue: '1112',
          decimalPlaces: 0,
        },
        field: getField('00019'),
      },
      '00021': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.STRING,
          value: 'Apple',
        },
        field: getField('00021'),
      },
      '00020': {
        existing: false,
        value: null,
        field: getField('00020'),
      },
      '00023': {
        existing: false,
        value: null,
        field: getField('00023'),
      },
    },
    '2020-02-05': {
      '00001': {
        existing: false,
        value: null,
        field: getField('00001'),
      },
      '00002': {
        existing: false,
        value: null,
        field: getField('00002'),
      },
      '00003': {
        existing: false,
        value: null,
        field: getField('00003'),
      },
      '00004': {
        existing: false,
        value: null,
        field: getField('00004'),
      },
      '00005': {
        existing: false,
        value: null,
        field: getField('00005'),
      },
      '00006': {
        existing: false,
        value: null,
        field: getField('00006'),
      },
      '00007': {
        existing: false,
        value: null,
        field: getField('00007'),
      },
      '00008': {
        existing: false,
        value: null,
        field: getField('00008'),
      },
      '00009': {
        existing: false,
        value: null,
        field: getField('00009'),
      },
      '00010': {
        existing: false,
        value: null,
        field: getField('00010'),
      },
      '00011': {
        existing: false,
        value: null,
        field: getField('00011'),
      },
      '00012': {
        existing: false,
        value: null,
        field: getField('00012'),
      },
      '00013': {
        existing: false,
        value: null,
        field: getField('00013'),
      },
      '00014': {
        existing: false,
        value: null,
        field: getField('00014'),
      },
      '00015': {
        existing: false,
        value: null,
        field: getField('00015'),
      },
      '00016': {
        existing: false,
        value: null,
        field: getField('00016'),
      },
      '00017': {
        existing: false,
        value: null,
        field: getField('00017'),
      },
      '00018': {
        existing: false,
        value: null,
        field: getField('00018'),
      },
      '00019': {
        existing: false,
        value: null,
        field: getField('00019'),
      },
      '00021': {
        existing: false,
        value: null,
        field: getField('00021'),
      },
      '00020': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.BOOLEAN,
          value: true,
        },
        field: getField('00020'),
      },
      '00023': {
        existing: false,
        value: null,
        field: getField('00023'),
      },
    },
    '2020-02-06': {
      '00001': {
        existing: false,
        value: null,
        field: getField('00001'),
      },
      '00002': {
        existing: false,
        value: null,
        field: getField('00002'),
      },
      '00003': {
        existing: false,
        value: null,
        field: getField('00003'),
      },
      '00004': {
        existing: false,
        value: null,
        field: getField('00004'),
      },
      '00005': {
        existing: false,
        value: null,
        field: getField('00005'),
      },
      '00006': {
        existing: false,
        value: null,
        field: getField('00006'),
      },
      '00007': {
        existing: false,
        value: null,
        field: getField('00007'),
      },
      '00008': {
        existing: false,
        value: null,
        field: getField('00008'),
      },
      '00009': {
        existing: false,
        value: null,
        field: getField('00009'),
      },
      '00010': {
        existing: false,
        value: null,
        field: getField('00010'),
      },
      '00011': {
        existing: false,
        value: null,
        field: getField('00011'),
      },
      '00012': {
        existing: false,
        value: null,
        field: getField('00012'),
      },
      '00013': {
        existing: false,
        value: null,
        field: getField('00013'),
      },
      '00014': {
        existing: false,
        value: null,
        field: getField('00014'),
      },
      '00015': {
        existing: false,
        value: null,
        field: getField('00015'),
      },
      '00016': {
        existing: false,
        value: null,
        field: getField('00016'),
      },
      '00017': {
        existing: false,
        value: null,
        field: getField('00017'),
      },
      '00018': {
        existing: false,
        value: null,
        field: getField('00018'),
      },
      '00019': {
        existing: false,
        value: null,
        field: getField('00019'),
      },
      '00021': {
        existing: false,
        value: null,
        field: getField('00021'),
      },
      '00020': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.BOOLEAN,
          value: false,
        },
        field: getField('00020'),
      },
      '00023': {
        existing: false,
        value: null,
        field: getField('00023'),
      },
    },
    '2020-02-07': {
      '00001': {
        existing: false,
        value: null,
        field: getField('00001'),
      },
      '00002': {
        existing: false,
        value: null,
        field: getField('00002'),
      },
      '00003': {
        existing: false,
        value: null,
        field: getField('00003'),
      },
      '00004': {
        existing: false,
        value: null,
        field: getField('00004'),
      },
      '00005': {
        existing: false,
        value: null,
        field: getField('00005'),
      },
      '00006': {
        existing: false,
        value: null,
        field: getField('00006'),
      },
      '00007': {
        existing: false,
        value: null,
        field: getField('00007'),
      },
      '00008': {
        existing: false,
        value: null,
        field: getField('00008'),
      },
      '00009': {
        existing: false,
        value: null,
        field: getField('00009'),
      },
      '00010': {
        existing: false,
        value: null,
        field: getField('00010'),
      },
      '00011': {
        existing: false,
        value: null,
        field: getField('00011'),
      },
      '00012': {
        existing: false,
        value: null,
        field: getField('00012'),
      },
      '00013': {
        existing: false,
        value: null,
        field: getField('00013'),
      },
      '00014': {
        existing: false,
        value: null,
        field: getField('00014'),
      },
      '00015': {
        existing: false,
        value: null,
        field: getField('00015'),
      },
      '00016': {
        existing: false,
        value: null,
        field: getField('00016'),
      },
      '00017': {
        existing: false,
        value: null,
        field: getField('00017'),
      },
      '00018': {
        existing: false,
        value: null,
        field: getField('00018'),
      },
      '00019': {
        existing: false,
        value: null,
        field: getField('00019'),
      },
      '00021': {
        existing: false,
        value: null,
        field: getField('00021'),
      },
      '00020': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.BOOLEAN,
          value: false,
        },
        field: getField('00020'),
      },
      '00023': {
        existing: false,
        value: null,
        field: getField('00023'),
      },
    },
    '2020-02-08': {
      '00001': {
        existing: false,
        value: null,
        field: getField('00001'),
      },
      '00002': {
        existing: false,
        value: null,
        field: getField('00002'),
      },
      '00003': {
        existing: false,
        value: null,
        field: getField('00003'),
      },
      '00004': {
        existing: false,
        value: null,
        field: getField('00004'),
      },
      '00005': {
        existing: false,
        value: null,
        field: getField('00005'),
      },
      '00006': {
        existing: false,
        value: null,
        field: getField('00006'),
      },
      '00007': {
        existing: false,
        value: null,
        field: getField('00007'),
      },
      '00008': {
        existing: false,
        value: null,
        field: getField('00008'),
      },
      '00009': {
        existing: false,
        value: null,
        field: getField('00009'),
      },
      '00010': {
        existing: false,
        value: null,
        field: getField('00010'),
      },
      '00011': {
        existing: false,
        value: null,
        field: getField('00011'),
      },
      '00012': {
        existing: false,
        value: null,
        field: getField('00012'),
      },
      '00013': {
        existing: false,
        value: null,
        field: getField('00013'),
      },
      '00014': {
        existing: false,
        value: null,
        field: getField('00014'),
      },
      '00015': {
        existing: false,
        value: null,
        field: getField('00015'),
      },
      '00016': {
        existing: false,
        value: null,
        field: getField('00016'),
      },
      '00017': {
        existing: false,
        value: null,
        field: getField('00017'),
      },
      '00018': {
        existing: false,
        value: null,
        field: getField('00018'),
      },
      '00019': {
        existing: false,
        value: null,
        field: getField('00019'),
      },
      '00021': {
        existing: false,
        value: null,
        field: getField('00021'),
      },
      '00020': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.BOOLEAN,
          value: false,
        },
        field: getField('00020'),
      },
      '00023': {
        existing: false,
        value: null,
        field: getField('00023'),
      },
    },
    '2020-02-09': {
      '00001': {
        existing: false,
        value: null,
        field: getField('00001'),
      },
      '00002': {
        existing: false,
        value: null,
        field: getField('00002'),
      },
      '00003': {
        existing: false,
        value: null,
        field: getField('00003'),
      },
      '00004': {
        existing: false,
        value: null,
        field: getField('00004'),
      },
      '00005': {
        existing: false,
        value: null,
        field: getField('00005'),
      },
      '00006': {
        existing: false,
        value: null,
        field: getField('00006'),
      },
      '00007': {
        existing: false,
        value: null,
        field: getField('00007'),
      },
      '00008': {
        existing: false,
        value: null,
        field: getField('00008'),
      },
      '00009': {
        existing: false,
        value: null,
        field: getField('00009'),
      },
      '00010': {
        existing: false,
        value: null,
        field: getField('00010'),
      },
      '00011': {
        existing: false,
        value: null,
        field: getField('00011'),
      },
      '00012': {
        existing: false,
        value: null,
        field: getField('00012'),
      },
      '00013': {
        existing: false,
        value: null,
        field: getField('00013'),
      },
      '00014': {
        existing: false,
        value: null,
        field: getField('00014'),
      },
      '00015': {
        existing: false,
        value: null,
        field: getField('00015'),
      },
      '00016': {
        existing: false,
        value: null,
        field: getField('00016'),
      },
      '00017': {
        existing: false,
        value: null,
        field: getField('00017'),
      },
      '00018': {
        existing: false,
        value: null,
        field: getField('00018'),
      },
      '00019': {
        existing: false,
        value: null,
        field: getField('00019'),
      },
      '00021': {
        existing: false,
        value: null,
        field: getField('00021'),
      },
      '00020': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.BOOLEAN,
          value: false,
        },
        field: getField('00020'),
      },
      '00023': {
        existing: false,
        value: null,
        field: getField('00023'),
      },
    },
    '2020-02-10': {
      '00001': {
        existing: false,
        value: null,
        field: getField('00001'),
      },
      '00002': {
        existing: false,
        value: null,
        field: getField('00002'),
      },
      '00003': {
        existing: false,
        value: null,
        field: getField('00003'),
      },
      '00004': {
        existing: false,
        value: null,
        field: getField('00004'),
      },
      '00005': {
        existing: false,
        value: null,
        field: getField('00005'),
      },
      '00006': {
        existing: false,
        value: null,
        field: getField('00006'),
      },
      '00007': {
        existing: false,
        value: null,
        field: getField('00007'),
      },
      '00008': {
        existing: false,
        value: null,
        field: getField('00008'),
      },
      '00009': {
        existing: false,
        value: null,
        field: getField('00009'),
      },
      '00010': {
        existing: false,
        value: null,
        field: getField('00010'),
      },
      '00011': {
        existing: false,
        value: null,
        field: getField('00011'),
      },
      '00012': {
        existing: false,
        value: null,
        field: getField('00012'),
      },
      '00013': {
        existing: false,
        value: null,
        field: getField('00013'),
      },
      '00014': {
        existing: false,
        value: null,
        field: getField('00014'),
      },
      '00015': {
        existing: false,
        value: null,
        field: getField('00015'),
      },
      '00016': {
        existing: false,
        value: null,
        field: getField('00016'),
      },
      '00017': {
        existing: false,
        value: null,
        field: getField('00017'),
      },
      '00018': {
        existing: false,
        value: null,
        field: getField('00018'),
      },
      '00019': {
        existing: false,
        value: null,
        field: getField('00019'),
      },
      '00021': {
        existing: false,
        value: null,
        field: getField('00021'),
      },
      '00020': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.BOOLEAN,
          value: false,
        },
        field: getField('00020'),
      },
      '00023': {
        existing: false,
        value: null,
        field: getField('00023'),
      },
    },
    '2020-02-11': {
      '00001': {
        existing: false,
        value: null,
        field: getField('00001'),
      },
      '00002': {
        existing: false,
        value: null,
        field: getField('00002'),
      },
      '00003': {
        existing: false,
        value: null,
        field: getField('00003'),
      },
      '00004': {
        existing: false,
        value: null,
        field: getField('00004'),
      },
      '00005': {
        existing: false,
        value: null,
        field: getField('00005'),
      },
      '00006': {
        existing: false,
        value: null,
        field: getField('00006'),
      },
      '00007': {
        existing: false,
        value: null,
        field: getField('00007'),
      },
      '00008': {
        existing: false,
        value: null,
        field: getField('00008'),
      },
      '00009': {
        existing: false,
        value: null,
        field: getField('00009'),
      },
      '00010': {
        existing: false,
        value: null,
        field: getField('00010'),
      },
      '00011': {
        existing: false,
        value: null,
        field: getField('00011'),
      },
      '00012': {
        existing: false,
        value: null,
        field: getField('00012'),
      },
      '00013': {
        existing: false,
        value: null,
        field: getField('00013'),
      },
      '00014': {
        existing: false,
        value: null,
        field: getField('00014'),
      },
      '00015': {
        existing: false,
        value: null,
        field: { ...getField('00015'), editable: false },
      },
      '00016': {
        existing: false,
        value: null,
        field: getField('00016'),
      },
      '00017': {
        existing: false,
        value: null,
        field: getField('00017'),
      },
      '00018': {
        existing: false,
        value: null,
        field: getField('00018'),
      },
      '00019': {
        existing: false,
        value: null,
        field: getField('00019'),
      },
      '00021': {
        existing: false,
        value: null,
        field: getField('00021'),
      },
      '00020': {
        existing: false,
        value: null,
        field: getField('00020'),
      },
      '00023': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.BOOLEAN,
          value: true,
        },
        field: getField('00023'),
      },
    },
    '2020-02-12': {
      '00001': {
        existing: false,
        value: null,
        field: getField('00001'),
      },
      '00002': {
        existing: false,
        value: null,
        field: getField('00002'),
      },
      '00003': {
        existing: false,
        value: null,
        field: getField('00003'),
      },
      '00004': {
        existing: false,
        value: null,
        field: getField('00004'),
      },
      '00005': {
        existing: false,
        value: null,
        field: getField('00005'),
      },
      '00006': {
        existing: false,
        value: null,
        field: getField('00006'),
      },
      '00007': {
        existing: false,
        value: null,
        field: getField('00007'),
      },
      '00008': {
        existing: false,
        value: null,
        field: getField('00008'),
      },
      '00009': {
        existing: false,
        value: null,
        field: getField('00009'),
      },
      '00010': {
        existing: false,
        value: null,
        field: getField('00010'),
      },
      '00011': {
        existing: false,
        value: null,
        field: getField('00011'),
      },
      '00012': {
        existing: false,
        value: null,
        field: getField('00012'),
      },
      '00013': {
        existing: false,
        value: null,
        field: getField('00013'),
      },
      '00014': {
        existing: false,
        value: null,
        field: getField('00014'),
      },
      '00015': {
        existing: false,
        value: null,
        field: { ...getField('00015'), editable: false },
      },
      '00016': {
        existing: false,
        value: null,
        field: getField('00016'),
      },
      '00017': {
        existing: false,
        value: null,
        field: getField('00017'),
      },
      '00018': {
        existing: false,
        value: null,
        field: getField('00018'),
      },
      '00019': {
        existing: false,
        value: null,
        field: getField('00019'),
      },
      '00021': {
        existing: false,
        value: null,
        field: getField('00021'),
      },
      '00020': {
        existing: false,
        value: null,
        field: getField('00020'),
      },
      '00023': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.BOOLEAN,
          value: true,
        },
        field: getField('00023'),
      },
    },
    '2020-02-13': {
      '00001': {
        existing: false,
        value: null,
        field: getField('00001'),
      },
      '00002': {
        existing: false,
        value: null,
        field: getField('00002'),
      },
      '00003': {
        existing: false,
        value: null,
        field: getField('00003'),
      },
      '00004': {
        existing: false,
        value: null,
        field: getField('00004'),
      },
      '00005': {
        existing: false,
        value: null,
        field: getField('00005'),
      },
      '00006': {
        existing: false,
        value: null,
        field: getField('00006'),
      },
      '00007': {
        existing: false,
        value: null,
        field: getField('00007'),
      },
      '00008': {
        existing: false,
        value: null,
        field: getField('00008'),
      },
      '00009': {
        existing: false,
        value: null,
        field: getField('00009'),
      },
      '00010': {
        existing: false,
        value: null,
        field: getField('00010'),
      },
      '00011': {
        existing: false,
        value: null,
        field: getField('00011'),
      },
      '00012': {
        existing: false,
        value: null,
        field: getField('00012'),
      },
      '00013': {
        existing: false,
        value: null,
        field: getField('00013'),
      },
      '00014': {
        existing: false,
        value: null,
        field: getField('00014'),
      },
      '00015': {
        existing: false,
        value: null,
        field: { ...getField('00015'), editable: false },
      },
      '00016': {
        existing: false,
        value: null,
        field: getField('00016'),
      },
      '00017': {
        existing: false,
        value: null,
        field: getField('00017'),
      },
      '00018': {
        existing: false,
        value: null,
        field: getField('00018'),
      },
      '00019': {
        existing: false,
        value: null,
        field: getField('00019'),
      },
      '00021': {
        existing: false,
        value: null,
        field: getField('00021'),
      },
      '00020': {
        existing: false,
        value: null,
        field: getField('00020'),
      },
      '00023': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.BOOLEAN,
          value: true,
        },
        field: getField('00023'),
      },
    },
    '2020-02-14': {
      '00001': {
        existing: false,
        value: null,
        field: getField('00001'),
      },
      '00002': {
        existing: false,
        value: null,
        field: getField('00002'),
      },
      '00003': {
        existing: false,
        value: null,
        field: getField('00003'),
      },
      '00004': {
        existing: false,
        value: null,
        field: getField('00004'),
      },
      '00005': {
        existing: false,
        value: null,
        field: getField('00005'),
      },
      '00006': {
        existing: false,
        value: null,
        field: getField('00006'),
      },
      '00007': {
        existing: false,
        value: null,
        field: getField('00007'),
      },
      '00008': {
        existing: false,
        value: null,
        field: getField('00008'),
      },
      '00009': {
        existing: false,
        value: null,
        field: getField('00009'),
      },
      '00010': {
        existing: false,
        value: null,
        field: getField('00010'),
      },
      '00011': {
        existing: false,
        value: null,
        field: getField('00011'),
      },
      '00012': {
        existing: false,
        value: null,
        field: getField('00012'),
      },
      '00013': {
        existing: false,
        value: null,
        field: getField('00013'),
      },
      '00014': {
        existing: false,
        value: null,
        field: getField('00014'),
      },
      '00015': {
        existing: false,
        value: null,
        field: getField('00015'),
      },
      '00016': {
        existing: false,
        value: null,
        field: getField('00016'),
      },
      '00017': {
        existing: false,
        value: null,
        field: getField('00017'),
      },
      '00018': {
        existing: false,
        value: null,
        field: getField('00018'),
      },
      '00019': {
        existing: false,
        value: null,
        field: getField('00019'),
      },
      '00021': {
        existing: false,
        value: null,
        field: getField('00021'),
      },
      '00020': {
        existing: false,
        value: null,
        field: getField('00020'),
      },
      '00023': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.BOOLEAN,
          value: true,
        },
        field: getField('00023'),
      },
    },
    '2020-02-15': {
      '00001': {
        existing: false,
        value: null,
        field: getField('00001'),
      },
      '00002': {
        existing: false,
        value: null,
        field: getField('00002'),
      },
      '00003': {
        existing: false,
        value: null,
        field: getField('00003'),
      },
      '00004': {
        existing: false,
        value: null,
        field: getField('00004'),
      },
      '00005': {
        existing: false,
        value: null,
        field: getField('00005'),
      },
      '00006': {
        existing: false,
        value: null,
        field: getField('00006'),
      },
      '00007': {
        existing: false,
        value: null,
        field: getField('00007'),
      },
      '00008': {
        existing: false,
        value: null,
        field: getField('00008'),
      },
      '00009': {
        existing: false,
        value: null,
        field: getField('00009'),
      },
      '00010': {
        existing: false,
        value: null,
        field: getField('00010'),
      },
      '00011': {
        existing: false,
        value: null,
        field: getField('00011'),
      },
      '00012': {
        existing: false,
        value: null,
        field: getField('00012'),
      },
      '00013': {
        existing: false,
        value: null,
        field: getField('00013'),
      },
      '00014': {
        existing: false,
        value: null,
        field: getField('00014'),
      },
      '00015': {
        existing: false,
        value: null,
        field: getField('00015'),
      },
      '00016': {
        existing: false,
        value: null,
        field: getField('00016'),
      },
      '00017': {
        existing: false,
        value: null,
        field: getField('00017'),
      },
      '00018': {
        existing: false,
        value: null,
        field: getField('00018'),
      },
      '00019': {
        existing: false,
        value: null,
        field: getField('00019'),
      },
      '00021': {
        existing: false,
        value: null,
        field: getField('00021'),
      },
      '00020': {
        existing: false,
        value: null,
        field: getField('00020'),
      },
      '00023': {
        existing: true,
        value: {
          type: LAYOUT_ITEM_TYPE.BOOLEAN,
          value: true,
        },
        field: getField('00023'),
      },
    },
  };
