import AttRecord from '../../../../../models/AttRecord';

import attRecordList from './attRecordList';

type TimeTrackingRecords = {
  [key: string]: { workTime?: number; totalTaskTime?: number };
};

const makeData = (attRecord: AttRecord) => {
  if (attRecord.dayType === 'Workday') {
    return attRecord.displayDay === '金'
      ? {
          workTime: 550,
        }
      : {
          workTime: 500,
          totalTaskTime: 450,
        };
  } else if (
    attRecord.dayType === 'Holiday' ||
    attRecord.dayType === 'LegalHoliday'
  ) {
    return {};
  } else {
    return {};
  }
};

const records: TimeTrackingRecords = attRecordList.reduce(
  (acc: TimeTrackingRecords, attRecord: AttRecord) => ({
    ...acc,
    [attRecord.recordDate]: makeData(attRecord),
  }),
  {}
);

export default records;
