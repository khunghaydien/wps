import { MenuSetting } from './types';

const orgSettings: MenuSetting = [
  {
    name: 'Admin_Lbl_Organization',
    requiredPermission: ['manageOverallSetting'],
    menuList: [
      {
        key: 'Organization',
        name: 'Admin_Lbl_CommonSettings',
        isInitialDisplay: true,
      },
      {
        key: 'Country',
        name: 'Admin_Lbl_Country',
      },
      {
        key: 'Company',
        name: 'Admin_Lbl_Company',
      }, //      {
      //        key: 'Administrator',
      //        name: 'Admin_Lbl_Administrator',
      //      },
      {
        key: 'Currency',
        name: 'Admin_Lbl_Currency',
      }, // {
      //   key: 'CountryDefaultTaxType',
      //   name: 'Admin_Lbl_ExpTaxType',
      // },
    ],
  },
];

export default orgSettings;
