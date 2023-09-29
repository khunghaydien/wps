import { Allowances } from '../models/attDailyAllowanceAll';

export const DailyAllowanceMergeDataUtil = (
  dailyAllowanceAllList: Allowances[],
  dailyAllowanceList: Allowances[]
) => {
  const tempDailyAllowanceAllData = [];
  const tempDailyAllowanceCheckedData = [];

  if (dailyAllowanceAllList !== null && dailyAllowanceAllList !== undefined) {
    dailyAllowanceAllList.forEach((item, index) => {
      tempDailyAllowanceAllData.push(
        Object.assign({}, item, {
          startTime: null,
          endTime: null,
          totalTime: null,
          quantity: null,
          isSelected: false,
        })
      );
      if (item.order === null) {
        tempDailyAllowanceAllData[index].order = 0;
      }
      if (item.allowanceCode === null) {
        tempDailyAllowanceAllData[index].allowanceCode = '';
      }
    });
  }

  if (dailyAllowanceList !== null && dailyAllowanceList !== undefined) {
    dailyAllowanceList.forEach((item, index) => {
      tempDailyAllowanceCheckedData.push(
        Object.assign({}, item, {
          isSelected: true,
        })
      );
      if (item.order === null) {
        tempDailyAllowanceCheckedData[index].order = 0;
      }
      if (item.allowanceCode === null) {
        tempDailyAllowanceCheckedData[index].allowanceCode = '';
      }
      if (item.allowanceId === null) {
        tempDailyAllowanceCheckedData[index].allowanceId = '';
      }
    });
  }

  tempDailyAllowanceCheckedData.forEach((item) => {
    tempDailyAllowanceAllData.forEach((ele, key) => {
      if (item.allowanceId === ele.allowanceId) {
        tempDailyAllowanceAllData.splice(key, 1);
      }
    });
  });

  // merge
  const sortDailyAllowanceAllData = tempDailyAllowanceAllData.concat(
    tempDailyAllowanceCheckedData
  );

  // remove when AllowanceId is Duplicated
  // const removedDuplicateDailyAllowanceData = [];
  // const tempObj = {};
  // for (let i = 0; i < sortDailyAllowanceAllData.length; i++) {
  //   if (!tempObj[sortDailyAllowanceAllData[i].allowanceId]) {
  //     removedDuplicateDailyAllowanceData.push(sortDailyAllowanceAllData[i]);
  //     tempObj[sortDailyAllowanceAllData[i].allowanceId] = true;
  //   }
  // }

  // sort
  const sortForDailyAllowanceAllDataStart = sortDailyAllowanceAllData.sort(
    (preValue, nextValue) => preValue.order - nextValue.order
  );
  const sortForDailyAllowanceAllDataFinish =
    sortForDailyAllowanceAllDataStart.sort((preValue, nextValue) => {
      if (preValue.order === nextValue.order) {
        return preValue.allowanceCode.localeCompare(nextValue.allowanceCode);
      }
      return 0;
    });
  return sortForDailyAllowanceAllDataFinish;
};
