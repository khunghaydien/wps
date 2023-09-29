import msg from '@commons/languages';
// color code constants here
export const available = '#d0e9b6';
export const fullyBookedOffDay = '#f9dc8d';
export const capacityExceeded = '#e2b3b2';

export const softBooked = '#008eb6';
export const confirmed = '#51b460';
export const nonProject = '#2d2d2d';
export const nonWorkingDay = '#afadab';
export const outOfRange = '#afadab';

export const LegendToolTip = [
  {
    toolTipTitle: msg().Psa_Lbl_LegendOverview,
    toolTipItemList: [
      {
        text: msg().Psa_Lbl_LegendAvailable,
        color: available,
      },
      {
        text: `${msg().Psa_Lbl_LegendFullyBooked} / ${
          msg().Psa_Lbl_LegendOffDay
        }`,
        color: fullyBookedOffDay,
      },
      {
        text: msg().Psa_Lbl_LegendCapacityExceeded,
        color: capacityExceeded,
      },
      {
        text: msg().Psa_Lbl_LegendOutOfRange,
        color: outOfRange,
      },
    ],
  },
  {
    toolTipTitle: msg().Psa_Lbl_LegendDetails,
    toolTipItemList: [
      {
        text: msg().Psa_Lbl_LegendSoftBooked,
        color: softBooked,
      },
      {
        text: msg().Psa_Lbl_LegendConfirmed,
        color: confirmed,
      },
      {
        text: msg().Psa_Lbl_LegendNonProject,
        color: nonProject,
      },
      {
        text: msg().Psa_Lbl_LegendNonWorkingDay,
        color: nonWorkingDay,
      },
    ],
  },
];
