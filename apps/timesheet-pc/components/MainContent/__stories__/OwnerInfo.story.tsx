import React from 'react';

import OwnerInfo from '../OwnerInfo';
import ownerInfo from './mock-data/ownerInfo';

export default {
  title: 'timesheet-pc/MainContent',
};

export const _OwnerInfo = () => <OwnerInfo ownerInfo={ownerInfo} />;

_OwnerInfo.parameters = {
  info: { propTables: [OwnerInfo], inline: true, source: true },
};
