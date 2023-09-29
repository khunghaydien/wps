import UseCaseCollection from '../UseCaseCollection';
import * as Event from '@attendance/libraries/Event';

jest.mock('@attendance/libraries/Event/create');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('default', () => {
  describe('register', () => {
    it('should do.', async () => {
      // Arrange
      const m = jest.fn(() => 'output');
      const useCaseMethodMock = m as unknown as (
        arg: string
      ) => Promise<string>;
      const Collection = UseCaseCollection<{
        test: (arg: string) => Promise<string>;
      }>();
      Collection.register({
        test: useCaseMethodMock,
      });

      // Act
      const result = await Collection().test('input');
      const event = (Event.create as jest.Mock).mock.results[0].value;

      // Assert
      expect(result).toEqual('output');
      expect(Collection().test.state()).toEqual('Proceed');
      expect(Collection().test.eventName).toMatch(/^test-.*$/);
      expect(Event.create).toHaveBeenCalledWith(Collection().test.eventName);
      expect(event.publish).toHaveBeenCalledTimes(1);
      expect(event.publish).toHaveBeenCalledWith('output');
      expect(Collection().test.subscribe).toEqual(event.subscribe);
    });
  });

  describe('event', () => {
    it('should be stopped', async () => {
      // Arrange
      const m = jest.fn(() => 'output');
      const useCaseMethodMock = m as unknown as (
        arg: string
      ) => Promise<string>;
      const Collection = UseCaseCollection<{
        test: (arg: string) => Promise<string>;
      }>();
      Collection.register({
        test: useCaseMethodMock,
      });

      {
        // Act
        Collection().test.stopPublication();
        await Collection().test('input');
        const event = (Event.create as jest.Mock).mock.results[0].value;

        // Assert
        expect(Collection().test.state()).toEqual('Stopped');
        expect(Event.create).toHaveBeenCalledWith(Collection().test.eventName);
        expect(event.publish).toHaveBeenCalledTimes(0);
      }
      {
        // Act
        await Collection().test('input');
        const event = (Event.create as jest.Mock).mock.results[0].value;

        // Assert
        expect(event.publish).toHaveBeenCalledTimes(0);
      }
    });

    it('should be started', async () => {
      // Arrange
      const m = jest.fn(() => 'output');
      const useCaseMethodMock = m as unknown as (
        arg: string
      ) => Promise<string>;
      const Collection = UseCaseCollection<{
        test: (arg: string) => Promise<string>;
      }>();
      Collection.register({
        test: useCaseMethodMock,
      });

      // Act
      Collection().test.stopPublication();
      Collection().test.startPublication();
      await Collection().test('input');
      const event = (Event.create as jest.Mock).mock.results[0].value;

      // Assert
      expect(Collection().test.state()).toEqual('Proceed');
      expect(Event.create).toHaveBeenCalledWith(Collection().test.eventName);
      expect(event.publish).toHaveBeenCalledTimes(1);
    });

    it('should be stopped once', async () => {
      // Arrange
      const m = jest.fn(() => 'output');
      const useCaseMethodMock = m as unknown as (
        arg: string
      ) => Promise<string>;
      const Collection = UseCaseCollection<{
        test: (arg: string) => Promise<string>;
      }>();
      Collection.register({
        test: useCaseMethodMock,
      });

      {
        // Act
        Collection().test.stopPublicationOnce();
        await Collection().test('input');
        const event = (Event.create as jest.Mock).mock.results[0].value;

        // Assert
        expect(Collection().test.state()).toEqual('Proceed');
        expect(Event.create).toHaveBeenCalledWith(Collection().test.eventName);
        expect(event.publish).toHaveBeenCalledTimes(0);
      }

      {
        // Act
        await Collection().test('input');
        const event = (Event.create as jest.Mock).mock.results[0].value;

        // Assert
        expect(Collection().test.state()).toEqual('Proceed');
        expect(Event.create).toHaveBeenCalledWith(Collection().test.eventName);
        expect(event.publish).toHaveBeenCalledTimes(1);
      }
    });
  });
});
