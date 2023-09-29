import { IFixDailyRequestRepository } from '@attendance/domain/models/FixDailyRequest';

export default {
  submit: jest.fn(),
  canSubmit: jest.fn(() => Promise.resolve({ confirmation: null })),
  cancelApproval: jest.fn(),
  cancelSubmitted: jest.fn(),
} as IFixDailyRequestRepository;
