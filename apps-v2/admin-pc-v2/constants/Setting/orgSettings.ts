import cloneDeep from 'lodash/cloneDeep';

import orgSettingsV1 from '@admin-pc/constants/Setting/orgSettings';

const orgSettingsV2 = cloneDeep(orgSettingsV1);

const { menuList } = orgSettingsV2[0];
const employeeMenu = {
  key: 'OverallEmp',
  name: 'Admin_Lbl_Employee',
};
menuList.push(employeeMenu);

export default orgSettingsV2;
