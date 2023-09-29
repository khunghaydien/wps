import React from 'react';

import msg from '../../../../../../commons/languages';
import Navigation, {
  Props as NavigationProps,
} from '../../../../molecules/commons/Navigation';

import { AttDailyDetailBaseFromApi } from '../../../../../../domain/models/approval/AttDailyDetail/Base';
import { None } from '../../../../../../domain/models/approval/AttDailyDetail/None';

import Wrapper from '../../../../atoms/Wrapper';
import Footer, {
  Props as FooterProps,
} from '../../../../organisms/approval/Footer';
import HistoryList from '../../../../organisms/approval/HistoryList';
import Request, {
  Props as AttRequestProps,
} from '../../../../organisms/approval/Request';

import './index.scss';

const ROOT = 'mobile-app-pages-approval-page-attendance-request';

type Props = {
  request: AttDailyDetailBaseFromApi<None>;
} & AttRequestProps &
  FooterProps &
  NavigationProps;

const AttRequest = (props: Props) => {
  if (!props.request) {
    return null;
  }
  const { detailList } = props;
  return (
    <Wrapper className={ROOT}>
      <Navigation
        title={msg().Appr_Lbl_ApprovalDetail}
        onClickBack={props.onClickBack}
        backButtonLabel={msg().Att_Lbl_RequestList}
      />
      <div className={`${ROOT}__main-content`}>
        <section className={`${ROOT}__section`}>
          <div className={`${ROOT}__title`}>{msg().Att_Lbl_Request}</div>
          {detailList && (
            <Request
              employeeName={props.request.request.employeeName}
              delegatedEmployeeName={
                props.request.request.delegatedEmployeeName
              }
              detailList={detailList}
            />
          )}
        </section>
        <section className={`${ROOT}__section`}>
          <div className={`${ROOT}__title`}>
            {msg().Com_Lbl_ApprovalHistory}
          </div>
          <HistoryList
            className={`${ROOT}__history-list`}
            historyList={props.request.historyList}
          />
        </section>
        <Footer
          comment={props.comment}
          onChangeComment={props.onChangeComment}
          onClickApproveButton={props.onClickApproveButton}
          onClickRejectButton={props.onClickRejectButton}
        />
      </div>
    </Wrapper>
  );
};

export default AttRequest;
