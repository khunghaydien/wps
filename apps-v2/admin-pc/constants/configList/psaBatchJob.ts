import fieldType from '@admin-pc/constants/fieldType';

import { ConfigList, ConfigListMap } from '@admin-pc/utils/ConfigUtil';

import BatchJobList from '@apps/admin-pc/components/PsaBatchJobList/BatchJobList';

const { FIELD_HIDDEN, FIELD_CUSTOM } = fieldType;
const base: ConfigList = [
  {
    key: 'companyId',
    type: FIELD_HIDDEN,
  },
  {
    section: 'PsaBatchJobProject',
    msgkey: 'Admin_Lbl_PsaBatchJobProject',
    isExpandable: false,
    configList: [
      {
        key: 'PROJECT',
        noLabel: true,
        type: FIELD_CUSTOM,
        Component: BatchJobList,
        enableMode: [''],
      },
    ],
  },
  {
    section: 'PsaBatchJobResource',
    msgkey: 'Admin_Lbl_PsaBatchJobResource',
    isExpandable: false,
    configList: [
      {
        key: 'RESOURCE',
        noLabel: true,
        type: FIELD_CUSTOM,
        Component: BatchJobList,
        enableMode: [''],
      },
    ],
  },
  // {
  //   section: 'PsaBatchJobOther',
  //   msgkey: 'Admin_Lbl_PsaBatchJobOther',
  //   isExpandable: false,
  //   configList: [
  //     {
  //       key: 'OTHER',
  //       noLabel: true,
  //       type: FIELD_CUSTOM,
  //       Component: BatchJobList,
  //       enableMode: [''],
  //     },
  //   ],
  // },
];

const configList: ConfigListMap = {
  base,
};

export default configList;
