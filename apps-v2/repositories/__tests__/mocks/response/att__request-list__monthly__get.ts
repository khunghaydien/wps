import { generateMockRequest } from '../helpers/employee';

export default {
  requestList: [
    generateMockRequest({
      requestDate: '2017-10-01',
      targetMonth: '2017-09-01',
    }),
  ],
};
