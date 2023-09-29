import React from 'react';

import msg from '../languages';

import './Unavailable.scss';

export default class Unavailable extends React.Component<
  Record<string, unknown>
> {
  render() {
    return (
      <div className="unavailable">
        <p>{msg().Com_Lbl_Unavailable}</p>
      </div>
    );
  }
}
