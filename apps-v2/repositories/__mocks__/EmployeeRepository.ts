import { defaultValue } from '@apps/domain/models/organization/__tests__/mocks/Employee';

export default {
  search: jest.fn().mockResolvedValue([defaultValue]),
};
