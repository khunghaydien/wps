import React from 'react';

import { withInfo } from '@storybook/addon-info';
import { boolean, withKnobs } from '@storybook/addon-knobs';

import HistoryList from '../../../components/organisms/approval/HistoryList';

import ImgSample from '../../images/sample.png';

interface FCStory extends React.FC {
  storyName?: string;
  parameters?: unknown;
}

const historyList = [
  {
    id: 'ID001',
    stepName: 'STEP NAME',
    approveTime: '2019-01-01 00:00',
    status: '',
    statusLabel: 'STATUS LABEL',
    approverName: 'APPROVER NAME',
    actorName: 'ACTOR NAME',
    actorPhotoUrl: ImgSample,
    comment: 'COMMENT',
    isDelegated: false,
  },
  {
    id: 'ID002',
    stepName: 'STEP NAME',
    approveTime: '2019-01-01 00:00',
    status: '',
    statusLabel: 'STATUS LABEL',
    approverName: 'APPROVER NAME',
    actorName: 'ACTOR NAME',
    actorPhotoUrl: ImgSample,
    comment: 'COMMENT',
    isDelegated: false,
  },
  {
    id: 'ID003',
    stepName: 'STEP NAME',
    approveTime: '2019-01-01 00:00',
    status: '',
    statusLabel: 'STATUS LABEL',
    approverName: 'APPROVER NAME',
    actorName: 'ACTOR NAME',
    actorPhotoUrl: ImgSample,
    comment: 'COMMENT',
    isDelegated: false,
  },
];

export default {
  title: 'Components/organisms/approval',
  decorators: [
    withKnobs,
    (story: (...args: Array<any>) => any) => <div>{story()}</div>,
    withInfo,
  ],
};

export const _HistoryList: FCStory = () => (
  <HistoryList
    historyList={
      boolean('isShowSeeMore', true) ? historyList : [historyList[0]]
    }
  />
);

_HistoryList.storyName = 'HistoryList';
_HistoryList.parameters = {
  info: {
    text: `
        # Description

        承認履歴に使われれる行です。
      `,
  },
};
