import moment from 'moment';

import adapters from '../index';

describe('adapters', () => {
  const fakeResponse = {
    name: 'AAA AAA',
    createdAt: '2018-01-01',
    number: '10',
  };

  describe('fromRemote()', () => {
    test('should convert Object to Entity', () => {
      // arrange
      const converters = [
        (o) => ({
          ...o,
          number: parseInt(o.number),
        }),
        (o) => ({
          ...o,
          createdAt: moment(o.createdAt),
        }),
      ];

      // execute
      const actual = adapters.fromRemote(fakeResponse, converters);

      // assert
      expect(actual).toEqual({
        name: 'AAA AAA',
        createdAt: moment('2018-01-01'),
        number: 10,
      });
    });
  });

  describe('toRemote()', () => {
    test('should convert Entity to Request parameter', () => {
      // arrange
      const fromRemote = [
        (o) => ({
          ...o,
          number: parseInt(o.number),
        }),
        (o) => ({
          ...o,
          createdAt: moment(o.createdAt),
        }),
      ];
      const entity = adapters.fromRemote(fakeResponse, fromRemote);

      const converters = [
        (o) => ({
          ...o,
          number: o.number.toString(),
        }),
        (o) => ({
          ...o,
          createdAt: o.createdAt.format('YYYY-MM-DD'),
        }),
      ];

      // execute
      const actual = adapters.toRemote(entity, converters);

      // assert
      expect(actual).toEqual({
        name: 'AAA AAA',
        createdAt: '2018-01-01',
        number: '10',
      });
    });
  });
});
