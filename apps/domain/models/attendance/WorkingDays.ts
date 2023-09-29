export const workingCheckTypeCode = {
  LEAVE: 'Leave',
  HOLIDAY: 'Holiday',
  LEGAL_HOLIDAY: 'LegalHoliday',
  LEAVE_OF_ABSENCE: 'LeaveOfAbsence',
  ABSENCE: 'Absence',
};

type WorkingCheckTypeCode =
  | 'Leave' //	The day have Full-day leave request (approved)
  | 'Holiday' // The day is A predetermined holiday of calendar /attendance pattern / work pattern
  | 'LegalHoliday' // The day is A predetermined legal holiday of calendar /attendance pattern / work pattern
  | 'LeaveOfAbsence' // The day in Temporary closure
  | 'Absence'; // The day have Absentee request (approved)

export type AttWorkingDayCheckRecord = {
  isWorkDay: boolean; // Working availability flag. Is it possible to work for work?
  workingCheckType: WorkingCheckTypeCode; // Workday check source
};

export const errorCode = {
  ATT_RECORD_NOT_FOUND: 'ATT_RECORD_NOT_FOUND', // When time statement is not found
  ILLEGAL_ATT_CALCULATION: 'ILLEGAL_ATT_CALCULATION', // Time calculation is incorrect
};

type ErrorCode =
  | 'ATT_RECORD_NOT_FOUND' // When time statement is not found
  | 'ILLEGAL_ATT_CALCULATION'; // Time calculation is incorrect

type RecordError = {
  errorCode: ErrorCode; // Error code
  message: string; // Error message
};

export type WorkingDay = {
  checkDate: string; // checked date
  attWorkingDayCheck: AttWorkingDayCheckRecord; // Workday check result
  isRecordSuccess: boolean; // Execution status for each date
  recordErrors: RecordError; // Record Error for each date
};

export type WorkingDays = { records: Array<WorkingDay> };
