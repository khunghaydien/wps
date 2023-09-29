export type SubstituteLeaveType = 'None' | 'Substitute' | 'CompensatoryStocked';

export const SUBSTITUTE_LEAVE_TYPE: {
  [key in SubstituteLeaveType]: SubstituteLeaveType;
} = {
  None: 'None',
  Substitute: 'Substitute',
  CompensatoryStocked: 'CompensatoryStocked',
};

export const ORDER_OF_SUBSTITUTE_LEAVE_TYPES: SubstituteLeaveType[] = [
  SUBSTITUTE_LEAVE_TYPE.None,
  SUBSTITUTE_LEAVE_TYPE.Substitute,
  SUBSTITUTE_LEAVE_TYPE.CompensatoryStocked,
];

export type ValidPeriodUnitMap = {
  Day: 'Day';
  Monthly: 'Monthly';
};

export type ValidPeriodUnit = ValidPeriodUnitMap[keyof ValidPeriodUnitMap];

export const VALID_PERIOD_UNIT: ValidPeriodUnitMap = {
  Day: 'Day',
  Monthly: 'Monthly',
};

export interface ISubstituteLeaveTypesFactory {
  create: (...args: unknown[]) => SubstituteLeaveType[];
}
