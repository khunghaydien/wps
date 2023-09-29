import * as React from 'react';
import { Provider } from 'react-redux';

import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';

import TimeUtil from '../../../../commons/utils/TimeUtil';
import { CoreProvider } from '../../../../core';

import {
  AlertCode,
  AlertLevel,
} from '../../../../domain/models/time-tracking/Alert';

import DailySummaryButton from '../DailySummaryButtonContainer';
import DailySummaryButtonPage from './pageObjects/DailySummaryButtonPage';
import createStore from './store';
import state from './store/state';

const renderComponent = (
  props: React.ComponentProps<typeof DailySummaryButton>,
  store = createStore()
) => {
  return render(
    <Provider
      // @ts-ignore
      store={store}
    >
      <CoreProvider>
        <DailySummaryButton {...props} />
      </CoreProvider>
    </Provider>
  );
};

const initState = (
  targetDate: string,
  workTime: number,
  totalTaskTime: number
) => {
  return {
    ...state,
    entities: {
      ...state.entities,
      timeTrackAlert: {
        [targetDate]: [
          {
            code: AlertCode.TimeAttConsistency,
            level: AlertLevel.Warn,
          },
        ],
      },
      dailyTimeTrack: {
        ...state.entities.dailyTimeTrack,
        [targetDate]: {
          status: 'Disabled',
          recordDate: targetDate,
          output: null,
          note: null,
          dailyRecordItemList: [
            {
              workCategoryName: '',
              workCategoryId: null,
              workCategoryCode: null,
              taskTime: totalTaskTime,
              taskNote: null,
              ratio: 100,
              jobName: 'そうめんに2～3本だけ黄色や赤色や緑色の麺を混ぜる仕事',
              jobId: 'a0h2v00000XB8o7AAD',
              jobCode: '2',
            },
          ],
          targetDate,
          time: totalTaskTime,
          realWorkTime: workTime,
          totalTaskTime,
        },
      },
    },
  };
};

describe.each`
  workTime     | totalTaskTime
  ${490}       | ${540}
  ${600}       | ${540}
  ${null}      | ${540}
  ${undefined} | ${500}
`(
  'given mismatched the work hours [$workTime min] with total task times [$totalTaskTime min]',
  ({ workTime, totalTaskTime }) => {
    test('it displays total task time', () => {
      // Arrange
      const targetDate = '2019-08-15';
      const stubState = initState(targetDate, workTime, totalTaskTime);
      const store = createStore(stubState);

      const expected = new RegExp(`^${TimeUtil.toHHmm(totalTaskTime)}$`);

      // Act
      const page = new DailySummaryButtonPage(() =>
        renderComponent({ date: targetDate }, store)
      );

      // Assert
      expect(page.taskTime).toHaveTextContent(expected);
    });
    test('it displays total task time as alert', () => {
      // Arrange
      const targetDate = '2019-08-15';
      const stubState = initState(targetDate, workTime, totalTaskTime);
      const store = createStore(stubState);

      // Act
      const page = new DailySummaryButtonPage(() =>
        renderComponent({ date: targetDate }, store)
      );

      // Assert
      expect(page.taskTime).toHaveClass(DailySummaryButtonPage.alertClass);
    });
    test('it displays alert', () => {
      // Arrange
      const targetDate = '2019-08-15';
      const stubState = initState(targetDate, workTime, totalTaskTime);
      const store = createStore(stubState);

      // Act
      const page = new DailySummaryButtonPage(() =>
        renderComponent({ date: targetDate }, store)
      );

      // Assert
      expect(page.alert).not.toBeNull();
    });
  }
);

describe.each`
  workTime | totalTaskTime
  ${500}   | ${500}
`(
  'given matched work hours [$workTime min] with total task time [$totalTaskTime]',
  ({ workTime, totalTaskTime }) => {
    test('it displays total task time.', () => {
      // Arrange
      const targetDate = '2019-08-15';
      const stubState = initState(targetDate, workTime, totalTaskTime);
      const store = createStore(stubState);

      const expected = new RegExp(`^${TimeUtil.toHHmm(totalTaskTime)}$`);

      // Act
      const page = new DailySummaryButtonPage(() =>
        renderComponent({ date: targetDate }, store)
      );

      // Assert
      expect(page.taskTime).toHaveTextContent(expected);
    });
    test('it displays total task time without alert style', () => {
      // Arrange
      const targetDate = '2019-08-15';
      const stubState = initState(targetDate, workTime, totalTaskTime);
      const store = createStore(stubState);

      // Act
      const page = new DailySummaryButtonPage(() =>
        renderComponent({ date: targetDate }, store)
      );

      // Assert
      expect(page.taskTime).toHaveClass(DailySummaryButtonPage.okClass);
    });
    test('it does not display alert', () => {
      // Arrange
      const targetDate = '2019-08-15';
      const stubState = initState(targetDate, workTime, totalTaskTime);
      const store = createStore(stubState);

      // Act
      const page = new DailySummaryButtonPage(() =>
        renderComponent({ date: targetDate }, store)
      );

      // Assert
      expect(page.alert).toBeNull();
    });
  }
);

describe.each`
  workTime     | totalTaskTime
  ${400}       | ${null}
  ${null}      | ${null}
  ${400}       | ${undefined}
  ${undefined} | ${undefined}
`(
  'given work hours [$workTime min] with empty total task time [$totalTaskTime]',
  ({ workTime, totalTaskTime }) => {
    test('it does not display total task time', () => {
      // Arrange
      const targetDate = '2019-08-15';
      const stubState = initState(targetDate, workTime, totalTaskTime);
      const store = createStore(stubState);

      // Act
      const page = new DailySummaryButtonPage(() =>
        renderComponent({ date: targetDate }, store)
      );

      // Assert
      expect(page.taskTime).toBeNull();
    });
    test('it displays a button', () => {
      // Arrange
      const targetDate = '2019-08-15';
      const stubState = initState(targetDate, workTime, totalTaskTime);
      const store = createStore(stubState);

      // Act
      const page = new DailySummaryButtonPage(() =>
        renderComponent({ date: targetDate }, store)
      );

      // Assert
      expect(page.plusButton).toHaveClass(DailySummaryButtonPage.buttonClass);
    });
  }
);

describe.each`
  workTime     | totalTaskTime
  ${490}       | ${540}
  ${600}       | ${540}
  ${null}      | ${540}
  ${undefined} | ${500}
`(
  'given no alert on the day with work hours [$workTime min] and total task time [$totalTaskTime]',
  ({ workTime, totalTaskTime }) => {
    test('it always displays no alert', () => {
      // Arrange
      const targetDate = '2019-08-15';
      const initialState = initState(targetDate, workTime, totalTaskTime);
      const stubState = {
        ...initialState,
        entities: {
          ...initialState.entities,
          timeTrackAlert: {
            [targetDate]: [],
          },
        },
      };
      const store = createStore(stubState);

      // Act
      const page = new DailySummaryButtonPage(() =>
        renderComponent({ date: targetDate }, store)
      );

      // Assert
      expect(page.alert).toBeNull();
    });

    test('it always displays task time without not alert', () => {
      // Arrange
      const targetDate = '2019-08-15';
      const initialState = initState(targetDate, workTime, totalTaskTime);
      const stubState = {
        ...initialState,
        entities: {
          ...initialState.entities,
          timeTrackAlert: {
            [targetDate]: [],
          },
        },
      };
      const store = createStore(stubState);

      const expected = new RegExp(`^${TimeUtil.toHHmm(totalTaskTime)}$`);

      // Act
      const page = new DailySummaryButtonPage(() =>
        renderComponent({ date: targetDate }, store)
      );

      // Assert
      expect(page.taskTime).toHaveClass(DailySummaryButtonPage.okClass);
      expect(page.taskTime).toHaveTextContent(expected);
    });
  }
);
