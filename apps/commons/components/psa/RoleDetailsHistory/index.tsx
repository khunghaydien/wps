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
  const renderComments = (
    processedComment: string | null,
    comment: RoleComment
  ) => {
    return (
      <div>
        {processedComment ? (
          comment.action !== msg().Psa_Lbl_ActionDecline ? (
            <div dangerouslySetInnerHTML={{ __html: processedComment }}></div>
          ) : (
            <div>
              <div dangerouslySetInnerHTML={{ __html: processedComment }}></div>
              {comment &&
                comment.rejectedEmployees &&
                comment.rejectedEmployees.map((employee, index) => (
                  <div>
                    <a
                      onClick={() =>
                        props.openEmployeeCapabilityInfo(employee.employeeId)
                      }
                    >
                      {index + 1}.{employee.employeeName}
                    </a>
                  </div>
                ))}
            </div>
          )
        ) : (
          '-'
        )}
      </div>
    );
  };

  const roleHistoryItems = props.commentsHistory.map((comment: RoleComment) => {
    const processedComment = comment.comments
      ? comment.comments.startsWith('\n')
        ? comment.comments
        : comment.comments.replace('\n', '<br>')
      : null;
    return (
      <MultiColumnsGrid
        sizeList={[3, 2, 2, 2, 3]}
        className={`${ROOT}__history-content-item`}
      >
        <div>{DateUtil.formatYMDhhmm(comment.createdDate)}</div>
        <div>{comment.action}</div>
        <div>{comment.status && msg()[`Psa_Lbl_Status${comment.status}`]}</div>
        <div>
          <a
            onClick={() => props.openEmployeeCapabilityInfo(comment.employeeId)}
          >
            {comment.employeeName}
          </a>
        </div>
        {renderComments(processedComment, comment)}
      </MultiColumnsGrid>
    );
  });

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
