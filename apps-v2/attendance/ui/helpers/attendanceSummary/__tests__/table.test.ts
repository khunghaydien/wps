import * as helper from '../table';

describe('colSpanNumber', () => {
  it.each`
    useManageCommuteCount | useAllowanceManagement | useObjectivelyEventLog | result
    ${false}              | ${false}               | ${false}               | ${0}
    ${false}              | ${false}               | ${true}                | ${1}
    ${false}              | ${true}                | ${false}               | ${1}
    ${false}              | ${true}                | ${true}                | ${2}
    ${true}               | ${false}               | ${false}               | ${1}
    ${true}               | ${false}               | ${true}                | ${2}
    ${true}               | ${true}                | ${false}               | ${2}
    ${true}               | ${true}                | ${true}                | ${3}
  `(
    'should return $result when [useManageCommuteCount=$useManageCommuteCount, useAllowanceManagement=$useAllowanceManagement, useObjectivelyEventLog=$useObjectivelyEventLog].',
    ({ result, ...workingType }) => {
      expect(helper.colSpanNumber(workingType, 0)).toBe(result);
    }
  );
});
