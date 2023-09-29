import uuid from 'uuid';

import Employee from '@widgets/dialogs/ProxyEmployeeSelectDialog/models/Employee';

import { create } from '@attendance/libraries/Event';

export default {
  selectedEmployee: create<Employee>(`SELECTED_EMPLOYEE-${uuid()}`),
} as const;
