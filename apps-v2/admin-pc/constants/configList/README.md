# config の書き方について

**expamle**

```js
configList.base = [
  { key: 'id', type: FIELD_HIDDEN },
  { key: 'code', msgkey: 'Admin_Lbl_Code', type: FIELD_TEXT, isRequired: true },
  {
    key: 'name',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
    display: DISPLAY_LIST,
  },
  {
    key: 'name_L0',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
    isRequired: true,
  },
  {
    key: 'name_L1',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
  },
  {
    key: 'name_L2',
    msgkey: 'Admin_Lbl_Name',
    type: FIELD_TEXT,
    display: DISPLAY_DETAIL,
  },
];
```

## 各項目ごとの props

### key

使用するデータの prop key

### msg key

リストのヘッダーと詳細のラベルに使用する msg key, `en_US.csv` で記述した key を指定する

### type

項目のタイプ、テキストフィールドやセレクトボックスにするかどうかなどを設定する

### isRequred

必須入力項目にするかどうかのフラグ

### display

項目をリストもしくは詳細ページの **どちらか片方だけ** に表示する場合に設定する

- DIAPLAY_LIST  
  リストのみに表示する
- DIAPLAY_DETAIL  
  詳細にのみに表示する

## `condition: (string => ?string, string => ?string) => boolean`

Function to return whether the item should be displayed or not. Return true to render the item.

**Function Arguments**

1. `baseValueGetter(key)` : Return the value of specified key in base items.
1. `historyValueGetter(key)` : Return the value of specified key in history items.

**Example**

```javascript
// Change the label by selected work system.
{
  key: 'startTime',
  // Admin_Lbl_WorkingHours: 始業終業時刻
  msgkey: 'Admin_Lbl_WorkingHours',
  condition: (baseValueGetter) => baseValueGetter('workSystem') !== 'JP:Flex'
},
{
  key: 'startTime',
  // Admin_Lbl_CoreTime: コアタイム
  msgkey: 'Admin_Lbl_CoreTime',
  condition: (baseValueGetter) => baseValueGetter('workSystem') === 'JP:Flex'
},
```
