import { fromRemote, toRemote } from '../validDateThrough';

describe('validDateThrough', () => {
  describe('fromRemote()', () => {
    const fakeRecord = {
      validDateTo: '2019-01-01',
    };

    test('should not do anything for record without validDateTo', () => {
      const actual = fromRemote({ name: 'foobar' });

      // assert
      expect(actual).toEqual({
        name: 'foobar',
      });
    });

    test('should convert Object to Entity', () => {
      // execute
      const actual = fromRemote(fakeRecord);

      // assert
      expect(actual).toEqual({
        validDateThrough: '2018-12-31',
      });
    });
  });

  describe('toRemote()', () => {
    const fakeRecord = {
      validDateThrough: '2018-12-31',
    };

    test('should not do anything for record without validDateTo', () => {
      // @ts-ignore
      const actual = toRemote({ name: 'foobar' });

      // assert
      expect(actual).toEqual({
        name: 'foobar',
      });
    });

    test('should convert Entity to Request parameter', () => {
      // arrange
      const entity = fromRemote(fakeRecord);

      // execute
      const actual = toRemote(entity);

      // assert
      expect(actual).toEqual({
        validDateTo: '2019-01-01',
      });
    });
  });
});
