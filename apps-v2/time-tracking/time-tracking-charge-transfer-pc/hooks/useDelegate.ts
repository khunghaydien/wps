import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { Permission } from '@apps/domain/models/access-control/Permission';
import { delegate } from '@apps/domain/models/User';

import { State } from '@apps/time-tracking/time-tracking-charge-transfer-pc/modules';

type User = {
  id: string;
  employeeCode: string;
  employeeName: string;
  employeePhotoUrl: string | undefined | null;
  departmentCode: ''; // Not used?
  departmentName: string;
  title: string;
  managerName: string;
  isDelegated: boolean;
};

type Delegate = [Permission, User | undefined];

export const useDelegate = (): Delegate => {
  const employee = useSelector(
    (state: State) => state.common.proxyEmployeeInfo
  );
  const userPermission = useSelector(
    (state: State) => state.common.accessControl.permission
  );
  // @ts-ignore
  // TODO Fix mismatched type for User | undefined
  const user: User | undefined = useMemo(() => {
    // @ts-ignore
    // TODO Fix mismatched type for delegate and employee
    return employee.id ? delegate(employee) : undefined;
  }, [employee]);

  return [userPermission, user];
};
