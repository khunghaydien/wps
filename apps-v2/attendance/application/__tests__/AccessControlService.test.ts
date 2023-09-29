import {
  isPermissionSatisfied,
  Permission,
} from '@apps/domain/models/access-control/Permission';

import * as AccessControlService from '../AccessControlService';

jest.mock('@apps/domain/models/access-control/Permission');

beforeEach(() => {
  jest.clearAllMocks();
});

it('throw error if it is not initialized', () => {
  expect(() => {
    AccessControlService.isPermissionSatisfied({
      isByDelegate: true,
    });
  }).toThrowError();
});

it('should call isPermissionSatisfied', () => {
  AccessControlService.setPermission(
    'TEST PERMISSION' as unknown as Permission
  );
  (isPermissionSatisfied as jest.Mock).mockReturnValueOnce(true);
  const result = AccessControlService.isPermissionSatisfied({
    isByDelegate: true,
  });
  expect(result).toBeTruthy();
  expect(isPermissionSatisfied).toBeCalledTimes(1);
  expect(isPermissionSatisfied).toBeCalledWith({
    userPermission: 'TEST PERMISSION',
    isByDelegate: true,
  });
});
