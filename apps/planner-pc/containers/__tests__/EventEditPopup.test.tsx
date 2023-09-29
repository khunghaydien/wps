import React from 'react';
import { Provider } from 'react-redux';

import moment from 'moment';

import '@testing-library/jest-dom/extend-expect';
import { act, render, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { GET_USER_SETTING } from '../../../commons/actions/userSetting';
import GlobalContainer from '../../../commons/containers/GlobalContainer';
import { CoreProvider } from '../../../core';

import ApiMock from '../../../../__tests__/mocks/ApiMock';
import EventEditPopup from '../EventEditPopupContainer';
import EventEditPopupPage from './pageObjects/EventEditPopupPage';
import createStore from './store';

beforeEach(() => {
  // https://stackoverflow.com/questions/43677034/enzyme-jest-window-getselection-does-not-work
  window.document.getSelection = jest.fn();
  // @ts-ignore
  window.document.createRange = jest.fn(() => ({
    setStart: () => {},
    setEnd: () => {},
    commonAncestorContainer: {
      nodeName: 'BODY',
      ownerDocument: document,
    },
  }));
});

const renderComponent = (store = createStore()): RenderResult => {
  return render(
    <Provider store={store}>
      <CoreProvider>
        <GlobalContainer>
          <EventEditPopup />
        </GlobalContainer>
      </CoreProvider>
    </Provider>
  );
};

beforeEach(() => {
  ApiMock.reset();
});

test.each`
  textfield        | value
  ${'title'}       | ${'TEST'}
  ${'description'} | ${'FUGA'}
`('enters $value to `$textfield` field', async ({ textfield, value }) => {
  // Arrange
  const page = new EventEditPopupPage(renderComponent);
  const input = page[textfield];

  // Act
  await act(() => userEvent.type(input, value));

  // Assert
  expect(input).toHaveValue(value);
});

test.each(['allDay'])('enables %p checkbox', async (checkbox) => {
  // Arrange
  const page = new EventEditPopupPage(renderComponent);
  const input = page[checkbox];

  // Act
  await act(() => userEvent.click(input));

  // Assert
  expect(input.checked).toBe(true);
});

test.skip('provides only date field only if allDay checked', async () => {
  /*
   * Components using DatePicker are not testable
   * because DatePicker in common does not support 'data' attribute.
   */

  // Arrange
  const page = new EventEditPopupPage(renderComponent);

  // Act
  await act(() => userEvent.click(page.allDay));

  // Assert
  expect(page.start.time).toBeNull();
  expect(page.end.time).toBeNull();
});

test('submits a new event', async () => {
  // Arrange
  const store = createStore();
  store.dispatch({
    type: 'SELECT_DATA_EVENT_EDIT_POPUP',
    payload: {
      id: 'a0Y7F000009UZAgUAO',
      title: 'テスト',
      start: moment('2020-09-30T16:00:00.000Z'),
      end: moment('2020-10-01T08:00:00.000Z'),
      isAllDay: false,
      isOrganizer: true,
      isOuting: true,
      calculateCapacity: true,
      location: 'Tokyo',
      remarks: 'TEST',
      createdServiceBy: 'teamspirit',
      externalEventId: null,
      job: {
        id: 'a0U7F00000Drqf9UAB',
        name: 'ジョブ',
        code: 'Job',
      },
      workCategoryId: '',
      workCategoryName: '',
      layout: {
        colSpan: 1,
        colIndex: 4,
        startMinutesOfDay: 60,
        endMinutesOfDay: 1020,
        visibleInMonthlyView: true,
        containsAllDay: false,
      },
    },
  });
  store.dispatch({
    type: 'FETCH_JOB_LIST',
    payload: [
      [
        {
          selectabledTimeTrack: true,
          parentId: null,
          name: 'ジョブ',
          isDirectCharged: true,
          id: 'a0U7F00000Drqf9UAB',
          hasChildren: false,
          code: 'Job',
        },
      ],
    ],
  });
  store.dispatch({
    type: 'SELECT_JOB_EVENT_EDIT_POPUP',
    payload: {
      id: 'a0U7F00000Drqf9UAB',
    },
  });

  const api = {
    path: '/planner/event/save',
    param: {
      description: 'TEST',
      endDateTime: '2020-10-01T08:00:00Z',
      id: 'a0Y7F000009UZAgUAO',
      isAllDay: false,
      isOuting: true,
      calculateCapacity: true,
      jobId: 'a0U7F00000Drqf9UAB',
      location: 'Tokyo',
      startDateTime: '2020-09-30T16:00:00Z',
      title: 'テスト',
      workCategoryId: null,
    },
  };
  ApiMock.setDummyResponse(api.path, api.param);
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  window.HTMLElement.prototype.scrollIntoView = () => {};
  const page = new EventEditPopupPage(() => renderComponent(store));

  // Act
  await act(() => userEvent.click(page.submit));

  // Assert
  expect(ApiMock.invoke).toHaveBeenCalledWith(api);
});

test('submits an event of allEvent without job', async () => {
  // Arrange
  const store = createStore();
  store.dispatch({
    type: 'SELECT_DATA_EVENT_EDIT_POPUP',
    payload: {
      id: 'a0Y7F000009UZAgUAO',
      title: 'テスト',
      start: moment('2020-09-30T16:00:00.000Z'),
      end: moment('2020-10-01T08:00:00.000Z'),
      isAllDay: true,
      isOrganizer: true,
      isOuting: true,
      calculateCapacity: true,
      location: 'Tokyo',
      remarks: 'TEST',
      createdServiceBy: 'teamspirit',
      externalEventId: null,
      job: {
        id: 'a0U7F00000Drqf9UAB',
        name: 'ジョブ',
        code: 'Job',
      },
      workCategoryId: '',
      workCategoryName: '',
      layout: {
        colSpan: 1,
        colIndex: 4,
        startMinutesOfDay: 60,
        endMinutesOfDay: 1020,
        visibleInMonthlyView: true,
        containsAllDay: false,
      },
    },
  });
  store.dispatch({
    type: 'FETCH_JOB_LIST',
    payload: [
      [
        {
          selectabledTimeTrack: true,
          parentId: null,
          name: 'ジョブ',
          isDirectCharged: true,
          id: 'a0U7F00000Drqf9UAB',
          hasChildren: false,
          code: 'Job',
        },
      ],
    ],
  });
  store.dispatch({
    type: 'SELECT_JOB_EVENT_EDIT_POPUP',
    payload: {
      id: 'a0U7F00000Drqf9UAB',
    },
  });

  const api = {
    path: '/planner/event/save',
    param: {
      description: 'TEST',
      endDateTime: '2020-09-30T15:00:00Z',
      id: 'a0Y7F000009UZAgUAO',
      isAllDay: true,
      isOuting: true,
      calculateCapacity: true,
      jobId: null,
      location: 'Tokyo',
      startDateTime: '2020-09-30T15:00:00Z',
      title: 'テスト',
      workCategoryId: null,
    },
  };
  ApiMock.setDummyResponse(api.path, api.param);

  const page = new EventEditPopupPage(() => renderComponent(store));

  // Act
  await act(() => userEvent.click(page.submit));

  // Assert
  expect(ApiMock.invoke).toHaveBeenCalledWith(api);
});

test('deletes an event', async () => {
  // Arrange
  const store = createStore();
  store.dispatch({
    type: 'SELECT_DATA_EVENT_EDIT_POPUP',
    payload: {
      id: 'a0Y7F000009UZAgUAO',
      title: 'テスト',
      start: moment('2020-09-30T16:00:00.000Z'),
      end: moment('2020-10-01T08:00:00.000Z'),
      isAllDay: true,
      isOrganizer: true,
      isOuting: true,
      calculateCapacity: true,
      location: 'Tokyo',
      remarks: 'TEST',
      createdServiceBy: 'teamspirit',
      externalEventId: null,
      job: {
        id: 'a0U7F00000Drqf9UAB',
        name: 'ジョブ',
        code: 'Job',
      },
      workCategoryId: '',
      workCategoryName: '',
      layout: {
        colSpan: 1,
        colIndex: 4,
        startMinutesOfDay: 60,
        endMinutesOfDay: 1020,
        visibleInMonthlyView: true,
        containsAllDay: false,
      },
    },
  });

  const api = {
    path: '/planner/event/delete',
    param: {
      id: 'a0Y7F000009UZAgUAO',
    },
  };
  ApiMock.setDummyResponse(api.path, api.param);

  const page = new EventEditPopupPage(() => renderComponent(store));

  // Act
  await act(() => userEvent.click(page.delete));
  await act(() => userEvent.click(page.confirmDialog.ok));

  // Assert
  expect(ApiMock.invoke).toHaveBeenCalledWith(api);
});

test('closes popup window', async () => {
  // Arrange
  const store = createStore();
  const page = new EventEditPopupPage(() => renderComponent(store));

  // Act
  await act(() => userEvent.click(page.outOfContent));

  // Assert
  expect(store.getState().ui.eventEditPopup.isOpen).toBe(false);
});

test('renders job select only if useWorkTime is true', () => {
  // Arrange
  const store = createStore();
  store.dispatch({
    type: GET_USER_SETTING,
    payload: {
      ...(store.getState().common as any).userSetting,
      useWorkTime: false,
    },
  });

  // Act
  const page = new EventEditPopupPage(() => renderComponent(store));

  // Assert
  expect(page.jobSelect).toBeNull();
});

test('renders work category select only if useWorkTime is true', () => {
  // Arrange
  const store = createStore();
  store.dispatch({
    type: GET_USER_SETTING,
    payload: {
      ...(store.getState().common as any).userSetting,
      useWorkTime: false,
    },
  });

  // Act
  const page = new EventEditPopupPage(() => renderComponent(store));

  // Assert
  expect(page.workCategorySelect).toBeNull();
});

test('renders calculate capacity checkbox box only if usePsa and belongsToResrouceGroup are true', async () => {
  // Arrange
  const store = createStore();

  // Act
  const page = new EventEditPopupPage(() => renderComponent(store));

  // Assert
  expect(page.calculateCapacityCheckbox).toBeNull();

  // Act
  store.dispatch({
    type: GET_USER_SETTING,
    payload: {
      ...store.getState().common.userSetting,
      usePsa: true,
    },
  });

  // Assert
  expect(page.calculateCapacityCheckbox).toBeNull();

  // Act
  await act(() =>
    store.dispatch({
      type: GET_USER_SETTING,
      payload: {
        ...store.getState().common.userSetting,
        belongsToResourceGroup: true,
      },
    })
  );

  // Assert
  expect(page.calculateCapacityCheckbox).not.toBeNull();
  // There is no case that usPsa is false and belongToResrouceGroup is false
});
