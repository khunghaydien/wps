import React from 'react';

import IconActivities from '@apps/commons/images/icons/iconActivities.svg';
import IconProjectFinance from '@apps/commons/images/icons/IconProjectFinance.svg';
import IconProjectOverview from '@apps/commons/images/icons/iconProjectOverview.svg';
import IconFileUpload from '@apps/commons/images/icons/upload.svg';
import msg from '@apps/commons/languages';

const ROOT = 'ts-psa__sidebar';

const sidebarListData = () => [
  {
    key: 'ACTIVITY',
    icon: <IconActivities className={`${ROOT}__icon-activity`} />,
    text: msg().Psa_Lbl_Activities,
  },
  {
    key: 'PROJECT',
    icon: <IconProjectOverview className={`${ROOT}__icon-project`} />,
    text: msg().Psa_Lbl_ProjectOverview,
  },
  {
    key: 'FINANCE',
    icon: <IconProjectFinance className={`${ROOT}__icon-finance`} />,
    text: msg().Psa_Lbl_ProjectFinance,
  },
  {
    key: 'UPLOAD',
    icon: <IconFileUpload className={`${ROOT}__icon-upload`} fill="#000" />,
    text: msg().Psa_Lbl_FileUpload,
  },
];

export default sidebarListData;
