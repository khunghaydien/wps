import React, { useEffect } from 'react';

import _ from 'lodash';

import configListTemplate from '../../constants/configList/shortTimeWorkReason';

import { ShortTimeWorkReason as ShortTimeWorkReasonModel } from '../../models/short-time-work-reason/ShortTimeWorkReason';

import MainContents from '../../components/MainContents';

type Props = Readonly<{
  companyId: string;
  actions: {
    search: (arg0: { companyId: string }) => void;
    create: (arg0: ShortTimeWorkReasonModel) => void;
    update: (arg0: ShortTimeWorkReasonModel) => void;
    delete: (arg0: { id: string }) => void;
  };
  searchShortTimeWorkReason: ShortTimeWorkReasonModel[];
}>;

const ShortTimeWorkReason = (props: Props) => {
  const { companyId, actions, searchShortTimeWorkReason } = props;

  const configList = _.cloneDeep(configListTemplate);
  configList.base.forEach((config) => {
    if (config.key && config.key === 'companyId') {
      config.defaultValue = companyId;
    }
  });

  useEffect(() => {
    actions.search({ companyId });
  }, [companyId]);

  return (
    <MainContents
      componentKey="ShortTimeWorkReason"
      configList={configList}
      itemList={searchShortTimeWorkReason}
      {...props}
    />
  );
};

export default ShortTimeWorkReason;
