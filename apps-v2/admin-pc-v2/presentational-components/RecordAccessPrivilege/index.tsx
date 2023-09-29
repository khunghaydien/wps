import React from 'react';

import { RecordAccessCreateRequest } from '@admin-pc-v2/actions/recordAccess';
import { RecordAccessState } from '@admin-pc-v2/reducers/recordAccess';
import { Record } from '@admin-pc/utils/RecordUtil';

import MainContents from '@admin-pc/components/MainContents';

type Props = {
  search: (requestParam: { companyId?: string; targetDate?: string }) => void;
  setModeBase: (key: string) => void;
  getRecord: (patternId: string) => Promise<any>;
  create: (requestParam: RecordAccessCreateRequest) => void;
  setSortCondition: (field: string) => void;
  update: () => void;
  recordAccess: RecordAccessState;
  editRecord?: Record;
  companyId: string;
  isShowDetail?: boolean;
  commonActions: any;
};
const RecordAccessPrivilege = (props: Props) => {
  return (
    <MainContents
      componentKey="recordAccess"
      itemList={props.recordAccess.list}
      hasTargetDate
      {...props}
      // @ts-ignore
      commonActions={{ ...props.commonActions, showDetail: props.getRecord }}
    />
  );
};

export default RecordAccessPrivilege;
