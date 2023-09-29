import { Store } from 'redux';

import { clear as clearRestReasons } from '../../../../modules/entities/restTimeReasons';
import { close } from '../../../../modules/ui/dailyAttTimeDialog';
import { actions as editingDailyAttTimeActions } from '../../../../modules/ui/editingDailyAttTime';

import Events from '../../../../events';
import LocalEvents from '../events';
import subscriber from '../subscriber';
import EventEmitter from '@attendance/libraries/Event/emitter';

const store = {
  dispatch: jest.fn(),
} as unknown as Store;

beforeEach(() => {
  jest.clearAllMocks();
});

describe.each(['submittedRequest', 'saved'] as (keyof Pick<
  typeof LocalEvents,
  'saved' | 'submittedRequest'
>)[])('%s', (functionName) => {
  it('should call close() if true is published', () => {
    // Arrange
    const unsubscriber = subscriber(store);

    // Act
    LocalEvents[functionName].publish(true);

    // Assert
    expect(store.dispatch).toBeCalledTimes(1);
    expect(store.dispatch).toBeCalledWith(close());

    unsubscriber();
  });
  it('should not call close() if false is published', () => {
    // Arrange
    const unsubscriber = subscriber(store);

    // Act
    LocalEvents[functionName].publish(false);

    // Assert
    expect(store.dispatch).toBeCalledTimes(0);

    unsubscriber();
  });
  it.each([true, false])(
    `should publish ${Events.updatedDailyRecord.eventName} if %s is published`,
    (value) => {
      // Arrange
      const publish = jest.spyOn(EventEmitter, 'publish');
      const unsubscriber = subscriber(store);
      LocalEvents[functionName].publish(value);

      // Act
      unsubscriber();

      // Assert
      expect(publish).toBeCalledTimes(2);
      expect(publish).toHaveBeenNthCalledWith(
        1,
        LocalEvents[functionName].eventName,
        value
      );
      expect(publish).toHaveBeenNthCalledWith(
        2,
        Events.updatedDailyRecord.eventName,
        undefined
      );
    }
  );
  it(`should not publish ${Events.updatedDailyRecord.eventName} if event is not called.`, () => {
    // Arrange
    const publish = jest.spyOn(EventEmitter, 'publish');
    const unsubscriber = subscriber(store);

    // Act
    unsubscriber();

    // Assert
    expect(publish).toBeCalledTimes(0);
  });
});

describe.each([
  'canceledApprovalRequest',
  'canceledSubmittedRequest',
] as (keyof Pick<
  typeof LocalEvents,
  'canceledApprovalRequest' | 'canceledSubmittedRequest'
>)[])('%s', (functionName) => {
  it(`should publish ${Events.updatedDailyRecord.eventName}.`, () => {
    // Arrange
    const publish = jest.spyOn(EventEmitter, 'publish');
    const unsubscriber = subscriber(store);

    // Act
    LocalEvents[functionName].publish();

    // Assert
    expect(publish).toBeCalledTimes(2);
    expect(publish).toHaveBeenNthCalledWith(
      1,
      LocalEvents[functionName].eventName,
      undefined
    );
    expect(publish).toHaveBeenNthCalledWith(
      2,
      Events.updatedDailyRecord.eventName,
      undefined
    );

    unsubscriber();
  });
  it(`should not publish ${Events.updatedDailyRecord.eventName} when unsubscribing`, () => {
    // Arrange
    const publish = jest.spyOn(EventEmitter, 'publish');
    const unsubscriber = subscriber(store);

    // Act
    LocalEvents[functionName].publish();
    unsubscriber();

    // Assert
    expect(publish).toBeCalledTimes(2);
    expect(publish).toHaveBeenNthCalledWith(
      1,
      LocalEvents[functionName].eventName,
      undefined
    );
    expect(publish).toHaveBeenNthCalledWith(
      2,
      Events.updatedDailyRecord.eventName,
      undefined
    );
  });
});

describe('unsubscribers', () => {
  it.each([
    ['submittedRequest', true],
    ['saved', true],
    ['canceledApprovalRequest', undefined],
    ['canceledSubmittedRequest', undefined],
  ] as [keyof typeof LocalEvents, boolean | void][])(
    'should execute',
    (functionName, ...value) => {
      // Arrange
      const publish = jest.spyOn(EventEmitter, 'publish');
      const unsubscriber = subscriber(store);

      // Act
      const result = unsubscriber();
      LocalEvents[functionName].publish(
        // @ts-ignore
        ...value
      );

      // Assert
      expect(result).toBe(undefined);
      expect(store.dispatch).toBeCalledTimes(2);
      expect(store.dispatch).toHaveBeenNthCalledWith(
        1,
        editingDailyAttTimeActions.unset()
      );
      expect(store.dispatch).toHaveBeenNthCalledWith(2, clearRestReasons());
      expect(publish).toBeCalledTimes(1);
      expect(publish).toBeCalledWith(
        LocalEvents[functionName].eventName,
        ...value
      );
    }
  );
});
