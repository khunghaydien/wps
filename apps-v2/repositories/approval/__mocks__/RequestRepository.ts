import { IRequestRepository } from '@apps/domain/models/approval/request/Request';

const repository: IRequestRepository = {
  approve: jest.fn(),
  reject: jest.fn(),
  fetchCount: jest.fn(),
};

export default repository;
