const dummyWorkDay = {
  startTime: 8 * 60,
  endTime: 17 * 60,
  dayType: 'WorkDay',
  rest1StartTime: 12 * 60,
  rest1EndTime: 13 * 60,
  rest2StartTime: null,
  rest2EndTime: null,
  rest3StartTime: null,
  rest3EndTime: null,
  rest4StartTime: null,
  rest4EndTime: null,
  rest5StartTime: null,
  rest5EndTime: null,
};

const dummyHoliday = {
  startTime: null,
  endTime: null,
  dayType: null,
  rest1StartTime: null,
  rest1EndTime: null,
  rest2StartTime: null,
  rest2EndTime: null,
  rest3StartTime: null,
  rest3EndTime: null,
  rest4StartTime: null,
  rest4EndTime: null,
  rest5StartTime: null,
  rest5EndTime: null,
};

const createRecord = (num: number) => {
  const recordDate = `2023-02-${String(num).padStart(2, '0')}`;
  const w = (num + 2) % 7;
  if (w === 0 || w === 6) {
    return {
      recordDate,
      ...dummyHoliday,
    };
  } else {
    return {
      recordDate,
      ...dummyWorkDay,
    };
  }
};

export const defaultValue = {
  summaryList: [
    {
      startDate: '2023-02-01',
      endDate: '2023-02-14',
      workingTypeList: null,
      recordList: new Array(14)
        .fill(null)
        .map((_, idx) => createRecord(idx + 1)),
    },
    {
      startDate: '2023-02-15',
      endDate: '2023-02-28',
      workingTypeList: null,
      recordList: new Array(28 - 15)
        .fill(null)
        .map((_, idx) => createRecord(idx + 15)),
    },
  ],
};
