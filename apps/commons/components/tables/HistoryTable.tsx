import * as React from 'react';

import classNames from 'classnames';

import { labelMapping as statusLabelMapping } from '../../constants/requestStatus';

import { ApprovalHistory } from '../../../domain/models/approval/request/History';
import STATUS from '../../../domain/models/approval/request/Status';

import DateUtil from '../../utils/DateUtil';

import msg from '../../languages';
import FixedHeaderTable, {
  BodyCell,
  BodyRow,
  HeaderCell,
  HeaderRow,
} from '../FixedHeaderTable';

import './HistoryTable.scss';

const ROOT = 'common-tables-history-table';

// TODO Use statusLabel only and get rid of status label mapping
const getStatusLabel = (history: ApprovalHistory): string =>
  history.statusLabel ||
  msg()[statusLabelMapping[history.status]] ||
  history.status ||
  '';

type Props = {
  historyList: ApprovalHistory[];
  isEllipsis?: boolean;
  isExp?: boolean;
};

export default class HistoryTable extends React.Component<Props> {
  renderRow() {
    const rows = this.props.historyList.map<React.ReactElement<typeof BodyRow>>(
      (history) => {
        // for exp pages, don't show `Delegate` for submitted and recalled
        const hideDelegateLabel =
          this.props.isExp &&
          (history.status === 'Started' || history.status === STATUS.Recalled);
        return (
          <BodyRow key={history.id}>
            <BodyCell className={`${ROOT}__cell ${ROOT}__column-step`}>
              {history.stepName}
            </BodyCell>
            <BodyCell className={`${ROOT}__cell ${ROOT}__column-date`}>
              {DateUtil.formatYMDhhmm(history.approveTime)}
            </BodyCell>
            <BodyCell className={`${ROOT}__cell ${ROOT}__column-status`}>
              {getStatusLabel(history)}
            </BodyCell>
            <BodyCell className={`${ROOT}__cell ${ROOT}__column-actor`}>
              <img
                className={`${ROOT}__column-actor-icon`}
                src={history.actorPhotoUrl}
                alt=""
              />
              <div className={`${ROOT}__column-actor-name`}>
                {history.actorName}
                {history.isDelegated && !hideDelegateLabel ? (
                  <div className={`${ROOT}__column-actor-name-delegate`}>
                    ({msg().Appr_Lbl_Delegate})
                  </div>
                ) : null}
              </div>
            </BodyCell>
            <BodyCell
              className={`${ROOT}__cell ${ROOT}__body-cell--comment ${ROOT}__column-comment`}
            >
              {history.comment}
            </BodyCell>
          </BodyRow>
        );
      }
    );

    return rows;
  }

  render() {
    const cssClass = classNames({
      [`${ROOT}--is-ellipsis`]: this.props.isEllipsis,
    });

    return (
      <div className={`${ROOT}`}>
        <FixedHeaderTable
          scrollableClass={`${ROOT}__scrollable`}
          className={cssClass}
        >
          <HeaderRow>
            <HeaderCell className={`${ROOT}__cell ${ROOT}__column-step`}>
              {msg().Appr_Lbl_Step}
            </HeaderCell>
            <HeaderCell className={`${ROOT}__cell ${ROOT}__column-date`}>
              {msg().Appr_Lbl_Time}
            </HeaderCell>
            <HeaderCell className={`${ROOT}__cell ${ROOT}__column-status`}>
              {msg().Appr_Lbl_Situation}
            </HeaderCell>
            <HeaderCell className={`${ROOT}__cell ${ROOT}__column-actor`}>
              {msg().Appr_Lbl_Actor}
            </HeaderCell>
            <HeaderCell className={`${ROOT}__cell ${ROOT}__column-comment`}>
              {msg().Appr_Lbl_Comments}
            </HeaderCell>
          </HeaderRow>

          {this.renderRow()}
        </FixedHeaderTable>
      </div>
    );
  }
}
