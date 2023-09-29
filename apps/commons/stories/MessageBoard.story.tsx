import React from 'react';

import MessageBoard from '../components/MessageBoard';

import imgIconDoneCircle from '../images/iconDoneCircle.png';

const style = {
  width: 700,
  height: 500,
  backgroundColor: '#f5f5f5',
};

export default {
  title: 'commons',
};

export const _MessageBoard = () => (
  <div style={style}>
    <MessageBoard
      message="This is a sample meesgae."
      iconSrc={imgIconDoneCircle}
    />
  </div>
);

_MessageBoard.storyName = 'MessageBoard';

_MessageBoard.parameters = {
  info: {
    text: `
MessageBoardを配置した親要素に対してレイアウトされる
背景色は透明
`,
    propTables: [MessageBoard],
    inline: true,
    source: true,
  },
};

export const MessageBoardWithDescirption = () => (
  <div style={style}>
    <MessageBoard
      message="This is a sample meesgae."
      iconSrc={imgIconDoneCircle}
      description="here is description area."
    />
  </div>
);

MessageBoardWithDescirption.storyName = 'MessageBoard - with descirption';

MessageBoardWithDescirption.parameters = {
  info: {
    text: `
MessageBoardを配置した親要素に対してレイアウトされる
背景色は透明
`,
    propTables: [MessageBoard],
    inline: true,
    source: true,
  },
};
