import * as CommuteCount from '../CommuteCount';

describe('convert', () => {
  it.each`
    commuteForwardCount | commuteBackwardCount | expected
    ${null}             | ${null}              | ${{ forwardCount: null, backwardCount: null }}
    ${null}             | ${0}                 | ${null}
    ${null}             | ${1}                 | ${null}
    ${0}                | ${null}              | ${null}
    ${1}                | ${null}              | ${null}
    ${0}                | ${0}                 | ${{ forwardCount: 0, backwardCount: 0 }}
    ${0}                | ${1}                 | ${{ forwardCount: 0, backwardCount: 1 }}
    ${1}                | ${0}                 | ${{ forwardCount: 1, backwardCount: 0 }}
    ${1}                | ${1}                 | ${{ forwardCount: 1, backwardCount: 1 }}
  `(
    `should be $expected if CommuteForwardCount is $commuteForwardCount and CommuteBackwardCount is $commuteBackwardCount.`,
    ({ expected, ...values }) => {
      expect(CommuteCount.convert(values)).toEqual(expected);
    }
  );
});
