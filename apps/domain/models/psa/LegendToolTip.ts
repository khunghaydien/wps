import msg from '@commons/languages';

export const LegendToolTip = [
  {
    toolTipTitle: msg().Psa_Lbl_LegendOverview,
    toolTipItemList: [
      {
        text: msg().Psa_Lbl_LegendAvailable,
        color: 'available',
      },
      {
        text: `${msg().Psa_Lbl_LegendFullyBooked} / ${
          msg().Psa_Lbl_LegendOffDay
        }`,
        color: 'fully-booked-off-day',
      },
      {
        text: msg().Psa_Lbl_LegendCapacityExceeded,
        color: 'capacity-exceeded',
      },
      {
        text: msg().Psa_Lbl_LegendOutOfRange,
        color: 'out-of-range',
      },
    ],
  },
  {
    toolTipTitle: msg().Psa_Lbl_LegendDetails,
    toolTipItemList: [
      {
        text: msg().Psa_Lbl_LegendSoftBooked,
        color: 'soft-booked',
      },
      { text: msg().Psa_Lbl_LegendConfirmed, color: 'confirmed' },
      {
        text: msg().Psa_Lbl_LegendNonProject,
        color: 'non-project',
      },
      {
        text: msg().Psa_Lbl_LegendNonWorkingDay,
        color: 'non-working-day',
      },
    ],
  },
];
