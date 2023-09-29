import React, { FC, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction, bindActionCreators } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import cloneDeep from 'lodash/cloneDeep';

import configList, { ROOT } from '../../constants/configList/approverGroup';

import msg from '@commons/languages';

import {
  APPROVER_MODULES,
  ApproverGroup,
} from '@admin-pc-v2/models/approverGroup';

import { actions as memberListActions } from '@admin-pc-v2/modules/approverGroup/entities/memberList';
import { actions as tabActions } from '@admin-pc-v2/modules/approverGroup/ui/tab';

import {
  create,
  del,
  search,
  update,
} from '@admin-pc-v2/actions/approverGroup';
import { list } from '@admin-pc-v2/actions/approverGroup/member';

import { State } from '@admin-pc-v2/reducers';

import '@admin-pc-v2/presentational-components/ApproverGroup/index.scss';
import { Props } from '@admin-pc/components/Admin/ContentsSelector';
import MainContents from '@admin-pc/components/MainContents';

const ApproverGroupContainer: FC<Props> = (props) => {
  const { companyId } = props;
  const dispatch = useDispatch() as unknown as ThunkDispatch<
    State,
    unknown,
    AnyAction
  >;

  const tmpEditRecord: Record<string, any> = useSelector(
    (state: State) => state.tmpEditRecord
  );

  const approverGroup = useSelector(
    (state: State) => state.approverGroup.entities.list
  );

  const configListCopy = cloneDeep(configList);
  configListCopy.base.forEach((config) => {
    if (config.key === 'companyId') {
      config.defaultValue = companyId;
    }
  });

  const actions = useMemo(
    () =>
      bindActionCreators(
        {
          create,
          delete: del,
          search,
          update,
        },
        dispatch
      ),
    [dispatch]
  );

  useEffect(() => {
    actions.search({ companyId });
  }, [actions, companyId]);

  const onClickCreateNewButton = () => {
    dispatch(memberListActions.clear());
  };

  // on row click
  const onClickEditButton = (baseRecord: ApproverGroup) => {
    // select first tab and fetch list if multi org hierarchy pattern is used (has multiple queues)
    const { attQueueId, expQueueId, generalQueueId, timeQueueId, queueId } =
      baseRecord;
    const memberQueueId =
      queueId || attQueueId || expQueueId || generalQueueId || timeQueueId;
    const selectedTab = Object.keys(APPROVER_MODULES).filter(
      (queueIdKey) => !!baseRecord[queueIdKey]
    )[0];

    dispatch(memberListActions.clear());
    dispatch(tabActions.reset());
    if (selectedTab) dispatch(tabActions.select(selectedTab));
    if (memberQueueId) dispatch(list({ queueId: memberQueueId }));
  };

  return (
    <MainContents
      actions={actions}
      className={ROOT}
      componentKey="approverGroup"
      configList={configListCopy}
      detailTitle={msg().Admin_Lbl_Details}
      itemList={approverGroup}
      onClickCreateNewButton={onClickCreateNewButton}
      onClickEditButton={onClickEditButton}
      tmpEditRecord={tmpEditRecord}
      {...props}
    />
  );
};

export default ApproverGroupContainer;
