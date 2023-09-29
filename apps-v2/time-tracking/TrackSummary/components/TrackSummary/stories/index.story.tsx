import React from 'react';

import { action } from '@storybook/addon-actions';

import { withProvider } from '../../../../../../.storybook/decorator/Provider';
import configureStore from '../../../store/configureStore';
import TrackSummary from '../index';
import {
  emptyDataStore,
  longDataStore,
  manyDataStore,
  requestedDataStore,
  store as defaultStore,
} from './mocks/store';

const store = configureStore({
  initialState: {
    entities: {
      summary: {
        targetDate: '2019-7-16',
        content: {
          startDate: '2019-7-16',
          endDate: '2019-8-15',
          // @ts-ignore
          request: {
            status: 'NotRequested',
            approverName: 'TeamSpirit',
          },
        },
      },
      request: { targetDate: '' },
      // @ts-ignore
      requestSummary: {},
    },
    // @ts-ignore
    userSetting: {
      photoUrl:
        'https://www.guidedogs.org/wp-content/uploads/2015/05/Dog-Im-Not.jpg',
    },
  },
});

const data = [
  {
    jobId: '1',
    jobCode: 'R06-WSP-Entire',
    jobName: 'R06(19/07)_WSP_Entire',
    workCategoryCode: 'SD-005',
    workCategoryId: '',
    workCategoryName: 'Design',
    workTimeRatio: 62.0,
    workTime: 5829,
    isEditLocked: false,
  },
  {
    jobId: '2',
    jobCode: 'R06-WSP-Entire',
    jobName: 'R06(19/07)_WSP_Entire',
    workCategoryCode: 'SD-010',
    workCategoryId: '',
    workCategoryName: 'Meeting&Others',
    workTimeRatio: 23.0,
    workTime: 2160,
    isEditLocked: false,
  },
  {
    jobId: '3',
    jobCode: 'PD-Common-Others',
    jobName: '（PD-Common）Others',
    workCategoryCode: '',
    workCategoryId: '',
    workCategoryName: undefined,
    workTimeRatio: 12.3,
    workTime: 990,
    isEditLocked: false,
  },
  {
    jobId: '4',
    jobCode: 'PD-Common-Recruting',
    jobName: '（PD-Common）Recruting',
    workCategoryCode: '',
    workCategoryId: '',
    workCategoryName: undefined,
    workTimeRatio: 2.1,
    workTime: 210,
    isEditLocked: false,
  },
  {
    jobId: '5',
    jobCode: 'PD-Common-Meeting',
    jobName: '（PD-Common）Meeting',
    workCategoryCode: 'SD-010',
    workCategoryId: '',
    workCategoryName: 'ミーティング他',
    workTimeRatio: 0.1,
    workTime: 30,
    isEditLocked: false,
  },
];

const longData = [
  {
    jobId: '1',
    jobCode: 'PD-Common-Meeting',
    jobName:
      'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure? On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee',
    workCategoryCode: '',
    workCategoryId: '',
    workCategoryName: 'Design',
    workTimeRatio: 50.0,
    workTime: 5829,
    isEditLocked: false,
  },
  {
    jobId: '1',
    jobCode: 'PD-Common-Meeting',
    jobName: 'R06(19/07)_WSP_Entire',
    workCategoryCode: '',
    workCategoryId: '',
    workCategoryName: 'Meeting&Others',
    workTimeRatio: 50.0,
    workTime: 2160,
    isEditLocked: false,
  },
];

export default {
  title: 'time-tracking/TrackSummary',
  decorators: [withProvider(store)],
};

export const _Approval = () => (
  <TrackSummary.Approval
    data={data.slice(0, 2)}
    startDate="2019-7-16"
    endDate="2019-8-15"
  />
);

export const ApprovalManyData = () => (
  <TrackSummary.Approval
    data={[...data, ...data, ...data, ...data]}
    startDate="2019-7-16"
    endDate="2019-8-15"
  />
);

ApprovalManyData.storyName = 'Approval/Many Data';

export const ApprovalLongData = () => (
  <TrackSummary.Approval
    data={longData}
    startDate="2019-7-16"
    endDate="2019-8-15"
  />
);

ApprovalLongData.storyName = 'Approval/Long Data';

export const _Request = () => (
  <TrackSummary.Request
    data={data}
    startDate="2019-07-15"
    endDate="2019-08-14"
    status="Pending"
    useRequest
    isOpen
    disableMotion
    openHistoryDialog={action('open history dialog')}
    onClickOpen={action('onClickOpen')}
  />
);

export const RequestEmpty = () => (
  <TrackSummary.Request
    data={[]}
    startDate="2019-07-15"
    endDate="2019-08-14"
    status="NotRequested"
    useRequest
    isOpen
    disableMotion
    openHistoryDialog={action('open history dialog')}
    onClickOpen={action('onClickOpen')}
  />
);

RequestEmpty.storyName = 'Request/Empty';

export const RequestManyData = () => (
  <TrackSummary.Request
    data={[...data, ...data, ...data, ...data]}
    startDate="2019-7-16"
    endDate="2019-8-15"
    status="Approved"
    useRequest
    isOpen
    disableMotion
    openHistoryDialog={action('open history dialog')}
    onClickOpen={action('onClickOpen')}
  />
);

RequestManyData.storyName = 'Request/Many Data';

export const RequestLongData = () => (
  <TrackSummary.Request
    data={longData}
    startDate="2019-7-16"
    endDate="2019-8-15"
    status="Approved"
    useRequest
    isOpen
    disableMotion
    openHistoryDialog={action('open history dialog')}
    onClickOpen={action('onClickOpen')}
  />
);

RequestLongData.storyName = 'Request/Long Data';

export const RequestCompact = () => (
  <TrackSummary.RequestCompact useRequest isOpenByDefault />
);

RequestCompact.storyName = 'RequestCompact';
RequestCompact.decorators = [withProvider(defaultStore)];

export const RequestCompactDisableRequestFeature = () => (
  <TrackSummary.RequestCompact useRequest={false} isOpenByDefault />
);

RequestCompactDisableRequestFeature.storyName =
  'RequestCompact/Disable request feature';
RequestCompactDisableRequestFeature.decorators = [withProvider(defaultStore)];

export const RequestCompactPending = () => (
  <TrackSummary.RequestCompact useRequest isOpenByDefault />
);

RequestCompactPending.storyName = 'RequestCompact/Pending';
RequestCompactPending.decorators = [withProvider(requestedDataStore)];

export const RequestCompactEmpty = () => (
  <TrackSummary.RequestCompact useRequest isOpenByDefault />
);

RequestCompactEmpty.storyName = 'RequestCompact/Empty';
RequestCompactEmpty.decorators = [withProvider(emptyDataStore)];

export const RequestCompactManyData = () => (
  <TrackSummary.RequestCompact useRequest isOpenByDefault />
);

RequestCompactManyData.storyName = 'RequestCompact/Many Data';
RequestCompactManyData.decorators = [withProvider(manyDataStore)];

export const RequestCompactLongData = () => (
  <TrackSummary.RequestCompact useRequest isOpenByDefault />
);

RequestCompactLongData.storyName = 'RequestCompact/Long Data';
RequestCompactLongData.decorators = [withProvider(longDataStore)];

export const _Transfer = () => (
  <TrackSummary.Transfer
    data={[data[0], { ...data[1], isEditLocked: true }]}
    startDate="2019-7-16"
    endDate="2019-8-15"
    useRequest
    status="Pending"
    onSelect={action('onSelect')}
  />
);

export const TransferCanEdit = () => (
  <TrackSummary.Transfer
    data={data.slice(0, 2)}
    startDate="2019-7-16"
    endDate="2019-8-15"
    useRequest
    status="NotRequested"
    onSelect={action('onSelect')}
  />
);

TransferCanEdit.storyName = 'Transfer/Can Edit';

export const TransferEditLocked = () => (
  <TrackSummary.Transfer
    data={data.slice(0, 2).map((datum) => ({ ...datum, isEditLocked: true }))}
    startDate="2019-7-16"
    endDate="2019-8-15"
    useRequest
    status="NotRequested"
    onSelect={action('onSelect')}
  />
);

TransferEditLocked.storyName = 'Transfer/Locked';

export const TransferManyData = () => (
  <TrackSummary.Transfer
    data={[...data, ...data, ...data, ...data]}
    startDate="2019-7-16"
    endDate="2019-8-15"
    useRequest
    status="Pending"
    onSelect={action('onSelect')}
  />
);

TransferManyData.storyName = 'Transfer/Many Data';

export const TransferLongData = () => (
  <TrackSummary.Transfer
    data={longData}
    startDate="2019-7-16"
    endDate="2019-8-15"
    useRequest
    status="Pending"
    onSelect={action('onSelect')}
  />
);

TransferLongData.storyName = 'Transfer/Long Data';
