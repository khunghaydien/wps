import _ from 'lodash';

import companySettingsV1 from '@admin-pc/constants/Setting/companySettings';

const companySettingsV2 = _.cloneDeep(companySettingsV1);

const { childMenuList: GeneralCommonChildMenuItems } =
  companySettingsV2[0].menuList[0];

const { childMenuList: ExpenseCommonChildMenuItems } = _.get(
  companySettingsV2[4],
  'menuList.0'
);

// Insert Position menu item after Employee
// Insert Organization Hierarchy Pattern after Position
const empIdx = GeneralCommonChildMenuItems.findIndex((x) => x.key === 'Emp');
const positionIdx = empIdx + 1;
const orgHierarchyPatternIdx = empIdx + 2;

GeneralCommonChildMenuItems.splice(positionIdx, 0, {
  key: 'Position',
  name: 'Admin_Lbl_Position',
  requiredPermission: ['managePosition'],
});

GeneralCommonChildMenuItems.splice(orgHierarchyPatternIdx, 0, {
  key: 'OrgHierarchy',
  name: 'Admin_Lbl_OrganizationHierarchyPattern',
  requiredPermission: ['manageOrgHPattern'],
});

// Replace Access Permission Management with Feature Access
const permissionIdx = GeneralCommonChildMenuItems.findIndex(
  (x) => x.key === 'Permission'
);
GeneralCommonChildMenuItems.splice(permissionIdx, 1, {
  key: 'FeatureAccess',
  name: 'Admin_Lbl_AccessPermissionManagement',
  requiredPermission: ['managePermission'],
});

if (ExpenseCommonChildMenuItems) {
  // Insert Mileage in Expense Settings After Vendor
  const mileageIdx =
    ExpenseCommonChildMenuItems.findIndex((x) => x.key === 'Vendor') + 1;
  ExpenseCommonChildMenuItems.splice(mileageIdx, 0, {
    key: 'MileageRate',
    name: '$Exp_Clbl_MileageRate',
    requiredPermission: ['manageExpMileageRate'],
  });
}

export default companySettingsV2;
