import React from 'react';
import { Provider } from 'react-redux';

import { Moment } from 'moment';

import '@testing-library/jest-dom/extend-expect';
import { render, RenderResult } from '@testing-library/react';

import 'moment-timezone';
import CalendarHeaderContainer from '../CalendarHeaderContainer';
import CalendarHeaderPage from './pageObjects/CalendarHeaderPage';
import createStore from './store';

jest.mock('moment', () => {
  const moment = jest.requireActual('moment');
  return (value = '2019-09-09T15:00:00.000Z'): Moment => moment(value);
});
jest.mock('moment-timezone', () => {
  const moment = jest.requireActual('moment');
  return (value = '2019-09-09T15:00:00.000Z'): Moment => moment(value);
});

const renderComponent = (store = createStore()): RenderResult => {
  return render(
    <Provider store={store}>
      <CalendarHeaderContainer />
    </Provider>
  );
};

describe('switches calendar view', () => {
  test('switches to monthly view', async () => {
    // Arrange
    const page = new CalendarHeaderPage(renderComponent);
    await page.viewMode.openMenu();

    // Act
    page.viewMode.selectMonth();

    // Assert
    expect(page.viewMode.label).toHaveTextContent(/^Month$/);
  });
  test('switches to weekly view', async () => {
    // Arrange
    const page = new CalendarHeaderPage(renderComponent);
    await page.viewMode.openMenu();

    // Act
    page.viewMode.selectWeek();

    // Assert
    expect(page.viewMode.label).toHaveTextContent(/^Week$/);
  });
});

describe('navigates to today', () => {
  test("opens today's calendar by default", async () => {
    const page = new CalendarHeaderPage(renderComponent);
    expect(page.monthList.label).toHaveTextContent(/^September 2019$/);
  });
  test("opens today's monthly calendar", async () => {
    // Arrange
    const page = new CalendarHeaderPage(renderComponent);

    await page.viewMode.openMenu();
    page.viewMode.selectMonth();

    // Visit a calendar of two months later
    page.clickNext();
    page.clickNext();

    // Act
    page.clickToday();

    // Assert
    expect(page.monthList.label).toHaveTextContent(/^September 2019$/);
  });
  test("opens today's weekly calendar", async () => {
    // Arrange
    const page = new CalendarHeaderPage(renderComponent);

    await page.viewMode.openMenu();
    page.viewMode.selectWeek();

    // Visit a calendar of 10 weeks later
    const tenWeeks = 10;
    for (let i = 0; i < tenWeeks; i++) {
      page.clickNext();
    }

    // Act
    page.clickToday();

    // Assert
    expect(page.monthList.label).toHaveTextContent(/^September 2019$/);
  });
});

describe('moves calendars by weeks', () => {
  test.each`
    weeks | month
    ${0}  | ${'September 2019'}
    ${1}  | ${'September 2019'}
    ${4}  | ${'October 2019'}
    ${20} | ${'January 2020'}
  `('opens calendar of $weeks week(s) later', async ({ weeks, month }) => {
    // Arrange
    const page = new CalendarHeaderPage(renderComponent);

    await page.viewMode.openMenu();
    page.viewMode.selectWeek();

    // Act
    for (let i = 0; i < weeks; i++) {
      page.clickNext();
    }

    // Assert
    expect(page.monthList.label).toHaveTextContent(new RegExp(`^${month}$`));
  });
  test.each`
    weeks | month
    ${0}  | ${'September 2019'}
    ${1}  | ${'September 2019'}
    ${4}  | ${'August 2019'}
    ${20} | ${'April 2019'}
  `('opens calendar of $weeks week(s) ago', async ({ weeks, month }) => {
    // Arrange
    const page = new CalendarHeaderPage(renderComponent);

    await page.viewMode.openMenu();
    page.viewMode.selectWeek();

    // Act
    for (let i = 0; i < weeks; i++) {
      page.clickPrev();
    }

    // Assert
    expect(page.monthList.label).toHaveTextContent(new RegExp(`^${month}$`));
  });
});

describe('moves calendars by months', () => {
  test.each`
    months | month
    ${0}   | ${'September 2019'}
    ${1}   | ${'October 2019'}
    ${4}   | ${'January 2020'}
  `('opens calendar of $months month(s) later', async ({ months, month }) => {
    // Arrange
    const page = new CalendarHeaderPage(renderComponent);

    await page.viewMode.openMenu();
    page.viewMode.selectMonth();

    // Act
    for (let i = 0; i < months; i++) {
      page.clickNext();
    }

    // Assert
    expect(page.monthList.label).toHaveTextContent(new RegExp(`^${month}$`));
  });
  test.each`
    months | month
    ${0}   | ${'September 2019'}
    ${1}   | ${'August 2019'}
    ${9}   | ${'December 2018'}
  `('opens calendar of $months month(s) ago', async ({ months, month }) => {
    // Arrange
    const page = new CalendarHeaderPage(renderComponent);

    await page.viewMode.openMenu();
    page.viewMode.selectMonth();

    // Act
    for (let i = 0; i < months; i++) {
      page.clickPrev();
    }

    // Assert
    expect(page.monthList.label).toHaveTextContent(new RegExp(`^${month}$`));
  });
});

describe('moves calendars of an arbitrary month', () => {
  test.each`
    index | month
    ${0}  | ${'September 2020'}
    ${1}  | ${'August 2020'}
    ${2}  | ${'July 2020'}
    ${3}  | ${'June 2020'}
    ${4}  | ${'May 2020'}
    ${5}  | ${'April 2020'}
    ${6}  | ${'March 2020'}
    ${7}  | ${'February 2020'}
    ${8}  | ${'January 2020'}
    ${9}  | ${'December 2019'}
    ${10} | ${'November 2019'}
    ${11} | ${'October 2019'}
    ${12} | ${'September 2019'}
    ${13} | ${'August 2019'}
    ${14} | ${'July 2019'}
    ${15} | ${'June 2019'}
    ${16} | ${'May 2019'}
    ${17} | ${'April 2019'}
    ${18} | ${'March 2019'}
    ${19} | ${'February 2019'}
    ${20} | ${'January 2019'}
    ${21} | ${'December 2018'}
    ${22} | ${'November 2018'}
    ${23} | ${'October 2018'}
  `('opens calendar on $month', async ({ index, month }) => {
    // Arrange
    const page = new CalendarHeaderPage(renderComponent);
    await page.monthList.openMenu();

    // Act
    page.monthList.clickItem(index);

    // Assert
    expect(page.monthList.label).toHaveTextContent(new RegExp(`^${month}$`));
  });
});
