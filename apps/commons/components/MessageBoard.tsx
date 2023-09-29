import React from 'react';

import classNames from 'classnames';

import './MessageBoard.scss';

const ROOT = 'commons-message-board';

type Props = {
  message: string;
  iconSrc: string;
  description: string;
};

/**
 * 共通コンポーネント - メッセージボード
 */
export default class MessageBoard extends React.Component<Props> {
  static defaultProps = {
    description: '',
  };

  render() {
    const description =
      this.props.description !== '' ? (
        <div className={`${ROOT}__description`}>
          <p>{this.props.description}</p>
        </div>
      ) : null;

    const messageClass = classNames(`${ROOT}__message`, {
      [`${ROOT}__message--center`]: !description,
    });

    return (
      <div className={ROOT}>
        <div className={messageClass}>
          <div className={`${ROOT}__icon`}>
            <img src={this.props.iconSrc} alt="" />
          </div>
          <p>{this.props.message}</p>
        </div>

        {description}
      </div>
    );
  }
}
