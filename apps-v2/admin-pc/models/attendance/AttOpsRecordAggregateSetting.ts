export type AttOpsRecordAggregateSetting = {
  label: string; // 運用項目の集計対象の項目名称
  fieldName: string; // 運用項目の集計対象のフィールド
  aggregateType: string; // 運用項目の集計対象の集計タイプ
};

export const updateOpsRecordByKey = (
  index: number,
  key: keyof AttOpsRecordAggregateSetting,
  value: string,
  originalRecord: AttOpsRecordAggregateSetting[]
): AttOpsRecordAggregateSetting[] => {
  let newOriginalRecord: AttOpsRecordAggregateSetting[] = [];
  if (originalRecord?.length > index) {
    const tempRecord = Object.assign(originalRecord);
    const record = { ...tempRecord[index], [key]: value };
    tempRecord[index] = record;
    return tempRecord;
  } else {
    if (originalRecord?.length === 0) {
      newOriginalRecord = new Array(1).fill({
        label: null,
        fieldName: null,
        aggregateType: null,
      });
    } else {
      newOriginalRecord = new Array(
        Math.abs(index - originalRecord.length)
      ).fill({
        label: null,
        fieldName: null,
        aggregateType: null,
      });
    }

    const newRecord = originalRecord.concat(newOriginalRecord);
    const record = { ...newRecord[index], [key]: value };
    newRecord[index] = record;

    return newRecord;
  }
};
