import * as React from 'react';

import classNames from 'classnames';

import msg from '../../../../commons/languages';
import DateUtil from '../../../../commons/utils/DateUtil';

import { ApprovalHistory } from '../../../../domain/models/approval/request/History';

import ImgIconApprovalHistory from '../../../images/icons/groups-copy.svg';
import Card from '../../atoms/Card';
import Chip from '../../atoms/Chip';
import Icon from '../../atoms/Icon';
import Person from '../../atoms/Person';

import './HistoryListItem.scss';

type Props = {
  className?: string;
  history: ApprovalHistory;
  isExpenseModule?: boolean;
};

const ROOT = 'mobile-app-molecules-approval-history-list-item';

export default class HistoryListItem extends React.PureComponent<Props> {
  render() {
    const { history, isExpenseModule } = this.props;
    const className = classNames(ROOT, this.props.className);

    const ActorImage =
      isExpenseModule && !history.actorPhotoUrl ? (
        <div className={`${ROOT}__person`}>
          <ImgIconApprovalHistory className={`${ROOT}__group`} />
        </div>
      ) : (
        <Person
          className={`${ROOT}__person`}
          src={history.actorPhotoUrl}
          alt={history.actorName}
        />
      );
    return (
      <Card className={className}>
        <div className={`${ROOT}__content`}>
          {ActorImage}
          <div className={`${ROOT}__info`}>
            <div className={`${ROOT}__info-row`}>
              <div className={`${ROOT}__status`}>
                <Chip
                  className={`${ROOT}__status-chip`}
                  text={history.statusLabel}
                />
              </div>
              {history.stepName && (
                <div className={`${ROOT}__step`}>{history.stepName}</div>
              )}
            </div>
            <div className={`${ROOT}__info-row`}>
              <div className={`${ROOT}__actor-label`}>
                {msg().Appr_Lbl_Actor}
              </div>
              <div>{history.actorName}</div>
            </div>
            <div className={`${ROOT}__info-row`}>
              <div className={`${ROOT}__comment`}>{history.comment}</div>
            </div>
            <div className={`${ROOT}__info-row`}>
              <Icon
                type="event-copy"
                size="small"
                className={`${ROOT}__approve-time-icon`}
              />
              <div className={`${ROOT}__approve-time-text`}>
                {DateUtil.formatYMDhhmm(history.approveTime)}
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }
}
