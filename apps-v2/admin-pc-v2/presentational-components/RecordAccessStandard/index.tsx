import React, { useEffect, useState } from 'react';

import cloneDeep from 'lodash/cloneDeep';

import configList from '@apps/admin-pc-v2/constants/configList/recordAccessStandard';

import DateUtil from '@apps/commons/utils/DateUtil';

import { RecordAccessCreateRequest } from '@admin-pc-v2/actions/recordAccess';

import { RecordAccessState } from '@admin-pc-v2/reducers/recordAccess';

import { Record } from '@admin-pc/utils/RecordUtil';

import MainContents from '@admin-pc/components/MainContents';

type Props = {
  actions: {
    search: (requestParam: { companyId?: string; targetDate?: string }) => void;
    setModeBase: (key: string) => void;
    getRecord: (patternId: string) => Promise<any>;
    create: (requestParam: RecordAccessCreateRequest) => void;
  };
  recordAccess: RecordAccessState;
  editRecord?: Record;
  companyId: string;
  dialog?: string;
  isShowDetail?: boolean;
  commonActions: any;
};
const RecordAccessStandard = (props: Props) => {
  const { companyId, isShowDetail } = props;
  const [, setDetailType] = useState('');

  useEffect(() => {
    const { actions } = props;
    actions.search({ companyId, targetDate: DateUtil.getToday() });
  }, [companyId]);

  useEffect(() => {
    if (!isShowDetail) {
      setDetailType('');
    }
  }, [isShowDetail]);

  const configListRecordAccess = cloneDeep(configList);
  configListRecordAccess.base.forEach((config) => {
    if (config.key === 'companyId') {
      config.defaultValue = props.companyId;
    }
  });

  const showDetail = (
    configList,
    editRecord,
    actions,
    companyId,
    onClickEditButton,
    modeBase
  ) => {
    const { id } = editRecord;
    props.actions.getRecord(id).then((response) => {
      props.commonActions.showDetail(
        configList,
        {
          ...response,
          validDateTo: DateUtil.addDays(response.validDateTo, -1),
        },
        actions,
        companyId,
        onClickEditButton,
        modeBase
      );
    });
  };

  return (
    <MainContents
      componentKey="recordAccess"
      configList={configListRecordAccess}
      itemList={props.recordAccess.list}
      hasTargetDate
      {...props}
      // @ts-ignore
      commonActions={{ ...props.commonActions, showDetail }}
    />
  );
};

export default RecordAccessStandard;
