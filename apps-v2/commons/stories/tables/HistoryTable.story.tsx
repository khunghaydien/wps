import React from 'react';

import { ApprovalHistory } from '@apps/domain/models/approval/request/History';

import HistoryTable from '../../components/tables/HistoryTable';

import imgPhoto from '../../images/Sample_photo001.png';

const dummyHistoryList: ApprovalHistory[] = [
  {
    id: 'id1',
    status: 'Pending',
    statusLabel: '承認待ち',
    stepName: 'テスト1',
    approveTime: '2004-04-01T12:00Z',
    approverName: '承認者名',
    actorPhotoUrl: imgPhoto,
    actorName: '申請者名',
    comment: 'コメント コメント コメント コメント コメント コメント コメント',
    isDelegated: false,
  },
  {
    id: 'id2',
    status: 'Pending',
    statusLabel: '承認待ち',
    stepName: 'テスト2',
    approveTime: '2004-04-01T12:00Z',
    approverName: '承認者名',
    actorPhotoUrl: imgPhoto,
    actorName: '申請者名',
    comment: 'コメント コメント コメント コメント コメント コメント コメント',
    isDelegated: false,
  },
  {
    id: 'id3',
    status: 'Pending',
    statusLabel: '承認待ち',
    stepName: 'テスト3',
    approveTime: '2004-04-01T12:00Z',
    approverName: '承認者名',
    actorPhotoUrl: imgPhoto,
    actorName: '申請者名',
    comment: 'コメント コメント コメント コメント コメント コメント コメント',
    isDelegated: false,
  },
  {
    id: 'id4',
    status: 'Pending',
    statusLabel: '承認待ち',
    stepName: 'テスト4',
    approveTime: '2004-04-01T12:00Z',
    approverName: '承認者名',
    actorPhotoUrl: imgPhoto,
    actorName: '申請者名',
    comment: 'コメント コメント コメント コメント コメント コメント コメント',
    isDelegated: false,
  },
  {
    id: 'id5',
    status: 'Pending',
    statusLabel: '承認待ち',
    stepName: 'テスト5',
    approveTime: '2004-04-01T12:00Z',
    approverName: '承認者名',
    actorPhotoUrl: imgPhoto,
    actorName: '申請者名',
    comment: 'コメント コメント コメント コメント コメント コメント コメント',
    isDelegated: false,
  },
  {
    id: 'id6',
    status: 'Pending',
    statusLabel: '承認待ち',
    stepName: 'テスト6',
    approveTime: '2004-04-01T12:00Z',
    approverName: '承認者名',
    actorPhotoUrl: imgPhoto,
    actorName: '申請者名',
    comment: 'コメント コメント コメント コメント コメント コメント コメント',
    isDelegated: false,
  },
];

export default {
  title: 'commons/tables',
};

export const _HistoryTable = () => (
  <HistoryTable historyList={dummyHistoryList} />
);

_HistoryTable.storyName = 'HistoryTable';

_HistoryTable.parameters = {
  info: { propTables: [HistoryTable], inline: true, source: true },
};
