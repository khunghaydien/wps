import React, { useEffect } from 'react';

import _ from 'lodash';

import configList from '../../constants/configList/plannerSetting';

import { Action } from '@admin-pc/utils/RecordUtil';

import MainContents from '@admin-pc/components/MainContents';

export type Props = {
  actions: Action;
  companyId: string;
  searchPlannerSetting: { [key: string]: unknown };
  commonActions: { setEditRecord: (arg0: { [key: string]: unknown }) => void };
};

const PlannerSetting = (props: Props) => {
  const { companyId, searchPlannerSetting, commonActions } = props;

  useEffect(() => {
    props.actions.get({ companyId });
  }, [companyId]);

  useEffect(() => {
    commonActions.setEditRecord({
      ...searchPlannerSetting,
      companyId,
    });
  }, [searchPlannerSetting]);

  return (
    <MainContents
      isSinglePane
      componentKey="plannerSetting"
      configList={configList}
      {...props}
    />
  );
};

export default PlannerSetting;
