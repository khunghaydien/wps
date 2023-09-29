import createMap from '../createMap';

it('should be convert', () => {
  const create = createMap([{ code: 'ABC' }, { code: 'DEF' }]);
  expect(create('code')).toEqual(
    new Map([
      ['ABC', { code: 'ABC' }],
      ['DEF', { code: 'DEF' }],
    ])
  );
});
