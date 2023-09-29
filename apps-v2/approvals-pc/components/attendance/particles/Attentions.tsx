import React from 'react';

import iconAttentions from '@apps/commons/images/iconAttention.png';

import attentionSummaryMessages from '@attendance/ui/helpers/attentionSummaryMessages';

import './Attentions.scss';

const ROOT = 'approvals-pc-att-monthly-process-list-pane-detail-attentions';

type Props = Readonly<{
  ineffectiveWorkingTime: number;
  insufficientRestTime: number;
}>;

export default class Attentions extends React.Component<Props> {
  render(): React.ReactNode {
    const messages = attentionSummaryMessages(this.props);
    if (!messages) {
      return null;
    }
    return (
      <div className={ROOT}>
        <div className={`${ROOT}__icon`}>
          <img src={iconAttentions} alt="" />
        </div>
        <div className={`${ROOT}__messages`}>
          <ul className={`${ROOT}__list`}>
            {messages.map((message) => (
              <li key={message} className={`${ROOT}__list-item`}>
                {message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
