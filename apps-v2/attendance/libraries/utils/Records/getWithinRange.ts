export default <
  $Record extends {
    startDate: string;
    endDate: string;
  }
>(
  date: string,
  records: $Record[]
) =>
  records?.find(
    ({ startDate, endDate }) => startDate <= date && date <= endDate
  );
