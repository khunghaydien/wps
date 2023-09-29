import { IObjectivelyEventLogRepository } from '@attendance/domain/models/ObjectivelyEventLog';

export default {
  fetch: jest.fn(),
  create: jest.fn(),
  remove: jest.fn(),
} as IObjectivelyEventLogRepository;
