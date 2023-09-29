import React from 'react';

import DateUtil from '@apps/commons/utils/DateUtil';

export const useFormattedDate = (date: Date): string => {
  const locale = React.useMemo(() => DateUtil.currentLang(), []);
  const formatter = React.useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        weekday: 'short',
      }),
    [locale]
  );
  const formattedDate = React.useMemo(() => {
    return formatter.format(date);
  }, [date, formatter]);

  return formattedDate;
};
