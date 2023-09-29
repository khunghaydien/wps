import { IDailyRecordRepository } from '@attendance/domain/models/AttDailyRecord';

export default {
  save: jest.fn(),
  saveRemarks: jest.fn(),
  fillRestTime: jest.fn(),
  saveFields: jest.fn(),
} as IDailyRecordRepository;
