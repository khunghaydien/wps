import React from 'react';

import { action } from '@storybook/addon-actions';

import imgPhoto from '../../../commons/images/Sample_photo001.png';
import TextUtil from '../../../commons/utils/TextUtil';

import { ArrayLabel } from '@apps/domain/models/approval/AttDailyDetail/Base';
import { ApprovalHistory } from '@apps/domain/models/approval/request/History';
import STATUS from '@apps/domain/models/approval/request/Status';

import Detail from '../../components/AttDailyProcessListPane/Detail';

const longText = `this
is
a
long long long long long long long`;

const dummyDetailList: ArrayLabel = [
  { label: '申請種別', value: '休暇申請' },
  { label: '休暇情報', value: '特別休暇' },
  { label: '範囲', value: '期間指定休暇' },
  { label: '期間', value: '2016/23/23 11:11:11 - 2016/23/23 11:11:11' },
  { label: '備考', value: TextUtil.nl2br(longText) },
];

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
  title: 'approvals-pc/AttDailyProcessListPane/Detail',
};

export const _Detail = () => (
  <Detail
    id="id"
    employeeName="承認太郎"
    statusLabel="承認待ち"
    originalRequestStatus={STATUS.Pending}
    requestComment={longText}
    employeePhotoUrl={imgPhoto}
    detailList={dummyDetailList}
    historyList={dummyHistoryList}
    editComment={action('change comment')}
    onClickRejectButton={action('reject')}
    onClickApproveButton={action('approve')}
    togglePane={action('toggle pane')}
    approveComment={longText}
    userPhotoUrl={imgPhoto}
    isExpanded={false}
  />
);

_Detail.parameters = {
  info: { propTables: [Detail], inline: true, source: true },
};

export const Detail承認内容変更申請 = () => (
  <Detail
    id="id"
    employeeName="承認太郎"
    statusLabel="承認待ち"
    originalRequestStatus={STATUS.Pending}
    requestComment={longText}
    employeePhotoUrl={imgPhoto}
    detailList={dummyDetailList}
    historyList={dummyHistoryList}
    editComment={action('change comment')}
    onClickRejectButton={action('reject')}
    onClickApproveButton={action('approve')}
    togglePane={action('toggle pane')}
    approveComment={longText}
    userPhotoUrl={imgPhoto}
    isExpanded={false}
  />
);

Detail承認内容変更申請.storyName = 'Detail 承認内容変更申請';
Detail承認内容変更申請.parameters = {
  info: { propTables: [Detail], inline: true, source: true },
};
