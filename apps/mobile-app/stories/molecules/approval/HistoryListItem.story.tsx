import React from 'react';

import { withInfo } from '@storybook/addon-info';
import { text, withKnobs } from '@storybook/addon-knobs';

import HistoryListItemItem from '../../../components/molecules/approval/HistoryListItem';

import ImgSample from '../../images/sample.png';

interface FCStory extends React.FC {
  storyName?: string;
  parameters?: unknown;
}

export default {
  title: 'Components/molecules/approval',
  decorators: [
    withKnobs,
    (story: (...args: Array<any>) => any) => <div>{story()}</div>,
    withInfo,
  ],
};

export const _HistoryListItemItem: FCStory = () => (
  <HistoryListItemItem
    history={{
      id: text('id', 'ID'),
      stepName: text('stepName', 'STEP NAME'),
      approveTime: text('approveTime', '2019-01-01 00:00'),
      status: '',
      statusLabel: text('statusLabel', 'STATUS LABEL'),
      approverName: text('approverName', 'APPROVER NAME'),
      actorName: text('actorName', 'ACTOR NAME'),
      actorPhotoUrl: ImgSample,
      comment: text('comment', 'COMMENT'),
      isDelegated: false,
    }}
  />
);

_HistoryListItemItem.storyName = 'HistoryListItemItem';
_HistoryListItemItem.parameters = {
  info: {
    text: `
      # Description

      承認履歴に使われれる行です。
    `,
  },
};
