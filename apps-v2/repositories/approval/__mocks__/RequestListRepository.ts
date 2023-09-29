import { IRequestListRepository } from '@apps/domain/models/approval/request/Request';

const repository: IRequestListRepository = {
  fetch: jest.fn(),
};

export default repository;
