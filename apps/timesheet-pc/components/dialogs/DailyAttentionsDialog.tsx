import React from 'react';

import Button from '../../../commons/components/buttons/Button';
import DialogFrame from '../../../commons/components/dialogs/DialogFrame';
import iconAttentions from '../../../commons/images/iconAttention.png';
import msg from '../../../commons/languages';

import './DailyAttentionsDialog.scss';

const ROOT = 'timesheet-pc-dialogs-daily-attentions-dialog';

type Props = {
  isHide: boolean;
  messages: Array<string>;
  onHide: () => void;
};

export default class DailyAttentionsDialog extends React.Component<Props> {
  render() {
    const { isHide, messages, onHide } = this.props;

    if (isHide) {
      return null;
    }

    return (
      <DialogFrame
        title={msg().Att_Msg_DailyAttention}
        className={ROOT}
        footer={
          <DialogFrame.Footer>
            <Button id={`${ROOT}__ok-button`} type="primary" onClick={onHide}>
              {msg().Com_Btn_Ok}
            </Button>
          </DialogFrame.Footer>
        }
        hide={onHide}
        initialFocus={`${ROOT}__ok-button`}
      >
        <div className={`${ROOT}__message`}>
          <div className={`${ROOT}__icon`}>
            <img src={iconAttentions} alt="" />
          </div>
          <div className={`${ROOT}__content`}>
            {messages.length === 1 ? (
              <p>{messages[0]}</p>
            ) : (
              <ul className={`${ROOT}__list`}>
                {messages.map((message, idx) => (
                  <li key={idx} className={`${ROOT}__list-item`}>
                    {message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </DialogFrame>
    );
  }
}
