import React, { useEffect } from 'react';

import _ from 'lodash';

import configList from '@admin-pc-v2/constants/configList/position';

import { Action, Record } from '@admin-pc/utils/RecordUtil';

import MainContents from '@admin-pc/components/MainContents';

type Props = {
  actions: Action;
  searchPosition: Array<Record>;
  companyId: string;
};

const Position = (props: Props) => {
  const { companyId } = props;

  useEffect(() => {
    props.actions.search({ companyId });
  }, [companyId]);

  const configListPosition = _.cloneDeep(configList);
  configListPosition.base.forEach((config) => {
    if (config.key === 'companyId') {
      config.defaultValue = props.companyId;
    }
  });

  return (
    <MainContents
      componentKey="position"
      configList={configListPosition}
      itemList={props.searchPosition}
      {...props}
    />
  );
};

export default Position;
