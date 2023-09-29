const getTimeFromISODateString = (ISODateString: string): number => {
  const [year, month, date] = ISODateString.split('-');
  return new Date(Number(year), Number(month) - 1, Number(date)).getTime();
};

const getTimeFromTerm = (term: string): number | false => {
  const parsed = new Date(term);
  return (
    // @ts-ignore
    !isNaN(parsed) &&
    new Date(
      parsed.getFullYear(),
      parsed.getMonth(),
      parsed.getDate()
    ).getTime()
  );
};

// NOTE: '2018-10-01' と '2018/10/1' では評価が異なる点を考慮している
const isDateIncludedInValidDate = (
  row: { validDate: { from: string; through: string } },
  { filterTerm }: { filterTerm: string }
): boolean => {
  const from = getTimeFromISODateString(row.validDate.from);
  const through = getTimeFromISODateString(row.validDate.through);
  const target = getTimeFromTerm(filterTerm);
  return target !== false && from <= target && target <= through;
};

export default isDateIncludedInValidDate;
