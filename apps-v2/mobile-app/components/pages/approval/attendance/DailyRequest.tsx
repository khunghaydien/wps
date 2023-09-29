import React from 'react';

import msg from '@apps/commons/languages';
import Navigation, {
  Props as NavigationProps,
} from '@mobile/components/molecules/commons/Navigation';
import ViewItem from '@mobile/components/molecules/commons/ViewItem';

import { AttDailyRequestDetail } from '@attendance/domain/models/approval/AttDailyRequestDetail';
import { ArrayLabel } from '@attendance/domain/models/approval/AttDailyRequestDetail/Base';

// FIXME: Do't use PC's components.
import Comparison from '@apps/approvals-pc/components/DetailParts/Comparison';
import ApplicantName from '@apps/mobile-app/components/organisms/approval/ApplicantName';
import Wrapper from '@mobile/components/atoms/Wrapper';
import Footer, {
  Props as FooterProps,
} from '@mobile/components/organisms/approval/Footer';
import HistoryList from '@mobile/components/organisms/approval/HistoryList';

import './DailyRequest.scss';

const ROOT = 'mobile-app-pages-approval-page-attendance-request';

type Props = {
  request: AttDailyRequestDetail;
  detailList: ArrayLabel;
  onClickBack: NavigationProps['onClickBack'];
} & FooterProps;

const DailyRequest: React.FC<Props> = (props: Props) => {
  if (!props.request) {
    return null;
  }
  const { detailList } = props;
  return (
    <Wrapper className={ROOT}>
      <Navigation
        title={msg().Appr_Lbl_ApprovalDetail}
        onClickBack={props.onClickBack}
        backButtonLabel={msg().Com_Lbl_Back}
      />
      <div className={`${ROOT}__main-content`}>
        <section className={`${ROOT}__section`}>
          <div className={`${ROOT}__title`}>{msg().Att_Lbl_Request}</div>
          {detailList && (
            <>
              <ApplicantName
                employeeName={props.request.request.employeeName}
                delegatedEmployeeName={
                  props.request.request.delegatedEmployeeName
                }
              />
              {detailList.map((item) => (
                <ViewItem label={item.label} key={item.label}>
                  {item.valueType ? (
                    <Comparison
                      new={item.value.toString()}
                      old={
                        item.originalValue !== undefined &&
                        item.originalValue !== null
                          ? item.originalValue.toString()
                          : ''
                      }
                      type={item.valueType || 'date'}
                    />
                  ) : (
                    item.value
                  )}
                </ViewItem>
              ))}
            </>
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

export default DailyRequest;
