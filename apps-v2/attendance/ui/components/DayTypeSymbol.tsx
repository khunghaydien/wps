import React from 'react';

import { DAY_TYPE, DayType } from '@attendance/domain/models/AttDailyRecord';

import Holiday from '@attendance/ui/images/holiday.svg';
import LegalHoliday from '@attendance/ui/images/legalHoliday.svg';
import PreferredLegalHoliday from '@attendance/ui/images/preferredLegalHoliday.svg';

type Props = {
  dayType: DayType;
};

const dayTypeIcon = (dayType: DayType) => {
  let template = null;

  if (dayType === DAY_TYPE.LegalHoliday) {
    template = <LegalHoliday />;
  } else if (dayType === DAY_TYPE.PreferredLegalHoliday) {
    template = <PreferredLegalHoliday />;
  } else if (dayType === DAY_TYPE.Holiday) {
    template = <Holiday />;
  }
  return template;
};

export default class DayTypeSymbol extends React.Component<Props> {
  render() {
    return <React.Fragment>{dayTypeIcon(this.props.dayType)}</React.Fragment>;
  }
}
