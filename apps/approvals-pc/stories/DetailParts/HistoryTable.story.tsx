import React from 'react';

import imgPhoto from '../../../commons/images/Sample_photo001.png';

import { ApprovalHistory } from '@apps/domain/models/approval/request/History';

import HistoryTable from '../../components/DetailParts/HistoryTable';

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
];

export default {
  title: 'approvals-pc/DetailParts',
};

export const _HistoryTable = () => (
  <HistoryTable historyList={dummyHistoryList} />
);

_HistoryTable.storyName = 'HistoryTable';

_HistoryTable.parameters = {
  info: { propTables: [HistoryTable], inline: true, source: true },
};

export const HistoryTableEllipsis = () => (
  <HistoryTable historyList={dummyHistoryList} isEllipsis />
);

HistoryTableEllipsis.storyName = 'HistoryTable - ellipsis';
HistoryTableEllipsis.parameters = {
  info: { propTables: [false], inline: true, source: true },
};
