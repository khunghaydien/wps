import React from 'react';

import CalendarUtil from '../../../commons/utils/CalendarUtil';

import DateCell from './DateCell';

type Props = Readonly<{
  weekDates: ReadonlyArray<Date>;
  today: Date;
  useWorkTime?: boolean;
  /**
   * The month of opened calendar.
   * The value takes 0 ~ 11.
   */
  month: number;
}>;

const Dates: React.FC<Props> = ({
  weekDates,
  today,
  month,
  useWorkTime,
}: Props) => (
  <>
    {weekDates.map((date) => (
      <DateCell
        useWorkTime={useWorkTime}
        date={date}
        today={CalendarUtil.isSameDate(date, today)}
        inactive={date.getMonth() !== month}
      />
    ))}
  </>
);

export default Dates;
