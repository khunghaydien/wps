import React from 'react';

import classNames from 'classnames';

import HorizontalLayout from '../../../../commons/components/fields/layouts/HorizontalLayout';
import msg from '../../../../commons/languages';
import DateUtil from '../../../../commons/utils/DateUtil';
import FormatUtil from '../../../../commons/utils/FormatUtil';

import { ExpRequest } from '../../../../domain/models/exp/request/Report';

import './PreRequestSummary.scss';

const ROOT = 'approvals-pc-expenses-request-pane-detail_pre_request_summary';

type Props = {
  expRequest: ExpRequest;
  baseCurrencySymbol: string;
  baseCurrencyDecimal: number;
};

type State = {
  isOpen: boolean;
};

export default class PreRequestSummary extends React.Component<Props, State> {
  state = {
    isOpen: false,
  };

  render() {
    const { expRequest } = this.props;
    const renderItems = [
      {
        label: {
          content: msg().Exp_Lbl_RequestNo,
          col: 3,
        },
        value: {
          content: expRequest.requestNo,
          col: 9,
        },
      },
      {
        label: {
          content: msg().Exp_Clbl_RequestTitle,
          col: 3,
        },
        value: {
          content: expRequest.subject,
          col: 9,
        },
      },
      {
        label: {
          content: msg().Exp_Clbl_EstimatedAmount,
          col: 3,
        },
        value: {
          content: `${this.props.baseCurrencySymbol} ${FormatUtil.formatNumber(
            expRequest.totalAmount,
            this.props.baseCurrencyDecimal
          )}`,
          col: 3,
        },
      },
      {
        label: {
          content: msg().Exp_Clbl_ScheduledDate,
          col: 3,
        },
        value: {
          content: DateUtil.formatYMD(expRequest.scheduledDate),
          col: 2,
        },
      },
      {
        label: {
          content: msg().Exp_Clbl_Purpose,
          col: 3,
        },
        value: {
          content: expRequest.purpose,
          col: 9,
        },
      },
    ];

    const header = (
      <div className={`${ROOT}__list-detail-header`}>
        <span className={`${ROOT}__list-detail-header-title`}>
          {msg().Exp_Lbl_ExpRequest}
        </span>
        <span
          className={`${ROOT}__list-detail-header-btn`}
          onClick={() => {
            this.setState((prevState) => {
              return { isOpen: !prevState.isOpen };
            });
          }}
        >
          {this.state.isOpen ? msg().Com_Btn_Close : msg().Com_Btn_Open}
        </span>
      </div>
    );

    const content = this.state.isOpen && (
      <div className={`${ROOT}__list-detail-content`}>
        {renderItems.map((item, i) => (
          <div key={i} className={`${ROOT}__list-detail-item`}>
            <HorizontalLayout>
              <HorizontalLayout.Label cols={item.label.col}>
                {item.label.content}
              </HorizontalLayout.Label>

              <HorizontalLayout.Body cols={item.value.col}>
                {item.value.content}
              </HorizontalLayout.Body>
            </HorizontalLayout>
          </div>
        ))}
      </div>
    );

    const toggleClassName = classNames({ 'is-open': this.state.isOpen });

    return (
      <div className={`${ROOT}__list-detail ${toggleClassName}`}>
        {header}
        {content}
      </div>
    );
  }
}
