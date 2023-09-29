export type PsaWorkScheme = {
  id: string;
  companyId: string;
  code: string;
  name_L0: string;
  name_L2: string;
  name_L1: string;
  workingDayMON: boolean;
  workingDayTUE: boolean;
  workingDayWED: boolean;
  workingDayTHU: boolean;
  workingDayFRI: boolean;
  workingDaySAT: boolean;
  workingDaySUN: boolean;
  workTimePerDay: number;
  adminComment: string;
};
