import React from 'react';

import { MileageRate as MileageRateProp } from '@apps/domain/models/exp/Mileage';

import {
  MileageRateCreateRequest,
  MileageRateUpdateRequest,
} from '@apps/admin-pc-v2/actions/mileageRate';

import { ConfigListMap } from '@apps/admin-pc/utils/ConfigUtil';

import MainContents from '@admin-pc/components/MainContents';

type Props = {
  actions: {
    search: (requestParam: { companyId?: string; targetDate?: string }) => void;
    delete: (param: { id: string }) => void;
    create: (requestParam: MileageRateCreateRequest) => void;
    update: (param: MileageRateUpdateRequest) => void;
    searchHistory: (param: { baseId: string }) => void;
    createHistory: (param: MileageRateCreateRequest) => void;
    deleteHistory: (param: { id: string }) => void;
  };
  configList: ConfigListMap;
  mileageRate: Array<MileageRateProp>;
};
const MileageRate = (props: Props) => {
  const { mileageRate, configList } = props;
  return (
    <MainContents
      componentKey="mileageRate"
      itemList={mileageRate}
      hasTargetDate
      configList={configList}
      {...props}
    />
  );
};

export default MileageRate;
