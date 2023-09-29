import { IRequestListRepository } from '@apps/domain/models/approval/request/Request';

import fetch from './fetch';

const repository: IRequestListRepository = {
  fetch,
};

export default repository;
