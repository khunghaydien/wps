import React, { FC, MouseEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { APPROVER_MODULES } from '@admin-pc-v2/models/approverGroup';

import { actions as tabActions } from '@admin-pc-v2/modules/approverGroup/ui/tab';

import { list } from '@admin-pc-v2/actions/approverGroup/member';

import { State } from '@admin-pc-v2/reducers';

import ApproverGroupGrid from '@admin-pc-v2/presentational-components/ApproverGroup/ApproverGroupGrid';

const ApproverGroupContainer: FC = () => {
  const dispatch = useDispatch() as ThunkDispatch<State, void, AnyAction>;

  const tmpEditRecord: Record<string, any> = useSelector(
    (state: State) => state.tmpEditRecord
  );
  const memberList = useSelector(
    (state: State) => state.approverGroup.entities.memberList
  );
  const selected = useSelector((state: State) => state.approverGroup.ui.tab);

  const approverModules = Object.keys(APPROVER_MODULES).filter(
    (queueIdKey) => !!tmpEditRecord[queueIdKey]
  );

  const onTabClick = (e: MouseEvent<HTMLButtonElement>) => {
    const { value } = e.currentTarget;
    dispatch(tabActions.select(value));
    dispatch(list({ queueId: tmpEditRecord[value] }));
  };

  return (
    <ApproverGroupGrid
      approvers={memberList}
      approverModules={approverModules}
      selected={selected}
      onTabClick={onTabClick}
    />
  );
};

export default ApproverGroupContainer;
