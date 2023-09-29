export type $DayType = {
  WORKDAY: 'Workday';
  HOLIDAY: 'Holiday';
  LEGAL_HOLIDAY: 'LegalHoliday';
};

export type DayTypeEnum = keyof $DayType;

const DayType: $DayType = {
  WORKDAY: 'Workday',
  HOLIDAY: 'Holiday',
  LEGAL_HOLIDAY: 'LegalHoliday',
};

export default DayType;
