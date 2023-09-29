/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Provider } from 'react-redux';

import { Story } from '@storybook/react';

import CoreProvider from '@apps/core/contexts';

import { State } from '../../modules';

import configureStore from '../../store/configureStore';
import TrackingContainer from '../TrackingContainer';

const render = (state: State) => (
  <Provider store={configureStore(state)}>
    <CoreProvider>
      <TrackingContainer />
    </CoreProvider>
  </Provider>
);

export default {
  title: 'time-tracking/tracking-pc/TrackingContainer',
};

export const Standard: Story = () => {
  const mockState: State = {
    userSetting: {} as any,
    common: {} as any,
    timeTrack: {
      selectedMonth: '',
      overview: {
        startDate: '2022-04-29',
        endDate: '2022-05-03',
        status: 'NotRequested',
      },
      dailyTrackList: {
        '2022-04-29': {
          recordDate: '2022-04-29',
          note: null,
          recordItemList: [],
          sumTaskTime: 0,
        },
        '2022-04-30': {
          recordDate: '2022-04-30',
          note: '作業報告',
          recordItemList: [
            {
              workCategoryName: '作業分類1-A',
              workCategoryId: 'a2u6D000000v8JrQAI',
              workCategoryCode: 'WC-001',
              taskTime: 180,
              taskNote: 'ジョブ別作業報告テキスト',
              ratio: null,
              order: 1,
              jobName: 'ジョブ1-A',
              jobId: 'a1K6D0000011kvHUAQ',
              jobCode: 'JOB-001',
              graphRatio: 37,
              id: 'a1K6D0000011kvHUAQ-a2u6D000000v8JrQAI',
            },
          ],
          sumTaskTime: 480,
        },
        '2022-05-01': {
          recordDate: '2022-05-01',
          note: '作業報告',
          recordItemList: [
            {
              workCategoryName: '作業分類1-A',
              workCategoryId: 'a2u6D000000v8JrQAI',
              workCategoryCode: 'WC-001',
              taskTime: 180,
              taskNote: 'ジョブ別作業報告テキスト',
              ratio: null,
              order: 1,
              jobName: 'ジョブ1-A',
              jobId: 'a1K6D0000011kvHUAQ',
              jobCode: 'JOB-001',
              graphRatio: 37,
              id: 'a1K6D0000011kvHUAQ-a2u6D000000v8JrQAI',
            },
            {
              workCategoryName: '作業分類2-A',
              workCategoryId: 'a2u6D000000v8JsQAI',
              workCategoryCode: 'WC-002',
              taskTime: 120,
              taskNote: 'ジョブ別作業報告テキスト',
              ratio: null,
              order: 2,
              jobName: 'ジョブ2-A',
              jobId: 'a1K6D0000011kvIUAQ',
              jobCode: 'JOB-002',
              graphRatio: 25,
              id: 'a1K6D0000011kvIUAQ-a2u6D000000v8JsQAI',
            },
            {
              workCategoryName: null,
              workCategoryId: null,
              workCategoryCode: null,
              taskTime: 60,
              taskNote: 'ジョブ別作業報告テキスト',
              ratio: null,
              order: 3,
              jobName: 'ジョブ3-A',
              jobId: 'a1K6D0000011kvJUAQ',
              jobCode: 'JOB-003',
              graphRatio: 12,
              id: 'a1K6D0000011kvJUAQ-',
            },
          ],
          sumTaskTime: 360,
        },
        '2022-05-02': {
          recordDate: '2022-05-02',
          note:
            '作業報告' +
            '・・・長いテキスト・・・長いテキスト・・・長いテキスト・・・長いテキスト・・・' +
            'LongLongLongLongLongLongLongLongLongLongLongLongLongLongLong',
          recordItemList: [
            {
              workCategoryName: '作業分類1-A',
              workCategoryId: 'a2u6D000000v8JrQAI',
              workCategoryCode: 'WC-001',
              taskTime: 180,
              taskNote: 'ジョブ別作業報告テキスト',
              ratio: null,
              order: 1,
              jobName:
                'ジョブ1-A' +
                '・・・長いテキスト・・・長いテキスト・・・長いテキスト・・・長いテキスト・・・' +
                'LongLongLongLongLongLongLongLongLongLongLongLongLongLongLong',
              jobId: 'a1K6D0000011kvHUAQ',
              jobCode: 'JOB-001',
              graphRatio: 37,
              id: 'a1K6D0000011kvHUAQ-a2u6D000000v8JrQAI',
            },
            {
              workCategoryName:
                '作業分類2-A' +
                '・・・長いテキスト・・・長いテキスト・・・長いテキスト・・・長いテキスト・・・' +
                'LongLongLongLongLongLongLongLongLongLongLongLongLongLongLong',
              workCategoryId: 'a2u6D000000v8JsQAI',
              workCategoryCode: 'WC-002',
              taskTime: 120,
              taskNote: 'ジョブ別作業報告テキスト',
              ratio: null,
              order: 2,
              jobName: 'ジョブ2-A',
              jobId: 'a1K6D0000011kvIUAQ',
              jobCode: 'JOB-002',
              graphRatio: 25,
              id: 'a1K6D0000011kvIUAQ-a2u6D000000v8JsQAI',
            },
            {
              workCategoryName: null,
              workCategoryId: null,
              workCategoryCode: null,
              taskTime: 60,
              taskNote:
                'ジョブ別作業報告テキスト' +
                '・・・長いテキスト・・・長いテキスト・・・長いテキスト・・・長いテキスト・・・' +
                'LongLongLongLongLongLongLongLongLongLongLongLongLongLongLong',
              ratio: null,
              order: 3,
              jobName: 'ジョブ3-A',
              jobId: 'a1K6D0000011kvJUAQ',
              jobCode: 'JOB-003',
              graphRatio: 12,
              id: 'a1K6D0000011kvJUAQ-',
            },
          ],
          sumTaskTime: 360,
        },
        '2022-05-03': {
          recordDate: '2022-05-03',
          note: '作業報告テキスト\n改行して、\n\nテキストの続き',
          recordItemList: [
            {
              workCategoryName: null,
              workCategoryId: null,
              workCategoryCode: null,
              taskTime: 480,
              taskNote:
                'ジョブ別作業報告テキスト\n改行して、\n\nテキストの続き',
              ratio: null,
              order: 1,
              jobName: 'ジョブ2-A',
              jobId: 'a1K6D0000011kvIUAQ',
              jobCode: 'JOB-002',
              graphRatio: 100,
              id: 'a1K6D0000011kvIUAQ-',
            },
          ],
          sumTaskTime: 480,
        },
      },
      allTaskSum: 840,
      taskList: {
        allIds: [
          'a1K6D0000011kvIUAQ-',
          'a1K6D0000011kvHUAQ-a2u6D000000v8JrQAI',
          'a1K6D0000011kvIUAQ-a2u6D000000v8JsQAI',
          'a1K6D0000011kvJUAQ-',
        ],
        byId: {
          'a1K6D0000011kvHUAQ-a2u6D000000v8JrQAI': {
            id: 'a1K6D0000011kvHUAQ-a2u6D000000v8JrQAI',
            taskTimeSum: 180,
            jobId: 'a1K6D0000011kvHUAQ',
            jobName: 'ジョブ1-A',
            workCategoryId: 'a2u6D000000v8JrQAI',
            workCategoryName: '作業分類1-A',
            barColor: '#00a3df',
            graphRatio: 37,
          },
          'a1K6D0000011kvIUAQ-a2u6D000000v8JsQAI': {
            id: 'a1K6D0000011kvIUAQ-a2u6D000000v8JsQAI',
            taskTimeSum: 120,
            jobId: 'a1K6D0000011kvIUAQ',
            jobName: 'ジョブ2-A',
            workCategoryId: 'a2u6D000000v8JsQAI',
            workCategoryName: '作業分類2-A',
            barColor: '#6fbeda',
            graphRatio: 25,
          },
          'a1K6D0000011kvJUAQ-': {
            id: 'a1K6D0000011kvJUAQ-',
            taskTimeSum: 60,
            jobId: 'a1K6D0000011kvJUAQ',
            jobName: 'ジョブ3-A',
            workCategoryId: null,
            workCategoryName: null,
            barColor: '#79cca6',
            graphRatio: 12,
          },
          'a1K6D0000011kvIUAQ-': {
            id: 'a1K6D0000011kvIUAQ-',
            taskTimeSum: 480,
            jobId: 'a1K6D0000011kvIUAQ',
            jobName: 'ジョブ2-A',
            workCategoryId: null,
            workCategoryName: null,
            barColor: '#0083b6',
            graphRatio: 100,
          },
        },
      },
      request: { id: '' },
    },
    widgets: {} as any,
  };

  return render(mockState);
};
