import createMapByCode from '../createMapByCode';

it('should be convert', () => {
  expect(createMapByCode([{ code: 'ABC' }, { code: 'DEF' }])).toEqual(
    new Map([
      ['ABC', { code: 'ABC' }],
      ['DEF', { code: 'DEF' }],
    ])
  );
});
