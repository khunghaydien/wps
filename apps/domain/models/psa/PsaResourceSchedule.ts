import msg from '@apps/commons/languages';

export const ScheduleStrategyConst = {
  AdjustConsiderAvailability: 'AdjustConsiderAvailability',
  AdjustIgnoreAvailability: 'AdjustIgnoreAvailability',
  FixedConsiderAvailability: 'FixedConsiderAvailability',
  FixedIgnoreAvailability: 'FixedIgnoreAvailability',
};

export const StrategyOptions = () => [
  {
    value: ScheduleStrategyConst.AdjustConsiderAvailability,
    label: msg().Psa_Lbl_StrategyAdjustConsiderAvailability,
  },
  {
    value: ScheduleStrategyConst.AdjustIgnoreAvailability,
    label: msg().Psa_Lbl_StrategyAdjustIgnoreAvailability,
  },
  {
    value: ScheduleStrategyConst.FixedConsiderAvailability,
    label: msg().Psa_Lbl_StrategyFixedConsiderAvailability,
  },
  {
    value: ScheduleStrategyConst.FixedIgnoreAvailability,
    label: msg().Psa_Lbl_StrategyIgnoreAvailability,
  },
];

export const WorkHoursPerDayOptions = () => [
  {
    value: 1,
    label: `1 ${msg().Psa_Lbl_HourPerDay}`,
  },
  {
    value: 2,
    label: `2 ${msg().Psa_Lbl_HoursPerDay}`,
  },
  {
    value: 3,
    label: `3 ${msg().Psa_Lbl_HoursPerDay}`,
  },
  {
    value: 4,
    label: `4 ${msg().Psa_Lbl_HoursPerDay}`,
  },
  {
    value: 5,
    label: `5 ${msg().Psa_Lbl_HoursPerDay}`,
  },
  {
    value: 6,
    label: `6 ${msg().Psa_Lbl_HoursPerDay}`,
  },
  {
    value: 7,
    label: `7 ${msg().Psa_Lbl_HoursPerDay}`,
  },
  {
    value: 8,
    label: `8 ${msg().Psa_Lbl_HoursPerDay}`,
  },
];
