import React from 'react';

import classnames from 'classnames';
import { isEmpty } from 'lodash';

import msg from '../../../../../../commons/languages';
import Navigation, {
  Props as NavigationProps,
} from '../../../../molecules/commons/Navigation';
import Highlight from '@apps/commons/components/exp/Highlight';

import STATUS from '../../../../../../domain/models/approval/request/Status';
import { ExpRequest } from '../../../../../../domain/models/exp/request/Report';
import { formatStatus } from '@apps/domain/models/exp/approval/request/History';

import Wrapper from '../../../../atoms/Wrapper';
import RecordSummaryListItem from '../../../../molecules/expense/RecordSummaryListItem';
import Footer, {
  Props as FooterProps,
} from '../../../../organisms/approval/Footer';
import HistoryList from '../../../../organisms/approval/HistoryList';
import Report, { Props as ReportProps } from './Report';

import './index.scss';

const ROOT = 'mobile-app-pages-approval-page-expense-report';

type Props = {
  isExpenseModule: boolean;
  report: ExpRequest;
  onClickRecord: (arg0: string) => void;
  onClickVendorDetail: () => void;
  isHighlightDiff?: boolean;
} & ReportProps &
  FooterProps &
  NavigationProps;

export default (props: Props) => {
  if (!props.report) {
    return null;
  }

  const wrapperClass = classnames(ROOT, {
    [`${ROOT}-no-footer`]: props.report.status !== STATUS.Pending,
  });

  const isExpenseReport = !props.isExpenseModule || props.isExpenseApproval;

  return (
    <Wrapper className={wrapperClass}>
      <Navigation
        title={msg().Appr_Lbl_ApprovalDetail}
        onClickBack={props.onClickBack}
        backButtonLabel={
          isExpenseReport ? msg().Exp_Lbl_ReportList : msg().Exp_Lbl_Requests
        }
      />
      <div className="main-content">
        <Report
          isExpenseApproval={isExpenseReport}
          report={props.report}
          currencySymbol={props.currencySymbol}
          currencyDecimalPlaces={props.currencyDecimalPlaces}
          onClickVendorDetail={props.onClickVendorDetail}
          isHighlightDiff={
            props.isHighlightDiff && !isEmpty(props.report.expPreRequest)
          }
          useJctRegistrationNumber={props.useJctRegistrationNumber}
          alwaysDisplaySettlementAmount={props.alwaysDisplaySettlementAmount}
        />
        <section className={`${ROOT}__section ${ROOT}__records-area`}>
          <div className={`${ROOT}__title`}>{msg().Exp_Lbl_Records}</div>
          {props.report.records.map((record) => {
            const { expPreRequestRecordId } = record;
            const { expPreRequest } = props.report;
            const preRequestRecord =
              props.isHighlightDiff &&
              expPreRequest &&
              (expPreRequest.records || []).find(
                (r) => r.recordId === expPreRequestRecordId
              );
            return (
              <Highlight
                highlight={
                  props.isHighlightDiff &&
                  isEmpty(preRequestRecord) &&
                  !isEmpty(expPreRequest)
                }
                key={record.recordId}
              >
                <RecordSummaryListItem
                  onClick={() => props.onClickRecord(record.recordId || '')}
                  // @ts-ignore
                  record={record}
                  preExpRecord={preRequestRecord}
                  currencySymbol={props.currencySymbol}
                  currencyDecimalPlaces={props.currencyDecimalPlaces}
                  isHighlightDiff={
                    props.isHighlightDiff && !isEmpty(preRequestRecord)
                  }
                />
              </Highlight>
            );
          })}
        </section>
        <section className={`${ROOT}__section`}>
          <div className={`${ROOT}__title`}>
            {msg().Com_Lbl_ApprovalHistory}
          </div>
          <HistoryList
            historyList={formatStatus(props.report.historyList)}
            isExpenseModule={props.isExpenseModule}
          />
        </section>
        {props.report.status === STATUS.Pending && (
          <Footer
            comment={props.comment}
            onChangeComment={props.onChangeComment}
            onClickApproveButton={props.onClickApproveButton}
            onClickRejectButton={props.onClickRejectButton}
          />
        )}
      </div>
    </Wrapper>
  );
};
