import defaultPermission, {
  isPermissionSatisfied,
  TotalTestConditions,
} from '../Permission';

describe('isPermissionSatisfied(conditions)', () => {
  describe('By Delegate (isByDelegate: true)', () => {
    describe('Always Allowed (allowIfByDelegate: true)', () => {
      test('Returns true', () => {
        const conditions: TotalTestConditions = {
          isByDelegate: true,
          userPermission: defaultPermission,
          allowIfByDelegate: true,
        };
        expect(isPermissionSatisfied(conditions)).toBe(true);
      });
    });

    describe('Permission Required  (requireIfByEmployee: permissionKey[])', () => {
      describe('With Proper User Permission', () => {
        test('Returns true', () => {
          const conditions: TotalTestConditions = {
            isByDelegate: true,
            requireIfByDelegate: ['cancelAttDailyApprovalByDelegate'],
            userPermission: {
              ...defaultPermission,
              cancelAttDailyApprovalByDelegate: true,
            },
          };
          expect(isPermissionSatisfied(conditions)).toBe(true);
        });
      });

      describe('Without Proper User Permission', () => {
        test('Returns false', () => {
          const conditions: TotalTestConditions = {
            isByDelegate: true,
            requireIfByDelegate: ['cancelAttDailyApprovalByDelegate'],
            userPermission: defaultPermission,
          };
          expect(isPermissionSatisfied(conditions)).toBe(false);
        });
      });
    });
  });

  describe('By Employee (isByDelegate: false)', () => {
    describe('Always Allowed (allowIfByEmployee: true)', () => {
      test('Returns true', () => {
        const conditions: TotalTestConditions = {
          isByDelegate: false,
          userPermission: defaultPermission,
          allowIfByEmployee: true,
        };
        expect(isPermissionSatisfied(conditions)).toBe(true);
      });
    });

    describe('Permission Required  (requireIfByEmployee: permissionKey[])', () => {
      describe('With Proper User Permission', () => {
        test('Returns true', () => {
          const conditions: TotalTestConditions = {
            isByDelegate: false,
            requireIfByEmployee: ['cancelAttDailyApprovalByEmployee'],
            userPermission: {
              ...defaultPermission,
              cancelAttDailyApprovalByEmployee: true,
            },
          };
          expect(isPermissionSatisfied(conditions)).toBe(true);
        });
      });

      describe('Without Proper User Permission', () => {
        test('Returns false', () => {
          const conditions: TotalTestConditions = {
            isByDelegate: false,
            requireIfByEmployee: ['cancelAttDailyApprovalByEmployee'],
            userPermission: defaultPermission,
          };
          expect(isPermissionSatisfied(conditions)).toBe(false);
        });
      });
    });
  });
  describe('If no permissions are specified', () => {
    test('throw new error', () => {
      const conditions: TotalTestConditions = {
        isByDelegate: false,
        userPermission: defaultPermission,
      };
      expect(() => {
        isPermissionSatisfied(conditions);
      }).toThrow('No permissions are specified.');
    });
  });
});
