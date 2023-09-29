export default <
  $Record extends {
    startDate: string;
    endDate: string;
  }
>(
  date: string,
  records: $Record[]
) => {
  if (!records) {
    return;
  }

  let result: $Record;

  for (const record of records) {
    if (record.startDate <= date && date <= record.endDate) {
      result = record;
      break;
    }
    if (result) {
      if (date < record.startDate && record.startDate < result.startDate) {
        result = record;
      } else if (record.endDate < date && result.endDate < record.endDate) {
        result = record;
      }
    } else {
      result = record;
    }
  }

  return result;
};
