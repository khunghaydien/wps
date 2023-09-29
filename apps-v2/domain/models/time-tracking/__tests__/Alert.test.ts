import { AlertCode, AlertLevel, isConsistentWithAttTime } from '../Alert';

describe('isConsistentWithAttTime()', () => {
  it.each`
    alertCode                       | alertLevel          | totalTaskTime | workTime     | isConsistent
    ${AlertCode.TimeAttConsistency} | ${AlertLevel.Warn}  | ${100}        | ${800}       | ${false}
    ${AlertCode.TimeAttConsistency} | ${AlertLevel.Warn}  | ${500}        | ${499}       | ${false}
    ${AlertCode.TimeAttConsistency} | ${AlertLevel.Warn}  | ${100}        | ${null}      | ${false}
    ${AlertCode.TimeAttConsistency} | ${AlertLevel.Warn}  | ${100}        | ${undefined} | ${false}
    ${AlertCode.TimeAttConsistency} | ${AlertLevel.Warn}  | ${undefined}  | ${499}       | ${false}
    ${AlertCode.TimeAttConsistency} | ${AlertLevel.Warn}  | ${null}       | ${499}       | ${false}
    ${AlertCode.TimeAttConsistency} | ${AlertLevel.Warn}  | ${null}       | ${null}      | ${true}
    ${AlertCode.TimeAttConsistency} | ${AlertLevel.Warn}  | ${undefined}  | ${undefined} | ${true}
    ${AlertCode.TimeAttConsistency} | ${AlertLevel.Warn}  | ${null}       | ${undefined} | ${true}
    ${AlertCode.TimeAttConsistency} | ${AlertLevel.Warn}  | ${undefined}  | ${null}      | ${true}
    ${AlertCode.TimeAttConsistency} | ${AlertLevel.Warn}  | ${500}        | ${500}       | ${true}
    ${'NotImplemented'}             | ${'NotImplemented'} | ${399}        | ${undefined} | ${true}
  `(
    'for a given $alertCode and $alertLevel, it should test match with $totalTaskTime and $workTime',
    ({ alertCode, alertLevel, totalTaskTime, workTime, isConsistent }) => {
      // Arrange
      const expected = isConsistent;

      // Act
      const actual = isConsistentWithAttTime(
        [{ code: alertCode, level: alertLevel }],
        totalTaskTime,
        workTime
      );

      // Asert
      expect(expected).toBe(actual);
    }
  );

  it('should test alert code with case sensitive', () => {
    // Arrange
    const expected = true;

    // Act
    const actual = isConsistentWithAttTime(
      // @ts-ignore for TEST
      [{ code: 'time_att_consistency', level: AlertLevel.Warn }],
      500,
      500
    );

    // Assert
    expect(expected).toBe(actual);
  });

  it('should test alert level with case sensitive', () => {
    // Arrange
    const expected = true;

    // Act
    const actual = isConsistentWithAttTime(
      // @ts-ignore for TEST
      [{ code: AlertCode.TimeAttConsistency, level: 'WARN' }],
      500,
      500
    );

    // Assert
    expect(expected).toBe(actual);
  });
});
