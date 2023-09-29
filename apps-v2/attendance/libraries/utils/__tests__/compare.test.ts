import compare from '../compare';

it.each`
  a                            | b                            | expected
  ${null}                      | ${null}                      | ${true}
  ${0}                         | ${0}                         | ${true}
  ${''}                        | ${''}                        | ${true}
  ${null}                      | ${0}                         | ${false}
  ${null}                      | ${''}                        | ${false}
  ${0}                         | ${null}                      | ${false}
  ${0}                         | ${''}                        | ${false}
  ${''}                        | ${null}                      | ${false}
  ${''}                        | ${0}                         | ${false}
  ${[1, 2, 3]}                 | ${[1, 2, 3]}                 | ${true}
  ${[[1], 2, 3]}               | ${[[1], 2, 3]}               | ${true}
  ${[{ a: 1 }, 2, 3]}          | ${[{ a: 1 }, 2, 3]}          | ${true}
  ${[1, 2, 3]}                 | ${[1, 2]}                    | ${false}
  ${[1, 2]}                    | ${[1, 2, 3]}                 | ${false}
  ${[1, 2, 3]}                 | ${[1, 2, 4]}                 | ${false}
  ${[1, 2, 3]}                 | ${[4, 5, 6]}                 | ${false}
  ${[1]}                       | ${[4, 5, 6]}                 | ${false}
  ${[1, 2, 3]}                 | ${[4]}                       | ${false}
  ${[1, 2, 3]}                 | ${null}                      | ${false}
  ${[1, 2, 3]}                 | ${0}                         | ${false}
  ${[1, 2, 3]}                 | ${''}                        | ${false}
  ${null}                      | ${[1, 2, 3]}                 | ${false}
  ${0}                         | ${[1, 2, 3]}                 | ${false}
  ${''}                        | ${[1, 2, 3]}                 | ${false}
  ${{ a: '1', b: '2' }}        | ${{ a: '1', b: '2' }}        | ${true}
  ${{ a: '1' }}                | ${{ c: '1' }}                | ${false}
  ${{ a: '1', b: '2' }}        | ${{ c: '1' }}                | ${false}
  ${{ a: '1' }}                | ${{ c: '1', d: '2' }}        | ${false}
  ${{ a: '1' }}                | ${{ a: '1', d: '2' }}        | ${false}
  ${{ a: [1], b: { c: '1' } }} | ${{ a: [1], b: { d: '1' } }} | ${false}
  ${{ a: [1], b: { c: '1' } }} | ${{ a: [1], b: { c: '1' } }} | ${true}
  ${null}                      | ${{ a: [1], b: { c: '1' } }} | ${false}
  ${{ a: [1], b: { c: '1' } }} | ${null}                      | ${false}
`('should return $expected [a=$a, b=$b]', ({ a, b, expected }) => {
  expect(compare(a, b)).toBe(expected);
});
