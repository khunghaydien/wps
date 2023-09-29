import React from 'react';

import { action } from '@storybook/addon-actions';

import imgPhoto from '@commons/images/Sample_photo001.png';
import TextUtil from '@commons/utils/TextUtil';

import { ApprovalHistory } from '@apps/domain/models/approval/request/History';
import {
  ArrayLabel,
  STATUS,
} from '@attendance/domain/models/approval/AttDailyRequestDetail/Base';

import Detail from '../Detail';

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

const dummyDetailForLateArrivalList: ArrayLabel = [
  { label: '申請種別', value: '遅刻' },
  { label: '日付', value: '2022/12/26' },
  { label: '始業時刻', value: '09:00' },
  { label: '出勤時刻', value: '10:00' },
  { label: '理由', value: '遅刻理由' },
  { label: '備考', value: TextUtil.nl2br(longText) },
];

const dummyDetailForEarlyLeaveList: ArrayLabel = [
  { label: '申請種別', value: '早退' },
  { label: '日付', value: '2022/12/28' },
  { label: '終業時刻', value: '18:00' },
  { label: '退勤時刻', value: '16:00' },
  { label: '理由', value: '早退理由' },
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
  title: 'approvals-pc/attendance/AttDailyProcessListPane/Detail',
};

export const _Detail = () => (
  <Detail
    id="id"
    employeeName="承認太郎"
    statusLabel="承認待ち"
    originalRequestStatus={STATUS.APPROVAL_IN}
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
    originalRequestStatus={STATUS.APPROVAL_IN}
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

export const DetailLateArrivalRequestAndReasonIdNotNull = () => (
  <Detail
    id="id"
    employeeName="承認太郎"
    statusLabel="承認待ち"
    originalRequestStatus={STATUS.APPROVAL_IN}
    requestComment={longText}
    employeePhotoUrl={imgPhoto}
    detailList={dummyDetailForLateArrivalList}
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
DetailLateArrivalRequestAndReasonIdNotNull.parameters = {
  info: { propTables: [Detail], inline: true, source: true },
};

export const DetailEarlyLeaveRequestAndReasonIdNotNull = () => (
  <Detail
    id="id"
    employeeName="承認太郎"
    statusLabel="承認待ち"
    originalRequestStatus={STATUS.APPROVAL_IN}
    requestComment={longText}
    employeePhotoUrl={imgPhoto}
    detailList={dummyDetailForEarlyLeaveList}
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
DetailEarlyLeaveRequestAndReasonIdNotNull.parameters = {
  info: { propTables: [Detail], inline: true, source: true },
};
