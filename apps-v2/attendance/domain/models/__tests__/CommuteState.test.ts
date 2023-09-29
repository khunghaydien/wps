import { COMMUTE_STATE, toCommuteCount, toCommuteState } from '../CommuteCount';

describe('toCommuteState()', () => {
  it.each`
    forwardCount | backwardCount | expected
    ${null}      | ${null}       | ${COMMUTE_STATE.UNENTERED}
    ${0}         | ${0}          | ${COMMUTE_STATE.NONE}
    ${1}         | ${0}          | ${COMMUTE_STATE.FORWARD}
    ${2}         | ${0}          | ${COMMUTE_STATE.FORWARD}
    ${0}         | ${1}          | ${COMMUTE_STATE.BACKWARD}
    ${0}         | ${1}          | ${COMMUTE_STATE.BACKWARD}
    ${1}         | ${1}          | ${COMMUTE_STATE.BOTH_WAYS}
    ${2}         | ${2}          | ${COMMUTE_STATE.BOTH_WAYS}
  `(
    `should be "$expected" if forwardCount is $forwardCount and backwardCount is $backwardCount.`,
    ({ expected, ...commuteCount }) => {
      expect(toCommuteState(commuteCount)).toBe(expected);
    }
  );
});

describe('toCommuteCount()', () => {
  it.each`
    commuteState               | expected
    ${COMMUTE_STATE.UNENTERED} | ${{ forwardCount: null, backwardCount: null }}
    ${COMMUTE_STATE.NONE}      | ${{ forwardCount: 0, backwardCount: 0 }}
    ${COMMUTE_STATE.FORWARD}   | ${{ forwardCount: 1, backwardCount: 0 }}
    ${COMMUTE_STATE.BACKWARD}  | ${{ forwardCount: 0, backwardCount: 1 }}
    ${COMMUTE_STATE.BOTH_WAYS} | ${{ forwardCount: 1, backwardCount: 1 }}
  `(
    `should be $expected if Commute State is "$commuteState".`,
    ({ expected, commuteState }) => {
      expect(toCommuteCount(commuteState)).toEqual(expected);
    }
  );
});
