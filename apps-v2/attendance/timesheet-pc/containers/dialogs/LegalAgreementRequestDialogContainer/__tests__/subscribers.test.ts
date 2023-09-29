import configureMockStore from 'redux-mock-store';

import * as selectors from '@attendance/timesheet-pc/modules/selectors';

import subscriber from '../subscriber';
import EventEmitter from '@attendance/libraries/Event/emitter';
import Events from '@attendance/timesheet-pc/events';
import UseCases, {
  // @ts-ignore
  mocked as UseCaseMockedMethods,
  UseCases as UseCaseMethods,
} from '@attendance/timesheet-pc/UseCases';

const createStore = configureMockStore();

jest.mock('@attendance/timesheet-pc/modules/selectors', () => ({
  __esModule: true,
  employeeId: jest.fn(),
}));

jest.mock('@attendance/timesheet-pc/UseCases', () => {
  const act = jest.requireActual('../../../../UseCases');
  const mocked = jest.requireActual('../../../../__mocks__/UseCases').methods;
  act.default.register(mocked);
  return {
    __esModule: true,
    default: act.default,
    mocked,
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});

it.each([
  'cancelRequestLegalAgreementRequest',
  'cancelApprovalLegalAgreementRequest',
] as (keyof Pick<
  UseCaseMethods,
  'cancelRequestLegalAgreementRequest' | 'cancelApprovalLegalAgreementRequest'
>)[])('should be call reload when finished %s', (functionName) => {
  // Arrange
  const publish = jest.spyOn(EventEmitter, 'publish');
  (selectors.employeeId as jest.Mock).mockReturnValue('employeeId');
  const store = createStore({
    ui: {
      legalAgreementRequest: {
        editing: {
          id: 'xxx',
        },
      },
    },
    entities: {
      timesheet: {
        ownerInfos: [
          {
            endDate: '2022-02-22',
          },
        ],
      },
    },
  });
  const unsubscriber = subscriber(store);

  // Act
  EventEmitter.publish(UseCases()[functionName].eventName);
  unsubscriber();

  // Assert
  expect(
    UseCaseMockedMethods.fetchListLegalAgreementRequest
  ).toHaveBeenCalledTimes(1);
  expect(
    UseCaseMockedMethods.fetchListLegalAgreementRequest
  ).toHaveBeenCalledWith({
    employeeId: 'employeeId',
    targetDate: '2022-02-22',
  });
  expect(
    UseCaseMockedMethods.fetchOvertimeLegalAgreement
  ).toHaveBeenCalledTimes(1);
  expect(UseCaseMockedMethods.fetchOvertimeLegalAgreement).toHaveBeenCalledWith(
    {
      employeeId: 'employeeId',
      targetDate: '2022-02-22',
    }
  );

  expect(publish).toHaveBeenCalledTimes(2);
  expect(publish).toHaveBeenNthCalledWith(
    2,
    Events.updatedDailyRecord.eventName,
    undefined
  );
});

describe.each(['removeLegalAgreementRequest'] as (keyof Pick<
  UseCaseMethods,
  'removeLegalAgreementRequest'
>)[])('%s', (functionName) => {
  it('should not call exit if result is false', () => {
    // Arrange
    const publish = jest.spyOn(EventEmitter, 'publish');
    (selectors.employeeId as jest.Mock).mockReturnValue('employeeId');
    const store = createStore({
      ui: {
        legalAgreementRequest: {
          editing: {
            id: 'xxx',
          },
        },
      },
      entities: {
        timesheet: {
          ownerInfos: [
            {
              endDate: '2022-02-22',
            },
          ],
        },
      },
    });
    const unsubscriber = subscriber(store);

    // Act
    EventEmitter.publish(UseCases()[functionName].eventName);
    unsubscriber();

    // Assert
    expect(
      UseCaseMockedMethods.fetchListLegalAgreementRequest
    ).toHaveBeenCalledTimes(0);
    expect(
      UseCaseMockedMethods.fetchOvertimeLegalAgreement
    ).toHaveBeenCalledTimes(0);

    expect(publish).toHaveBeenCalledTimes(1);
  });

  it('should not call exit if result is true', () => {
    // Arrange
    const publish = jest.spyOn(EventEmitter, 'publish');
    (selectors.employeeId as jest.Mock).mockReturnValue('employeeId');
    const store = createStore({
      ui: {
        legalAgreementRequest: {
          editing: {
            id: 'xxx',
          },
        },
      },
      entities: {
        timesheet: {
          ownerInfos: [
            {
              endDate: '2022-02-22',
            },
          ],
        },
      },
    });
    const unsubscriber = subscriber(store);

    // Act
    EventEmitter.publish(UseCases()[functionName].eventName, true);
    unsubscriber();

    // Assert
    expect(
      UseCaseMockedMethods.fetchListLegalAgreementRequest
    ).toHaveBeenCalledTimes(1);
    expect(
      UseCaseMockedMethods.fetchListLegalAgreementRequest
    ).toHaveBeenCalledWith({
      employeeId: 'employeeId',
      targetDate: '2022-02-22',
    });
    expect(
      UseCaseMockedMethods.fetchOvertimeLegalAgreement
    ).toHaveBeenCalledTimes(1);
    expect(
      UseCaseMockedMethods.fetchOvertimeLegalAgreement
    ).toHaveBeenCalledWith({
      employeeId: 'employeeId',
      targetDate: '2022-02-22',
    });

    expect(publish).toHaveBeenCalledTimes(2);
    expect(publish).toHaveBeenNthCalledWith(
      2,
      Events.updatedDailyRecord.eventName,
      undefined
    );
  });
});

describe.each([
  'submitLegalAgreementRequest',
  'reapplyLegalAgreementRequest',
] as (keyof Pick<
  UseCaseMethods,
  'submitLegalAgreementRequest' | 'reapplyLegalAgreementRequest'
>)[])('%s', (functionName) => {
  it('should be call exit when finished %s', () => {
    const store = createStore({
      ui: {
        legalAgreementRequest: {
          editing: {
            id: 'xxx',
          },
        },
      },
      entities: {
        timesheet: {
          ownerInfos: [
            {
              endDate: '2022-02-22',
            },
          ],
        },
      },
    });
    const publish = jest.spyOn(EventEmitter, 'publish');
    const unsubscriber = subscriber(store);
    EventEmitter.publish(UseCases()[functionName].eventName);

    // Act
    unsubscriber();

    // Assert
    expect(publish).toHaveBeenCalledTimes(2);
    expect(publish).toHaveBeenNthCalledWith(
      2,
      Events.updatedDailyRecord.eventName,
      undefined
    );
  });
});

describe.each(['fetchListLegalAgreementRequest'] as (keyof Pick<
  UseCaseMethods,
  'fetchListLegalAgreementRequest'
>)[])('%s', (functionName) => {
  it('should be call select when had targetId', async () => {
    // Arrange
    const store = createStore({
      ui: {
        legalAgreementRequest: {
          editing: {
            id: 'abc',
          },
        },
      },
      entities: {
        timesheet: {
          ownerInfos: [
            {
              endDate: '2022-02-22',
            },
          ],
        },
      },
    });
    const unsubscriber = subscriber(store);

    // Act
    await EventEmitter.publish(UseCases()[functionName].eventName, {
      requestList: {
        requests: [
          {
            id: 'abc',
          },
        ],
      },
    });
    unsubscriber();

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });

  it('should be not call select when had not targetId', async () => {
    // Arrange
    const store = createStore({
      ui: {
        legalAgreementRequest: {
          editing: {},
        },
      },
      entities: {
        timesheet: {
          ownerInfos: [
            {
              endDate: '2022-02-22',
            },
          ],
        },
      },
    });
    const unsubscriber = subscriber(store);

    // Act
    await EventEmitter.publish(UseCases()[functionName].eventName, {
      requestList: {
        requests: [
          {
            id: 'abc',
          },
        ],
      },
    });
    unsubscriber();

    // Assert
    expect(store.getActions()).toMatchSnapshot();
  });
});
