import * as React from 'react';

import msg from '../../../../commons/languages';
import ApprovalStatus from '../../molecules/commons/ApprovalStatus';

import {
  AttDailyRequest,
  STATUS,
} from '@attendance/domain/models/AttDailyRequest';

import Layout from '../../../containers/organisms/attendance/DailyRequestListLayoutContainer';

import Header from '../../atoms/Header';
import LinkListItem from '../../atoms/LinkListItem';

import './DailyRequestListPage.scss';

const ROOT = 'mobile-app-pages-attendance-daily-request-list-page';

export type Props = Readonly<{
  availableRequests: AttDailyRequest[];
  latestRequests: AttDailyRequest[];
  onClickRequest: (arg0: AttDailyRequest) => void;
  isLocked: boolean;
}>;

export default class DailyRequestListPage extends React.Component<Props> {
  render() {
    return (
      <div className={ROOT}>
        <Layout>
          <div className={`${ROOT}__section`}>
            <Header level={2}>{msg().Att_Lbl_Submitted}</Header>
            {this.props.latestRequests.length > 0 ? (
              this.props.latestRequests.map((r) => (
                <LinkListItem
                  key={r.id}
                  onClick={() => this.props.onClickRequest(r)}
                >
                  <div className={`${ROOT}__item`}>
                    <ApprovalStatus
                      className={`${ROOT}__approval-status`}
                      status={this.props.isLocked ? STATUS.APPROVED : r.status}
                      isForReapply={r.isForReapply}
                      iconOnly
                    />
                    <div className={`${ROOT}__item-name`}>
                      {r.requestTypeName}
                    </div>
                  </div>
                </LinkListItem>
              ))
            ) : (
              <p className={`${ROOT}__remarks--no-request`}>
                {msg().Att_Msg_NoRequestSubmitted}
              </p>
            )}
          </div>

          <div className={`${ROOT}__section`}>
            <Header level={2}>{msg().Att_Lbl_NewRequest}</Header>
            {this.props.availableRequests.length > 0 ? (
              this.props.availableRequests.map((r, index) => (
                <LinkListItem
                  key={index}
                  onClick={() => this.props.onClickRequest(r)}
                >
                  {r.requestTypeName}
                </LinkListItem>
              ))
            ) : (
              <p className={`${ROOT}__remarks--no-request`}>
                {msg().Att_Msg_NoRequestAvailable}
              </p>
            )}
          </div>
        </Layout>
      </div>
    );
  }
}
