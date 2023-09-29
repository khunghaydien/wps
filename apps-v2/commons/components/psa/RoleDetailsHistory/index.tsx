import React from 'react';

import MultiColumnsGrid from '@apps/commons/components/MultiColumnsGrid';
import DateUtil from '@apps/commons/utils/DateUtil';

import {
  RoleComment,
  RoleCommentHistory,
} from '../../../../domain/models/psa/Role';

import msg from '../../../languages/index';

const ROOT = 'ts-psa__role-details';

type Props = {
  commentsHistory: RoleCommentHistory;
  elementRef: React.Ref<HTMLDivElement>;
  openEmployeeCapabilityInfo?: (empId: string) => void;
};

const RoleDetailsHistory = (props: Props) => {
  const roleHistoryItems = props.commentsHistory.map((comment: RoleComment) => (
    <MultiColumnsGrid
      sizeList={[3, 2, 2, 2, 3]}
      className={`${ROOT}__history-content-item`}
    >
      <div>{DateUtil.formatYMDhhmm(comment.createdDate)}</div>
      <div>{comment.action}</div>
      <div>{comment.status && msg()[`Psa_Lbl_Status${comment.status}`]}</div>
      <div>
        <a onClick={() => props.openEmployeeCapabilityInfo(comment.employeeId)}>
          {comment.employeeName}
        </a>
      </div>
      <div>{comment.comments || '-'}</div>
    </MultiColumnsGrid>
  ));

  return (
    <div className={`${ROOT}--history`} ref={props.elementRef}>
      <div className={`${ROOT}__header--history`}>
        {msg().Admin_Lbl_History}
      </div>
      <MultiColumnsGrid
        sizeList={[3, 2, 2, 2, 3]}
        className={`${ROOT}__history-content-header`}
      >
        <div>{msg().Psa_Lbl_DateAndTime}</div>
        <div>{msg().Psa_Lbl_Action}</div>
        <div>{msg().Psa_Lbl_Status}</div>
        <div>{msg().Psa_Lbl_ActionBy}</div>
        <div>{msg().Appr_Lbl_Comments}</div>
      </MultiColumnsGrid>
      <div className={`${ROOT}__history`}>{roleHistoryItems}</div>
    </div>
  );
};
export default RoleDetailsHistory;
