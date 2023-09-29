import * as React from 'react';

import './Errors.scss';

const ROOT = 'mobile-app-atoms-errors';

type Props = Readonly<{
  messages: string[];
}>;

export default class Errors extends React.PureComponent<Props> {
  render() {
    return (
      <ul className={ROOT}>
        {this.props.messages.map((message) => {
          // message は全て異なるはずなので、keyとして利用しても問題ないはず
          return (
            <li key={message} className={`${ROOT}__item`}>
              {message}
            </li>
          );
        })}
      </ul>
    );
  }
}
